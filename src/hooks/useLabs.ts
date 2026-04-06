import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useLabStore } from '@/store/labStore';
import { useAuth } from './useAuth';
import type { LabDraw, LabValue } from '@/types/lab.types';

export function useLabs() {
  const { user } = useAuth();
  const { draws, values, setDraws, setValues, addDraw, addValues } = useLabStore();

  useEffect(() => {
    if (!user) return;
    loadDraws();
  }, [user]);

  async function loadDraws() {
    const { data } = await supabase
      .from('lab_draws')
      .select('*')
      .eq('user_id', user!.id)
      .order('draw_date', { ascending: false });
    if (data) setDraws(data as LabDraw[]);
  }

  async function loadValuesForDraw(drawId: string) {
    const { data } = await supabase
      .from('lab_values')
      .select('*')
      .eq('draw_id', drawId);
    if (data) return data as LabValue[];
    return [];
  }

  async function loadAllValues() {
    if (!user) return;
    const { data } = await supabase
      .from('lab_values')
      .select('*')
      .eq('user_id', user.id)
      .order('draw_date', { ascending: true });
    if (data) setValues(data as LabValue[]);
  }

  async function createDraw(draw: Partial<LabDraw>) {
    const { data, error } = await supabase
      .from('lab_draws')
      .insert({ ...draw, user_id: user!.id })
      .select()
      .single();
    if (error) throw error;
    addDraw(data as LabDraw);
    return data as LabDraw;
  }

  async function saveLabValues(drawId: string, labValues: Partial<LabValue>[]) {
    const toInsert = labValues.map(v => ({
      ...v,
      draw_id: drawId,
      user_id: user!.id,
    }));
    const { data, error } = await supabase
      .from('lab_values')
      .insert(toInsert)
      .select();
    if (error) throw error;
    if (data) addValues(data as LabValue[]);
    return data as LabValue[];
  }

  async function getLabTrend(markerName: string): Promise<{ date: string; value: number }[]> {
    if (!user) return [];
    const { data } = await supabase
      .from('lab_values')
      .select('value, draw_date')
      .eq('user_id', user.id)
      .eq('marker_name', markerName)
      .order('draw_date', { ascending: true });
    return (data || []).map(d => ({ date: d.draw_date || '', value: d.value }));
  }

  return {
    draws,
    values,
    loadDraws,
    loadValuesForDraw,
    loadAllValues,
    createDraw,
    saveLabValues,
    getLabTrend,
  };
}
