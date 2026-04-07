import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, FileText, BarChart3, Utensils, Sparkles, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { STANDARD_DISCLAIMER } from '@/lib/safety';
import { MEDICATION_DEPLETIONS } from '@/data/medicationDepletions';
import type { LabValue } from '@/types/lab.types';
import type { Medication } from '@/types/user.types';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [labValues, setLabValues] = useState<LabValue[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  async function loadData() {
    const [drawsRes, medsRes] = await Promise.all([
      supabase.from('lab_draws').select('*').eq('user_id', user!.id).order('draw_date', { ascending: false }).limit(1),
      supabase.from('medications').select('*').eq('user_id', user!.id).eq('is_active', true),
    ]);
    if (drawsRes.data?.[0]) {
      const valuesRes = await supabase.from('lab_values').select('*').eq('draw_id', drawsRes.data[0].id);
      if (valuesRes.data) setLabValues(valuesRes.data);
    }
    if (medsRes.data) setMedications(medsRes.data as Medication[]);
  }

  const healthScore = labValues.length > 0
    ? Math.round(labValues.reduce((sum, v) => {
        if (v.optimal_flag === 'optimal') return sum + 100;
        if (v.optimal_flag === 'suboptimal_low' || v.optimal_flag === 'suboptimal_high') return sum + 60;
        return sum + 20;
      }, 0) / labValues.length)
    : null;

  const scorePercent = healthScore ?? 0;
  const firstName = profile?.first_name || 'there';

  // Find first medication depletion for alert
  const firstDepletion = medications.find(m => {
    const info = MEDICATION_DEPLETIONS[m.name.toLowerCase().trim()];
    return info && info.depletes.length > 0;
  });
  const depletionInfo = firstDepletion ? MEDICATION_DEPLETIONS[firstDepletion.name.toLowerCase().trim()] : null;

  return (
    <div className="space-y-10">
      {/* Welcome Section & AI Status — exact from stitch29 */}
      <section className="space-y-4">
        <div>
          <span className="text-xs text-[#A0ACAB] tracking-[0.2em] uppercase font-bold">Status Briefing</span>
          <h2 className="font-['Newsreader',serif] text-4xl italic leading-tight text-[#E2E2E6] mt-1">
            {getGreeting()}, {firstName}
          </h2>
        </div>
        {/* AI Alert Card */}
        <div className="bg-[#15181C] p-5 rounded-xl border-l-2 border-[#1F403D] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Sparkles className="w-12 h-12" />
          </div>
          <p className="text-sm text-[#A0ACAB] flex items-start gap-3">
            <Zap className="w-5 h-5 text-[#1F403D] shrink-0 mt-0.5" strokeWidth={1.5} />
            <span>
              {firstDepletion && depletionInfo
                ? <>Your <span className="text-[#1F403D] font-bold">{depletionInfo.depletes[0]?.nutrient} levels</span> suggest supplementation is required due to {firstDepletion.name} usage.</>
                : labValues.length > 0
                  ? <>Your <span className="text-[#1F403D] font-bold">lab results</span> have been analyzed. {labValues.filter(v => v.optimal_flag === 'optimal').length} markers are in optimal range.</>
                  : <>Upload your <span className="text-[#1F403D] font-bold">lab results</span> to unlock personalized health intelligence and biomarker tracking.</>
              }
            </span>
          </p>
        </div>
      </section>

      {/* CauseScore™ Bento Card — exact from stitch29 */}
      <section className="bg-[#1E2226] rounded-xl p-8 border border-[rgba(63,73,72,0.2)] relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-[#1F403D] to-transparent opacity-20 group-hover:opacity-40 transition-opacity" />
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Circular Gauge */}
          <div className="relative flex items-center justify-center">
            <div
              className="w-44 h-44 rounded-full flex items-center justify-center"
              style={{
                background: `radial-gradient(closest-side, #15181C 85%, transparent 86% 100%), conic-gradient(#1F403D ${scorePercent}%, #1E2226 0)`
              }}
            >
              <div className="text-center">
                <div className="font-['Newsreader',serif] text-5xl text-[#1F403D]">{healthScore ?? '--'}</div>
                <div className="text-[10px] tracking-widest text-[#A0ACAB] uppercase mt-1 font-bold">CauseScore™</div>
              </div>
            </div>
            <div className="absolute inset-0 bg-[#1F403D]/5 blur-[60px] rounded-full -z-10" />
          </div>
          {/* Sub-scores */}
          <div className="flex-1 w-full space-y-6">
            {[
              { label: 'Nutrient Status', value: 'Optimal', color: '#1F403D', pct: labValues.length > 0 ? 92 : 0 },
              { label: 'Medication Risk', value: medications.length > 0 ? 'Moderate' : 'None', color: '#C9A84C', pct: medications.length > 0 ? 45 : 0 },
              { label: 'Inflammation Risk', value: 'Low', color: '#A0ACAB', pct: 15 },
            ].map((bar) => (
              <div key={bar.label} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] text-[#A0ACAB] uppercase tracking-widest font-bold">{bar.label}</span>
                  <span className="text-xs font-bold" style={{ color: bar.color }}>{bar.value}</span>
                </div>
                <div className="h-[3px] w-full bg-[#0A0C0F] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${bar.pct}%`, backgroundColor: bar.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions Grid — exact from stitch29 */}
      <section>
        <h3 className="text-[10px] text-[#A0ACAB] tracking-[0.25em] uppercase mb-6 px-1 font-bold">Clinical Protocol</h3>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/app/doctor-prep" className="bg-[#15181C] p-5 rounded-xl border border-[#2C3433]/20 hover:bg-[#1E2226] transition-colors cursor-pointer group">
            <FileText className="w-6 h-6 text-[#1F403D] mb-3" strokeWidth={1.5} />
            <span className="text-sm text-[#E2E2E6] font-bold block">Doctor Visit Slip</span>
            <span className="text-[10px] text-[#A0ACAB] uppercase mt-1 block tracking-wider">Generate Report</span>
          </Link>
          <Link to="/app/medications" className="bg-[#15181C] p-5 rounded-xl border border-[#2C3433]/20 hover:bg-[#1E2226] transition-colors cursor-pointer group">
            <BarChart3 className="w-6 h-6 text-[#C9A84C] mb-3" strokeWidth={1.5} />
            <span className="text-sm text-[#E2E2E6] font-bold block">Depletion Report</span>
            <span className="text-[10px] text-[#A0ACAB] uppercase mt-1 block tracking-wider">Vial Analysis</span>
          </Link>
          <Link to="/app/wellness" className="bg-[#15181C] p-5 rounded-xl border border-[#2C3433]/20 hover:bg-[#1E2226] transition-colors cursor-pointer group">
            <Utensils className="w-6 h-6 text-[#A0ACAB] mb-3" strokeWidth={1.5} />
            <span className="text-sm text-[#E2E2E6] font-bold block">Wellness Plan</span>
            <span className="text-[10px] text-[#A0ACAB] uppercase mt-1 block tracking-wider">Protocol Guidance</span>
          </Link>
          <Link to="/app/symptoms" className="bg-[#1F403D]/10 p-5 rounded-xl border border-[#1F403D]/20 hover:bg-[#1F403D]/15 transition-colors cursor-pointer group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-12 h-12 bg-[#1F403D]/20 blur-xl" />
            <Sparkles className="w-6 h-6 text-[#1F403D] mb-3" strokeWidth={1.5} />
            <span className="text-sm text-[#1F403D] font-bold block">Ask CauseHealth.</span>
            <span className="text-[10px] text-[#1F403D]/80 uppercase mt-1 block tracking-wider font-bold">AI Consultant</span>
          </Link>
        </div>
      </section>

      {/* Intelligence Feed — exact from stitch29 */}
      <section className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[10px] text-[#A0ACAB] tracking-[0.25em] uppercase font-bold">Intelligence Feed</h3>
          <span className="text-[10px] text-[#1F403D] uppercase cursor-pointer hover:underline font-bold tracking-widest">View All</span>
        </div>
        <div className="space-y-4">
          {firstDepletion && depletionInfo ? (
            <div className="bg-[#1E2226] p-4 rounded-xl border border-[#2C3433]/10 flex items-center gap-4">
              <div className="w-1 h-10 bg-[#C9A84C] rounded-full" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-[#E2E2E6]"><span className="text-[#C9A84C] font-bold">{firstDepletion.name} detected</span> — {depletionInfo.depletes[0]?.nutrient} depletion likely.</p>
                  <span className="text-[9px] text-[#A0ACAB] font-bold uppercase tracking-tighter shrink-0 ml-2">2H ago</span>
                </div>
                <p className="text-[11px] text-[#A0ACAB] mt-1">Recommended: {depletionInfo.depletes[0]?.recommended_supplement}</p>
              </div>
            </div>
          ) : null}

          {labValues.length > 0 ? (
            <div className="bg-[#1E2226] p-4 rounded-xl border border-[#2C3433]/10 flex items-center gap-4">
              <div className="w-1 h-10 bg-[#1F403D] rounded-full" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-[#E2E2E6]"><span className="text-[#1F403D] font-bold">Lab Results</span> — {labValues.filter(v => v.optimal_flag === 'optimal').length} markers optimal.</p>
                  <span className="text-[9px] text-[#A0ACAB] font-bold uppercase tracking-tighter shrink-0 ml-2">Recent</span>
                </div>
                <p className="text-[11px] text-[#A0ACAB] mt-1">View full biomarker analysis in Labs tab.</p>
              </div>
            </div>
          ) : null}

          {/* Upload prompt if no data */}
          {labValues.length === 0 && medications.length === 0 && (
            <Link to="/app/labs/upload" className="bg-[#1E2226] p-4 rounded-xl border border-[#2C3433]/10 flex items-center gap-4 opacity-60">
              <div className="w-1 h-10 bg-[#A0ACAB]/30 rounded-full" />
              <div className="flex-1">
                <p className="text-sm text-[#E2E2E6] font-medium">Upload labs to activate your Intelligence Feed.</p>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Upload CTA if no labs */}
      {labValues.length === 0 && (
        <section>
          <Link to="/app/labs/upload" className="block bg-[#1F403D]/10 border border-[#1F403D]/20 rounded-xl p-8 text-center hover:bg-[#1F403D]/15 transition-colors">
            <Upload className="w-8 h-8 text-[#1F403D] mx-auto mb-3 opacity-60" strokeWidth={1.5} />
            <h3 className="font-['Newsreader',serif] text-xl text-[#E2E2E6] mb-2">Upload Your Labs</h3>
            <p className="text-sm text-[#A0ACAB]">Get your personalized CauseScore™ and biomarker insights.</p>
          </Link>
        </section>
      )}

      {/* Disclaimer */}
      <p className="text-[9px] text-[#A0ACAB]/30 text-center leading-relaxed">{STANDARD_DISCLAIMER}</p>
    </div>
  );
}
