import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Activity,
  Moon,
  Smile,
  StickyNote,
  Save,
  TrendingUp,
  CheckSquare,
  Target,
  Calendar,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/Progress';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useUIStore } from '@/store/uiStore';
import type { ProgressEntry } from '@/types/user.types';
import type { Milestones } from '@/types/wellness.types';

function SliderInput({
  label,
  icon: Icon,
  value,
  onChange,
  color,
}: {
  label: string;
  icon: React.ElementType;
  value: number;
  onChange: (value: number) => void;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          <Icon className="w-4 h-4" />
          {label}
        </label>
        <span className={`text-lg font-display font-bold ${color}`}>{value}</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700 accent-teal-500"
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1">
        <span>Poor</span>
        <span>Excellent</span>
      </div>
    </div>
  );
}

function ComplianceGrid({ data }: { data: Record<string, unknown>[] }) {
  // Show last 12 weeks (84 days) in a GitHub-contribution-style grid
  const weeks = 12;
  const daysPerWeek = 7;
  const totalDays = weeks * daysPerWeek;

  const today = new Date();
  const grid: { date: string; compliant: boolean | null }[] = [];

  for (let i = totalDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayData = data.find(
      (entry) => Object.keys(entry).length > 0 && (entry as Record<string, unknown>)['_date'] === dateStr
    );
    grid.push({
      date: dateStr,
      compliant: dayData
        ? Object.entries(dayData)
            .filter(([k]) => k !== '_date')
            .every(([, v]) => v === true)
        : null,
    });
  }

  const weekGroups: typeof grid[] = [];
  for (let i = 0; i < grid.length; i += daysPerWeek) {
    weekGroups.push(grid.slice(i, i + daysPerWeek));
  }

  return (
    <div className="flex gap-1 overflow-x-auto pb-2">
      {weekGroups.map((week, wi) => (
        <div key={wi} className="flex flex-col gap-1">
          {week.map((day) => (
            <div
              key={day.date}
              title={`${day.date}: ${day.compliant === null ? 'No data' : day.compliant ? 'Compliant' : 'Missed'}`}
              className={`w-3.5 h-3.5 rounded-sm ${
                day.compliant === null
                  ? 'bg-slate-100 dark:bg-slate-800'
                  : day.compliant
                    ? 'bg-emerald-400 dark:bg-emerald-500'
                    : 'bg-slate-300 dark:bg-slate-600'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default function ProgressPage() {
  const { user } = useAuth();
  const { addToast } = useUIStore();
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [milestones, setMilestones] = useState<Milestones | null>(null);
  const [milestoneChecks, setMilestoneChecks] = useState<Record<string, boolean>>({});
  const [complianceData, setComplianceData] = useState<Record<string, unknown>[]>([]);

  // Daily check-in form
  const [energy, setEnergy] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [mood, setMood] = useState(5);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');

  const loadData = useCallback(async () => {
    if (!user) return;

    try {
      const [entriesRes, planRes, complianceRes] = await Promise.all([
        supabase
          .from('progress_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('entry_date', { ascending: true })
          .limit(90),
        supabase
          .from('wellness_plans')
          .select('milestones')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .single(),
        supabase
          .from('supplement_compliance')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: true })
          .limit(84),
      ]);

      if (entriesRes.data) {
        setEntries(entriesRes.data as ProgressEntry[]);

        // Pre-fill today's entry if it exists
        const today = new Date().toISOString().split('T')[0];
        const todayEntry = entriesRes.data.find(
          (e: ProgressEntry) => e.entry_date === today
        );
        if (todayEntry) {
          setEnergy(todayEntry.energy_level ?? 5);
          setSleepQuality(todayEntry.sleep_quality ?? 5);
          setMood(todayEntry.mood ?? 5);
          setWeight(todayEntry.weight_kg?.toString() ?? '');
          setNotes(todayEntry.notes ?? '');
        }
      }

      if (planRes.data?.milestones) {
        setMilestones(planRes.data.milestones as Milestones);
      }

      if (complianceRes.data) {
        setComplianceData(
          complianceRes.data.map((row: Record<string, unknown>) => ({
            _date: row.date,
            ...(row.supplements as Record<string, boolean> || {}),
          }))
        );
      }
    } catch {
      // Data might not exist yet
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveCheckin = async () => {
    if (!user) return;
    setSaving(true);

    const today = new Date().toISOString().split('T')[0];
    const entryData = {
      user_id: user.id,
      entry_date: today,
      energy_level: energy,
      sleep_quality: sleepQuality,
      mood,
      weight_kg: weight ? parseFloat(weight) : null,
      notes: notes || null,
      symptom_scores: {},
      supplement_compliance: {},
    };

    try {
      // Upsert - update if today's entry exists, insert if not
      const existing = entries.find((e) => e.entry_date === today);
      if (existing) {
        const { error } = await supabase
          .from('progress_entries')
          .update(entryData)
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('progress_entries')
          .insert(entryData);
        if (error) throw error;
      }

      addToast({ type: 'success', title: 'Daily check-in saved!' });
      await loadData();
    } catch (err) {
      addToast({ type: 'error', title: 'Failed to save', message: String(err) });
    } finally {
      setSaving(false);
    }
  };

  const chartData = useMemo(() => {
    return entries.slice(-30).map((e) => ({
      date: new Date(e.entry_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      energy: e.energy_level,
      sleep: e.sleep_quality,
      mood: e.mood,
    }));
  }, [entries]);

  const toggleMilestone = (key: string) => {
    setMilestoneChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl mt-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader title="Progress Tracking" />

      <div className="space-y-6">
        {/* Daily Check-In */}
        <Card>
          <h2 className="text-base font-semibold text-slate-warm dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-teal-500" />
            Daily Check-In
          </h2>
          <div className="space-y-5">
            <SliderInput
              label="Energy Level"
              icon={Activity}
              value={energy}
              onChange={setEnergy}
              color="text-amber-500"
            />
            <SliderInput
              label="Sleep Quality"
              icon={Moon}
              value={sleepQuality}
              onChange={setSleepQuality}
              color="text-indigo-500"
            />
            <SliderInput
              label="Mood"
              icon={Smile}
              value={mood}
              onChange={setMood}
              color="text-emerald-500"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Weight (optional)"
                type="number"
                step="0.1"
                placeholder="kg"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                <StickyNote className="w-4 h-4" />
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="How are you feeling today? Any symptoms, side effects, or observations..."
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-sm bg-white dark:bg-slate-800 text-slate-warm dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 resize-none"
              />
            </div>

            <Button onClick={handleSaveCheckin} loading={saving}>
              <Save className="w-4 h-4" />
              Save Check-In
            </Button>
          </div>
        </Card>

        {/* Weekly Trends */}
        {chartData.length > 1 && (
          <Card>
            <h2 className="text-base font-semibold text-slate-warm dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-500" />
              Trends (Last 30 Days)
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={[0, 10]}
                    tick={{ fontSize: 12, fill: '#94a3b8' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.75rem',
                      fontSize: '0.75rem',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="energy"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={false}
                    name="Energy"
                  />
                  <Line
                    type="monotone"
                    dataKey="sleep"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={false}
                    name="Sleep"
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    name="Mood"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-6 mt-4 justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-amber-500 rounded" />
                <span className="text-xs text-slate-500">Energy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-indigo-500 rounded" />
                <span className="text-xs text-slate-500">Sleep</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-emerald-500 rounded" />
                <span className="text-xs text-slate-500">Mood</span>
              </div>
            </div>
          </Card>
        )}

        {/* Supplement Compliance */}
        <Card>
          <h2 className="text-base font-semibold text-slate-warm dark:text-white mb-4 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-teal-500" />
            Supplement Compliance
          </h2>
          {complianceData.length > 0 ? (
            <>
              <div className="mb-3">
                <ComplianceGrid data={complianceData} />
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-emerald-400" />
                  Taken
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-slate-300 dark:bg-slate-600" />
                  Missed
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-sm bg-slate-100 dark:bg-slate-800" />
                  No data
                </div>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
              Start logging your supplement compliance to see your adherence calendar.
            </p>
          )}
        </Card>

        {/* Milestone Tracker */}
        {milestones && (
          <Card>
            <h2 className="text-base font-semibold text-slate-warm dark:text-white mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-teal-500" />
              Milestone Tracker
            </h2>
            <div className="space-y-6">
              {[
                { label: '30-Day Goals', items: milestones.day_30, prefix: '30', color: 'secondary' as const },
                { label: '60-Day Goals', items: milestones.day_60, prefix: '60', color: 'success' as const },
                { label: '90-Day Goals', items: milestones.day_90, prefix: '90', color: 'warning' as const },
              ].map(({ label, items, prefix, color }) => {
                const checked = items.filter((_, i) => milestoneChecks[`${prefix}-${i}`]).length;
                const total = items.length;

                return (
                  <div key={prefix}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-slate-warm dark:text-white">{label}</h4>
                      <Badge variant={checked === total ? 'success' : 'default'}>
                        {checked}/{total}
                      </Badge>
                    </div>
                    <ProgressBar value={checked} max={total} color={color} size="sm" className="mb-3" />
                    <div className="space-y-2">
                      {items.map((item, i) => {
                        const key = `${prefix}-${i}`;
                        return (
                          <label
                            key={key}
                            className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={milestoneChecks[key] || false}
                              onChange={() => toggleMilestone(key)}
                              className="mt-0.5 rounded border-slate-300 text-teal-500 focus:ring-teal-400"
                            />
                            <span
                              className={`text-sm ${
                                milestoneChecks[key]
                                  ? 'line-through text-slate-400'
                                  : 'text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              {item}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
