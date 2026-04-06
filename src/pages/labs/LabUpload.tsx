import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, Loader2, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useLabStore } from '@/store/labStore';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { extractLabValues, matchToOptimalRanges } from '@/lib/labParser';
import type { ExtractedLabValue, LabValue } from '@/types/lab.types';

interface EditableValue extends ExtractedLabValue {
  _id: string;
}

const PROCESSING_STEPS = [
  { key: 'uploading', label: 'Uploading file' },
  { key: 'parsing', label: 'Extracting text from PDF' },
  { key: 'analyzing', label: 'AI analyzing lab values' },
  { key: 'matching', label: 'Matching to optimal ranges' },
] as const;

export default function LabUpload() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setProcessingStatus, addDraw, addValues } = useLabStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [extractedValues, setExtractedValues] = useState<EditableValue[]>([]);
  const [, setMatchedValues] = useState<LabValue[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [drawDate, setDrawDate] = useState(new Date().toISOString().split('T')[0]);
  const [labName, setLabName] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    marker_name: '',
    value: '',
    unit: '',
    standard_low: '',
    standard_high: '',
  });

  const processFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF file.');
      return;
    }

    setError(null);
    setExtractedValues([]);
    setMatchedValues([]);

    try {
      // Step 1: Uploading
      setCurrentStep(0);
      setProcessingStatus('uploading');
      await new Promise((r) => setTimeout(r, 400));

      // Step 2: Parsing PDF
      setCurrentStep(1);
      setProcessingStatus('parsing');

      const extracted = await extractLabValues(file);

      // Step 3: AI Analysis
      setCurrentStep(2);
      setProcessingStatus('analyzing');
      await new Promise((r) => setTimeout(r, 300));

      // Step 4: Matching ranges
      setCurrentStep(3);

      const editable: EditableValue[] = extracted.map((ev) => ({
        ...ev,
        _id: crypto.randomUUID(),
      }));
      setExtractedValues(editable);

      const matched = matchToOptimalRanges(extracted);
      setMatchedValues(matched);

      setCurrentStep(4);
      setProcessingStatus('complete');

      if (extracted[0]?.draw_date) {
        setDrawDate(extracted[0].draw_date);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process PDF.');
      setCurrentStep(-1);
      setProcessingStatus('error');
    }
  }, [setProcessingStatus]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const updateExtractedValue = (id: string, field: keyof ExtractedLabValue, value: string | number) => {
    setExtractedValues((prev) =>
      prev.map((ev) => (ev._id === id ? { ...ev, [field]: value } : ev))
    );
  };

  const removeExtractedValue = (id: string) => {
    setExtractedValues((prev) => prev.filter((ev) => ev._id !== id));
  };

  const addManualValue = () => {
    if (!manualEntry.marker_name || !manualEntry.value) return;

    const newValue: EditableValue = {
      _id: crypto.randomUUID(),
      marker_name: manualEntry.marker_name,
      value: parseFloat(manualEntry.value),
      unit: manualEntry.unit,
      standard_low: manualEntry.standard_low ? parseFloat(manualEntry.standard_low) : null,
      standard_high: manualEntry.standard_high ? parseFloat(manualEntry.standard_high) : null,
      flag: 'normal',
      category: 'other',
      draw_date: drawDate,
    };

    setExtractedValues((prev) => [...prev, newValue]);
    setManualEntry({ marker_name: '', value: '', unit: '', standard_low: '', standard_high: '' });
  };

  const handleSave = async () => {
    if (!user || extractedValues.length === 0) return;

    setSaving(true);
    setError(null);

    try {
      // Re-match with any edits the user made
      const finalExtracted: ExtractedLabValue[] = extractedValues.map(({ _id, ...ev }) => ev);
      const finalMatched = matchToOptimalRanges(finalExtracted);

      // Create lab_draw
      const { data: draw, error: drawError } = await supabase
        .from('lab_draws')
        .insert({
          user_id: user.id,
          draw_date: drawDate,
          lab_name: labName || null,
          processing_status: 'complete',
        })
        .select()
        .single();

      if (drawError || !draw) throw new Error(drawError?.message ?? 'Failed to create lab draw.');

      // Create lab_values
      const valuesToInsert = finalMatched.map((lv) => ({
        draw_id: draw.id,
        user_id: user.id,
        marker_name: lv.marker_name,
        marker_category: lv.marker_category,
        value: lv.value,
        unit: lv.unit,
        standard_low: lv.standard_low,
        standard_high: lv.standard_high,
        optimal_low: lv.optimal_low,
        optimal_high: lv.optimal_high,
        standard_flag: lv.standard_flag,
        optimal_flag: lv.optimal_flag,
        draw_date: drawDate,
      }));

      const { data: insertedValues, error: valuesError } = await supabase
        .from('lab_values')
        .insert(valuesToInsert)
        .select();

      if (valuesError) throw new Error(valuesError.message);

      addDraw(draw);
      if (insertedValues) addValues(insertedValues);

      navigate(`/app/labs/${draw.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save lab results.');
    } finally {
      setSaving(false);
    }
  };

  const isProcessing = currentStep >= 0 && currentStep < 4;
  const showReview = extractedValues.length > 0 && !isProcessing;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upload Lab Results"
        description="Upload a PDF of your lab report or enter values manually"
      />

      {/* Drag & Drop Zone */}
      {!showReview && !isProcessing && (
        <Card padding="none">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-4 p-12 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
              dragOver
                ? 'border-teal-400 bg-teal-50 dark:bg-teal-900/10'
                : 'border-slate-200 dark:border-slate-600 hover:border-teal-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center">
              <Upload className="w-8 h-8 text-teal-500" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-slate-warm dark:text-white">
                Drop your lab report here
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                or click to browse. Accepts PDF files.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </Card>
      )}

      {/* Processing Animation */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <div className="flex flex-col items-center gap-6 py-4">
                <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
                <p className="text-lg font-medium text-slate-warm dark:text-white">
                  Processing your lab report...
                </p>
                <div className="w-full max-w-md space-y-3">
                  {PROCESSING_STEPS.map((step, i) => (
                    <div key={step.key} className="flex items-center gap-3">
                      {i < currentStep ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                      ) : i === currentStep ? (
                        <Loader2 className="w-5 h-5 text-teal-500 animate-spin flex-shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200 dark:border-slate-600 flex-shrink-0" />
                      )}
                      <span
                        className={`text-sm ${
                          i <= currentStep
                            ? 'text-slate-warm dark:text-white'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      {error && (
        <Card>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-rose-600 dark:text-rose-400">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2"
                onClick={() => {
                  setError(null);
                  setCurrentStep(-1);
                }}
              >
                Try again
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Review Table */}
      {showReview && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <h2 className="text-lg font-semibold font-display text-slate-warm dark:text-white mb-4">
              Review Extracted Values
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Verify the extracted values below. You can edit any incorrect values before saving.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Input
                label="Draw Date"
                type="date"
                value={drawDate}
                onChange={(e) => setDrawDate(e.target.value)}
              />
              <Input
                label="Lab Name (optional)"
                placeholder="e.g., Quest Diagnostics"
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700">
                    <th className="text-left py-2 px-3 font-medium text-slate-500">Marker</th>
                    <th className="text-left py-2 px-3 font-medium text-slate-500">Value</th>
                    <th className="text-left py-2 px-3 font-medium text-slate-500">Unit</th>
                    <th className="text-left py-2 px-3 font-medium text-slate-500">Std Low</th>
                    <th className="text-left py-2 px-3 font-medium text-slate-500">Std High</th>
                    <th className="text-left py-2 px-3 font-medium text-slate-500">Category</th>
                    <th className="py-2 px-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {extractedValues.map((ev) => (
                    <tr
                      key={ev._id}
                      className="border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <td className="py-2 px-3">
                        <input
                          className="w-full bg-transparent text-slate-warm dark:text-white text-sm border-b border-transparent hover:border-slate-300 focus:border-teal-400 focus:outline-none py-1"
                          value={ev.marker_name}
                          onChange={(e) => updateExtractedValue(ev._id, 'marker_name', e.target.value)}
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          step="any"
                          className="w-20 bg-transparent text-slate-warm dark:text-white text-sm border-b border-transparent hover:border-slate-300 focus:border-teal-400 focus:outline-none py-1"
                          value={ev.value}
                          onChange={(e) => updateExtractedValue(ev._id, 'value', parseFloat(e.target.value) || 0)}
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          className="w-20 bg-transparent text-slate-warm dark:text-white text-sm border-b border-transparent hover:border-slate-300 focus:border-teal-400 focus:outline-none py-1"
                          value={ev.unit}
                          onChange={(e) => updateExtractedValue(ev._id, 'unit', e.target.value)}
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          step="any"
                          className="w-16 bg-transparent text-slate-warm dark:text-white text-sm border-b border-transparent hover:border-slate-300 focus:border-teal-400 focus:outline-none py-1"
                          value={ev.standard_low ?? ''}
                          onChange={(e) =>
                            updateExtractedValue(ev._id, 'standard_low', e.target.value ? parseFloat(e.target.value) : '')
                          }
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          step="any"
                          className="w-16 bg-transparent text-slate-warm dark:text-white text-sm border-b border-transparent hover:border-slate-300 focus:border-teal-400 focus:outline-none py-1"
                          value={ev.standard_high ?? ''}
                          onChange={(e) =>
                            updateExtractedValue(ev._id, 'standard_high', e.target.value ? parseFloat(e.target.value) : '')
                          }
                        />
                      </td>
                      <td className="py-2 px-3">
                        <Badge>{ev.category}</Badge>
                      </td>
                      <td className="py-2 px-3">
                        <button
                          onClick={() => removeExtractedValue(ev._id)}
                          className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* OR Divider */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative px-4 bg-bg-main dark:bg-bg-dark-main">
              <span className="text-sm text-slate-400">OR</span>
            </div>
          </div>

          {/* Manual Entry */}
          <Card>
            <button
              onClick={() => setShowManual(!showManual)}
              className="flex items-center gap-2 text-sm font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add values manually
            </button>

            <AnimatePresence>
              {showManual && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
                    <Input
                      label="Marker Name"
                      placeholder="e.g., Vitamin D"
                      value={manualEntry.marker_name}
                      onChange={(e) => setManualEntry((p) => ({ ...p, marker_name: e.target.value }))}
                    />
                    <Input
                      label="Value"
                      type="number"
                      step="any"
                      placeholder="e.g., 32"
                      value={manualEntry.value}
                      onChange={(e) => setManualEntry((p) => ({ ...p, value: e.target.value }))}
                    />
                    <Input
                      label="Unit"
                      placeholder="e.g., ng/mL"
                      value={manualEntry.unit}
                      onChange={(e) => setManualEntry((p) => ({ ...p, unit: e.target.value }))}
                    />
                    <Input
                      label="Std Low"
                      type="number"
                      step="any"
                      value={manualEntry.standard_low}
                      onChange={(e) => setManualEntry((p) => ({ ...p, standard_low: e.target.value }))}
                    />
                    <Input
                      label="Std High"
                      type="number"
                      step="any"
                      value={manualEntry.standard_high}
                      onChange={(e) => setManualEntry((p) => ({ ...p, standard_high: e.target.value }))}
                    />
                  </div>
                  <Button size="sm" className="mt-3" onClick={addManualValue}>
                    <Plus className="w-4 h-4" />
                    Add Marker
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => navigate('/app/labs')}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving} disabled={extractedValues.length === 0}>
              <FileText className="w-4 h-4" />
              Save Lab Results ({extractedValues.length} markers)
            </Button>
          </div>
        </motion.div>
      )}

      {/* Initial manual entry (no PDF uploaded) */}
      {!showReview && !isProcessing && (
        <>
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative px-4 bg-bg-main dark:bg-bg-dark-main">
              <span className="text-sm text-slate-400">OR</span>
            </div>
          </div>

          <Card>
            <h2 className="text-lg font-semibold font-display text-slate-warm dark:text-white mb-4">
              Enter Values Manually
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Input
                label="Draw Date"
                type="date"
                value={drawDate}
                onChange={(e) => setDrawDate(e.target.value)}
              />
              <Input
                label="Lab Name (optional)"
                placeholder="e.g., Quest Diagnostics"
                value={labName}
                onChange={(e) => setLabName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-3">
              <Input
                label="Marker Name"
                placeholder="e.g., Vitamin D"
                value={manualEntry.marker_name}
                onChange={(e) => setManualEntry((p) => ({ ...p, marker_name: e.target.value }))}
              />
              <Input
                label="Value"
                type="number"
                step="any"
                placeholder="e.g., 32"
                value={manualEntry.value}
                onChange={(e) => setManualEntry((p) => ({ ...p, value: e.target.value }))}
              />
              <Input
                label="Unit"
                placeholder="e.g., ng/mL"
                value={manualEntry.unit}
                onChange={(e) => setManualEntry((p) => ({ ...p, unit: e.target.value }))}
              />
              <Input
                label="Std Low"
                type="number"
                step="any"
                value={manualEntry.standard_low}
                onChange={(e) => setManualEntry((p) => ({ ...p, standard_low: e.target.value }))}
              />
              <Input
                label="Std High"
                type="number"
                step="any"
                value={manualEntry.standard_high}
                onChange={(e) => setManualEntry((p) => ({ ...p, standard_high: e.target.value }))}
              />
            </div>

            <Button size="sm" onClick={addManualValue} disabled={!manualEntry.marker_name || !manualEntry.value}>
              <Plus className="w-4 h-4" />
              Add Marker
            </Button>

            {extractedValues.length > 0 && (
              <div className="mt-4 space-y-2">
                {extractedValues.map((ev) => (
                  <div
                    key={ev._id}
                    className="flex items-center justify-between py-2 px-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <span className="text-sm text-slate-warm dark:text-white">
                      {ev.marker_name}: {ev.value} {ev.unit}
                    </span>
                    <button
                      onClick={() => removeExtractedValue(ev._id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSave} loading={saving}>
                    <FileText className="w-4 h-4" />
                    Save Lab Results ({extractedValues.length} markers)
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
