import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import type { Profile, HealthProfile } from '@/types/user.types';

export function useAuth() {
  const { user, session, profile, healthProfile, loading, setUser, setSession, setProfile, setHealthProfile, setLoading, reset } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        reset();
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId: string) {
    try {
      const [profileRes, healthRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('health_profiles').select('*').eq('user_id', userId).single(),
      ]);

      if (profileRes.data) setProfile(profileRes.data as Profile);
      if (healthRes.data) setHealthProfile(healthRes.data as HealthProfile);
    } catch (err) {
      // Profile might not exist yet (e.g. during onboarding)
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email: string, password: string, firstName: string, lastName: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        first_name: firstName,
        last_name: lastName,
      });
      if (profileError) {
        console.error('Failed to create profile:', profileError);
        throw profileError;
      }
    }
    return data;
  }

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    await supabase.auth.signOut();
    reset();
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  }

  async function updateProfile(updates: Partial<Profile>) {
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();
    if (error) throw error;
    setProfile(data as Profile);
    return data;
  }

  async function updateHealthProfile(updates: Partial<HealthProfile>) {
    if (!user) throw new Error('Not authenticated');

    const existing = await supabase.from('health_profiles').select('id').eq('user_id', user.id).single();

    let result;
    if (existing.data) {
      result = await supabase
        .from('health_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from('health_profiles')
        .insert({ ...updates, user_id: user.id })
        .select()
        .single();
    }

    if (result.error) throw result.error;
    setHealthProfile(result.data as HealthProfile);
    return result.data;
  }

  return {
    user,
    session,
    profile,
    healthProfile,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    updateHealthProfile,
  };
}
