import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Sparkles,
  Download,
  AlertTriangle,
  Leaf,
  Pill,
  Dumbbell,
  Moon,
  Brain,
  TestTube,
  Stethoscope,
  UserCheck,
  Target,
  FileText,
  DollarSign,
  Clock,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge, EvidenceRating } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/Progress';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { generateWellnessPlan } from '@/lib/claude';
import { STANDARD_DISCLAIMER } from '@/lib/safety';
import { useUIStore } from '@/store/uiStore';
import type {
  WellnessPlan,
  SupplementRecommendation,
  TestingRecommendation,
  SpecialistReferral,
} from '@/types/wellness.types';
import type { LabValue } from '@/types/lab.types';
import type { Medication, Symptom } from '@/types/user.types';

const GENERATION_STEPS = [
  { label: 'Analyzing your health data', icon: FileText, duration: 3000 },
  { label: 'Identifying root causes', icon: Brain, duration: 4000 },
  { label: 'Building supplement stack', icon: Pill, duration: 3500 },
  { label: 'Creating protocols', icon: Target, duration: 3000 },
  { label: 'Generating recommendations', icon: Sparkles, duration: 2500 },
];

function CollapsibleSection({
  title,
  icon: Icon,
  defaultOpen = false,
  children,
}: {
  title: string;
  icon: React.ElementType;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-900/30">
            <Icon className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-warm dark:text-white">{title}</h3>
        </div>
        {open ? (
          <ChevronDown className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronRight className="w-5 h-5 text-slate-400" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-700 pt-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

function SupplementCard({ supplement }: { supplement: SupplementRecommendation }) {
  return (
    <div className="p-4 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-semibold text-slate-warm dark:text-white">{supplement.name}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{supplement.reason}</p>
        </div>
        <EvidenceRating rating={supplement.evidence_rating} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant="info">{supplement.dose}</Badge>
        <Badge variant="default">{supplement.timing}</Badge>
        <Badge variant="default">{supplement.form}</Badge>
        <Badge variant="success">
          <DollarSign className="w-3 h-3 mr-0.5" />
          {supplement.monthly_cost}/mo
        </Badge>
      </div>
    </div>
  );
}

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

export default function WellnessPlanPage() {
  const { user, profile, healthProfile } = useAuth();
  const { addToast } = useUIStore();
  const [plan, setPlan] = useState<WellnessPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [milestoneChecks, setMilestoneChecks] = useState<Record<string, boolean>>({});

  const loadPlan = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('wellness_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) setPlan(data as WellnessPlan);
    } catch (err) {
      // No active plan yet is expected; log unexpected errors
      console.error('Failed to load wellness plan:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  const handleGenerate = async () => {
    if (!user || !profile || !healthProfile) {
      addToast({ type: 'warning', title: 'Please complete your health profile first' });
      return;
    }

    setGenerating(true);
    setGenerationStep(0);

    // Animate through steps
    for (let i = 0; i < GENERATION_STEPS.length; i++) {
      setGenerationStep(i);
      await new Promise((r) => setTimeout(r, GENERATION_STEPS[i].duration));
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

      const generatedPlan = await generateWellnessPlan(profile, labHistory, medications, symptoms);

      // Deactivate old plans
      await supabase
        .from('wellness_plans')
        .update({ is_active: false })
        .eq('user_id', user.id);

      // Save new plan
      const { data, error } = await supabase
        .from('wellness_plans')
        .insert({
          user_id: user.id,
          ...generatedPlan,
          is_active: true,
          version: (plan?.version ?? 0) + 1,
        })
        .select()
        .single();

      if (error) throw error;
      setPlan(data as WellnessPlan);
      addToast({ type: 'success', title: 'Wellness plan generated successfully!' });
    } catch (err) {
      addToast({ type: 'error', title: 'Failed to generate plan', message: String(err) });
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    alert('PDF download coming soon! This feature is under development.');
  };

  const toggleMilestone = (key: string) => {
    setMilestoneChecks((prev) => ({ ...prev, [key]: !prev[key] }));
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
            <Sparkles className="w-8 h-8 text-teal-500 animate-pulse" />
          </div>
          <h2 className="text-xl font-display font-semibold text-slate-warm dark:text-white mb-2">
            Building Your Wellness Plan
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-10">
            Our AI is analyzing your complete health profile...
          </p>

          <div className="space-y-4">
            {GENERATION_STEPS.map((step, i) => {
              const StepIcon = step.icon;
              const isActive = i === generationStep;
              const isComplete = i < generationStep;

              return (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800'
                      : isComplete
                        ? 'bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 opacity-50'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      isActive
                        ? 'bg-teal-100 dark:bg-teal-800/50'
                        : isComplete
                          ? 'bg-emerald-100 dark:bg-emerald-800/50'
                          : 'bg-slate-100 dark:bg-slate-700'
                    }`}
                  >
                    <StepIcon
                      className={`w-5 h-5 ${
                        isActive
                          ? 'text-teal-600 dark:text-teal-400 animate-pulse'
                          : isComplete
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-400'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      isActive
                        ? 'text-teal-700 dark:text-teal-300'
                        : isComplete
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                    {isActive && '...'}
                    {isComplete && ' - Done'}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8">
            <ProgressBar
              value={((generationStep + 1) / GENERATION_STEPS.length) * 100}
              color="secondary"
            />
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
          <div className="space-y-3 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader
        title="Your Wellness Plan"
        description={plan ? `Version ${plan.version} - Last updated ${new Date(plan.updated_at).toLocaleDateString()}` : undefined}
        action={
          <div className="flex gap-2">
            {plan && (
              <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            )}
            <Button onClick={handleGenerate}>
              <Sparkles className="w-4 h-4" />
              {plan ? 'Regenerate Plan' : 'Generate Plan'}
            </Button>
          </div>
        }
      />

      {!plan ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-900/30 mb-4">
              <Sparkles className="w-8 h-8 text-teal-500" />
            </div>
            <h2 className="text-lg font-display font-semibold text-slate-warm dark:text-white mb-2">
              No Active Wellness Plan
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Generate a personalized wellness plan based on your lab results, symptoms,
              medications, and health profile. Our AI analyzes everything together to find
              root causes and create an actionable protocol.
            </p>
            <Button onClick={handleGenerate}>
              <Sparkles className="w-4 h-4" />
              Generate Your Wellness Plan
            </Button>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {/* Executive Summary */}
          {plan.executive_summary && (
            <CollapsibleSection title="Executive Summary" icon={FileText} defaultOpen>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {plan.executive_summary}
              </p>
              {plan.priority_findings && (
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {plan.priority_findings.critical.length > 0 && (
                    <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800">
                      <h4 className="text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wide mb-2">
                        Critical
                      </h4>
                      <ul className="space-y-1">
                        {plan.priority_findings.critical.map((f, i) => (
                          <li key={i} className="text-sm text-rose-600 dark:text-rose-300">{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {plan.priority_findings.monitor.length > 0 && (
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                      <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-2">
                        Monitor
                      </h4>
                      <ul className="space-y-1">
                        {plan.priority_findings.monitor.map((f, i) => (
                          <li key={i} className="text-sm text-amber-600 dark:text-amber-300">{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {plan.priority_findings.optimal.length > 0 && (
                    <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800">
                      <h4 className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-2">
                        Optimal
                      </h4>
                      <ul className="space-y-1">
                        {plan.priority_findings.optimal.map((f, i) => (
                          <li key={i} className="text-sm text-emerald-600 dark:text-emerald-300">{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CollapsibleSection>
          )}

          {/* Root Cause Analysis */}
          {plan.root_cause_analysis && (
            <CollapsibleSection title="Root Cause Analysis" icon={Brain}>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-warm dark:text-white mb-2">
                    Primary Drivers
                  </h4>
                  <ul className="space-y-2">
                    {plan.root_cause_analysis.primary_drivers.map((driver, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        {driver}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-warm dark:text-white mb-2">
                    Contributing Factors
                  </h4>
                  <ul className="space-y-2">
                    {plan.root_cause_analysis.contributing_factors.map((factor, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
                {plan.root_cause_analysis.interconnections.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-warm dark:text-white mb-2">
                      Interconnections
                    </h4>
                    <ul className="space-y-2">
                      {plan.root_cause_analysis.interconnections.map((c, i) => (
                        <li key={i} className="text-sm text-slate-500 dark:text-slate-400 italic">
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CollapsibleSection>
          )}

          {/* Nutrition Plan */}
          {plan.nutrition_plan && (
            <CollapsibleSection title="Nutrition Plan" icon={Leaf}>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-2">
                      Foods to Eliminate
                    </h4>
                    <ul className="space-y-1">
                      {plan.nutrition_plan.foods_to_eliminate.map((food, i) => (
                        <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          {food}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                      Foods to Emphasize
                    </h4>
                    <ul className="space-y-1">
                      {plan.nutrition_plan.foods_to_emphasize.map((food, i) => (
                        <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {food}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Meal Timing: {plan.nutrition_plan.meal_timing}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Protein: {plan.nutrition_plan.protein_target}
                    </span>
                  </div>
                </div>
                {plan.nutrition_plan.specific_to_conditions.length > 0 && (
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                    <h4 className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-1">
                      Condition-Specific Notes
                    </h4>
                    <ul className="space-y-1">
                      {plan.nutrition_plan.specific_to_conditions.map((note, i) => (
                        <li key={i} className="text-sm text-blue-600 dark:text-blue-300">{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CollapsibleSection>
          )}

          {/* Supplement Stack */}
          {plan.supplement_stack && (
            <CollapsibleSection title="Supplement Stack" icon={Pill}>
              <div className="space-y-6">
                {plan.supplement_stack.tier_1_start_immediately.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="critical" size="md">Tier 1</Badge>
                      <span className="text-sm font-medium text-slate-warm dark:text-white">
                        Start Immediately
                      </span>
                    </div>
                    <div className="space-y-3">
                      {plan.supplement_stack.tier_1_start_immediately.map((s, i) => (
                        <SupplementCard key={i} supplement={s} />
                      ))}
                    </div>
                  </div>
                )}
                {plan.supplement_stack.tier_2_add_week_2.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="warning" size="md">Tier 2</Badge>
                      <span className="text-sm font-medium text-slate-warm dark:text-white">
                        Add Week 2
                      </span>
                    </div>
                    <div className="space-y-3">
                      {plan.supplement_stack.tier_2_add_week_2.map((s, i) => (
                        <SupplementCard key={i} supplement={s} />
                      ))}
                    </div>
                  </div>
                )}
                {plan.supplement_stack.tier_3_optional.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="info" size="md">Tier 3</Badge>
                      <span className="text-sm font-medium text-slate-warm dark:text-white">
                        Optional
                      </span>
                    </div>
                    <div className="space-y-3">
                      {plan.supplement_stack.tier_3_optional.map((s, i) => (
                        <SupplementCard key={i} supplement={s} />
                      ))}
                    </div>
                  </div>
                )}
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm text-slate-500 dark:text-slate-400">
                  Estimated total monthly cost: $
                  {[
                    ...plan.supplement_stack.tier_1_start_immediately,
                    ...plan.supplement_stack.tier_2_add_week_2,
                    ...plan.supplement_stack.tier_3_optional,
                  ]
                    .reduce((sum, s) => sum + parseFloat(s.monthly_cost.replace(/[^0-9.]/g, '') || '0'), 0)
                    .toFixed(2)}
                </div>
              </div>
            </CollapsibleSection>
          )}

          {/* Exercise Prescription */}
          {plan.exercise_prescription && (
            <CollapsibleSection title="Exercise Prescription" icon={Dumbbell}>
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Type</p>
                    <p className="text-sm font-medium text-slate-warm dark:text-white mt-0.5">
                      {plan.exercise_prescription.type}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Frequency</p>
                    <p className="text-sm font-medium text-slate-warm dark:text-white mt-0.5">
                      {plan.exercise_prescription.frequency}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Duration</p>
                    <p className="text-sm font-medium text-slate-warm dark:text-white mt-0.5">
                      {plan.exercise_prescription.duration}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Intensity</p>
                    <p className="text-sm font-medium text-slate-warm dark:text-white mt-0.5">
                      {plan.exercise_prescription.intensity}
                    </p>
                  </div>
                </div>
                {plan.exercise_prescription.specific_recommendations.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-warm dark:text-white mb-2">Recommendations</h4>
                    <ul className="space-y-1">
                      {plan.exercise_prescription.specific_recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {plan.exercise_prescription.contraindications.length > 0 && (
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
                    <h4 className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">
                      Contraindications
                    </h4>
                    <ul className="space-y-1">
                      {plan.exercise_prescription.contraindications.map((c, i) => (
                        <li key={i} className="text-sm text-amber-600 dark:text-amber-300">{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CollapsibleSection>
          )}

          {/* Sleep Protocol */}
          {plan.sleep_protocol && (
            <CollapsibleSection title="Sleep Protocol" icon={Moon}>
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Target: <span className="font-semibold">{plan.sleep_protocol.target_hours} hours</span>
                </p>
                <div>
                  <h4 className="text-sm font-medium text-slate-warm dark:text-white mb-2">Recommendations</h4>
                  <ul className="space-y-1">
                    {plan.sleep_protocol.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
                {plan.sleep_protocol.supplements.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-warm dark:text-white mb-2">Sleep Supplements</h4>
                    <div className="flex flex-wrap gap-2">
                      {plan.sleep_protocol.supplements.map((s, i) => (
                        <Badge key={i} variant="info">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {plan.sleep_protocol.environment_changes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-warm dark:text-white mb-2">Environment</h4>
                    <ul className="space-y-1">
                      {plan.sleep_protocol.environment_changes.map((c, i) => (
                        <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CollapsibleSection>
          )}

          {/* Stress Protocol */}
          {plan.stress_protocol && (
            <CollapsibleSection title="Stress Protocol" icon={Brain}>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-slate-warm dark:text-white mb-2">Techniques</h4>
                  <ul className="space-y-1">
                    {plan.stress_protocol.techniques.map((t, i) => (
                      <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
                {plan.stress_protocol.supplements.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-warm dark:text-white mb-2">Stress Supplements</h4>
                    <div className="flex flex-wrap gap-2">
                      {plan.stress_protocol.supplements.map((s, i) => (
                        <Badge key={i} variant="info">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {plan.stress_protocol.lifestyle_changes.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-slate-warm dark:text-white mb-2">Lifestyle Changes</h4>
                    <ul className="space-y-1">
                      {plan.stress_protocol.lifestyle_changes.map((c, i) => (
                        <li key={i} className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CollapsibleSection>
          )}

          {/* Testing Recommendations */}
          {plan.testing_recommendations && plan.testing_recommendations.length > 0 && (
            <CollapsibleSection title="Testing Recommendations" icon={TestTube}>
              <div className="space-y-4">
                {plan.testing_recommendations.map((test, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="font-semibold text-slate-warm dark:text-white">
                        {test.test_name}
                      </h4>
                      <div className="flex gap-2 flex-shrink-0">
                        <PriorityLabel priority={test.priority} />
                        <CoverageBadge coverage={test.estimated_coverage} />
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{test.reason}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {test.icd10_codes.map((code, j) => (
                        <Badge key={j} variant="info" size="sm">
                          {code.code}: {code.description}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Medication Discussion Points */}
          {plan.medication_discussion_points && plan.medication_discussion_points.length > 0 && (
            <CollapsibleSection title="Medication Discussion Points" icon={Stethoscope}>
              <div className="space-y-3">
                {plan.medication_discussion_points.map((med, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                  >
                    <h4 className="font-semibold text-slate-warm dark:text-white">{med.medication}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      <span className="font-medium">Concern:</span> {med.concern}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      <span className="font-medium">Request:</span> {med.request}
                    </p>
                    {med.icd10_for_concern && (
                      <Badge variant="info" size="sm" className="mt-2">
                        {med.icd10_for_concern}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Specialist Referrals */}
          {plan.specialist_referrals && plan.specialist_referrals.length > 0 && (
            <CollapsibleSection title="Specialist Referrals" icon={UserCheck}>
              <div className="space-y-3">
                {plan.specialist_referrals.map((ref, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between p-4 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div>
                      <h4 className="font-semibold text-slate-warm dark:text-white">{ref.specialty}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{ref.reason}</p>
                    </div>
                    <UrgencyBadge urgency={ref.urgency} />
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* 30/60/90 Day Milestones */}
          {plan.milestones && (
            <CollapsibleSection title="30/60/90 Day Milestones" icon={Target}>
              <div className="space-y-6">
                {[
                  { label: '30-Day Goals', items: plan.milestones.day_30, prefix: '30' },
                  { label: '60-Day Goals', items: plan.milestones.day_60, prefix: '60' },
                  { label: '90-Day Goals', items: plan.milestones.day_90, prefix: '90' },
                ].map(({ label, items, prefix }) => (
                  <div key={prefix}>
                    <h4 className="text-sm font-semibold text-slate-warm dark:text-white mb-2">{label}</h4>
                    <div className="space-y-2">
                      {items.map((item, i) => {
                        const key = `${prefix}-${i}`;
                        return (
                          <label
                            key={key}
                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={milestoneChecks[key] || false}
                              onChange={() => toggleMilestone(key)}
                              className="mt-0.5 rounded border-slate-300 text-teal-500 focus:ring-teal-400"
                            />
                            <span
                              className={`text-sm ${
                                milestoneChecks[key]
                                  ? 'line-through text-slate-400'
                                  : 'text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              {item}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {/* Disclaimer */}
          <Card padding="sm" className="mt-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {STANDARD_DISCLAIMER}
              </p>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
