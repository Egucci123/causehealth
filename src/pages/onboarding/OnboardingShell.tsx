import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Step1Demographics from './Step1_Demographics';
import Step2Diagnoses from './Step2_Diagnoses';
import Step3Medications from './Step3_Medications';
import Step4Symptoms from './Step4_Symptoms';
import Step5Lifestyle from './Step5_Lifestyle';
import Step6Goals from './Step6_Goals';
import Step7Complete from './Step7_Complete';

const STEP_NAMES = [
  'Core Biometrics',
  'Patient Profile',
  'Pharmacological Profile',
  'Symptom Analysis',
  'Lifestyle Factors',
  'Health Goals',
  'Complete',
];

export default function OnboardingShell() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const { user, profile, loading } = useAuth();
  useNavigate(); // kept for potential future use

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0C0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#282D33] border-t-[#1F403D] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/register" replace />;
  if (profile?.onboarding_completed) return <Navigate to="/app" replace />;

  function handleNext() {
    if (currentStep < 7) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  }

  const progressPercent = Math.round((currentStep / 7) * 100);
  const stepNum = String(currentStep).padStart(2, '0');

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  function renderStep() {
    const props = { onNext: handleNext, onBack: handleBack };
    switch (currentStep) {
      case 1: return <Step1Demographics {...props} />;
      case 2: return <Step2Diagnoses {...props} />;
      case 3: return <Step3Medications {...props} />;
      case 4: return <Step4Symptoms {...props} />;
      case 5: return <Step5Lifestyle {...props} />;
      case 6: return <Step6Goals {...props} />;
      case 7: return <Step7Complete {...props} />;
      default: return null;
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0C0F] text-[#E2E2E6] font-['DM_Sans',sans-serif] selection:bg-[#1F403D]/20"
      style={{
        background: `radial-gradient(circle at 0% 0%, rgba(31,64,61,0.1) 0%, transparent 40%), radial-gradient(circle at 100% 100%, rgba(31,64,61,0.05) 0%, transparent 40%), #0A0C0F`
      }}
    >
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#0A0C0F]/80 backdrop-blur-md border-b border-[#2C3433]/30 flex items-center justify-between px-6 h-20 shadow-sm">
        <div className="flex items-center gap-3">
          {currentStep > 1 ? (
            <button onClick={handleBack} className="text-[#A0ACAB] hover:text-[#E2E2E6] transition-colors active:scale-95">
              <ArrowLeft className="w-5 h-5" strokeWidth={1.5} />
            </button>
          ) : null}
          <span className="font-['Newsreader',serif] italic text-[#1F403D] text-2xl tracking-tight">CauseHealth.</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#1F403D]">Step {stepNum} / 07</span>
            <span className="text-[10px] uppercase tracking-widest text-[#A0ACAB]/60">{STEP_NAMES[currentStep - 1]}</span>
          </div>
          <div className="h-10 w-10 bg-[#1E2226] border border-[#3F4948]/50 flex items-center justify-center">
            <User className="w-5 h-5 text-[#A0ACAB]" strokeWidth={1.5} />
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="fixed top-20 left-0 w-full h-[2px] bg-[#282D33] z-50">
        <div className="h-full bg-[#1F403D] transition-all duration-700 ease-in-out" style={{ width: `${progressPercent}%` }} />
      </div>

      {/* Content */}
      <main className="pt-32 pb-24 px-6 flex justify-center min-h-screen">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
