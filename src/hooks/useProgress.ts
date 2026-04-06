import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import type { ProgressEntry } from '@/types/user.types';

export function useProgress() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadEntries();
  }, [user]);

  async function loadEntries() {
    setLoading(true);
    const { data } = await supabase
      .from('progress_entries')
      .select('*')
      .eq('user_id', user!.id)
      .order('entry_date', { ascending: false })
      .limit(90);
    if (data) setEntries(data as ProgressEntry[]);
    setLoading(false);
  }

  async function addEntry(entry: Partial<ProgressEntry>) {
    const { data, error } = await supabase
      .from('progress_entries')
      .insert({ ...entry, user_id: user!.id })
      .select()
      .single();
    if (error) throw error;
    setEntries(prev => [data as ProgressEntry, ...prev]);
    return data as ProgressEntry;
  }

  return { entries, loading, addEntry, loadEntries };
}
