import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  DollarSign,
  CheckCircle2,
  HelpCircle,
  XCircle,
  Lightbulb,
  ExternalLink,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { STANDARD_DISCLAIMER } from '@/lib/safety';
import { ICD10_TEST_JUSTIFICATIONS } from '@/data/icd10Codes';
import type { TestingRecommendation } from '@/types/wellness.types';

interface DirectPayProvider {
  name: string;
  description: string;
  priceRange: string;
}

const DIRECT_PAY_PROVIDERS: DirectPayProvider[] = [
  {
    name: 'Ulta Lab Tests',
    description:
      'Order lab tests online at discounted prices. Tests are performed at Quest Diagnostics locations nationwide. No doctor visit required.',
    priceRange: '$29-$399 per panel',
  },
  {
    name: 'LabCorp OnDemand',
    description:
      'Purchase lab tests directly from LabCorp at transparent prices. Results available online within days.',
    priceRange: '$35-$349 per panel',
  },
  {
    name: 'Function Health',
    description:
      'Comprehensive annual lab testing membership. Over 100 biomarkers tested with personalized reporting and trend tracking.',
    priceRange: '$499/year membership',
  },
  {
    name: 'Marek Health',
    description:
      'Hormone and metabolic-focused lab testing with clinical consultation. Popular for comprehensive hormone panels.',
    priceRange: '$200-$600 per panel',
  },
];

const COVERAGE_TIPS = [
  'Always ask your doctor to note symptoms and diagnoses on the lab order to support medical necessity.',
  'Request that your provider use the most specific ICD-10 codes available rather than generic codes.',
  'If a test is denied, ask your provider to submit a prior authorization with medical necessity documentation.',
  'Preventive screenings may be covered differently than diagnostic tests. Confirm with your insurer.',
  'Some insurance plans cover more lab tests if ordered through specific in-network labs (Quest, LabCorp).',
  'Keep copies of all denial letters - you have the right to appeal every denial.',
  'Annual wellness visits may include lab work at no cost under the ACA preventive care mandate.',
  'Consider an HSA or FSA to pay for lab tests with pre-tax dollars.',
];

function CoverageIcon({ coverage }: { coverage: TestingRecommendation['estimated_coverage'] }) {
  switch (coverage) {
    case 'likely_covered':
      return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    case 'maybe_covered':
      return <HelpCircle className="w-5 h-5 text-amber-500" />;
    case 'likely_not_covered':
      return <XCircle className="w-5 h-5 text-rose-500" />;
  }
}

function CoverageBadge({ coverage }: { coverage: TestingRecommendation['estimated_coverage'] }) {
  const config = {
    likely_covered: { label: 'Likely Covered', variant: 'success' as const },
    maybe_covered: { label: 'Maybe Covered', variant: 'warning' as const },
    likely_not_covered: { label: 'Likely Not Covered', variant: 'critical' as const },
  };
  const { label, variant } = config[coverage];
  return <Badge variant={variant} size="md">{label}</Badge>;
}

// Estimated self-pay costs for common tests
const SELF_PAY_ESTIMATES: Record<string, string> = {
  full_thyroid_panel: '$75-$150',
  testosterone_panel: '$80-$175',
  fasting_insulin_homa: '$30-$65',
  rbc_folate_mma: '$60-$120',
  comprehensive_metabolic: '$25-$50',
  cbc_with_differential: '$15-$35',
  vitamin_d_25oh: '$30-$65',
  iron_panel_ferritin: '$40-$80',
  hs_crp: '$25-$50',
  homocysteine: '$35-$70',
  lipid_panel_advanced: '$60-$150',
  cortisol_dhea: '$50-$100',
};

export default function InsurancePage() {
  const { user, healthProfile } = useAuth();
  const [tests, setTests] = useState<TestingRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedTests, setExpandedTests] = useState<Record<number, boolean>>({});

  const loadRecommendedTests = useCallback(async () => {
    if (!user) return;

    try {
      // Try to get tests from the active wellness plan
      const { data: plan } = await supabase
        .from('wellness_plans')
        .select('testing_recommendations')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (plan?.testing_recommendations) {
        setTests(plan.testing_recommendations);
      } else if (healthProfile) {
        // Build recommendations from diagnoses and ICD-10 database
        const recommendations: TestingRecommendation[] = [];
        const diagnoses = healthProfile.diagnoses || [];

        Object.entries(ICD10_TEST_JUSTIFICATIONS).forEach(([_key, justification]) => {
          const isRelevant = justification.triggers?.some(
            (trigger: string) =>
              diagnoses.some((d) => d.toLowerCase().includes(trigger)) ||
              trigger === 'fatigue' // common enough to include
          );

          if (isRelevant) {
            recommendations.push({
              test_name: justification.test_name,
              reason: justification.medical_necessity.substring(0, 200) + '...',
              priority: 'moderate',
              icd10_codes: justification.codes,
              medical_necessity: justification.medical_necessity,
              estimated_coverage: 'maybe_covered',
            });
          }
        });

        setTests(recommendations);
      }
    } catch {
      // No wellness plan
    } finally {
      setLoading(false);
    }
  }, [user, healthProfile]);

  useEffect(() => {
    loadRecommendedTests();
  }, [loadRecommendedTests]);

  const toggleTest = (index: number) => {
    setExpandedTests((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const totalDirectPayCost = () => {
    let min = 0;
    let max = 0;
    tests.forEach((test) => {
      // Search for a matching self-pay estimate key
      const key = Object.keys(SELF_PAY_ESTIMATES).find((k) =>
        test.test_name.toLowerCase().includes(k.replace(/_/g, ' '))
      );
      if (key) {
        const range = SELF_PAY_ESTIMATES[key];
        const match = range.match(/\$(\d+)-\$(\d+)/);
        if (match) {
          min += parseInt(match[1]);
          max += parseInt(match[2]);
        }
      } else {
        min += 50;
        max += 150;
      }
    });
    return { min, max };
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
          <div className="space-y-3 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const costEstimate = totalDirectPayCost();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader
        title="Insurance Coverage Guide"
        description="Understand which tests may be covered by insurance and explore direct-pay alternatives for comprehensive lab testing."
      />

      {tests.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-900/30 mb-4">
              <Shield className="w-8 h-8 text-teal-500" />
            </div>
            <h2 className="text-lg font-display font-semibold text-slate-warm dark:text-white mb-2">
              No Test Recommendations Yet
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Generate a wellness plan first to get personalized test recommendations
              with insurance coverage estimates and ICD-10 justification codes.
            </p>
          </Card>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {/* Coverage Summary */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-display font-bold text-slate-warm dark:text-white">
                {tests.filter((t) => t.estimated_coverage === 'likely_covered').length}
              </p>
              <p className="text-xs text-slate-500">Likely Covered</p>
            </Card>
            <Card className="text-center">
              <HelpCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <p className="text-2xl font-display font-bold text-slate-warm dark:text-white">
                {tests.filter((t) => t.estimated_coverage === 'maybe_covered').length}
              </p>
              <p className="text-xs text-slate-500">Maybe Covered</p>
            </Card>
            <Card className="text-center">
              <XCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
              <p className="text-2xl font-display font-bold text-slate-warm dark:text-white">
                {tests.filter((t) => t.estimated_coverage === 'likely_not_covered').length}
              </p>
              <p className="text-xs text-slate-500">Likely Not Covered</p>
            </Card>
          </div>

          {/* Recommended Tests */}
          <div>
            <h2 className="text-lg font-display font-semibold text-slate-warm dark:text-white mb-4">
              Recommended Tests
            </h2>
            <div className="space-y-3">
              {tests.map((test, i) => (
                <Card key={i} padding="none" className="overflow-hidden">
                  <button
                    onClick={() => toggleTest(i)}
                    className="w-full p-4 flex items-start gap-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <CoverageIcon coverage={test.estimated_coverage} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-warm dark:text-white text-sm">
                          {test.test_name}
                        </h3>
                        <CoverageBadge coverage={test.estimated_coverage} />
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {test.icd10_codes.map((code, j) => (
                          <Badge key={j} variant="info" size="sm">
                            {code.code}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {expandedTests[i] ? (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    )}
                  </button>

                  {expandedTests[i] && (
                    <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-700 pt-3 ml-9">
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                            Medical Necessity Preview
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-300">
                            {test.medical_necessity}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                            ICD-10 Code Details
                          </h4>
                          <div className="space-y-1">
                            {test.icd10_codes.map((code, j) => (
                              <div key={j} className="flex items-center gap-2 text-sm">
                                <Badge variant="info" size="sm">{code.code}</Badge>
                                <span className="text-slate-600 dark:text-slate-300">
                                  {code.description}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600 dark:text-slate-300">
                            Estimated self-pay:{' '}
                            <span className="font-medium">
                              {(() => {
                                const key = Object.keys(SELF_PAY_ESTIMATES).find((k) =>
                                  test.test_name.toLowerCase().includes(k.replace(/_/g, ' '))
                                );
                                return key ? SELF_PAY_ESTIMATES[key] : '$50-$150';
                              })()}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>

          {/* Direct Pay Alternatives */}
          <div>
            <h2 className="text-lg font-display font-semibold text-slate-warm dark:text-white mb-4">
              Direct Pay Alternatives
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              If insurance does not cover the tests you need, these direct-pay services offer
              transparent pricing without requiring a doctor visit.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {DIRECT_PAY_PROVIDERS.map((provider) => (
                <Card key={provider.name} hover>
                  <h3 className="font-semibold text-slate-warm dark:text-white flex items-center gap-2">
                    {provider.name}
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {provider.description}
                  </p>
                  <p className="text-sm font-medium text-teal-600 dark:text-teal-400 mt-2">
                    {provider.priceRange}
                  </p>
                </Card>
              ))}
            </div>

            {/* Total Cost Estimate */}
            <Card className="mt-4 bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                <div>
                  <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">
                    Estimated Total Direct-Pay Cost
                  </p>
                  <p className="text-lg font-display font-bold text-teal-800 dark:text-teal-200">
                    ${costEstimate.min} - ${costEstimate.max}
                  </p>
                  <p className="text-xs text-teal-600 dark:text-teal-400">
                    For all {tests.length} recommended tests
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Tips for Maximizing Coverage */}
          <div>
            <h2 className="text-lg font-display font-semibold text-slate-warm dark:text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Tips for Maximizing Insurance Coverage
            </h2>
            <Card>
              <ul className="space-y-3">
                {COVERAGE_TIPS.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-xs font-bold text-teal-600 dark:text-teal-400">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Disclaimer */}
          <Card padding="sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {STANDARD_DISCLAIMER} Insurance coverage estimates are general guidance only and vary
                by plan, provider, and state. Always verify coverage with your insurance company before
                ordering tests.
              </p>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
