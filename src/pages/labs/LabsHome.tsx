import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, TestTube2, Calendar, Sparkles, Activity, Heart, Check } from 'lucide-react';
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

interface DrawWithSummary extends LabDraw {
  markerCount: number;
  criticalCount: number;
  monitorCount: number;
  optimalCount: number;
  categories: string[];
}

export default function LabsHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setDraws, setValues } = useLabStore();
  const [loading, setLoading] = useState(true);
  const [drawSummaries, setDrawSummaries] = useState<DrawWithSummary[]>([]);
  const [activeTab, setActiveTab] = useState('all');

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F5] px-6 pt-8 pb-32 font-['Manrope',sans-serif]">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-[#EFEEEA] rounded-2xl w-2/3" />
          <div className="h-5 bg-[#EFEEEA] rounded-xl w-full" />
          <div className="h-14 bg-[#EFEEEA] rounded-xl w-full" />
          <div className="h-64 bg-[#EFEEEA] rounded-[32px]" />
          <div className="h-48 bg-[#EFEEEA] rounded-[32px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] px-6 pt-8 pb-32 font-['Manrope',sans-serif] space-y-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-['Fraunces',serif] italic text-4xl text-[#01261F]">
          Lab Results
        </h1>
        <p className="text-sm text-[#414846] mt-3 leading-relaxed max-w-sm">
          Track and analyze your lab work through our AI analysis engine. Optimal ranges, not just standard.
        </p>
        <button
          onClick={() => navigate('/app/labs/upload')}
          className="w-full mt-6 bg-[#1A3C34] text-white rounded-xl py-4 uppercase tracking-[0.15em] font-bold text-sm flex items-center justify-center gap-2"
        >
          <Upload className="w-4 h-4" />
          UPLOAD LABS
        </button>
      </motion.div>

      {drawSummaries.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-[32px] p-8 shadow-[0_8px_32px_-4px_rgba(27,28,26,0.06)] text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#E9E8E4] flex items-center justify-center">
              <TestTube2 className="w-7 h-7 text-[#414846]" />
            </div>
          </div>
          <h2 className="font-['Fraunces',serif] italic text-2xl text-[#01261F]">
            No lab results yet
          </h2>
          <p className="text-sm text-[#414846] mt-3 leading-relaxed max-w-[300px] mx-auto">
            Upload your first lab report to get started. Our AI will analyze your results using optimal ranges and identify patterns your doctor may have missed.
          </p>
          <button
            onClick={() => navigate('/app/labs/upload')}
            className="mt-5 text-sm font-bold text-[#01261F] underline underline-offset-4 decoration-[#01261F]/30"
          >
            Upload Your First Lab Report
          </button>
        </motion.div>
      ) : (
        /* Lab Draws Timeline */
        <div className="space-y-4">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[0.15em] transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#1A3C34] text-white'
                    : 'bg-[#F4F4F0] text-[#414846]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-sm text-[#414846] py-8 text-center">
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
                    className="w-full text-left bg-white rounded-[32px] shadow-[0_8px_32px_-4px_rgba(27,28,26,0.06)] p-8 transition-transform active:scale-[0.98]"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-3.5 h-3.5 text-[#414846]" />
                          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414846]">
                            {new Date(draw.draw_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                        <h3 className="font-['Fraunces',serif] italic text-xl text-[#01261F] mt-2">
                          {draw.lab_name || 'Lab Results'}
                        </h3>
                        <p className="text-sm text-[#414846] mt-1">
                          {draw.markerCount} markers analyzed
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {draw.criticalCount > 0 && (
                        <span className="text-[10px] uppercase tracking-[0.15em] font-bold px-3 py-1.5 rounded-full bg-[#FFDAD6] text-[#BA1A1A]">
                          {draw.criticalCount} critical
                        </span>
                      )}
                      {draw.monitorCount > 0 && (
                        <span className="text-[10px] uppercase tracking-[0.15em] font-bold px-3 py-1.5 rounded-full bg-[#FFF3E0] text-[#955D00]">
                          {draw.monitorCount} monitor
                        </span>
                      )}
                      {draw.optimalCount > 0 && (
                        <span className="text-[10px] uppercase tracking-[0.15em] font-bold px-3 py-1.5 rounded-full bg-[#D4EDDA] text-[#1A3C34]">
                          {draw.optimalCount} optimal
                        </span>
                      )}
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Methodology Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#1A3C34] rounded-[32px] p-8 text-white"
      >
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#83A69C]">
          THE METHODOLOGY
        </span>
        <h2 className="font-['Fraunces',serif] italic text-2xl text-white mt-3">
          Why we measure optimal ranges
        </h2>
        <p className="text-sm text-[#83A69C] mt-3 leading-relaxed">
          Standard lab ranges are based on population averages that include sick individuals. Our optimal ranges are derived from peer-reviewed research targeting the levels where your body functions at its best, not just within the bounds of disease absence.
        </p>

        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#83A69C]/20 flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-[#83A69C]" />
            </div>
            <span className="text-sm text-white font-medium">Optimal Range Analysis</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#83A69C]/20 flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-[#83A69C]" />
            </div>
            <span className="text-sm text-white font-medium">Pattern Recognition</span>
          </div>
        </div>
      </motion.div>

      {/* Analytical Framework */}
      <div className="space-y-4">
        <div className="border-t border-[#C1C8C4]/20 pt-8">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#414846]">
            ANALYTICAL FRAMEWORK
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#F4F4F0] rounded-[32px] p-8"
        >
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5 text-[#01261F]" />
          </div>
          <h3 className="font-['Fraunces',serif] text-xl text-[#01261F] mb-2">
            Nutrient Density
          </h3>
          <p className="text-sm text-[#414846] leading-relaxed">
            Tracking vitamins and minerals against optimal levels to identify subclinical deficiencies before they become symptomatic.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#F4F4F0] rounded-[32px] p-8"
        >
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4">
            <Activity className="w-5 h-5 text-[#01261F]" />
          </div>
          <h3 className="font-['Fraunces',serif] text-xl text-[#01261F] mb-2">
            Hormone Balance
          </h3>
          <p className="text-sm text-[#414846] leading-relaxed">
            Mapping metabolic and stress hormones to reveal imbalances driving fatigue, weight gain, and mood disruption.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[#F4F4F0] rounded-[32px] p-8"
        >
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4">
            <Heart className="w-5 h-5 text-[#01261F]" />
          </div>
          <h3 className="font-['Fraunces',serif] text-xl text-[#01261F] mb-2">
            Cardiovascular Risk
          </h3>
          <p className="text-sm text-[#414846] leading-relaxed">
            Advanced particle testing beyond standard cholesterol to reveal true atherosclerotic risk and metabolic syndrome markers.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
