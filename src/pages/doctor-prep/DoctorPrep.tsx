import { useState, useEffect } from 'react';
import { Share2, FileText, Copy, Stethoscope, FlaskConical, Pill, HelpCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { STANDARD_DISCLAIMER } from '@/lib/safety';
import type { LabValue } from '@/types/lab.types';
import type { Medication, Symptom } from '@/types/user.types';

export default function DoctorPrep() {
  const { user } = useAuth();
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
      const { data: vals } = await supabase.from('lab_values').select('*').eq('draw_id', drawsRes.data[0].id);
      if (vals) setLabValues(vals);
    }
    if (medsRes.data) setMedications(medsRes.data as Medication[]);
    if (sympRes.data) setSymptoms(sympRes.data as Symptom[]);
  }

  const criticalLabs = labValues.filter(v => v.optimal_flag === 'deficient' || v.optimal_flag === 'elevated');
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <div>
      {/* Header — from stitch28 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-xs font-bold text-[#1F403D] uppercase tracking-[0.3em] mb-4 block">Preparation Summary</span>
          <h2 className="font-['Newsreader',serif] text-5xl text-[#E2E2E6] leading-tight">Your Visit Prep — {today}</h2>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 border border-[#3F4948] hover:bg-[#15181C] transition-all group">
          <Share2 className="w-5 h-5 text-[#A0ACAB] group-hover:text-[#1F403D]" strokeWidth={1.5} />
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#A0ACAB] group-hover:text-[#E2E2E6]">Share Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Chief Concerns */}
        <section className="md:col-span-7 bg-[#15181C] p-8 rounded-xl border border-[rgba(47,56,54,0.4)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-10 h-[1px] bg-gradient-to-r from-[#1F403D] to-transparent" />
          <div className="flex items-center gap-3 mb-8">
            <Stethoscope className="w-5 h-5 text-[#1F403D]" strokeWidth={1.5} />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A0ACAB]">Chief Concerns</h3>
          </div>
          <ul className="space-y-8">
            {symptoms.length > 0 ? symptoms.slice(0, 3).map(s => (
              <li key={s.id} className="flex items-start gap-5">
                <div className="w-1 h-1 bg-[#1F403D] mt-3" />
                <div>
                  <span className="font-['Newsreader',serif] text-2xl block text-[#E2E2E6]">{s.symptom}</span>
                  <p className="text-[#A0ACAB] text-sm mt-2 leading-relaxed">Severity: {s.severity}/10{s.duration ? ` • Duration: ${s.duration}` : ''}</p>
                </div>
              </li>
            )) : (
              <li className="text-[#A0ACAB] text-sm">No symptoms tracked yet. Add symptoms to populate this section.</li>
            )}
          </ul>
        </section>

        {/* Lab Anomalies */}
        <section className="md:col-span-5 bg-[#15181C] p-8 rounded-xl border border-[rgba(47,56,54,0.4)] border-t-2 border-t-[#CF6679]/30">
          <div className="flex items-center gap-3 mb-8">
            <FlaskConical className="w-5 h-5 text-[#CF6679]" strokeWidth={1.5} />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A0ACAB]">Lab Anomalies</h3>
          </div>
          {criticalLabs.length > 0 ? criticalLabs.slice(0, 2).map(lab => (
            <div key={lab.id} className="mt-6">
              <div className="flex justify-between items-end mb-4">
                <span className="font-['Newsreader',serif] text-3xl text-[#E2E2E6]">{lab.marker_name}</span>
                <span className="text-[#CF6679] font-medium">{lab.value} {lab.unit}</span>
              </div>
              <div className="h-[1px] bg-[#3F4948] w-full relative">
                <div className="absolute h-[1px] bg-[#CF6679]" style={{ width: '35%' }} />
              </div>
              <p className="text-xs text-[#A0ACAB] mt-4 leading-relaxed italic opacity-80">
                Requires discussion regarding supplementation or intervention.
              </p>
            </div>
          )) : (
            <p className="text-[#A0ACAB] text-sm">Upload labs to identify anomalies for discussion.</p>
          )}
        </section>

        {/* Current Medications */}
        <section className="md:col-span-5 bg-[#15181C] p-8 rounded-xl border border-[rgba(47,56,54,0.4)]">
          <div className="flex items-center gap-3 mb-8">
            <Pill className="w-5 h-5 text-[#1F403D]" strokeWidth={1.5} />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A0ACAB]">Current Meds</h3>
          </div>
          {medications.length > 0 ? medications.slice(0, 3).map(med => (
            <div key={med.id} className="bg-[#1E2226]/50 p-6 border-l border-[#1F403D] mb-4 last:mb-0">
              <span className="font-['Newsreader',serif] text-2xl block text-[#E2E2E6]">{med.name}</span>
              {med.dose && <span className="text-[10px] text-[#1F403D] font-bold uppercase tracking-widest mt-1 block">{med.dose}</span>}
              {med.frequency && (
                <div className="mt-3 flex items-center gap-2 text-[#A0ACAB] text-xs">
                  <span>{med.frequency}</span>
                </div>
              )}
            </div>
          )) : (
            <p className="text-[#A0ACAB] text-sm">No medications tracked yet.</p>
          )}
        </section>

        {/* Questions to Ask */}
        <section className="md:col-span-7 bg-[#15181C] p-8 rounded-xl border border-[rgba(47,56,54,0.4)]">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-5 h-5 text-[#1F403D]" strokeWidth={1.5} />
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A0ACAB]">Questions to Ask</h3>
          </div>
          <div className="space-y-6">
            <blockquote className="border-l border-[#3F4948] pl-8 py-2">
              <p className="font-['Newsreader',serif] text-2xl italic text-[#E2E2E6] leading-relaxed">
                {medications.length > 0
                  ? `"Are there nutrient depletions I should address given my current ${medications[0].name} regimen?"`
                  : '"What additional lab markers should I request beyond the standard panel?"'}
              </p>
            </blockquote>
            <p className="text-[#A0ACAB] text-xs pl-8 leading-relaxed">
              Note: CauseHealth. generates these questions based on your medications, labs, and symptom data.
            </p>
          </div>
        </section>
      </div>

      {/* Action Buttons */}
      <div className="mt-20 flex flex-col sm:flex-row gap-6 items-center justify-center">
        <button className="w-full sm:w-auto px-12 py-5 bg-[#1F403D] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#2D5A56] transition-all flex items-center justify-center gap-3">
          <FileText className="w-5 h-5" strokeWidth={1.5} />
          Generate PDF
        </button>
        <button className="w-full sm:w-auto px-12 py-5 border border-[#3F4948] text-[#A0ACAB] hover:border-[#1F403D] hover:text-[#1F403D] transition-all font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-3">
          <Copy className="w-5 h-5" strokeWidth={1.5} />
          Copy
        </button>
      </div>

      <p className="text-[9px] text-[#A0ACAB]/30 text-center leading-relaxed mt-12">{STANDARD_DISCLAIMER}</p>
    </div>
  );
}
