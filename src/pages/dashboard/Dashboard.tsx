import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, ArrowRight, Activity, Stethoscope, Shield, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { STANDARD_DISCLAIMER } from '@/lib/safety';
import { MEDICATION_DEPLETIONS } from '@/data/medicationDepletions';
import type { LabDraw, LabValue } from '@/types/lab.types';
import type { Medication, Symptom } from '@/types/user.types';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning,';
  if (h < 17) return 'Good afternoon,';
  return 'Good evening,';
}

function getMedDepletions(meds: Medication[]) {
  const depletions: { med: string; nutrients: string[] }[] = [];
  for (const med of meds) {
    const key = med.name.toLowerCase().trim();
    const info = MEDICATION_DEPLETIONS[key];
    if (info && info.depletes.length > 0) {
      depletions.push({ med: med.name, nutrients: info.depletes.map(d => d.nutrient) });
    }
  }
  return depletions;
}

export default function Dashboard() {
  const { profile, user } = useAuth();
  const [latestDraw, setLatestDraw] = useState<LabDraw | null>(null);
  const [labValues, setLabValues] = useState<LabValue[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [, setSymptoms] = useState<Symptom[]>([]);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  async function loadData() {
    const [drawsRes, medsRes, sympRes] = await Promise.all([
      supabase.from('lab_draws').select('*').eq('user_id', user!.id).order('draw_date', { ascending: false }).limit(1),
      supabase.from('medications').select('*').eq('user_id', user!.id).eq('is_active', true),
      supabase.from('symptoms').select('*').eq('user_id', user!.id),
    ]);
    if (drawsRes.data?.[0]) {
      setLatestDraw(drawsRes.data[0]);
      const valuesRes = await supabase.from('lab_values').select('*').eq('draw_id', drawsRes.data[0].id);
      if (valuesRes.data) setLabValues(valuesRes.data);
    }
    if (medsRes.data) setMedications(medsRes.data as Medication[]);
    if (sympRes.data) setSymptoms(sympRes.data as Symptom[]);
  }

  const healthScore = labValues.length > 0
    ? Math.round(labValues.reduce((sum, v) => {
        if (v.optimal_flag === 'optimal') return sum + 100;
        if (v.optimal_flag === 'suboptimal_low' || v.optimal_flag === 'suboptimal_high') return sum + 60;
        if (v.optimal_flag === 'deficient' || v.optimal_flag === 'elevated') return sum + 20;
        return sum + 50;
      }, 0) / labValues.length)
    : null;

  const optimalCount = labValues.filter(v => v.optimal_flag === 'optimal').length;
  const criticalCount = labValues.filter(v => v.optimal_flag === 'deficient' || v.optimal_flag === 'elevated').length;
  const depletions = getMedDepletions(medications);
  const firstName = profile?.first_name || 'there';

  const scoreDescription = healthScore !== null
    ? `Based on ${labValues.length} markers from your most recent lab panel.`
    : 'Upload your lab results to calculate your personalized health score.';

  // Insight card content
  let insightLabel = 'Get Started';
  let insightHeadline = 'Upload labs to unlock insights.';
  let insightDesc = 'We analyze your biomarkers against optimal ranges, detect medication depletions, and map root causes.';
  let insightLink = '/app/labs/upload';
  let insightLinkText = 'Upload your first panel';

  if (depletions.length > 0) {
    insightLabel = 'Depletion Alert';
    insightHeadline = `${depletions[0].med} may deplete key nutrients.`;
    insightDesc = `${depletions[0].nutrients.slice(0, 3).join(', ')} could be affected.${depletions.length > 1 ? ` Plus ${depletions.length - 1} more medication${depletions.length - 1 > 1 ? 's' : ''}.` : ''}`;
    insightLink = '/app/medications';
    insightLinkText = 'View medication details';
  } else if (labValues.length > 0) {
    insightLabel = 'Lab Insight';
    insightHeadline = 'Patterns detected across your markers.';
    insightDesc = `${optimalCount} of ${labValues.length} markers are in the optimal range. Review your full panel for detailed root-cause analysis.`;
    insightLink = `/app/labs/${latestDraw?.id}`;
    insightLinkText = 'View full lab panel';
  }

  return (
    <div className="space-y-12">

      {/* -- 1. GREETING -- */}
      <section className="space-y-1">
        <h2 className="text-4xl font-['Fraunces',serif] tracking-tight text-[#01261F]">
          {getGreeting()}
        </h2>
        <p className="text-lg text-[#414846]">Your health overview is ready.</p>
      </section>

      {/* -- 2. BENTO GRID -- */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Health Score Card */}
        <div className="md:col-span-7 bg-white rounded-[32px] p-8 shadow-[0_8px_32px_-4px_rgba(27,28,26,0.06)] flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#414846] mb-6">HEALTH SCORE</h3>
            <div className="flex items-end gap-2">
              <span className="text-7xl font-['Fraunces',serif] italic text-[#01261F]">
                {healthScore ?? '--'}
              </span>
              <span className="text-xl font-['Fraunces',serif] text-[#BDAC52] pb-2">/100</span>
            </div>
            <p className="text-sm text-[#414846] mt-4 max-w-[200px]">{scoreDescription}</p>
          </div>

          {/* Decorative gauge */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 opacity-[0.07] group-hover:opacity-[0.15] transition-opacity duration-700">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#1A3C34" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="30" />
            </svg>
          </div>

          {/* Sub stats */}
          <div className="mt-8 pt-6 border-t border-[#C1C8C4]/10 flex gap-4">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-[#414846]">Optimal Markers</span>
              <span className="font-bold text-[#01261F]">{labValues.length > 0 ? optimalCount : '--'}</span>
            </div>
            <div className="w-px h-8 bg-[#C1C8C4]/20"></div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-[#414846]">Critical</span>
              <span className={`font-bold ${criticalCount > 0 ? 'text-[#BA1A1A]' : 'text-[#01261F]'}`}>
                {labValues.length > 0 ? criticalCount : '--'}
              </span>
            </div>
          </div>
        </div>

        {/* Insight Card (dark) */}
        <div className="md:col-span-5 bg-[#1A3C34] text-white rounded-[32px] p-8 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#83A69C] mb-2">{insightLabel}</h3>
            <div className="text-4xl font-['Fraunces',serif] italic">{insightHeadline}</div>
            <p className="text-[#83A69C] text-sm mt-2">{insightDesc}</p>
          </div>

          {healthScore !== null && healthScore >= 70 && (
            <div className="mt-6 flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-4">
              <span className="text-xs font-medium">Top {Math.max(5, 100 - healthScore)}% of your demographic</span>
            </div>
          )}

          <Link
            to={insightLink}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold relative z-10"
          >
            {insightLinkText} <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Gradient overlay */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#01261F] via-transparent to-transparent opacity-50"></div>
        </div>
      </section>

      {/* -- 3. YOUR TOOLKIT -- */}
      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <h2 className="text-3xl font-['Fraunces',serif] tracking-tight text-[#01261F]">Your Toolkit</h2>
          <button className="text-sm font-bold text-[#01261F] border-b border-[#6C5E06]/40 pb-0.5 tracking-tight">
            Manage
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { to: '/app/wellness', icon: Activity, label: 'Wellness Plan', desc: 'AI-generated protocol' },
            { to: '/app/doctor-prep', icon: Stethoscope, label: 'Doctor Prep', desc: 'ICD-10 documents' },
            { to: '/app/symptoms', icon: TrendingUp, label: 'Symptoms', desc: 'Root cause mapper' },
            { to: '/app/insurance', icon: Shield, label: 'Insurance', desc: 'Coverage guide' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="bg-[#F4F4F0] p-6 rounded-[24px] hover:scale-[1.02] transition-transform duration-300 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-shadow">
                <item.icon className="w-5 h-5 text-[#01261F]" strokeWidth={1.5} />
              </div>
              <h4 className="font-bold text-sm text-[#01261F] mb-1">{item.label}</h4>
              <p className="text-[11px] text-[#414846] leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* -- 4. ACTIVE PROTOCOL -- */}
      <section className="pb-12">
        <div className="bg-[#E9E8E4] rounded-[40px] p-1 overflow-hidden">
          <div className="bg-white rounded-[38px] p-10 space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-[#6C5E06]/10 text-[#6C5E06] text-[10px] font-bold uppercase tracking-widest">
              Active Protocol
            </div>
            <h2 className="text-4xl font-['Fraunces',serif] text-[#01261F]">Your Wellness Plan</h2>
            <p className="text-[#414846] leading-relaxed italic">
              {labValues.length > 0
                ? criticalCount > 0
                  ? `Focus on the ${criticalCount} marker${criticalCount > 1 ? 's' : ''} that need attention. Your plan includes targeted supplement and lifestyle recommendations.`
                  : `All ${optimalCount} optimal markers are holding steady. Your plan focuses on maintaining these levels and optimizing the rest.`
                : 'Generate your first wellness plan. Upload labs and we will create a personalized protocol based on your biomarkers.'}
            </p>
            <Link
              to={labValues.length > 0 ? '/app/wellness' : '/app/labs/upload'}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#01261F]"
            >
              {labValues.length > 0 ? 'View your plan' : 'Get started'} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* -- 5. UPLOAD CTA (if no labs) -- */}
      {labValues.length === 0 && (
        <section>
          <Link
            to="/app/labs/upload"
            className="block bg-[#1A3C34] text-white rounded-[32px] p-8 text-center"
          >
            <Upload className="w-8 h-8 mx-auto mb-3 opacity-60" />
            <h3 className="font-['Fraunces',serif] text-xl mb-2">Upload Your Labs</h3>
            <p className="text-sm text-[#83A69C]">Get your personalized health score and biomarker insights.</p>
          </Link>
        </section>
      )}

      {/* -- DISCLAIMER -- */}
      <p className="text-[10px] text-[#414846]/40 text-center leading-relaxed pb-4">
        {STANDARD_DISCLAIMER}
      </p>
    </div>
  );
}
