import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import type { Medication } from '@/types/user.types';

export function useMedications() {
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadMedications();
  }, [user]);

  async function loadMedications() {
    setLoading(true);
    const { data } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', user!.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (data) setMedications(data as Medication[]);
    setLoading(false);
  }

  async function addMedication(med: Partial<Medication>) {
    const { data, error } = await supabase
      .from('medications')
      .insert({ ...med, user_id: user!.id })
      .select()
      .single();
    if (error) throw error;
    setMedications(prev => [data as Medication, ...prev]);
    return data as Medication;
  }

  async function removeMedication(id: string) {
    await supabase.from('medications').update({ is_active: false }).eq('id', id);
    setMedications(prev => prev.filter(m => m.id !== id));
  }

  async function updateMedication(id: string, updates: Partial<Medication>) {
    const { data, error } = await supabase
      .from('medications')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    setMedications(prev => prev.map(m => m.id === id ? data as Medication : m));
  }

  return { medications, loading, addMedication, removeMedication, updateMedication, loadMedications };
}
