import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, FlaskConical, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { useLabStore } from '@/store/labStore';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { LabDraw, LabValue } from '@/types/lab.types';

const CATEGORY_TABS = [
  { id: 'all', label: 'All' },
  { id: 'metabolic', label: 'Metabolic' },
  { id: 'cardiovascular', label: 'Cardiovascular' },
  { id: 'thyroid', label: 'Thyroid' },
  { id: 'liver', label: 'Liver' },
  { id: 'kidney', label: 'Kidney' },
  { id: 'nutrients', label: 'Nutrients' },
  { id: 'hormones', label: 'Hormones' },
  { id: 'inflammation', label: 'Inflammation' },
  { id: 'cbc', label: 'CBC' },
];

interface DrawWithSummary extends LabDraw {
  markerCount: number;
  criticalCount: number;
  monitorCount: number;
  optimalCount: number;
  categories: string[];
}

export default function LabsHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setDraws, setValues } = useLabStore();
  const [loading, setLoading] = useState(true);
  const [drawSummaries, setDrawSummaries] = useState<DrawWithSummary[]>([]);

  useEffect(() => {
    if (!user) return;
    loadLabData();
  }, [user]);

  async function loadLabData() {
    try {
      const [drawsRes, valuesRes] = await Promise.all([
        supabase
          .from('lab_draws')
          .select('*')
          .eq('user_id', user!.id)
          .order('draw_date', { ascending: false }),
        supabase
          .from('lab_values')
          .select('*')
          .eq('user_id', user!.id),
      ]);

      const loadedDraws: LabDraw[] = drawsRes.data ?? [];
      const loadedValues: LabValue[] = valuesRes.data ?? [];

      setDraws(loadedDraws);
      setValues(loadedValues);

      const summaries: DrawWithSummary[] = loadedDraws.map((draw) => {
        const drawValues = loadedValues.filter((v) => v.draw_id === draw.id);
        const categories = [...new Set(drawValues.map((v) => v.marker_category).filter(Boolean))] as string[];

        let criticalCount = 0;
        let monitorCount = 0;
        let optimalCount = 0;

        for (const v of drawValues) {
          if (
            v.optimal_flag === 'deficient' ||
            v.optimal_flag === 'elevated' ||
            v.standard_flag === 'critical_low' ||
            v.standard_flag === 'critical_high'
          ) {
            criticalCount++;
          } else if (
            v.optimal_flag === 'suboptimal_low' ||
            v.optimal_flag === 'suboptimal_high'
          ) {
            monitorCount++;
          } else if (v.optimal_flag === 'optimal') {
            optimalCount++;
          }
        }

        return {
          ...draw,
          markerCount: drawValues.length,
          criticalCount,
          monitorCount,
          optimalCount,
          categories,
        };
      });

      setDrawSummaries(summaries);
    } catch (err) {
      console.error('Failed to load lab data:', err);
    } finally {
      setLoading(false);
    }
  }

  const filterDrawsByCategory = (draws: DrawWithSummary[], category: string) => {
    if (category === 'all') return draws;
    return draws.filter((d) => d.categories.includes(category));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Lab Results" />
        <div className="grid gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lab Results"
        description="Track and analyze your lab work over time"
        action={
          <Button onClick={() => navigate('/app/labs/upload')}>
            <Upload className="w-4 h-4" />
            Upload Labs
          </Button>
        }
      />

      {drawSummaries.length === 0 ? (
        /* Empty State */
        <Card>
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
              <FlaskConical className="w-8 h-8 text-teal-500" />
            </div>
            <h2 className="text-lg font-semibold font-display text-slate-warm dark:text-white">
              No lab results yet
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-md">
              Upload your first lab report to get started. Our AI will analyze your results using
              optimal ranges and identify patterns your doctor may have missed.
            </p>
            <Button onClick={() => navigate('/app/labs/upload')} className="mt-2">
              <Upload className="w-4 h-4" />
              Upload Your First Lab Report
            </Button>
          </div>
        </Card>
      ) : (
        <Tabs tabs={CATEGORY_TABS} defaultTab="all">
          {(activeTab) => {
            const filtered = filterDrawsByCategory(drawSummaries, activeTab);

            if (filtered.length === 0) {
              return (
                <p className="text-sm text-slate-500 dark:text-slate-400 py-8 text-center">
                  No lab draws with {activeTab} markers found.
                </p>
              );
            }

            return (
              <div className="space-y-4">
                {filtered.map((draw, index) => (
                  <motion.div
                    key={draw.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      hover
                      onClick={() => navigate(`/app/labs/${draw.id}`)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center flex-shrink-0">
                            <FlaskConical className="w-5 h-5 text-teal-500" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-slate-warm dark:text-white">
                                {draw.lab_name || 'Lab Results'}
                              </h3>
                              <Badge>{draw.markerCount} markers</Badge>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-500 dark:text-slate-400">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(draw.draw_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {draw.criticalCount > 0 && (
                            <Badge variant="critical">
                              {draw.criticalCount} critical
                            </Badge>
                          )}
                          {draw.monitorCount > 0 && (
                            <Badge variant="warning">
                              {draw.monitorCount} monitor
                            </Badge>
                          )}
                          {draw.optimalCount > 0 && (
                            <Badge variant="success">
                              {draw.optimalCount} optimal
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            );
          }}
        </Tabs>
      )}
    </div>
  );
}
