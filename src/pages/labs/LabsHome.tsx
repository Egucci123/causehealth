import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, TestTube2, Calendar, Sparkles, Activity, Heart } from 'lucide-react';
import { useLabStore } from '@/store/labStore';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { LabDraw, LabValue } from '@/types/lab.types';

const CATEGORY_TABS = [
  { id: 'all', label: 'All' },
  { id: 'metabolic', label: 'Metabolic' },
  { id: 'cardiovascular', label: 'Cardiovascular' },
  { id: 'thyroid', label: 'Thyroid' },
  { id: 'liver', label: 'Liver' },
  { id: 'kidney', label: 'Kidney' },
  { id: 'nutrients', label: 'Nutrients' },
  { id: 'hormones', label: 'Hormones' },
  { id: 'inflammation', label: 'Inflammation' },
  { id: 'cbc', label: 'CBC' },
];

const CATEGORY_SUBTITLES: Record<string, string> = {
  thyroid: 'GLANDULAR HEALTH',
  metabolic: 'METABOLIC PANEL',
  cardiovascular: 'CARDIAC MARKERS',
  liver: 'HEPATIC FUNCTION',
  kidney: 'RENAL FUNCTION',
  nutrients: 'MICRONUTRIENT STATUS',
  hormones: 'ENDOCRINE PANEL',
  inflammation: 'INFLAMMATORY MARKERS',
  cbc: 'COMPLETE BLOOD COUNT',
};

interface DrawWithSummary extends LabDraw {
  markerCount: number;
  criticalCount: number;
  monitorCount: number;
  optimalCount: number;
  categories: string[];
}

function getStatusLabel(flag: string | null | undefined): { label: string; color: string } {
  switch (flag) {
    case 'optimal':
      return { label: 'OPTIMAL', color: 'bg-[#1F403D]/20 text-[#6DB8AF]' };
    case 'deficient':
    case 'elevated':
    case 'critical_low':
    case 'critical_high':
      return { label: 'DEFICIENCY', color: 'bg-[#CF6679]/20 text-[#CF6679]' };
    case 'suboptimal_low':
    case 'suboptimal_high':
      return { label: 'SUB-OPTIMAL', color: 'bg-[#C9A84C]/20 text-[#C9A84C]' };
    default:
      return { label: 'SYSTEMIC CALM', color: 'bg-[#1F403D]/20 text-[#6DB8AF]' };
  }
}

function getRangeBarColor(flag: string | null | undefined): string {
  switch (flag) {
    case 'optimal':
      return 'bg-[#1F403D]';
    case 'deficient':
    case 'elevated':
    case 'critical_low':
    case 'critical_high':
      return 'bg-[#CF6679]';
    case 'suboptimal_low':
    case 'suboptimal_high':
      return 'bg-[#C9A84C]';
    default:
      return 'bg-[#1F403D]';
  }
}

function getRangePercent(value: number | null, refLow: number | null, refHigh: number | null): number {
  if (value == null || refLow == null || refHigh == null) return 50;
  const range = refHigh - refLow;
  if (range <= 0) return 50;
  const pct = ((value - refLow) / range) * 100;
  return Math.max(5, Math.min(95, pct));
}

export default function LabsHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setDraws, setValues } = useLabStore();
  const [loading, setLoading] = useState(true);
  const [drawSummaries, setDrawSummaries] = useState<DrawWithSummary[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [allValues, setAllValues] = useState<LabValue[]>([]);

  useEffect(() => {
    if (!user) return;
    loadLabData();
  }, [user]);

  async function loadLabData() {
    try {
      const [drawsRes, valuesRes] = await Promise.all([
        supabase
          .from('lab_draws')
          .select('*')
          .eq('user_id', user!.id)
          .order('draw_date', { ascending: false }),
        supabase
          .from('lab_values')
          .select('*')
          .eq('user_id', user!.id),
      ]);

      const loadedDraws: LabDraw[] = drawsRes.data ?? [];
      const loadedValues: LabValue[] = valuesRes.data ?? [];

      setDraws(loadedDraws);
      setValues(loadedValues);
      setAllValues(loadedValues);

      const summaries: DrawWithSummary[] = loadedDraws.map((draw) => {
        const drawValues = loadedValues.filter((v) => v.draw_id === draw.id);
        const categories = [...new Set(drawValues.map((v) => v.marker_category).filter(Boolean))] as string[];

        let criticalCount = 0;
        let monitorCount = 0;
        let optimalCount = 0;

        for (const v of drawValues) {
          if (
            v.optimal_flag === 'deficient' ||
            v.optimal_flag === 'elevated' ||
            v.standard_flag === 'critical_low' ||
            v.standard_flag === 'critical_high'
          ) {
            criticalCount++;
          } else if (
            v.optimal_flag === 'suboptimal_low' ||
            v.optimal_flag === 'suboptimal_high'
          ) {
            monitorCount++;
          } else if (v.optimal_flag === 'optimal') {
            optimalCount++;
          }
        }

        return {
          ...draw,
          markerCount: drawValues.length,
          criticalCount,
          monitorCount,
          optimalCount,
          categories,
        };
      });

      setDrawSummaries(summaries);
    } catch (err) {
      console.error('Failed to load lab data:', err);
    } finally {
      setLoading(false);
    }
  }

  const filterDrawsByCategory = (draws: DrawWithSummary[], category: string) => {
    if (category === 'all') return draws;
    return draws.filter((d) => d.categories.includes(category));
  };

  const filtered = filterDrawsByCategory(drawSummaries, activeTab);

  // Group values by category for biomarker section display
  const latestDrawValues = drawSummaries.length > 0
    ? allValues.filter((v) => v.draw_id === drawSummaries[0].id)
    : [];

  const valuesByCategory = latestDrawValues.reduce<Record<string, LabValue[]>>((acc, v) => {
    const cat = v.marker_category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(v);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0C0F] px-6 pt-8 pb-32 font-['DM_Sans',sans-serif]">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-[#15181C] rounded-[10px] w-2/3" />
          <div className="h-5 bg-[#15181C] rounded-[10px] w-full" />
          <div className="h-14 bg-[#15181C] rounded-[10px] w-full" />
          <div className="h-64 bg-[#15181C] rounded-[10px]" />
          <div className="h-48 bg-[#15181C] rounded-[10px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0C0F] px-6 pt-8 pb-32 font-['DM_Sans',sans-serif] space-y-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
          DIAGNOSTIC OVERVIEW
        </span>
        <h1 className="font-['Newsreader',serif] text-4xl text-[#E2E2E6] mt-2">
          Your Lab Results
        </h1>
        <button
          onClick={() => navigate('/app/labs/upload')}
          className="w-full mt-6 bg-[#1F403D] text-white rounded-[10px] py-4 uppercase tracking-[0.15em] font-bold text-sm flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          + ADD LABS
        </button>
      </motion.div>

      {drawSummaries.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-[#15181C] rounded-[10px] border border-[rgba(63,73,72,0.2)] p-8 text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#1E2226] flex items-center justify-center">
              <TestTube2 className="w-7 h-7 text-[#A0ACAB]" />
            </div>
          </div>
          <h2 className="font-['Newsreader',serif] text-2xl text-[#E2E2E6]">
            No lab results yet
          </h2>
          <p className="text-sm text-[#A0ACAB] mt-3 leading-relaxed max-w-[300px] mx-auto">
            Upload your first lab report to get started. Our AI will analyze your results using optimal ranges and identify patterns your doctor may have missed.
          </p>
          <button
            onClick={() => navigate('/app/labs/upload')}
            className="mt-5 text-sm font-bold text-[#E2E2E6] underline underline-offset-4 decoration-[#A0ACAB]/30"
          >
            Upload Your First Lab Report
          </button>
        </motion.div>
      ) : (
        /* Lab content */
        <div className="space-y-6">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-4 py-2 rounded-[24px] text-xs font-bold uppercase tracking-[0.15em] transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#1F403D] text-white'
                    : 'bg-[#15181C] text-[#A0ACAB] border border-[rgba(63,73,72,0.2)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Biomarker Sections by Category */}
          {activeTab === 'all' ? (
            Object.entries(valuesByCategory).map(([category, values]) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <h2 className="font-['Newsreader',serif] text-xl text-[#E2E2E6] capitalize">
                    {category}
                  </h2>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
                    {CATEGORY_SUBTITLES[category.toLowerCase()] || 'BIOMARKERS'}
                  </span>
                </div>

                {/* Biomarker Rows */}
                {values.map((val) => {
                  const status = getStatusLabel(val.optimal_flag || val.standard_flag);
                  const barColor = getRangeBarColor(val.optimal_flag || val.standard_flag);
                  const pct = getRangePercent(
                    val.value,
                    val.standard_low ?? val.optimal_low,
                    val.standard_high ?? val.optimal_high,
                  );
                  return (
                    <div
                      key={val.id}
                      className="bg-[#15181C] rounded-[10px] border border-[rgba(63,73,72,0.2)] p-6"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-xs uppercase tracking-widest text-[#A0ACAB]">
                          {val.marker_name}
                        </span>
                        <span className={`text-[10px] uppercase tracking-[0.15em] font-bold px-3 py-1 rounded-[24px] ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-['Newsreader',serif] text-[#E2E2E6]">
                          {val.value ?? '--'}
                        </span>
                        <span className="text-sm text-[#A0ACAB]">{val.unit || ''}</span>
                      </div>
                      {/* Range bar */}
                      <div className="relative h-1 bg-[#282D33] rounded-full overflow-hidden mb-2">
                        <div
                          className={`absolute left-0 top-0 h-full rounded-full ${barColor}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-[#A0ACAB]">
                          REF: {val.standard_low ?? val.optimal_low ?? '--'} - {val.standard_high ?? val.optimal_high ?? '--'} {val.unit || ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            ))
          ) : (
            /* Filtered draw cards */
            filtered.length === 0 ? (
              <p className="text-sm text-[#A0ACAB] py-8 text-center">
                No lab draws with {activeTab} markers found.
              </p>
            ) : (
              <div className="space-y-4">
                {filtered.map((draw, index) => (
                  <motion.div
                    key={draw.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => navigate(`/app/labs/${draw.id}`)}
                      className="w-full text-left bg-[#15181C] rounded-[10px] border border-[rgba(63,73,72,0.2)] p-8 transition-transform active:scale-[0.98]"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-3.5 h-3.5 text-[#A0ACAB]" />
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
                              {new Date(draw.draw_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <h3 className="font-['Newsreader',serif] text-xl text-[#E2E2E6] mt-2">
                            {draw.lab_name || 'Lab Results'}
                          </h3>
                          <p className="text-sm text-[#A0ACAB] mt-1">
                            {draw.markerCount} markers analyzed
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {draw.criticalCount > 0 && (
                          <span className="text-[10px] uppercase tracking-[0.15em] font-bold px-3 py-1.5 rounded-[24px] bg-[#CF6679]/20 text-[#CF6679]">
                            {draw.criticalCount} critical
                          </span>
                        )}
                        {draw.monitorCount > 0 && (
                          <span className="text-[10px] uppercase tracking-[0.15em] font-bold px-3 py-1.5 rounded-[24px] bg-[#C9A84C]/20 text-[#C9A84C]">
                            {draw.monitorCount} monitor
                          </span>
                        )}
                        {draw.optimalCount > 0 && (
                          <span className="text-[10px] uppercase tracking-[0.15em] font-bold px-3 py-1.5 rounded-[24px] bg-[#1F403D]/20 text-[#6DB8AF]">
                            {draw.optimalCount} optimal
                          </span>
                        )}
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            )
          )}
        </div>
      )}

      {/* Smart Clinical Analysis Card - always shown */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#15181C] rounded-[10px] border border-[rgba(63,73,72,0.2)] p-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <Sparkles className="w-5 h-5 text-[#C9A84C]" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
            ENGINEERED INTERPRETATION
          </span>
        </div>
        <h2 className="font-['Newsreader',serif] text-2xl text-[#E2E2E6] mt-3">
          Smart Clinical Analysis
        </h2>
        <p className="text-sm text-[#A0ACAB] mt-4 leading-relaxed">
          Our analysis engine evaluates your biomarkers against{' '}
          <span className="text-[#1F403D] font-bold">optimal functional ranges</span> rather than
          standard laboratory reference intervals. This approach identifies{' '}
          <span className="text-[#1F403D] font-bold">subclinical patterns</span> that conventional
          screening may overlook.
        </p>
        <p className="text-sm text-[#A0ACAB]/70 mt-3 italic leading-relaxed">
          "The absence of disease is not the presence of health. Optimal ranges reflect where your
          physiology thrives, not merely survives."
        </p>

        {/* Recommended Protocol */}
        <div className="mt-6 pt-5 border-t border-[#2C3433]">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
            RECOMMENDED PROTOCOL
          </span>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#1F403D]" />
              <span className="text-sm text-[#E2E2E6]">Vitamin D3 <span className="text-[#A0ACAB]">5,000 IU daily</span></span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#1F403D]" />
              <span className="text-sm text-[#E2E2E6]">Magnesium Glycinate <span className="text-[#A0ACAB]">400mg nightly</span></span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#1F403D]" />
              <span className="text-sm text-[#E2E2E6]">Omega-3 (EPA/DHA) <span className="text-[#A0ACAB]">2g daily with food</span></span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analytical Framework */}
      <div className="space-y-4">
        <div className="border-t border-[#2C3433] pt-8">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
            ANALYTICAL FRAMEWORK
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#15181C] rounded-[10px] border border-[rgba(63,73,72,0.2)] p-8"
        >
          <div className="w-12 h-12 rounded-[10px] bg-[#1E2226] flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5 text-[#C9A84C]" />
          </div>
          <h3 className="font-['Newsreader',serif] text-xl text-[#E2E2E6] mb-2">
            Nutrient Density
          </h3>
          <p className="text-sm text-[#A0ACAB] leading-relaxed">
            Tracking vitamins and minerals against optimal levels to identify subclinical deficiencies before they become symptomatic.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#15181C] rounded-[10px] border border-[rgba(63,73,72,0.2)] p-8"
        >
          <div className="w-12 h-12 rounded-[10px] bg-[#1E2226] flex items-center justify-center mb-4">
            <Activity className="w-5 h-5 text-[#C9A84C]" />
          </div>
          <h3 className="font-['Newsreader',serif] text-xl text-[#E2E2E6] mb-2">
            Hormone Balance
          </h3>
          <p className="text-sm text-[#A0ACAB] leading-relaxed">
            Mapping metabolic and stress hormones to reveal imbalances driving fatigue, weight gain, and mood disruption.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[#15181C] rounded-[10px] border border-[rgba(63,73,72,0.2)] p-8"
        >
          <div className="w-12 h-12 rounded-[10px] bg-[#1E2226] flex items-center justify-center mb-4">
            <Heart className="w-5 h-5 text-[#C9A84C]" />
          </div>
          <h3 className="font-['Newsreader',serif] text-xl text-[#E2E2E6] mb-2">
            Cardiovascular Risk
          </h3>
          <p className="text-sm text-[#A0ACAB] leading-relaxed">
            Advanced particle testing beyond standard cholesterol to reveal true atherosclerotic risk and metabolic syndrome markers.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
