import jsPDF from 'jspdf';
import type { DoctorPrepDocument } from '@/types/wellness.types';
import { STANDARD_DISCLAIMER } from './safety';

export function generateDoctorPrepPDF(doc: DoctorPrepDocument): jsPDF {
  const pdf = new jsPDF();
  let y = 20;
  const margin = 20;
  const pageWidth = pdf.internal.pageSize.width - 2 * margin;

  // Header
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('CauseHealth — Doctor Visit Preparation', margin, y);
  y += 10;

  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Prepared: ${new Date().toLocaleDateString()}`, margin, y);
  if (doc.appointment_date) {
    pdf.text(`Appointment: ${doc.appointment_date}`, margin + 80, y);
  }
  if (doc.provider_name) {
    pdf.text(`Provider: ${doc.provider_name}`, margin + 160, y);
  }
  y += 12;

  // Line
  pdf.setDrawColor(13, 92, 99);
  pdf.setLineWidth(0.5);
  pdf.line(margin, y, margin + pageWidth, y);
  y += 10;

  // Patient Summary
  if (doc.patient_summary) {
    y = addSection(pdf, 'Patient Clinical Summary', y, margin, pageWidth);
    y = addWrappedText(pdf, doc.patient_summary, y, margin, pageWidth);
    y += 8;
  }

  // Test Requests
  if (doc.test_requests && doc.test_requests.length > 0) {
    y = addSection(pdf, 'Test Requests', y, margin, pageWidth);
    for (const test of doc.test_requests) {
      y = checkPageBreak(pdf, y, 40);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${test.test_name}`, margin + 4, y);
      y += 5;

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      if (test.icd10_codes) {
        const codes = test.icd10_codes.map(c => `${c.code} - ${c.description}`).join('; ');
        y = addWrappedText(pdf, `ICD-10: ${codes}`, y, margin + 4, pageWidth - 8);
      }
      if (test.medical_necessity) {
        y = addWrappedText(pdf, `Medical Necessity: ${test.medical_necessity}`, y, margin + 4, pageWidth - 8);
      }
      y += 4;
    }
    y += 4;
  }

  // Medication Discussion
  if (doc.medication_discussion_points && doc.medication_discussion_points.length > 0) {
    y = checkPageBreak(pdf, y, 30);
    y = addSection(pdf, 'Medication Discussion Points', y, margin, pageWidth);
    for (const point of doc.medication_discussion_points) {
      y = checkPageBreak(pdf, y, 20);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(point.medication, margin + 4, y);
      y += 5;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      y = addWrappedText(pdf, `Concern: ${point.concern}`, y, margin + 4, pageWidth - 8);
      y = addWrappedText(pdf, `Request: ${point.request}`, y, margin + 4, pageWidth - 8);
      y += 3;
    }
    y += 4;
  }

  // Specialist Referrals
  if (doc.specialist_referrals && doc.specialist_referrals.length > 0) {
    y = checkPageBreak(pdf, y, 30);
    y = addSection(pdf, 'Specialist Referral Requests', y, margin, pageWidth);
    for (const ref of doc.specialist_referrals) {
      y = checkPageBreak(pdf, y, 15);
      pdf.setFontSize(9);
      pdf.text(`${ref.specialty} (${ref.urgency}) — ${ref.reason}`, margin + 4, y);
      y += 6;
    }
    y += 4;
  }

  // Disclaimer
  y = checkPageBreak(pdf, y, 30);
  pdf.setDrawColor(200, 200, 200);
  pdf.line(margin, y, margin + pageWidth, y);
  y += 8;
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'italic');
  y = addWrappedText(pdf, STANDARD_DISCLAIMER, y, margin, pageWidth);

  return pdf;
}

function addSection(pdf: jsPDF, title: string, y: number, margin: number, _pageWidth: number): number {
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(13, 92, 99);
  pdf.text(title, margin, y);
  pdf.setTextColor(0, 0, 0);
  y += 8;
  return y;
}

function addWrappedText(pdf: jsPDF, text: string, y: number, x: number, maxWidth: number): number {
  const lines = pdf.splitTextToSize(text, maxWidth);
  for (const line of lines) {
    y = checkPageBreak(pdf, y, 6);
    pdf.text(line, x, y);
    y += 4.5;
  }
  return y;
}

function checkPageBreak(pdf: jsPDF, y: number, needed: number): number {
  const pageHeight = pdf.internal.pageSize.height;
  if (y + needed > pageHeight - 20) {
    pdf.addPage();
    return 20;
  }
  return y;
}
