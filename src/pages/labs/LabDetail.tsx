import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { OPTIMAL_RANGES } from '@/data/optimalRanges';
import { PATTERN_LIBRARY } from '@/data/patternLibrary';
import type { LabDraw, LabValue } from '@/types/lab.types';
import type { LabPattern } from '@/data/patternLibrary';

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function detectPatterns(labValues: LabValue[]): LabPattern[] {
  const valueMap: Record<string, number> = {};
  for (const lv of labValues) {
    const key = Object.keys(OPTIMAL_RANGES).find(
      (k) => OPTIMAL_RANGES[k].name.toLowerCase() === lv.marker_name.toLowerCase(),
    );
    if (key) valueMap[key] = lv.value;
  }
  return PATTERN_LIBRARY.filter(
    (pattern) => pattern.markers.some((m) => m in valueMap) && pattern.condition(valueMap),
  );
}

function flagToPriority(lv: LabValue): 'critical' | 'monitor' | 'optimal' {
  if (
    lv.optimal_flag === 'deficient' ||
    lv.optimal_flag === 'elevated' ||
    lv.standard_flag === 'critical_low' ||
    lv.standard_flag === 'critical_high'
  )
    return 'critical';
  if (lv.optimal_flag === 'suboptimal_low' || lv.optimal_flag === 'suboptimal_high')
    return 'monitor';
  return 'optimal';
}

function daysAgo(dateStr: string | null): number {
  if (!dateStr) return 0;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/* ── Main Component ──────────────────────────────────────────────────────── */

export default function LabDetail() {
  const { drawId } = useParams<{ drawId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [draw, setDraw] = useState<LabDraw | null>(null);
  const [labValues, setLabValues] = useState<LabValue[]>([]);
  const [allDraws, setAllDraws] = useState<LabDraw[]>([]);
  const [allLabValues, setAllLabValues] = useState<LabValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMarkerIdx, setSelectedMarkerIdx] = useState(0);

  /* ── Data loading ──────────────────────────────────────────────────────── */

  useEffect(() => {
    if (!user || !drawId) return;
    loadDrawData();
  }, [user, drawId]);

  async function loadDrawData() {
    try {
      const [drawRes, valuesRes, otherDrawsRes, allValuesRes] = await Promise.all([
        supabase.from('lab_draws').select('*').eq('id', drawId!).single(),
        supabase.from('lab_values').select('*').eq('draw_id', drawId!),
        supabase
          .from('lab_draws')
          .select('*')
          .eq('user_id', user!.id)
          .order('draw_date', { ascending: true }),
        supabase
          .from('lab_values')
          .select('*')
          .eq('user_id', user!.id),
      ]);
      if (drawRes.data) setDraw(drawRes.data);
      if (valuesRes.data) setLabValues(valuesRes.data);
      if (otherDrawsRes.data) setAllDraws(otherDrawsRes.data);
      if (allValuesRes.data) setAllLabValues(allValuesRes.data);
    } catch (err) {
      console.error('Failed to load draw data:', err);
    } finally {
      setLoading(false);
    }
  }

  /* ── Derived ───────────────────────────────────────────────────────────── */

  const patterns = useMemo(() => detectPatterns(labValues), [labValues]);

  const sortedValues = useMemo(() => {
    const order = { critical: 0, monitor: 1, optimal: 2 };
    return [...labValues].sort(
      (a, b) => order[flagToPriority(a)] - order[flagToPriority(b)],
    );
  }, [labValues]);

  const selectedLv = sortedValues[selectedMarkerIdx] ?? null;

  const optKey = selectedLv
    ? Object.keys(OPTIMAL_RANGES).find(
        (k) => OPTIMAL_RANGES[k].name.toLowerCase() === selectedLv.marker_name.toLowerCase(),
      )
    : null;
  const optRange = optKey ? OPTIMAL_RANGES[optKey] : null;

  const priority = selectedLv ? flagToPriority(selectedLv) : 'optimal';

  // Build trend data for the selected marker across all draws
  const trendData = useMemo(() => {
    if (!selectedLv) return [];
    const markerName = selectedLv.marker_name.toLowerCase();
    const points: Array<{ label: string; value: number; drawId: string }> = [];

    for (const d of allDraws) {
      const match = allLabValues.find(
        (v) => v.draw_id === d.id && v.marker_name.toLowerCase() === markerName,
      );
      if (match) {
        const date = new Date(d.draw_date);
        points.push({
          label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: match.value,
          drawId: d.id,
        });
      }
    }
    return points;
  }, [selectedLv, allDraws, allLabValues]);

  const trendDirection = useMemo(() => {
    if (trendData.length < 2) return null;
    const last = trendData[trendData.length - 1].value;
    const prev = trendData[trendData.length - 2].value;
    return last > prev ? 'up' : last < prev ? 'down' : 'flat';
  }, [trendData]);

  // Range bar calculations
  const rangeBar = useMemo(() => {
    if (!selectedLv) return null;
    const allPts = [
      selectedLv.value,
      selectedLv.standard_low,
      selectedLv.standard_high,
      selectedLv.optimal_low,
      selectedLv.optimal_high,
    ].filter((v): v is number => v !== null);
    if (allPts.length < 2) return null;

    const min = Math.min(...allPts);
    const max = Math.max(...allPts);
    const range = max - min || 1;
    const pad = range * 0.15;
    const dMin = min - pad;
    const dMax = max + pad;
    const dRange = dMax - dMin;
    const toP = (v: number) => ((v - dMin) / dRange) * 100;

    return {
      optLeft: selectedLv.optimal_low !== null ? toP(selectedLv.optimal_low) : 0,
      optRight: selectedLv.optimal_high !== null ? toP(selectedLv.optimal_high) : 100,
      stdLow: selectedLv.standard_low,
      stdHigh: selectedLv.standard_high,
      optLow: selectedLv.optimal_low,
      optHigh: selectedLv.optimal_high,
      valuePct: Math.max(0, Math.min(100, toP(selectedLv.value))),
    };
  }, [selectedLv]);

  // Pattern match for selected marker
  const markerPattern = useMemo(() => {
    if (!optKey) return null;
    return patterns.find((p) => p.markers.includes(optKey));
  }, [optKey, patterns]);

  /* ── Skeleton ──────────────────────────────────────────────────────────── */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] px-5 pt-6 pb-24 font-['Manrope',sans-serif]">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-white/60 rounded-2xl w-2/3" />
          <div className="h-56 bg-white/60 rounded-3xl" />
          <div className="h-40 bg-white/60 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!draw || !selectedLv) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] px-5 pt-6 pb-24 font-['Manrope',sans-serif]">
        <Header onBack={() => navigate(-1)} onAdd={() => navigate('/app/labs')} />
        <div className="mt-16 text-center">
          <p className="text-[#414844]">Lab draw not found.</p>
        </div>
      </div>
    );
  }

  const updatedDays = daysAgo(draw.draw_date);

  /* ── Render ────────────────────────────────────────────────────────────── */

  return (
    <div className="min-h-screen bg-[#F5F0E8] px-5 pt-6 pb-24 font-['Manrope',sans-serif]">
      {/* Header */}
      <Header onBack={() => navigate(-1)} onAdd={() => navigate('/app/labs')} />

      {/* Marker selector pills */}
      {sortedValues.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 mt-5 -mx-1 px-1">
          {sortedValues.map((lv, i) => {
            const p = flagToPriority(lv);
            return (
              <button
                key={lv.id}
                onClick={() => setSelectedMarkerIdx(i)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  i === selectedMarkerIdx
                    ? 'bg-[#012D1D] text-white'
                    : p === 'critical'
                    ? 'bg-[#FFDAD6] text-[#BA1A1A]'
                    : p === 'monitor'
                    ? 'bg-[#BEE8DC] text-[#3F665C]'
                    : 'bg-white text-[#414844] shadow-[0_8px_24px_rgba(14,55,39,0.05)]'
                }`}
              >
                {lv.marker_name}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-6 space-y-5">
        {/* ── Hero header ──────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60">
            Biomarker View
          </span>
          <h1 className="font-['Fraunces',serif] text-4xl font-medium text-[#012D1D] mt-1 leading-tight">
            {selectedLv.marker_name}
          </h1>
          {optRange?.description && (
            <p className="text-sm italic text-[#414844] mt-2">{optRange.description}</p>
          )}
        </motion.div>

        {/* ── Value + Range Bar Card ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-6"
        >
          <div className="flex items-end justify-between">
            <div>
              <span className="font-['Fraunces',serif] text-4xl font-medium text-[#012D1D]">
                {selectedLv.value}
              </span>
              <span className="text-sm text-[#414844] ml-2">{selectedLv.unit}</span>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${
                priority === 'optimal'
                  ? 'bg-[#BEE8DC] text-[#3F665C]'
                  : priority === 'monitor'
                  ? 'bg-[#BEE8DC] text-[#3F665C]'
                  : 'bg-[#FFDAD6] text-[#BA1A1A]'
              }`}
            >
              {priority === 'optimal' ? 'Optimal' : priority === 'monitor' ? 'Suboptimal' : 'Critical'}
            </span>
          </div>

          <span className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60 mt-4 block">
            Last updated: {updatedDays} days ago
          </span>

          {/* Range bar */}
          {rangeBar && (
            <div className="mt-4">
              <div className="relative h-2 rounded-full bg-[#C1ECD4] overflow-hidden">
                {/* Optimal zone overlay */}
                <div
                  className="absolute top-0 h-full bg-[#3F665C]/30 rounded-full"
                  style={{
                    left: `${rangeBar.optLeft}%`,
                    width: `${rangeBar.optRight - rangeBar.optLeft}%`,
                  }}
                />
                {/* Value dot */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-[#012D1D] shadow-sm"
                  style={{ left: `calc(${rangeBar.valuePct}% - 7px)` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[10px] text-[#414844]/60">
                  {rangeBar.stdLow !== null ? `Low ${rangeBar.stdLow}` : ''}
                </span>
                <span className="text-[10px] text-[#3F665C] font-semibold">
                  Optimal {rangeBar.optLow ?? ''}{rangeBar.optLow !== null && rangeBar.optHigh !== null ? ' \u2013 ' : ''}{rangeBar.optHigh ?? ''}
                </span>
                <span className="text-[10px] text-[#414844]/60">
                  {rangeBar.stdHigh !== null ? `High ${rangeBar.stdHigh}` : ''}
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* ── Why This Matters Section ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="font-['Fraunces',serif] text-2xl font-medium text-[#012D1D]">
            Why this matters{optRange?.low_symptoms && optRange.low_symptoms.length > 0
              ? ` for your ${optRange.low_symptoms[0].toLowerCase().includes('hair') ? 'hair health' : optRange.low_symptoms[0].toLowerCase().includes('fatigue') ? 'energy levels' : 'health'}`
              : ''}
          </h2>
          <div className="mt-3 space-y-3">
            {optRange?.description && (
              <p className="text-sm text-[#414844] leading-relaxed">
                {selectedLv.marker_name} is a key indicator that provides insight into your body's underlying processes.
                {priority === 'critical'
                  ? ` Your current level of ${selectedLv.value} ${selectedLv.unit} falls outside the optimal range, which may be contributing to symptoms you're experiencing.`
                  : priority === 'monitor'
                  ? ` Your current level of ${selectedLv.value} ${selectedLv.unit} is borderline and worth monitoring closely.`
                  : ` Your current level of ${selectedLv.value} ${selectedLv.unit} is within the optimal range, indicating healthy function in this area.`}
              </p>
            )}
            {priority !== 'optimal' && optRange?.low_symptoms && optRange.low_symptoms.length > 0 && (
              <p className="text-sm text-[#414844] leading-relaxed">
                When {selectedLv.marker_name.toLowerCase()} is suboptimal, common symptoms include{' '}
                {optRange.low_symptoms.slice(0, 3).join(', ').toLowerCase()}.
                Addressing this through targeted nutrition and lifestyle changes can lead to meaningful improvement within 60-90 days.
              </p>
            )}
          </div>
        </motion.div>

        {/* ── Key Insight Card ─────────────────────────────────────────────── */}
        {(markerPattern || priority !== 'optimal') && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-6"
          >
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-[#3F665C] mt-1.5 shrink-0" />
              <div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60">
                  Key Insight
                </span>
                <p className="text-sm text-[#012D1D] mt-2 leading-relaxed">
                  {markerPattern
                    ? markerPattern.clinical_significance
                    : priority === 'critical'
                    ? `Your ${selectedLv.marker_name} level of ${selectedLv.value} ${selectedLv.unit || ''} is significantly outside the optimal range. This may require clinical attention and targeted supplementation.`
                    : `Your ${selectedLv.marker_name} level of ${selectedLv.value} ${selectedLv.unit || ''} is slightly outside optimal. Small dietary and lifestyle adjustments may bring this into range.`}
                </p>
                {markerPattern && (
                  <p className="text-sm text-[#3F665C] mt-2 font-medium">
                    {markerPattern.recommended_action}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── 90-Day Improvement Chart ─────────────────────────────────────── */}
        {trendData.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60">
                Trend Over Time
              </span>
              {trendDirection && (
                <span
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold ${
                    trendDirection === 'up'
                      ? priority === 'critical'
                        ? 'bg-[#FFDAD6] text-[#BA1A1A]'
                        : 'bg-[#BEE8DC] text-[#3F665C]'
                      : trendDirection === 'down'
                      ? priority === 'optimal'
                        ? 'bg-[#FFDAD6] text-[#BA1A1A]'
                        : 'bg-[#BEE8DC] text-[#3F665C]'
                      : 'bg-[#F5F0E8] text-[#414844]'
                  }`}
                >
                  <TrendingUp className={`w-3 h-3 ${trendDirection === 'down' ? 'rotate-180' : ''}`} />
                  Trend {trendDirection}
                </span>
              )}
            </div>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData} barCategoryGap="30%">
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#414844' }}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      background: '#012D1D',
                      border: 'none',
                      borderRadius: 12,
                      color: '#fff',
                      fontSize: 12,
                    }}
                    cursor={false}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {trendData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={
                          i === trendData.length - 1
                            ? '#012D1D'
                            : '#C1ECD4'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {/* ── Action Cards ─────────────────────────────────────────────────── */}
        {priority !== 'optimal' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="grid grid-cols-2 gap-3"
          >
            <div className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-5">
              <div className="w-10 h-10 rounded-2xl bg-[#BEE8DC]/40 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-[#3F665C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 7.07l-.71-.71M4.05 4.93l-.71-.71" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60">
                Update Diet
              </span>
              <p className="text-sm font-semibold text-[#012D1D] mt-1">
                {optRange?.root_causes_low && optRange.root_causes_low.includes('poor_diet')
                  ? 'Increase iron-rich foods'
                  : optRange?.root_causes_low && optRange.root_causes_low.includes('inadequate_intake')
                  ? 'Increase nutrient-dense foods'
                  : 'Optimize your nutrition'}
              </p>
              <p className="text-xs text-[#414844] mt-1">
                Targeted dietary changes for better levels.
              </p>
            </div>
            <div className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-5">
              <div className="w-10 h-10 rounded-2xl bg-[#BEE8DC]/40 flex items-center justify-center mb-3">
                <Plus className="w-5 h-5 text-[#3F665C]" />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60">
                Add Supplement
              </span>
              <p className="text-sm font-semibold text-[#012D1D] mt-1">
                {selectedLv.marker_name.toLowerCase().includes('vitamin d')
                  ? 'Vitamin D3 + K2'
                  : selectedLv.marker_name.toLowerCase().includes('ferritin')
                  ? 'Iron Bisglycinate'
                  : selectedLv.marker_name.toLowerCase().includes('b12')
                  ? 'Methylcobalamin B12'
                  : `Support ${selectedLv.marker_name}`}
              </p>
              <p className="text-xs text-[#414844] mt-1">
                Evidence-based supplementation protocol.
              </p>
            </div>
          </motion.div>
        )}

        {/* ── Lab Source Info ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60">
              Lab Source
            </span>
            <span className="text-sm text-[#012D1D] font-medium">
              {draw.lab_name || 'Unknown Lab'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60">
              Physician Review
            </span>
            <span className="text-sm text-[#012D1D] font-medium">
              {draw.ordering_provider || 'Not specified'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60">
              Biomarker ID
            </span>
            <span className="text-sm text-[#414844] font-mono text-xs">
              {selectedLv.id.slice(0, 8).toUpperCase()}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60">
              Draw Date
            </span>
            <span className="text-sm text-[#012D1D] font-medium">
              {new Date(draw.draw_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        </motion.div>

        {/* Standard range reference */}
        {selectedLv && (
          <div className="text-center pb-4">
            <p className="text-[10px] text-[#414844]/50 uppercase tracking-widest">
              Standard: {selectedLv.standard_low ?? '\u2014'} \u2013 {selectedLv.standard_high ?? '\u2014'} {selectedLv.unit}
              {' '} | Optimal: {selectedLv.optimal_low ?? '\u2014'} \u2013 {selectedLv.optimal_high ?? '\u2014'} {selectedLv.unit}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/* ── Header Sub-component                                                   */
/* ═══════════════════════════════════════════════════════════════════════════ */

function Header({ onBack, onAdd }: { onBack: () => void; onAdd: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1">
          <ArrowLeft className="w-5 h-5 text-[#012D1D]" />
        </button>
        <span className="font-['Fraunces',serif] text-lg font-semibold text-[#012D1D]">
          CauseHealth.
        </span>
      </div>
      <button
        onClick={onAdd}
        className="flex items-center gap-1.5 bg-[#012D1D] text-white rounded-full px-4 py-2 text-xs font-semibold"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Data
      </button>
    </div>
  );
}
