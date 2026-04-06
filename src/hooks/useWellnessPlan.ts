import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import type { WellnessPlan } from '@/types/wellness.types';

export function useWellnessPlan() {
  const { user } = useAuth();
  const [activePlan, setActivePlan] = useState<WellnessPlan | null>(null);
  const [plans, setPlans] = useState<WellnessPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadPlans();
  }, [user]);

  async function loadPlans() {
    setLoading(true);
    const { data } = await supabase
      .from('wellness_plans')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    if (data) {
      setPlans(data as WellnessPlan[]);
      const active = data.find((p: WellnessPlan) => p.is_active);
      setActivePlan((active as WellnessPlan) || null);
    }
    setLoading(false);
  }

  async function savePlan(plan: Partial<WellnessPlan>) {
    // Deactivate existing plans
    await supabase
      .from('wellness_plans')
      .update({ is_active: false })
      .eq('user_id', user!.id);

    const { data, error } = await supabase
      .from('wellness_plans')
      .insert({ ...plan, user_id: user!.id, is_active: true })
      .select()
      .single();
    if (error) throw error;
    setActivePlan(data as WellnessPlan);
    await loadPlans();
    return data as WellnessPlan;
  }

  return { activePlan, plans, loading, loadPlans, savePlan };
}
