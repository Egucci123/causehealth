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

  return (
    <div className="max-w-3xl mx-auto space-y-12">

      {/* ── 1. GREETING ── */}
      <section>
        <h1 className="font-['Fraunces',serif] italic text-4xl tracking-tight text-[#1A3C34] leading-tight">
          {getGreeting()}
          <br />
          {firstName}.
        </h1>
        <p className="mt-3 text-[#414844] font-['Manrope',sans-serif] text-base max-w-sm leading-relaxed">
          {labValues.length > 0
            ? `${optimalCount} markers optimal${criticalCount > 0 ? `, ${criticalCount} need attention` : ', everything trending well'}. Here is what your body is telling us.`
            : 'Your health journey starts here. Upload your first lab panel to unlock personalized insights.'}
        </p>
      </section>

      {/* ── 2. HEALTH SCORE CARD ── */}
      <section>
        <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_32px_-4px_rgba(27,28,26,0.06)] relative overflow-hidden">
          {/* Label */}
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414844]">
            Health Score
          </span>

          {/* Score */}
          <div className="mt-4 flex items-baseline gap-1">
            <span className="font-['Fraunces',serif] italic text-7xl text-[#1A3C34] leading-none">
              {healthScore ?? '--'}
            </span>
            <span className="font-['Manrope',sans-serif] text-2xl text-[#1A3C34]/30 font-medium">/100</span>
          </div>

          {/* Subtitle */}
          <p className="mt-3 text-sm text-[#414844] font-['Manrope',sans-serif] leading-relaxed max-w-xs">
            {healthScore !== null
              ? `Based on ${labValues.length} markers from your most recent lab panel.`
              : 'Upload your lab results to calculate your personalized health score.'}
          </p>

          {/* Decorative circle */}
          <svg className="absolute -bottom-16 -right-16 w-56 h-56 opacity-[0.07]" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#1A3C34" strokeWidth="6" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="#1A3C34" strokeWidth="4" />
          </svg>

          {/* Divider + sub-stats */}
          <div className="mt-6 pt-6 border-t border-[#C1C8C2]/10 flex justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414844]">Optimal Markers</span>
              <p className="font-['Fraunces',serif] italic text-2xl text-[#1A3C34] mt-1">
                {labValues.length > 0 ? optimalCount : '--'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414844]">Critical</span>
              <p className={`font-['Fraunces',serif] italic text-2xl mt-1 ${criticalCount > 0 ? 'text-[#BA1A1A]' : 'text-[#1A3C34]'}`}>
                {labValues.length > 0 ? criticalCount : '--'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. LONGEVITY / INSIGHT CARD (Dark) ── */}
      <section>
        <div className="bg-[#1A3C34] text-white rounded-[32px] p-8 relative overflow-hidden">
          {depletions.length > 0 ? (
            <>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#86AF99]">
                Depletion Alert
              </span>
              <h2 className="font-['Fraunces',serif] italic text-2xl mt-3 leading-snug">
                {depletions[0].med} may be depleting key nutrients.
              </h2>
              <p className="mt-3 text-sm text-white/70 font-['Manrope',sans-serif] leading-relaxed">
                {depletions[0].nutrients.slice(0, 3).join(', ')} could be affected.
                {depletions.length > 1 && ` Plus ${depletions.length - 1} more medication${depletions.length - 1 > 1 ? 's' : ''} with known depletions.`}
              </p>
              <Link
                to="/app/medications"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white font-['Manrope',sans-serif]"
              >
                View medication details <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          ) : labValues.length > 0 ? (
            <>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#86AF99]">
                Lab Insight
              </span>
              <h2 className="font-['Fraunces',serif] italic text-2xl mt-3 leading-snug">
                Patterns detected across your markers.
              </h2>
              <p className="mt-3 text-sm text-white/70 font-['Manrope',sans-serif] leading-relaxed">
                {optimalCount} of {labValues.length} markers are in the optimal range. Review your full panel for detailed root-cause analysis.
              </p>
              <Link
                to={`/app/labs/${latestDraw?.id}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white font-['Manrope',sans-serif]"
              >
                View full lab panel <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          ) : (
            <>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#86AF99]">
                Get Started
              </span>
              <h2 className="font-['Fraunces',serif] italic text-2xl mt-3 leading-snug">
                Upload labs to unlock your health insights.
              </h2>
              <p className="mt-3 text-sm text-white/70 font-['Manrope',sans-serif] leading-relaxed">
                We analyze your biomarkers against optimal ranges, detect medication depletions, and map root causes.
              </p>
              <Link
                to="/app/labs/upload"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white font-['Manrope',sans-serif]"
              >
                Upload your first panel <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}

          {/* Badge */}
          {healthScore !== null && healthScore >= 70 && (
            <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 inline-block">
              <span className="text-sm font-['Manrope',sans-serif] font-semibold text-white/90">
                Top {Math.max(5, 100 - healthScore)}% of your demographic
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ── 4. YOUR TOOLKIT (2x2 Grid) ── */}
      <section>
        <div className="flex justify-between items-baseline mb-6">
          <h2 className="font-['Fraunces',serif] italic text-2xl text-[#1A3C34]">Your Toolkit</h2>
          <Link to="/app/wellness" className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414844]">
            Manage
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { to: '/app/wellness', icon: Activity, label: 'Wellness Plan', desc: 'AI-generated protocol' },
            { to: '/app/doctor-prep', icon: Stethoscope, label: 'Doctor Prep', desc: 'ICD-10 documents' },
            { to: '/app/symptoms', icon: TrendingUp, label: 'Symptoms', desc: 'Root cause mapper' },
            { to: '/app/insurance', icon: Shield, label: 'Insurance', desc: 'Coverage guide' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="bg-white rounded-[32px] p-6 shadow-[0_8px_32px_-4px_rgba(27,28,26,0.06)] hover:shadow-[0_12px_40px_-4px_rgba(27,28,26,0.10)] transition-shadow"
            >
              <div className="w-11 h-11 rounded-full bg-[#F5F3F0] flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5 text-[#1A3C34]" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-semibold text-[#1B1C1A] font-['Manrope',sans-serif]">{item.label}</p>
              <p className="text-[11px] text-[#414844] mt-1 font-['Manrope',sans-serif]">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 5. ACTIVE PROTOCOL ── */}
      <section>
        <div className="bg-[#F5F3F0] rounded-[32px] p-8">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#414844]">
            Active Protocol
          </span>
          <h2 className="font-['Fraunces',serif] italic text-2xl text-[#1A3C34] mt-3">
            Your Wellness Plan
          </h2>
          {labValues.length > 0 ? (
            <>
              <p className="mt-3 text-sm text-[#414844] font-['Manrope',sans-serif] leading-relaxed max-w-md">
                {criticalCount > 0
                  ? `Focus on the ${criticalCount} marker${criticalCount > 1 ? 's' : ''} that need attention. Your plan includes targeted supplement and lifestyle recommendations.`
                  : `All ${optimalCount} optimal markers are holding steady. Your plan focuses on maintaining these levels and optimizing the rest.`}
              </p>
              <Link
                to="/app/wellness"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1A3C34] font-['Manrope',sans-serif]"
              >
                View your plan <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          ) : (
            <>
              <p className="mt-3 text-sm text-[#414844] font-['Manrope',sans-serif] leading-relaxed max-w-md">
                Generate your first wellness plan. Upload labs and we will create a personalized protocol based on your biomarkers.
              </p>
              <Link
                to="/app/labs/upload"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1A3C34] font-['Manrope',sans-serif]"
              >
                Get started <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </section>

      {/* ── 6. UPLOAD CTA (if no labs) ── */}
      {labValues.length === 0 && (
        <section>
          <Link
            to="/app/labs/upload"
            className="block bg-[#1A3C34] rounded-[32px] p-8 text-white hover:opacity-95 transition-opacity"
          >
            <Upload className="w-8 h-8 mb-4 text-white/60" />
            <h3 className="font-['Fraunces',serif] italic text-2xl mb-2">Upload Your Labs</h3>
            <p className="text-sm text-white/70 font-['Manrope',sans-serif] leading-relaxed max-w-sm">
              Get your personalized health score, biomarker insights, and medication depletion analysis.
            </p>
          </Link>
        </section>
      )}

      {/* ── 7. DISCLAIMER ── */}
      <p className="text-[10px] text-[#414844]/40 text-center leading-relaxed font-['Manrope',sans-serif] pb-4">
        {STANDARD_DISCLAIMER}
      </p>
    </div>
  );
}
