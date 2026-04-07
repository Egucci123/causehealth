import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Stethoscope,
  FileText,
  Heart,
  MessageCircle,
} from 'lucide-react';
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
      depletions.push({ med: med.name, nutrients: info.depletes.map((d) => d.nutrient) });
    }
  }
  return depletions;
}

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [, setLatestDraw] = useState<LabDraw | null>(null);
  const [labValues, setLabValues] = useState<LabValue[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [, setSymptoms] = useState<Symptom[]>([]);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  async function loadData() {
    const [drawsRes, medsRes, sympRes] = await Promise.all([
      supabase
        .from('lab_draws')
        .select('*')
        .eq('user_id', user!.id)
        .order('draw_date', { ascending: false })
        .limit(1),
      supabase.from('medications').select('*').eq('user_id', user!.id).eq('is_active', true),
      supabase.from('symptoms').select('*').eq('user_id', user!.id),
    ]);
    if (drawsRes.data?.[0]) {
      setLatestDraw(drawsRes.data[0]);
      const valuesRes = await supabase
        .from('lab_values')
        .select('*')
        .eq('draw_id', drawsRes.data[0].id);
      if (valuesRes.data) setLabValues(valuesRes.data);
    }
    if (medsRes.data) setMedications(medsRes.data as Medication[]);
    if (sympRes.data) setSymptoms(sympRes.data as Symptom[]);
  }

  const healthScore =
    labValues.length > 0
      ? Math.round(
          labValues.reduce((sum, v) => {
            if (v.optimal_flag === 'optimal') return sum + 100;
            if (v.optimal_flag === 'suboptimal_low' || v.optimal_flag === 'suboptimal_high')
              return sum + 60;
            if (v.optimal_flag === 'deficient' || v.optimal_flag === 'elevated') return sum + 20;
            return sum + 50;
          }, 0) / labValues.length
        )
      : null;

  const optimalCount = labValues.filter((v) => v.optimal_flag === 'optimal').length;
  const suboptimalCount = labValues.filter(
    (v) => v.optimal_flag === 'suboptimal_low' || v.optimal_flag === 'suboptimal_high'
  ).length;
  const criticalCount = labValues.filter(
    (v) => v.optimal_flag === 'deficient' || v.optimal_flag === 'elevated'
  ).length;
  const depletions = getMedDepletions(medications);

  const scorePercent = healthScore !== null ? healthScore : 0;

  // Nutrient status
  const nutrientStatus =
    labValues.length === 0
      ? { label: 'No Data', color: '#A0ACAB', percent: 0 }
      : optimalCount >= labValues.length * 0.7
        ? { label: 'Optimal', color: '#1F403D', percent: 85 }
        : optimalCount >= labValues.length * 0.4
          ? { label: 'Moderate', color: '#C9A84C', percent: 55 }
          : { label: 'Low', color: '#CF6679', percent: 25 };

  // Medication risk
  const medRisk =
    depletions.length === 0
      ? { label: 'Low', color: '#1F403D', percent: 15 }
      : depletions.length <= 2
        ? { label: 'Moderate', color: '#C9A84C', percent: 50 }
        : { label: 'High', color: '#CF6679', percent: 80 };

  // Inflammation risk
  const inflammationRisk =
    criticalCount === 0
      ? { label: 'Low', color: '#E2E2E6', percent: 10 }
      : criticalCount <= 2
        ? { label: 'Moderate', color: '#C9A84C', percent: 45 }
        : { label: 'Elevated', color: '#CF6679', percent: 70 };

  // Alert text
  let alertText = 'Upload your lab results to unlock personalized insights and your CauseScore.';
  if (depletions.length > 0) {
    alertText = `${depletions[0].med} may deplete ${depletions[0].nutrients.slice(0, 3).join(', ')}. ${depletions.length > 1 ? `${depletions.length - 1} more medication${depletions.length > 1 ? 's' : ''} flagged.` : 'Review your depletion report.'}`;
  } else if (labValues.length > 0) {
    alertText = `${optimalCount} of ${labValues.length} markers optimal. ${criticalCount > 0 ? `${criticalCount} marker${criticalCount > 1 ? 's' : ''} need attention.` : 'All markers within acceptable range.'}`;
  }

  // Intelligence feed items
  const feedItems: {
    id: string;
    color: string;
    headline: string;
    desc: string;
    time: string;
  }[] = [];

  if (depletions.length > 0) {
    feedItems.push({
      id: 'depletion',
      color: '#C9A84C',
      headline: `${depletions[0].med} Nutrient Depletion`,
      desc: `${depletions[0].nutrients.slice(0, 3).join(', ')} may be depleted. Consider supplementation.`,
      time: 'ACTIVE',
    });
  }
  if (criticalCount > 0) {
    feedItems.push({
      id: 'critical',
      color: '#CF6679',
      headline: `${criticalCount} Critical Marker${criticalCount > 1 ? 's' : ''} Detected`,
      desc: 'Biomarkers outside optimal range require clinical review.',
      time: 'URGENT',
    });
  }
  if (labValues.length > 0) {
    feedItems.push({
      id: 'insight',
      color: '#1F403D',
      headline: 'Lab Panel Analysis Complete',
      desc: `${labValues.length} biomarkers analyzed. ${optimalCount} in optimal range.`,
      time: '2H AGO',
    });
  }
  if (suboptimalCount > 0) {
    feedItems.push({
      id: 'suboptimal',
      color: '#1F403D',
      headline: `${suboptimalCount} Suboptimal Markers`,
      desc: 'These markers are within range but could be optimized with targeted interventions.',
      time: '4H AGO',
    });
  }
  if (feedItems.length === 0) {
    feedItems.push({
      id: 'welcome',
      color: '#1F403D',
      headline: 'Welcome to CauseHealth.',
      desc: 'Upload your first lab panel to unlock personalized health intelligence.',
      time: 'NOW',
    });
  }

  const firstName = profile?.first_name || 'there';

  // Conic gradient for gauge
  const conicGradient = `conic-gradient(#1F403D 0% ${scorePercent}%, #1E2226 ${scorePercent}% 100%)`;

  return (
    <div className="space-y-10">
      {/* SECTION 1 -- STATUS BRIEFING */}
      <section className="space-y-5">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] block">
          STATUS BRIEFING
        </span>
        <h2 className="font-['Newsreader',serif] text-4xl italic text-[#E2E2E6]">
          {getGreeting()} {firstName}
        </h2>

        {/* Alert card */}
        <div className="bg-[#15181C] p-5 rounded-xl border-l-2 border-[#1F403D] flex items-start gap-4">
          <div className="mt-0.5">
            <Zap className="w-5 h-5 text-[#1F403D]" strokeWidth={1.5} />
          </div>
          <p className="text-sm text-[#E2E2E6]/80 leading-relaxed font-['DM_Sans',sans-serif]">
            {alertText}
          </p>
        </div>
      </section>

      {/* SECTION 2 -- CAUSESCORE */}
      <section>
        <div className="bg-[#1E2226] rounded-xl p-8 border border-[rgba(63,73,72,0.2)] relative overflow-hidden">
          {/* Flare gradient */}
          <div
            className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, #1F403D 0%, transparent 60px)',
            }}
          />

          <div className="relative z-10">
            {/* Gauge */}
            <div className="flex flex-col items-center mb-8">
              <div
                className="w-44 h-44 rounded-full flex items-center justify-center relative"
                style={{
                  background: conicGradient,
                }}
              >
                {/* Inner circle */}
                <div className="w-36 h-36 rounded-full bg-[#1E2226] flex flex-col items-center justify-center">
                  <span className="font-['Newsreader',serif] text-5xl text-[#E2E2E6]">
                    {healthScore ?? '--'}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] mt-1">
                    CAUSESCORE&trade;
                  </span>
                </div>
              </div>
            </div>

            {/* Three status bars */}
            <div className="space-y-4">
              {[
                { title: 'NUTRIENT STATUS', statusLabel: nutrientStatus.label, color: nutrientStatus.color, percent: nutrientStatus.percent },
                { title: 'MEDICATION RISK', statusLabel: medRisk.label, color: medRisk.color, percent: medRisk.percent },
                { title: 'INFLAMMATION RISK', statusLabel: inflammationRisk.label, color: inflammationRisk.color, percent: inflammationRisk.percent },
              ].map((bar) => (
                <div key={bar.title} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
                      {bar.title}
                    </span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: bar.color }}
                    >
                      {bar.statusLabel}
                    </span>
                  </div>
                  <div className="h-1 bg-[#282D33] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${bar.percent}%`,
                        backgroundColor: bar.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 -- CLINICAL PROTOCOL */}
      <section className="space-y-5">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB] block">
          CLINICAL PROTOCOL
        </span>

        <div className="grid grid-cols-2 gap-4">
          {[
            {
              to: '/app/doctor-prep',
              icon: Stethoscope,
              title: 'Doctor Visit Slip',
              subtitle: 'ICD-10 READY',
            },
            {
              to: '/app/medications',
              icon: FileText,
              title: 'Depletion Report',
              subtitle: 'NUTRIENT ANALYSIS',
            },
            {
              to: '/app/wellness',
              icon: Heart,
              title: 'Wellness Plan',
              subtitle: 'AI PROTOCOL',
            },
            {
              to: '/app/ask',
              icon: MessageCircle,
              title: 'Ask CauseHealth.',
              subtitle: 'AI ASSISTANT',
            },
          ].map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="bg-[#15181C] rounded-xl p-6 border border-[rgba(63,73,72,0.2)] hover:border-[#1F403D]/40 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1F403D]/20 flex items-center justify-center mb-4">
                <card.icon className="w-5 h-5 text-[#1F403D]" strokeWidth={1.5} />
              </div>
              <h4 className="font-bold text-sm text-[#E2E2E6] mb-1 font-['DM_Sans',sans-serif]">
                {card.title}
              </h4>
              <span className="text-[10px] uppercase tracking-widest text-[#A0ACAB]">
                {card.subtitle}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 4 -- INTELLIGENCE FEED */}
      <section className="space-y-5">
        <div className="flex justify-between items-center">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
            INTELLIGENCE FEED
          </span>
          <Link
            to="/app/labs"
            className="text-xs font-bold text-[#1F403D] hover:opacity-80 transition-opacity"
          >
            VIEW ALL
          </Link>
        </div>

        <div className="space-y-3">
          {feedItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#15181C] rounded-xl p-5 border border-[rgba(63,73,72,0.2)] flex gap-4"
              style={{ borderLeftWidth: '3px', borderLeftColor: item.color }}
            >
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-[#E2E2E6] mb-1 font-['DM_Sans',sans-serif]">
                  {item.headline}
                </h4>
                <p className="text-xs text-[#A0ACAB] leading-relaxed">{item.desc}</p>
              </div>
              <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#A0ACAB]/60 shrink-0 mt-0.5">
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* DISCLAIMER */}
      <p className="text-[10px] text-[#A0ACAB]/30 text-center leading-relaxed pb-4 font-['DM_Sans',sans-serif]">
        {STANDARD_DISCLAIMER}
      </p>
    </div>
  );
}
