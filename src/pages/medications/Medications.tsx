import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { MEDICATION_DEPLETIONS } from '@/data/medicationDepletions';
import type { Medication } from '@/types/user.types';
import type { MedicationInfo } from '@/types/medication.types';

function lookupMed(name: string): MedicationInfo | null {
  const key = name.toLowerCase().trim();
  if (MEDICATION_DEPLETIONS[key]) return MEDICATION_DEPLETIONS[key];
  for (const info of Object.values(MEDICATION_DEPLETIONS)) {
    if (info.generic_name.toLowerCase() === key) return info;
    if (info.brand_names.some(b => b.toLowerCase() === key)) return info;
  }
  return null;
}

function getRiskBadge(info: MedicationInfo | null) {
  if (!info || info.depletes.length === 0) return null;
  const hasCritical = info.depletes.some(d => d.severity === 'critical');
  const hasHigh = info.depletes.some(d => d.severity === 'high');
  if (hasCritical || hasHigh) return { text: 'High Depletion Risk', bg: 'bg-[#CF6679]/10', color: 'text-[#CF6679]', border: 'border-[#CF6679]/20' };
  return { text: 'Moderate Risk', bg: 'bg-[#C9A84C]/10', color: 'text-[#C9A84C]', border: 'border-[#C9A84C]/20' };
}

export default function Medications() {
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [expandedMed, setExpandedMed] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (user) loadMeds(); }, [user]);

  async function loadMeds() {
    setLoading(true);
    const { data } = await supabase.from('medications').select('*').eq('user_id', user!.id).eq('is_active', true).order('created_at', { ascending: false });
    if (data) setMedications(data as Medication[]);
    setLoading(false);
  }

  async function addMed(name: string) {
    if (!user || !name.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('medications').insert({ user_id: user.id, name: name.trim(), is_active: true });
    if (error) { alert('Failed to save. Try again.'); console.error(error); }
    else { await loadMeds(); setShowAdd(false); setSearchQuery(''); }
    setSaving(false);
  }

  async function removeMed(id: string) {
    await supabase.from('medications').update({ is_active: false }).eq('id', id);
    setMedications(prev => prev.filter(m => m.id !== id));
  }

  const totalDepletions = medications.reduce((sum, m) => {
    const info = lookupMed(m.name);
    return sum + (info?.depletes.filter(d => d.severity === 'critical' || d.severity === 'high').length || 0);
  }, 0);

  const handleNameChange = useCallback((v: string) => setSearchQuery(v), []);

  const suggestions = searchQuery.length >= 2
    ? Object.values(MEDICATION_DEPLETIONS)
        .filter(info => info.generic_name.toLowerCase().includes(searchQuery.toLowerCase()) || info.brand_names.some(b => b.toLowerCase().includes(searchQuery.toLowerCase())))
        .slice(0, 6)
    : [];

  return (
    <div className="space-y-10">
      {/* Header — from stitch26 */}
      <div className="flex justify-between items-end">
        <div>
          <span className="text-[10px] tracking-widest text-[#C9A84C] uppercase mb-2 block font-bold">Pharmaceutical Portfolio</span>
          <h2 className="font-['Newsreader',serif] text-5xl text-[#E2E2E6]">Your Medications</h2>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-[#2D5A56] text-[#E6F0EE] px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg">
          <Plus className="w-4 h-4" />
          <span>Add Med</span>
        </button>
      </div>

      {/* Global Depletion Dashboard — from stitch26 */}
      {totalDepletions > 0 && (
        <div className="p-[1px] bg-[#3F4948]/30 rounded-xl overflow-hidden shadow-sm">
          <button className="w-full flex items-center justify-between p-4 bg-[#1E2226] rounded-lg hover:bg-[#282D33] transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#CF6679]/10 flex items-center justify-center rounded-lg">
                <AlertTriangle className="w-6 h-6 text-[#CF6679]" strokeWidth={1.5} />
              </div>
              <div className="text-left">
                <p className="text-[10px] tracking-widest text-[#CF6679] uppercase font-bold">Action Required</p>
                <p className="font-bold text-lg text-[#E2E2E6]">Global Depletion Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-[#CF6679] text-white px-2.5 py-0.5 rounded-full text-xs font-bold">{totalDepletions} Critical Alerts</span>
              <ChevronRight className="w-5 h-5 text-[#3F4948] group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      )}

      {/* Medication Cards — from stitch26 */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2].map(i => <div key={i} className="bg-[#1E2226] rounded-xl p-6 border border-[rgba(47,56,54,0.4)] animate-pulse h-48" />)}
        </div>
      ) : medications.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-[#1E2226] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#2C3433]/30">
            <Plus className="w-8 h-8 text-[#A0ACAB]" strokeWidth={1.5} />
          </div>
          <h3 className="font-['Newsreader',serif] italic text-2xl text-[#E2E2E6] mb-4">No medications tracked</h3>
          <p className="text-[#A0ACAB] text-sm max-w-sm mx-auto mb-8">Your clinical regimen is currently unpopulated. Begin documenting your interventions to optimize your biological trajectory.</p>
          <button onClick={() => setShowAdd(true)} className="bg-[#1F403D] text-white px-8 py-4 font-bold text-xs uppercase tracking-[0.2em] active:scale-95 transition-all w-full max-w-sm">
            Add Your First Medication
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {medications.map(med => {
            const info = lookupMed(med.name);
            const badge = getRiskBadge(info);
            const isExpanded = expandedMed === med.id;

            return (
              <div key={med.id} className="bg-[#1E2226] rounded-xl border border-[rgba(47,56,54,0.4)] p-6 flex flex-col shadow-lg relative overflow-hidden">
                {/* Flare edge */}
                <div className="absolute top-0 left-0 w-10 h-[1px] bg-gradient-to-r from-[#1F403D] to-transparent" />

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-['Newsreader',serif] text-3xl text-[#E2E2E6]">{med.name}</h3>
                    <p className="text-[#A0ACAB] text-sm font-medium">{info?.generic_name || med.prescribing_condition || 'Medication'}</p>
                  </div>
                  {badge && (
                    <div className={`${badge.bg} ${badge.color} px-2 py-1 rounded text-[9px] font-bold tracking-tighter uppercase border ${badge.border}`}>
                      {badge.text}
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-8">
                  {med.dose && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#3F4948] uppercase text-[10px] tracking-widest font-bold">Dosage</span>
                      <span className="text-[#E2E2E6] font-semibold">{med.dose}</span>
                    </div>
                  )}
                  {med.frequency && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[#3F4948] uppercase text-[10px] tracking-widest font-bold">Schedule</span>
                      <span className="text-[#E2E2E6] font-semibold">{med.frequency}</span>
                    </div>
                  )}
                </div>

                {info && info.depletes.length > 0 ? (
                  <button onClick={() => setExpandedMed(isExpanded ? null : med.id)} className="mt-auto w-full py-3 border border-[#1F403D]/50 text-[#2D5A56] rounded-lg font-bold text-sm tracking-wide hover:bg-[#1F403D]/5 transition-all flex items-center justify-center gap-2">
                    <span>{isExpanded ? 'Hide Depletions' : 'View Depletions'}</span>
                    {isExpanded ? <ChevronDown className="w-4 h-4 rotate-180" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                ) : (
                  <button onClick={() => removeMed(med.id)} className="mt-auto text-[#A0ACAB]/50 text-xs hover:text-[#CF6679] transition-colors">Remove</button>
                )}

                {/* Expanded Depletions */}
                <AnimatePresence>
                  {isExpanded && info && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-6 pt-6 border-t border-[#3F4948]/20">
                      <div className="space-y-4">
                        {info.depletes.map(dep => {
                          const riskColor = dep.severity === 'critical' ? '#CF6679' : dep.severity === 'high' ? '#C9A84C' : '#A0ACAB';
                          const riskLabel = dep.severity === 'critical' ? 'HIGH RISK' : dep.severity === 'high' ? 'MODERATE' : 'LOW RISK';
                          return (
                            <div key={dep.nutrient} className="flex justify-between items-center">
                              <span className="font-bold text-[#E2E2E6] text-sm">{dep.nutrient}</span>
                              <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border" style={{ color: riskColor, borderColor: `${riskColor}33`, backgroundColor: `${riskColor}15` }}>
                                {riskLabel}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <p className="text-[#A0ACAB] text-xs mt-4 leading-relaxed">{info.depletes[0]?.mechanism}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Medication Modal — bottom sheet */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60" onClick={() => setShowAdd(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 28, stiffness: 300 }} onClick={e => e.stopPropagation()} className="w-full max-w-lg bg-[#15181C] rounded-t-xl p-6 pb-12 max-h-[80vh] overflow-y-auto">
              <div className="w-10 h-1 rounded-full bg-[#3F4948]/40 mx-auto mb-5" />
              <h2 className="font-['Newsreader',serif] text-xl text-[#E2E2E6] mb-5">Add Medication</h2>

              <div className="relative mb-4">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A0ACAB]/60" />
                <input
                  type="text"
                  placeholder="Search medication name..."
                  value={searchQuery}
                  onChange={e => handleNameChange(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && searchQuery.trim()) addMed(searchQuery.trim()); }}
                  className="w-full pl-6 bg-transparent border-b border-[#3F4948]/50 text-[#E2E2E6] py-4 text-sm placeholder:text-[#A0ACAB]/40 focus:outline-none focus:border-[#1F403D] transition-colors"
                  autoFocus
                />
              </div>

              {suggestions.length > 0 && (
                <div className="mb-4 space-y-1">
                  {suggestions.map(info => (
                    <button key={info.generic_name} onClick={() => addMed(info.generic_name)} className="w-full text-left px-4 py-3 text-sm text-[#E2E2E6] hover:bg-[#1E2226] transition-colors rounded-lg">
                      {info.generic_name} <span className="text-[#A0ACAB] text-xs ml-2">({info.brand_names.join(', ')})</span>
                    </button>
                  ))}
                </div>
              )}

              <button onClick={() => { if (searchQuery.trim()) addMed(searchQuery.trim()); }} disabled={saving || !searchQuery.trim()} className="w-full bg-[#1F403D] text-white py-4 font-bold text-xs uppercase tracking-[0.2em] active:scale-95 transition-all disabled:opacity-50 mt-4">
                {saving ? 'Saving...' : 'Add Medication'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
