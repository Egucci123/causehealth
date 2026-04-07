import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Sparkles, Upload, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { LabDraw, LabValue } from '@/types/lab.types';

interface DrawWithValues extends LabDraw {
  values: LabValue[];
}

function getStatusBadge(flag: string | null) {
  if (flag === 'optimal') return { text: 'Optimal', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', color: 'text-emerald-300' };
  if (flag === 'deficient' || flag === 'elevated') return { text: 'Deficiency', bg: 'bg-[#CF6679]/10', border: 'border-[#CF6679]/20', color: 'text-[#CF6679]' };
  if (flag === 'suboptimal_low' || flag === 'suboptimal_high') return { text: 'Sub-Optimal', bg: 'bg-[#C9A84C]/10', border: 'border-[#C9A84C]/20', color: 'text-[#C9A84C]' };
  return { text: 'Normal', bg: 'bg-[#A0ACAB]/10', border: 'border-[#A0ACAB]/20', color: 'text-[#A0ACAB]' };
}

function getBarColor(flag: string | null) {
  if (flag === 'optimal') return '#1F403D';
  if (flag === 'deficient' || flag === 'elevated') return '#CF6679';
  if (flag === 'suboptimal_low' || flag === 'suboptimal_high') return '#C9A84C';
  return '#A0ACAB';
}

function getBarPercent(value: number, low: number | null, high: number | null): number {
  const min = low ?? 0;
  const max = high ?? (value * 2);
  if (max <= min) return 50;
  return Math.min(100, Math.max(5, ((value - min) / (max - min)) * 100));
}

export default function LabsHome() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [draws, setDraws] = useState<DrawWithValues[]>([]);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  async function loadData() {
    setLoading(true);
    const { data: drawData } = await supabase.from('lab_draws').select('*').eq('user_id', user!.id).order('draw_date', { ascending: false });
    if (drawData && drawData.length > 0) {
      const withValues: DrawWithValues[] = [];
      for (const draw of drawData) {
        const { data: vals } = await supabase.from('lab_values').select('*').eq('draw_id', draw.id);
        withValues.push({ ...draw, values: (vals || []) as LabValue[] });
      }
      setDraws(withValues);
    }
    setLoading(false);
  }

  const latestDraw = draws[0];
  const hasLabs = draws.length > 0;

  // Group values by category
  const categories = latestDraw
    ? Object.entries(
        latestDraw.values.reduce<Record<string, LabValue[]>>((acc, v) => {
          const cat = v.marker_category || 'Other';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(v);
          return acc;
        }, {})
      )
    : [];

  return (
    <div className="space-y-12">
      {/* Header — from stitch27 */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[#1F403D] text-[10px] font-bold uppercase tracking-[0.25em] mb-2 block">Diagnostic Overview</span>
          <h2 className="font-['Newsreader',serif] text-5xl text-[#E2E2E6] tracking-tight leading-tight">Your Lab Results</h2>
        </div>
        <Link
          to="/app/labs/upload"
          className="bg-[#1F403D] text-white px-7 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:brightness-110 transition-all active:scale-95 shadow-xl border border-white/5"
        >
          <Plus className="w-4 h-4" />
          <span className="text-xs uppercase tracking-widest">+ Add Labs</span>
        </Link>
      </section>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#1E2226] rounded-xl p-6 border border-[rgba(63,73,72,0.2)] animate-pulse h-32" />
          ))}
        </div>
      ) : !hasLabs ? (
        <>
          {/* Empty State */}
          <section className="text-center py-16">
            <div className="w-20 h-20 bg-[#1E2226] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#2C3433]/30">
              <Upload className="w-8 h-8 text-[#A0ACAB]" strokeWidth={1.5} />
            </div>
            <h3 className="font-['Newsreader',serif] text-2xl text-[#E2E2E6] mb-4">No lab results yet</h3>
            <p className="text-[#A0ACAB] text-sm max-w-sm mx-auto leading-relaxed mb-6">
              Begin your clinical journey by uploading your latest blood panel. Our AI will synthesize the data into your personalized dossier.
            </p>
            <Link to="/app/labs/upload" className="text-[#E2E2E6] font-bold underline underline-offset-4 decoration-[#1F403D]">
              Upload Your First Lab Report
            </Link>
          </section>

          {/* Smart Analysis Card — always shown */}
          <section className="bg-[#1E2226] border border-[#3F4948] rounded-xl p-10 relative overflow-hidden shadow-2xl">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#1F403D]/10 blur-[100px] rounded-full" />
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 rounded-lg bg-[#1F403D]/20 flex items-center justify-center border border-[#1F403D]/30">
                <Sparkles className="w-7 h-7 text-[#1F403D]" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-['Newsreader',serif] text-3xl text-[#E2E2E6]">Smart Clinical Analysis</h4>
                <p className="text-[10px] text-[#A0ACAB] uppercase tracking-[0.3em] font-bold">Engineered Interpretation</p>
              </div>
            </div>
            <p className="text-[#E2E2E6]/90 leading-relaxed text-sm font-light">
              Upload your labs to receive AI-powered analysis comparing your biomarkers against <span className="text-[#1F403D] font-bold">optimal ranges</span>, not just standard reference ranges. We identify patterns your doctor may miss in a 12-minute appointment.
            </p>
          </section>
        </>
      ) : (
        <>
          {/* Biomarker Grid — from stitch27 */}
          {categories.map(([category, values]) => (
            <div key={category}>
              <div className="flex items-center justify-between border-b border-[#3F4948] pb-2 mb-6">
                <h3 className="font-['Newsreader',serif] text-xl text-[#E2E2E6]">{category}</h3>
                <span className="text-[10px] text-[#A0ACAB] tracking-widest uppercase">Bio-Markers</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.map((val) => {
                  const badge = getStatusBadge(val.optimal_flag);
                  const barColor = getBarColor(val.optimal_flag);
                  const pct = getBarPercent(val.value, val.standard_low, val.standard_high);
                  const isCritical = val.optimal_flag === 'deficient' || val.optimal_flag === 'elevated';
                  const isSuboptimal = val.optimal_flag === 'suboptimal_low' || val.optimal_flag === 'suboptimal_high';

                  return (
                    <div
                      key={val.id}
                      className="bg-[#1E2226] p-6 rounded-xl border border-[rgba(63,73,72,0.2)] shadow-[0_4px_20px_rgba(0,0,0,0.3)] relative overflow-hidden"
                    >
                      {(isCritical || isSuboptimal) && (
                        <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: barColor, opacity: 0.6 }} />
                      )}
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] text-[#A0ACAB] uppercase tracking-wider">{val.marker_name}</span>
                        <span className={`${badge.bg} ${badge.color} text-[9px] px-2.5 py-1 rounded-sm font-bold uppercase tracking-tighter border ${badge.border}`}>
                          {badge.text}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-4xl font-['Newsreader',serif] leading-none ${isCritical ? 'text-[#CF6679]' : isSuboptimal ? 'text-[#C9A84C]' : 'text-[#E2E2E6]'}`}>
                          {val.value}
                        </span>
                        <span className="text-[11px] text-[#A0ACAB] font-medium">{val.unit}</span>
                      </div>
                      <div className="mt-5 h-1.5 w-full bg-[#1A1D1F] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                      </div>
                      <div className="mt-3 flex justify-between text-[9px] text-[#A0ACAB] uppercase tracking-widest">
                        <span>Ref: {val.standard_low ?? '—'} — {val.standard_high ?? '—'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Smart Analysis Card */}
          <section className="bg-[#1E2226] border border-[#3F4948] rounded-xl p-10 relative overflow-hidden shadow-2xl">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#1F403D]/10 blur-[100px] rounded-full" />
            <div className="flex items-center gap-5 mb-8">
              <div className="w-14 h-14 rounded-lg bg-[#1F403D]/20 flex items-center justify-center border border-[#1F403D]/30">
                <Sparkles className="w-7 h-7 text-[#1F403D]" strokeWidth={1.5} />
              </div>
              <div>
                <h4 className="font-['Newsreader',serif] text-3xl text-[#E2E2E6]">Smart Clinical Analysis</h4>
                <p className="text-[10px] text-[#A0ACAB] uppercase tracking-[0.3em] font-bold">Engineered Interpretation</p>
              </div>
            </div>
            <p className="text-[#E2E2E6]/90 leading-relaxed text-sm font-light">
              {latestDraw.values.filter(v => v.optimal_flag !== 'optimal').length > 0
                ? `${latestDraw.values.filter(v => v.optimal_flag !== 'optimal').length} markers require attention. While technically within standard lab ranges, these are critically low for peak physiological performance.`
                : 'All markers are within optimal ranges. Continue current protocol.'}
            </p>
            <div className="mt-8 bg-[#282D33]/50 p-8 rounded-xl border border-[#3F4948]">
              <h5 className="text-[11px] font-bold text-[#1F403D] uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1F403D]" />
                Recommended Protocol
              </h5>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <Check className="w-5 h-5 text-[#1F403D] shrink-0" strokeWidth={1.5} />
                  <div className="text-sm">
                    <span className="text-[#E2E2E6] font-bold block mb-1">Upload additional panels</span>
                    <span className="text-[#A0ACAB] text-xs leading-relaxed">More data enables more accurate pattern recognition across biomarkers.</span>
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
