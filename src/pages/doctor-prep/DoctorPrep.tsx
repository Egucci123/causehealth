import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Calendar,
  Download,
  Share2,
  Sparkles,
  AlertTriangle,
  Trash2,
  Stethoscope,
  TestTube,
  Pill,
  UserCheck,
  ClipboardList,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/Progress';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { generateDoctorPrepDocument } from '@/lib/claude';
import { STANDARD_DISCLAIMER } from '@/lib/safety';
import { useUIStore } from '@/store/uiStore';
import type {
  DoctorPrepDocument,
  TestingRecommendation,
  MedicationDiscussionPoint,
  SpecialistReferral,
} from '@/types/wellness.types';
import type { LabValue } from '@/types/lab.types';
import type { Medication, Symptom } from '@/types/user.types';

const GENERATION_STEPS = [
  'Compiling your health data...',
  'Generating clinical summary...',
  'Mapping ICD-10 codes...',
  'Formatting document...',
];

function CoverageBadge({ coverage }: { coverage: TestingRecommendation['estimated_coverage'] }) {
  const config = {
    likely_covered: { label: 'Likely Covered', variant: 'success' as const },
    maybe_covered: { label: 'Maybe Covered', variant: 'warning' as const },
    likely_not_covered: { label: 'Likely Not Covered', variant: 'critical' as const },
  };
  const { label, variant } = config[coverage];
  return <Badge variant={variant}>{label}</Badge>;
}

function PriorityLabel({ priority }: { priority: TestingRecommendation['priority'] }) {
  const config = {
    urgent: { label: 'Urgent', variant: 'critical' as const },
    high: { label: 'High', variant: 'warning' as const },
    moderate: { label: 'Moderate', variant: 'info' as const },
  };
  const { label, variant } = config[priority];
  return <Badge variant={variant}>{label}</Badge>;
}

function UrgencyBadge({ urgency }: { urgency: SpecialistReferral['urgency'] }) {
  const config = {
    urgent: { label: 'Urgent', variant: 'critical' as const },
    soon: { label: 'Soon', variant: 'warning' as const },
    routine: { label: 'Routine', variant: 'default' as const },
  };
  const { label, variant } = config[urgency];
  return <Badge variant={variant}>{label}</Badge>;
}

export default function DoctorPrepPage() {
  const { user, profile, healthProfile } = useAuth();
  const { addToast } = useUIStore();
  const [doc, setDoc] = useState<DoctorPrepDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);

  // Form state
  const [appointmentDate, setAppointmentDate] = useState('');
  const [providerName, setProviderName] = useState('');

  // Editable sections
  const [editableTests, setEditableTests] = useState<TestingRecommendation[]>([]);
  const [editableMeds, setEditableMeds] = useState<MedicationDiscussionPoint[]>([]);
  const [editableReferrals, setEditableReferrals] = useState<SpecialistReferral[]>([]);

  const loadDocument = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('doctor_prep_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        const typed = data as DoctorPrepDocument;
        setDoc(typed);
        setAppointmentDate(typed.appointment_date || '');
        setProviderName(typed.provider_name || '');
        setEditableTests(typed.test_requests || []);
        setEditableMeds(typed.medication_discussion_points || []);
        setEditableReferrals(typed.specialist_referrals || []);
      }
    } catch (err) {
      // No existing document yet is expected; log unexpected errors
      console.error('Failed to load doctor prep document:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDocument();
  }, [loadDocument]);

  const handleGenerate = async () => {
    if (!user || !profile || !healthProfile) {
      addToast({ type: 'warning', title: 'Please complete your health profile first' });
      return;
    }
    if (!appointmentDate) {
      addToast({ type: 'warning', title: 'Please set an appointment date' });
      return;
    }

    setGenerating(true);
    setGenStep(0);

    for (let i = 0; i < GENERATION_STEPS.length; i++) {
      setGenStep(i);
      await new Promise((r) => setTimeout(r, 2500));
    }

    try {
      // Fetch lab history, medications, and symptoms for the AI prompt
      const [drawsRes, medsRes, symptomsRes] = await Promise.all([
        supabase.from('lab_draws').select('*').eq('user_id', user.id).order('draw_date', { ascending: false }),
        supabase.from('medications').select('*').eq('user_id', user.id).eq('is_active', true),
        supabase.from('symptoms').select('*').eq('user_id', user.id),
      ]);
      const labHistory: LabValue[][] = [];
      if (drawsRes.data) {
        for (const draw of drawsRes.data) {
          const valRes = await supabase.from('lab_values').select('*').eq('draw_id', draw.id);
          if (valRes.data) labHistory.push(valRes.data as LabValue[]);
        }
      }
      const medications = (medsRes.data || []) as Medication[];
      const symptoms = (symptomsRes.data || []) as Symptom[];

      const generated = await generateDoctorPrepDocument(
        profile,
        labHistory,
        medications,
        symptoms,
        { date: appointmentDate, provider: providerName }
      );

      const { data, error } = await supabase
        .from('doctor_prep_documents')
        .insert({
          user_id: user.id,
          appointment_date: appointmentDate,
          provider_name: providerName,
          ...generated,
        })
        .select()
        .single();

      if (error) throw error;

      const typed = data as DoctorPrepDocument;
      setDoc(typed);
      setEditableTests(typed.test_requests || []);
      setEditableMeds(typed.medication_discussion_points || []);
      setEditableReferrals(typed.specialist_referrals || []);
      addToast({ type: 'success', title: 'Doctor prep document generated!' });
    } catch (err) {
      addToast({ type: 'error', title: 'Failed to generate document', message: String(err) });
    } finally {
      setGenerating(false);
    }
  };

  const removeTest = (index: number) => {
    setEditableTests((prev) => prev.filter((_, i) => i !== index));
  };

  const removeMed = (index: number) => {
    setEditableMeds((prev) => prev.filter((_, i) => i !== index));
  };

  const removeReferral = (index: number) => {
    setEditableReferrals((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDownloadPDF = () => {
    alert('PDF download coming soon! This feature is under development.');
  };

  const handleShare = () => {
    alert('Share functionality coming soon! This feature is under development.');
  };

  if (generating) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-900/30 mb-6">
            <FileText className="w-8 h-8 text-teal-500 animate-pulse" />
          </div>
          <h2 className="text-xl font-display font-semibold text-slate-warm dark:text-white mb-2">
            Preparing Your Doctor Visit Document
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10">
            Creating a professional clinical document...
          </p>

          <div className="space-y-3">
            {GENERATION_STEPS.map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-lg text-sm transition-all ${
                  i === genStep
                    ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 font-medium'
                    : i < genStep
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400 opacity-50'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === genStep
                      ? 'bg-teal-500 text-white animate-pulse'
                      : i < genStep
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                  }`}
                >
                  {i < genStep ? '\u2713' : i + 1}
                </div>
                {step}
              </motion.div>
            ))}
          </div>

          <div className="mt-8">
            <ProgressBar value={((genStep + 1) / GENERATION_STEPS.length) * 100} color="secondary" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          <div className="h-48 bg-slate-200 dark:bg-slate-700 rounded-xl mt-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader
        title="Doctor Visit Preparation"
        description="Generate a professional clinical document with ICD-10 codes, test justifications, and discussion points for your next appointment."
        action={
          doc && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </div>
          )
        }
      />

      {/* Appointment Form */}
      <Card className="mb-6">
        <h3 className="text-base font-semibold text-slate-warm dark:text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-500" />
          Appointment Details
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Appointment Date"
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
          />
          <Input
            label="Provider Name"
            placeholder="Dr. Smith"
            value={providerName}
            onChange={(e) => setProviderName(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <Button onClick={handleGenerate} loading={generating}>
            <Sparkles className="w-4 h-4" />
            {doc ? 'Regenerate Document' : 'Generate Document'}
          </Button>
        </div>
      </Card>

      {doc && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Clinical Preview Header */}
          <Card className="border-l-4 border-l-teal-500">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-display font-semibold text-slate-warm dark:text-white">
                CauseHealth Clinical Document
              </h2>
              <span className="text-xs text-slate-400">
                Generated {new Date(doc.created_at).toLocaleDateString()}
              </span>
            </div>
            {doc.appointment_date && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Appointment: {new Date(doc.appointment_date).toLocaleDateString()} {doc.provider_name ? `with ${doc.provider_name}` : ''}
              </p>
            )}
          </Card>

          {/* Patient Clinical Summary */}
          {doc.patient_summary && (
            <Card>
              <h3 className="text-base font-semibold text-slate-warm dark:text-white mb-3 flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-500" />
                Patient Clinical Summary
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {doc.patient_summary}
              </p>
            </Card>
          )}

          {/* Test Requests */}
          {editableTests.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-warm dark:text-white flex items-center gap-2">
                  <TestTube className="w-5 h-5 text-teal-500" />
                  Test Requests
                </h3>
                <span className="text-xs text-slate-400">{editableTests.length} tests</span>
              </div>
              <div className="space-y-4">
                {editableTests.map((test, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 relative group"
                  >
                    <button
                      onClick={() => removeTest(i)}
                      className="absolute top-3 right-3 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                      title="Remove test"
                    >
                      <Trash2 className="w-4 h-4 text-slate-400" />
                    </button>
                    <div className="flex items-start justify-between gap-4 pr-8">
                      <h4 className="font-semibold text-slate-warm dark:text-white">
                        {test.test_name}
                      </h4>
                      <div className="flex gap-2 flex-shrink-0">
                        <PriorityLabel priority={test.priority} />
                        <CoverageBadge coverage={test.estimated_coverage} />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {test.icd10_codes.map((code, j) => (
                        <Badge key={j} variant="info" size="sm">
                          {code.code}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                      <span className="font-medium">Medical Necessity:</span> {test.medical_necessity}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Medication Discussion Points */}
          {editableMeds.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-warm dark:text-white flex items-center gap-2">
                  <Pill className="w-5 h-5 text-teal-500" />
                  Medication Discussion Points
                </h3>
              </div>
              <div className="space-y-3">
                {editableMeds.map((med, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 relative group"
                  >
                    <button
                      onClick={() => removeMed(i)}
                      className="absolute top-3 right-3 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4 text-slate-400" />
                    </button>
                    <h4 className="font-semibold text-slate-warm dark:text-white">{med.medication}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      <span className="font-medium">Concern:</span> {med.concern}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      <span className="font-medium">Request:</span> {med.request}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Specialist Referrals */}
          {editableReferrals.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-slate-warm dark:text-white flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-teal-500" />
                  Specialist Referrals
                </h3>
              </div>
              <div className="space-y-3">
                {editableReferrals.map((ref, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between p-4 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 relative group"
                  >
                    <button
                      onClick={() => removeReferral(i)}
                      className="absolute top-3 right-3 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4 text-slate-400" />
                    </button>
                    <div className="pr-8">
                      <h4 className="font-semibold text-slate-warm dark:text-white">{ref.specialty}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{ref.reason}</p>
                    </div>
                    <UrgencyBadge urgency={ref.urgency} />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Symptom Report */}
          {doc.symptom_report && (
            <Card>
              <h3 className="text-base font-semibold text-slate-warm dark:text-white mb-3 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-teal-500" />
                Symptom Report
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {doc.symptom_report}
              </p>
            </Card>
          )}

          {/* Disclaimer */}
          <Card padding="sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">
                  Important Disclaimer
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {STANDARD_DISCLAIMER}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
