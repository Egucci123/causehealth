import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import type { Symptom } from '@/types/user.types';

export function useSymptoms() {
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadSymptoms();
  }, [user]);

  async function loadSymptoms() {
    setLoading(true);
    const { data } = await supabase
      .from('symptoms')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    if (data) setSymptoms(data as Symptom[]);
    setLoading(false);
  }

  async function addSymptom(symptom: Partial<Symptom>) {
    const { data, error } = await supabase
      .from('symptoms')
      .insert({ ...symptom, user_id: user!.id })
      .select()
      .single();
    if (error) throw error;
    setSymptoms(prev => [data as Symptom, ...prev]);
    return data as Symptom;
  }

  async function removeSymptom(id: string) {
    await supabase.from('symptoms').delete().eq('id', id);
    setSymptoms(prev => prev.filter(s => s.id !== id));
  }

  async function updateSymptom(id: string, updates: Partial<Symptom>) {
    const { data, error } = await supabase
      .from('symptoms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    setSymptoms(prev => prev.map(s => s.id === id ? data as Symptom : s));
  }

  return { symptoms, loading, addSymptom, removeSymptom, updateSymptom, loadSymptoms };
}
