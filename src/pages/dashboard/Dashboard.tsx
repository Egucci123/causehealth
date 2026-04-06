import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, ArrowRight, AlertTriangle, Pill, TestTube2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { STANDARD_DISCLAIMER } from '@/lib/safety';
import { MEDICATION_DEPLETIONS } from '@/data/medicationDepletions';
import type { LabDraw, LabValue } from '@/types/lab.types';
import type { Medication, Symptom } from '@/types/user.types';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Welcome home';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
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
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);

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
  const monitorCount = labValues.filter(v => v.optimal_flag === 'suboptimal_low' || v.optimal_flag === 'suboptimal_high').length;
  const criticalCount = labValues.filter(v => v.optimal_flag === 'deficient' || v.optimal_flag === 'elevated').length;
  const depletions = getMedDepletions(medications);
  const firstName = profile?.first_name || 'there';

  return (
    <div className="px-6 pt-4 max-w-3xl mx-auto">
      {/* Welcome */}
      <section className="mb-10">
        <h1 className="text-5xl font-display font-semibold tracking-tight text-[#012D1D] leading-tight mb-2">
          {getGreeting()},<br />{firstName}.
        </h1>
        <p className="text-[#414844] text-lg max-w-sm">
          {labValues.length > 0
            ? `${optimalCount} markers optimal, ${criticalCount > 0 ? `${criticalCount} need attention` : 'everything trending well'}. Here is what your body is telling us.`
            : 'Your health journey starts here. Upload your first lab panel to unlock personalized insights.'}
        </p>
      </section>

      {/* Health Score Ring */}
      <section className="mb-6">
        <div className="bg-[#1B4332] rounded-xl p-6 text-white relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <TestTube2 className="w-5 h-5 text-[#86AF99]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#86AF99]">
              Health Score
            </span>
          </div>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                <circle
                  cx="80" cy="80" r="70" fill="none"
                  stroke="#86AF99" strokeWidth="8"
                  strokeDasharray="440"
                  strokeDashoffset={healthScore !== null ? 440 - (healthScore / 100) * 440 : 440}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-display font-bold">{healthScore ?? '--'}</span>
                <span className="text-xs uppercase tracking-wider opacity-70">
                  {healthScore !== null ? (healthScore >= 80 ? 'Optimal' : healthScore >= 60 ? 'Good' : 'Needs Work') : 'Upload Labs'}
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm opacity-80 leading-relaxed text-center">
            {healthScore !== null
              ? `${optimalCount} of ${labValues.length} markers in optimal range.`
              : 'Upload your lab results to calculate your score.'}
          </p>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Medication Depletion Alert */}
      {depletions.length > 0 && (
        <section className="mb-6">
          <Link to="/app/medications" className="block bg-white rounded-xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#BA1A1A]" />
            <div className="flex gap-4 pl-3">
              <div className="w-12 h-12 bg-[#FFDAD6]/30 flex items-center justify-center rounded-xl flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-[#BA1A1A]" />
              </div>
              <div>
                <h3 className="font-bold text-[#012D1D] mb-1">Medication Depletion Detected</h3>
                <p className="text-sm text-[#414844]">
                  {depletions[0].med} may be depleting {depletions[0].nutrients.slice(0, 3).join(', ')}.
                  {depletions.length > 1 && ` +${depletions.length - 1} more.`}
                </p>
                <span className="text-xs text-[#012D1D] font-bold mt-2 inline-flex items-center gap-1">
                  View details <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Lab Summary — only if labs exist */}
      {labValues.length > 0 && (
        <section className="mb-6">
          <div className="bg-[#EFEEEB] rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-xl text-[#012D1D]">Biomarker Summary</h3>
              <Link to={`/app/labs/${latestDraw?.id}`} className="text-xs font-bold text-[#012D1D] uppercase tracking-widest">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white rounded-lg p-3 text-center">
                <span className="block font-display text-2xl text-[#3F665C]">{optimalCount}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#414844]/60">Optimal</span>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <span className="block font-display text-2xl text-[#012D1D]">{monitorCount}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#414844]/60">Monitor</span>
              </div>
              <div className="bg-white rounded-lg p-3 text-center">
                <span className="block font-display text-2xl text-[#BA1A1A]">{criticalCount}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#414844]/60">Critical</span>
              </div>
            </div>
            {/* Top markers */}
            {labValues.slice(0, 3).map((v) => (
              <div key={v.id} className="flex justify-between items-center py-3">
                <div>
                  <span className="text-[10px] font-bold text-[#414844]/50 uppercase tracking-widest">{v.marker_category}</span>
                  <p className="text-sm font-semibold text-[#012D1D]">{v.marker_name}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-[#012D1D] font-mono">{v.value}</span>
                  <span className="text-xs text-[#414844] ml-1">{v.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Symptoms Summary — only if symptoms exist */}
      {symptoms.length > 0 && (
        <section className="mb-6">
          <Link to="/app/symptoms" className="block bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-xl text-[#012D1D]">Tracked Symptoms</h3>
              <span className="text-xs font-bold text-[#012D1D] uppercase tracking-widest">
                {symptoms.length} Active
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {symptoms.slice(0, 6).map((s) => (
                <span
                  key={s.id}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    s.severity >= 7 ? 'bg-[#FFDAD6] text-[#BA1A1A]'
                    : s.severity >= 4 ? 'bg-[#FFF3E0] text-[#E65100]'
                    : 'bg-[#D5E7DB] text-[#012D1D]'
                  }`}
                >
                  {s.symptom}
                </span>
              ))}
            </div>
          </Link>
        </section>
      )}

      {/* Medications List — only if meds exist */}
      {medications.length > 0 && (
        <section className="mb-6">
          <Link to="/app/medications" className="block bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-xl text-[#012D1D]">Active Medications</h3>
              <Pill className="w-5 h-5 text-[#012D1D]/40" />
            </div>
            <div className="flex flex-wrap gap-2">
              {medications.map((m) => (
                <span key={m.id} className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#EFEEEB] text-[#012D1D]">
                  {m.name} {m.dose && <span className="text-[#414844]/60">{m.dose}</span>}
                </span>
              ))}
            </div>
          </Link>
        </section>
      )}

      {/* Upload CTA — if no labs */}
      {labValues.length === 0 && (
        <section className="mb-8">
          <Link
            to="/app/labs/upload"
            className="block bg-[#012D1D] text-white rounded-xl p-8 text-center hover:opacity-95 transition-opacity"
          >
            <Upload className="w-8 h-8 mx-auto mb-3 opacity-60" />
            <h3 className="font-display text-xl mb-2">Upload Your Labs</h3>
            <p className="text-sm text-white/70">Get your personalized health score and biomarker insights.</p>
          </Link>
        </section>
      )}

      {/* Disclaimer */}
      <p className="text-[10px] text-[#414844]/40 text-center leading-relaxed pb-4">
        {STANDARD_DISCLAIMER}
      </p>
    </div>
  );
}
