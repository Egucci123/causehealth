import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Activity,
  Stethoscope,
  Pill,
  FlaskConical,
  ChevronDown,
  ChevronUp,
  FileText,
  ClipboardList,
  Sparkles,
  AlertCircle,
  Info,
  Search,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/layout/PageHeader';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { SYMPTOM_ROOT_CAUSES } from '@/data/symptomRootCauses';
import { lookupSymptom as lookupSymptomAsync } from '@/lib/aiLookup';
import { MEDICATION_DEPLETIONS } from '@/data/medicationDepletions';
import { ICD10_TEST_JUSTIFICATIONS } from '@/data/icd10Codes';
import type { Symptom, Medication } from '@/types/user.types';
import type { SymptomInfo, SymptomRootCause, TestJustification } from '@/types/medication.types';

const DURATION_OPTIONS = [
  { value: 'less_than_week', label: 'Less than a week' },
  { value: '1_2_weeks', label: '1-2 weeks' },
  { value: '2_4_weeks', label: '2-4 weeks' },
  { value: '1_3_months', label: '1-3 months' },
  { value: '3_6_months', label: '3-6 months' },
  { value: '6_12_months', label: '6-12 months' },
  { value: 'over_1_year', label: 'Over 1 year' },
  { value: 'chronic', label: 'Chronic / Ongoing' },
];

const COMMON_SYMPTOMS = [
  'Fatigue',
  'Hair Loss',
  'Joint Pain',
  'Muscle Pain',
  'Brain Fog',
  'Headaches',
  'Insomnia',
  'Anxiety',
  'Bloating',
  'Constipation',
  'Weight Gain',
  'Cold Intolerance',
];

function getSeverityColor(severity: number): { bg: string; text: string; label: string } {
  if (severity <= 3) return { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-400', label: 'Mild' };
  if (severity <= 6) return { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', label: 'Moderate' };
  return { bg: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-700 dark:text-rose-400', label: 'Severe' };
}

function getSeverityVariant(severity: number): 'success' | 'warning' | 'critical' {
  if (severity <= 3) return 'success';
  if (severity <= 6) return 'warning';
  return 'critical';
}

function getProbabilityVariant(probability: string): 'critical' | 'warning' | 'success' | 'info' | 'default' {
  if (probability.includes('critical')) return 'critical';
  if (probability === 'high' || probability.startsWith('high')) return 'warning';
  if (probability === 'moderate') return 'info';
  return 'default';
}

function getProbabilityLabel(probability: string): string {
  return probability.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeSymptomKey(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

function lookupSymptomSync(name: string): SymptomInfo | null {
  const key = normalizeSymptomKey(name);
  if (SYMPTOM_ROOT_CAUSES[key]) return SYMPTOM_ROOT_CAUSES[key];
  for (const [k, info] of Object.entries(SYMPTOM_ROOT_CAUSES)) {
    if (k.includes(key) || key.includes(k)) return info;
    if (info.symptom.toLowerCase().includes(name.toLowerCase())) return info;
  }
  return null;
}

function lookupSymptomWithCache(name: string, resolved: Map<string, SymptomInfo>): SymptomInfo | null {
  const cached = resolved.get(name.toLowerCase().trim());
  if (cached) return cached;
  return lookupSymptomSync(name);
}

function lookupTest(testKey: string): TestJustification | null {
  if (ICD10_TEST_JUSTIFICATIONS[testKey]) return ICD10_TEST_JUSTIFICATIONS[testKey];
  // Fuzzy match
  for (const [k, info] of Object.entries(ICD10_TEST_JUSTIFICATIONS)) {
    if (k.includes(testKey) || testKey.includes(k)) return info;
  }
  return null;
}

function formatDuration(value: string | null): string {
  if (!value) return '';
  return DURATION_OPTIONS.find((o) => o.value === value)?.label || value.replace(/_/g, ' ');
}

export default function Symptoms() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [testDetailModal, setTestDetailModal] = useState<TestJustification | null>(null);

  // Form state
  const [formSymptom, setFormSymptom] = useState('');
  const [formSeverity, setFormSeverity] = useState(5);
  const [formDuration, setFormDuration] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [showCommonSymptoms, setShowCommonSymptoms] = useState(false);
  const [resolvedSymptoms, setResolvedSymptoms] = useState<Map<string, SymptomInfo>>(new Map());
  const [lookingUp, setLookingUp] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      loadSymptoms();
      loadMedications();
    }
  }, [user]);

  // Auto-lookup symptoms not in static DB via Claude AI
  useEffect(() => {
    for (const s of symptoms) {
      const key = s.symptom.toLowerCase().trim();
      if (resolvedSymptoms.has(key) || lookingUp.has(key) || lookupSymptomSync(s.symptom)) continue;

      setLookingUp(prev => new Set(prev).add(key));
      lookupSymptomAsync(s.symptom).then(result => {
        if (result) {
          setResolvedSymptoms(prev => {
            const next = new Map(prev);
            next.set(key, result.data);
            return next;
          });
        }
        setLookingUp(prev => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      });
    }
  }, [symptoms]);

  async function loadSymptoms() {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('symptoms')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSymptoms(data as Symptom[]);
    }
    setLoading(false);
  }

  async function loadMedications() {
    if (!user) return;
    const { data } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (data) setMedications(data as Medication[]);
  }

  function resetForm() {
    setFormSymptom('');
    setFormSeverity(5);
    setFormDuration('');
    setFormNotes('');
    setShowCommonSymptoms(false);
  }

  async function handleSave() {
    if (!user || !formSymptom.trim()) return;
    setSaving(true);

    await supabase.from('symptoms').insert({
      user_id: user.id,
      symptom: formSymptom.trim(),
      severity: formSeverity,
      duration: formDuration || null,
      notes: formNotes.trim() || null,
    });

    await loadSymptoms();
    setSaving(false);
    setShowAddModal(false);
    resetForm();
  }

  async function handleRemove(id: string) {
    await supabase.from('symptoms').delete().eq('id', id);
    setSymptoms((prev) => prev.filter((s) => s.id !== id));
  }

  function toggleCard(id: string) {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // Medication connection helper
  const getMedicationConnections = useCallback(
    (rootCauses: SymptomRootCause[]): { cause: string; medication: string; mechanism: string }[] => {
      const connections: { cause: string; medication: string; mechanism: string }[] = [];
      for (const med of medications) {
        const medKey = med.name.toLowerCase().replace(/\s+/g, '');
        const medInfo = MEDICATION_DEPLETIONS[medKey];
        if (!medInfo) continue;

        for (const rootCause of rootCauses) {
          const causeLower = rootCause.cause.toLowerCase();
          for (const dep of medInfo.depletes) {
            if (
              causeLower.includes(dep.nutrient.toLowerCase()) ||
              causeLower.includes('statin') && medKey.includes('statin') ||
              causeLower.includes(med.name.toLowerCase())
            ) {
              connections.push({
                cause: rootCause.cause,
                medication: med.name,
                mechanism: `${med.name} depletes ${dep.nutrient} (${dep.severity} severity)`,
              });
            }
          }
        }
      }
      return connections;
    },
    [medications]
  );

  // Overview aggregations
  const overview = useMemo(() => {
    const rootCauseCount = new Map<string, number>();
    const testCount = new Map<string, number>();

    for (const symptom of symptoms) {
      const info = lookupSymptomWithCache(symptom.symptom, resolvedSymptoms);
      if (!info) continue;

      for (const rc of info.root_causes) {
        rootCauseCount.set(rc.cause, (rootCauseCount.get(rc.cause) || 0) + 1);
        for (const test of rc.tests) {
          testCount.set(test, (testCount.get(test) || 0) + 1);
        }
      }
    }

    const topCauses = [...rootCauseCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const topTests = [...testCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return { topCauses, topTests };
  }, [symptoms]);

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Symptom Root Cause Mapper"
        description="Every symptom has a cause. Let's find yours."
        action={
          <Button onClick={() => { resetForm(); setShowAddModal(true); }}>
            <Plus className="w-4 h-4" />
            Add Symptom
          </Button>
        }
      />

      {/* Overview Summary */}
      {symptoms.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Tracked */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-teal-500" />
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Tracked Symptoms
                  </span>
                </div>
                <p className="text-2xl font-bold text-slate-warm dark:text-white">
                  {symptoms.length}
                </p>
              </div>

              {/* Top Root Causes */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Search className="w-4 h-4 text-teal-500" />
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Common Root Causes
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {overview.topCauses.length > 0 ? (
                    overview.topCauses.map(([cause, count]) => (
                      <Badge key={cause} variant="default" size="sm">
                        {cause.split(' ').slice(0, 3).join(' ')} ({count})
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400">No data yet</span>
                  )}
                </div>
              </div>

              {/* Top Tests */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FlaskConical className="w-4 h-4 text-teal-500" />
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Most Recommended Tests
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {overview.topTests.length > 0 ? (
                    overview.topTests.map(([test, count]) => (
                      <Badge key={test} variant="info" size="sm">
                        {test.replace(/_/g, ' ')} ({count})
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400">No data yet</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/app/doctor-prep')}
              >
                <FileText className="w-4 h-4" />
                Generate Doctor Prep
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Symptoms List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3 mb-3" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
            </Card>
          ))}
        </div>
      ) : symptoms.length === 0 ? (
        <Card className="text-center py-12">
          <Stethoscope className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-warm dark:text-white mb-2">
            No symptoms tracked
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Add symptoms to discover potential root causes and get personalized recommendations.
          </p>
          <Button onClick={() => { resetForm(); setShowAddModal(true); }}>
            <Plus className="w-4 h-4" />
            Track Your First Symptom
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {symptoms.map((symptom) => {
            const info = lookupSymptomWithCache(symptom.symptom, resolvedSymptoms);
            const isLookingUpSymptom = lookingUp.has(symptom.symptom.toLowerCase().trim());
            const isExpanded = expandedCards.has(symptom.id);
            const sevColor = getSeverityColor(symptom.severity);
            const medConnections = info ? getMedicationConnections(info.root_causes) : [];

            return (
              <motion.div
                key={symptom.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                layout
              >
                <Card>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-slate-warm dark:text-white">
                          {symptom.symptom}
                        </h3>
                        <Badge variant={getSeverityVariant(symptom.severity)} size="md">
                          {symptom.severity}/10 - {sevColor.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                        {symptom.duration && (
                          <span>{formatDuration(symptom.duration)}</span>
                        )}
                        {symptom.notes && (
                          <>
                            {symptom.duration && <span>-</span>}
                            <span className="italic">{symptom.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleRemove(symptom.id)}>
                        <Trash2 className="w-4 h-4 text-rose-500" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleCard(symptom.id)}>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Severity Bar */}
                  <div className="mb-3">
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          symptom.severity <= 3
                            ? 'bg-emerald-400'
                            : symptom.severity <= 6
                            ? 'bg-amber-400'
                            : 'bg-rose-400'
                        }`}
                        style={{ width: `${symptom.severity * 10}%` }}
                      />
                    </div>
                  </div>

                  {info ? (
                    <>
                      {/* Quick summary of root causes */}
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {info.root_causes.slice(0, 4).map((rc) => (
                          <Badge
                            key={rc.cause}
                            variant={getProbabilityVariant(rc.probability)}
                            size="sm"
                          >
                            {rc.cause.split('(')[0].trim().slice(0, 30)}
                          </Badge>
                        ))}
                        {info.root_causes.length > 4 && (
                          <Badge variant="default" size="sm">
                            +{info.root_causes.length - 4} more
                          </Badge>
                        )}
                      </div>

                      {/* Expanded Detail */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            {/* Root Causes Ranked */}
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                              <h4 className="text-sm font-semibold text-slate-warm dark:text-white mb-3 flex items-center gap-2">
                                <ClipboardList className="w-4 h-4 text-teal-500" />
                                Ranked Root Causes
                              </h4>
                              <div className="space-y-3">
                                {info.root_causes.map((rc, idx) => (
                                  <RootCauseRow
                                    key={rc.cause}
                                    rootCause={rc}
                                    rank={idx + 1}
                                    onTestClick={(testKey) => {
                                      const detail = lookupTest(testKey);
                                      if (detail) setTestDetailModal(detail);
                                    }}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Medication Connections */}
                            {medConnections.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <h4 className="text-sm font-semibold text-slate-warm dark:text-white mb-3 flex items-center gap-2">
                                  <Pill className="w-4 h-4 text-teal-500" />
                                  Connection to Your Medications
                                </h4>
                                <div className="space-y-2">
                                  {medConnections.map((conn, idx) => (
                                    <div
                                      key={idx}
                                      className="p-3 rounded-lg bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800 text-sm"
                                    >
                                      <div className="flex items-center gap-2 mb-1">
                                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                        <span className="font-medium text-amber-700 dark:text-amber-400">
                                          {conn.medication}
                                        </span>
                                      </div>
                                      <p className="text-slate-600 dark:text-slate-400 ml-6">
                                        {conn.mechanism}
                                      </p>
                                      <p className="text-slate-500 dark:text-slate-500 ml-6 mt-0.5 text-xs">
                                        Linked to: {conn.cause}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Immediate Actions */}
                            {info.immediate_actions && info.immediate_actions.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <h4 className="text-sm font-semibold text-slate-warm dark:text-white mb-3 flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-teal-500" />
                                  Immediate Actions
                                </h4>
                                <ul className="space-y-2">
                                  {info.immediate_actions.map((action, idx) => (
                                    <li
                                      key={idx}
                                      className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                                    >
                                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs font-medium">
                                        {idx + 1}
                                      </span>
                                      {action}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Pattern Analysis */}
                            {info.pattern_analysis && Object.keys(info.pattern_analysis).length > 0 && (
                              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <h4 className="text-sm font-semibold text-slate-warm dark:text-white mb-3">
                                  Pattern Analysis
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {Object.entries(info.pattern_analysis).map(([key, value]) => (
                                    <div
                                      key={key}
                                      className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-sm"
                                    >
                                      <span className="font-medium text-slate-warm dark:text-white capitalize">
                                        {key.replace(/_/g, ' ')}
                                      </span>
                                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                                        {value}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {!isExpanded && (
                        <button
                          onClick={() => toggleCard(symptom.id)}
                          className="text-sm text-teal-500 hover:text-teal-600 font-medium mt-1"
                        >
                          View root cause analysis
                        </button>
                      )}
                    </>
                  ) : isLookingUpSymptom ? (
                    <div className="flex items-center gap-3 text-sm text-teal-600 dark:text-teal-400 mt-2 p-3 bg-teal-50 dark:bg-teal-900/10 rounded-lg">
                      <svg className="animate-spin h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing root causes for {symptom.symptom}...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-500">
                        <Info className="w-4 h-4" />
                        No root cause data found for this symptom
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add Symptom Modal */}
      <Modal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          resetForm();
        }}
        title="Add Symptom"
        size="lg"
      >
        <div className="space-y-5">
          {/* Symptom Name */}
          <div>
            <Input
              label="Symptom"
              placeholder="Describe your symptom..."
              value={formSymptom}
              onChange={(e) => setFormSymptom(e.target.value)}
              autoFocus
            />
            <div className="mt-2">
              <button
                type="button"
                className="text-xs text-teal-500 hover:text-teal-600 font-medium"
                onClick={() => setShowCommonSymptoms(!showCommonSymptoms)}
              >
                {showCommonSymptoms ? 'Hide' : 'Or choose from'} common symptoms
              </button>
              <AnimatePresence>
                {showCommonSymptoms && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-2 mt-2">
                      {COMMON_SYMPTOMS.map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setFormSymptom(s);
                            setShowCommonSymptoms(false);
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            formSymptom === s
                              ? 'bg-teal-50 border-teal-300 text-teal-700 dark:bg-teal-900/30 dark:border-teal-700 dark:text-teal-400'
                              : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-teal-300 hover:text-teal-600'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Severity Slider */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Severity
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={10}
                value={formSeverity}
                onChange={(e) => setFormSeverity(Number(e.target.value))}
                className="flex-1 accent-teal-500"
              />
              <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${getSeverityColor(formSeverity).bg} ${getSeverityColor(formSeverity).text}`}>
                {formSeverity}/10
              </div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-1">
              <span>Mild</span>
              <span>Moderate</span>
              <span>Severe</span>
            </div>
          </div>

          {/* Duration */}
          <Select
            label="Duration"
            placeholder="How long have you had this?"
            options={DURATION_OPTIONS}
            value={formDuration}
            onChange={(e) => setFormDuration(e.target.value)}
          />

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Notes
            </label>
            <textarea
              placeholder="Any patterns, triggers, or additional details..."
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border text-sm transition-colors duration-200 bg-white dark:bg-slate-800 text-slate-warm dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 border-slate-200 dark:border-slate-600 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              loading={saving}
              disabled={!formSymptom.trim()}
            >
              Add Symptom
            </Button>
          </div>
        </div>
      </Modal>

      {/* Test Detail Modal */}
      <Modal
        open={!!testDetailModal}
        onClose={() => setTestDetailModal(null)}
        title={testDetailModal?.test_name || 'Test Details'}
        size="lg"
      >
        {testDetailModal && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                Medical Necessity
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {testDetailModal.medical_necessity}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                ICD-10 Codes
              </h4>
              <div className="space-y-1.5">
                {testDetailModal.codes.map((code) => (
                  <div
                    key={code.code}
                    className="flex items-center gap-3 text-sm"
                  >
                    <Badge variant="info" size="sm">
                      {code.code}
                    </Badge>
                    <span className="text-slate-600 dark:text-slate-300">
                      {code.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                Triggers
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {testDetailModal.triggers.map((t) => (
                  <Badge key={t} variant="default" size="sm">
                    {t.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ---------- Root Cause Row Sub-component ---------- */

function RootCauseRow({
  rootCause,
  rank,
  onTestClick,
}: {
  rootCause: SymptomRootCause;
  rank: number;
  onTestClick: (testKey: string) => void;
}) {
  return (
    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
      <div className="flex items-start gap-3">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center text-xs font-bold">
          {rank}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <span className="font-medium text-slate-warm dark:text-white text-sm">
              {rootCause.cause}
            </span>
            <Badge variant={getProbabilityVariant(rootCause.probability)} size="sm">
              {getProbabilityLabel(rootCause.probability)}
            </Badge>
            <Badge variant="default" size="sm">
              {rootCause.icd10}
            </Badge>
          </div>

          {/* Test Badges */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-xs text-slate-400 dark:text-slate-500 self-center mr-1">
              Tests:
            </span>
            {rootCause.tests.map((test) => (
              <button
                key={test}
                onClick={() => onTestClick(test)}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
              >
                {test.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
