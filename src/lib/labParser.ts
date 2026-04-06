import * as pdfjsLib from 'pdfjs-dist';
import { extractLabsWithAI } from '@/lib/claude';
import { OPTIMAL_RANGES } from '@/data/optimalRanges';
import type { ExtractedLabValue, LabValue } from '@/types/lab.types';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export async function extractLabValues(pdfFile: File): Promise<ExtractedLabValue[]> {
  try {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const textParts: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ');
      textParts.push(pageText);
    }

    const fullText = textParts.join('\n\n--- PAGE BREAK ---\n\n');

    if (!fullText.trim()) {
      throw new Error('No text could be extracted from the PDF. The file may be image-based or encrypted.');
    }

    const extracted = await extractLabsWithAI(fullText);
    return extracted;
  } catch (error) {
    console.error('extractLabValues error:', error);
    throw new Error(
      error instanceof Error
        ? `PDF extraction failed: ${error.message}`
        : 'Failed to extract lab values from PDF.'
    );
  }
}

function normalizeMarkerKey(name: string): string {
  const normalized = name
    .toLowerCase()
    .replace(/[()]/g, '')
    .replace(/[\s\-\/]+/g, '_')
    .replace(/_+/g, '_')
    .trim();

  // Map common variations to our keys
  const aliases: Record<string, string> = {
    'fasting_glucose': 'glucose_fasting',
    'glucose': 'glucose_fasting',
    'glucose_fasting_plasma': 'glucose_fasting',
    'hemoglobin_a1c': 'hba1c',
    'a1c': 'hba1c',
    'glycated_hemoglobin': 'hba1c',
    'insulin': 'fasting_insulin',
    'insulin_fasting': 'fasting_insulin',
    'total_cholesterol': 'cholesterol_total',
    'cholesterol': 'cholesterol_total',
    'ldl_cholesterol': 'ldl',
    'ldl_c': 'ldl',
    'hdl_cholesterol': 'hdl',
    'hdl_c': 'hdl',
    'trigs': 'triglycerides',
    'alt_sgpt': 'alt',
    'sgpt': 'alt',
    'alanine_aminotransferase': 'alt',
    'ast_sgot': 'ast',
    'sgot': 'ast',
    'aspartate_aminotransferase': 'ast',
    'total_bilirubin': 'bilirubin_total',
    'bilirubin': 'bilirubin_total',
    'alk_phos': 'alkaline_phosphatase',
    'alp': 'alkaline_phosphatase',
    'gamma_gt': 'ggt',
    'gamma_glutamyl_transferase': 'ggt',
    'estimated_gfr': 'egfr',
    'glomerular_filtration_rate': 'egfr',
    'blood_urea_nitrogen': 'bun',
    'thyroid_stimulating_hormone': 'tsh',
    'ft3': 'free_t3',
    'ft4': 'free_t4',
    'vitamin_d_25_oh': 'vitamin_d',
    '25_oh_vitamin_d': 'vitamin_d',
    '25_hydroxy_vitamin_d': 'vitamin_d',
    'vit_d': 'vitamin_d',
    'b12': 'vitamin_b12',
    'cobalamin': 'vitamin_b12',
    'iron_ferritin': 'ferritin',
    'rbc_magnesium': 'magnesium_rbc',
    'magnesium_red_blood_cell': 'magnesium_rbc',
    'omega_3_index': 'omega3_index',
    'total_testosterone': 'testosterone_total',
    'testosterone': 'testosterone_total',
    'free_testosterone': 'testosterone_free',
    'sex_hormone_binding_globulin': 'shbg',
    'dhea_sulfate': 'dhea_s',
    'dhea_so4': 'dhea_s',
    'cortisol_am': 'cortisol_morning',
    'cortisol': 'cortisol_morning',
    'high_sensitivity_crp': 'hs_crp',
    'hs_c_reactive_protein': 'hs_crp',
    'crp': 'hs_crp',
    'c_reactive_protein': 'hs_crp',
    'apolipoprotein_b': 'apob',
    'apo_b': 'apob',
    'white_blood_cell': 'wbc',
    'white_blood_cells': 'wbc',
    'hgb': 'hemoglobin',
    'hct': 'hematocrit',
    'plt': 'platelets',
    'platelet_count': 'platelets',
  };

  return aliases[normalized] ?? normalized;
}

export function matchToOptimalRanges(extracted: ExtractedLabValue[]): LabValue[] {
  return extracted.map((ev) => {
    const key = normalizeMarkerKey(ev.marker_name);
    const optRange = OPTIMAL_RANGES[key];

    let optimal_flag: LabValue['optimal_flag'] = null;
    let optimal_low: number | null = null;
    let optimal_high: number | null = null;

    if (optRange) {
      optimal_low = optRange.optimal.low;
      optimal_high = optRange.optimal.high;

      if (optimal_low !== null && optimal_high !== null) {
        if (ev.value >= optimal_low && ev.value <= optimal_high) {
          optimal_flag = 'optimal';
        } else if (ev.value < optimal_low) {
          const stdLow = optRange.standard.low;
          optimal_flag = stdLow !== null && ev.value < stdLow ? 'deficient' : 'suboptimal_low';
        } else {
          const stdHigh = optRange.standard.high;
          optimal_flag = stdHigh !== null && ev.value > stdHigh ? 'elevated' : 'suboptimal_high';
        }
      } else if (optimal_high !== null) {
        // Only upper bound (e.g., HbA1c, fasting insulin)
        if (ev.value <= optimal_high) {
          optimal_flag = 'optimal';
        } else {
          const stdHigh = optRange.standard.high;
          optimal_flag = stdHigh !== null && ev.value > stdHigh ? 'elevated' : 'suboptimal_high';
        }
      } else if (optimal_low !== null) {
        // Only lower bound (e.g., HDL, eGFR)
        if (ev.value >= optimal_low) {
          optimal_flag = 'optimal';
        } else {
          const stdLow = optRange.standard.low;
          optimal_flag = stdLow !== null && ev.value < stdLow ? 'deficient' : 'suboptimal_low';
        }
      }
    }

    return {
      id: crypto.randomUUID(),
      draw_id: '',
      user_id: '',
      created_at: new Date().toISOString(),
      marker_name: optRange?.name ?? ev.marker_name,
      marker_category: optRange?.category ?? ev.category ?? null,
      value: ev.value,
      unit: optRange?.unit ?? ev.unit ?? null,
      standard_low: ev.standard_low ?? optRange?.standard.low ?? null,
      standard_high: ev.standard_high ?? optRange?.standard.high ?? null,
      optimal_low,
      optimal_high,
      standard_flag: (ev.flag as LabValue['standard_flag']) ?? null,
      optimal_flag,
      draw_date: ev.draw_date ?? null,
    };
  });
}
