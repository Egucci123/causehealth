import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Step1Demographics from './Step1_Demographics';
import Step2Diagnoses from './Step2_Diagnoses';
import Step3Medications from './Step3_Medications';
import Step4Symptoms from './Step4_Symptoms';
import Step5Lifestyle from './Step5_Lifestyle';
import Step6Goals from './Step6_Goals';
import Step7Complete from './Step7_Complete';

const TOTAL_STEPS = 7;

const STEP_NAMES = [
  'CORE BIOMETRICS',
  'PATIENT PROFILE',
  'PHARMACOLOGICAL PROFILE',
  'SYMPTOM ANALYSIS',
  'LIFESTYLE FACTORS',
  'HEALTH GOALS',
  'COMPLETE',
];

export default function OnboardingShell() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  /* ─── Auth guard ─── */
  useEffect(() => {
    if (!loading && !user) {
      navigate('/register', { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!loading && profile?.onboarding_completed) {
      navigate('/app', { replace: true });
    }
  }, [profile, loading, navigate]);

  /* ─── Loading state ─── */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0C0F] flex items-center justify-center">
        <div className="animate-pulse">
          <span className="font-['Newsreader',serif] text-2xl italic text-[#1F403D]">
            CauseHealth.
          </span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  /* ─── Navigation ─── */
  function handleNext() {
    if (currentStep < TOTAL_STEPS) {
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

  /* ─── Progress ─── */
  const progressPercent = Math.round((currentStep / TOTAL_STEPS) * 100);
  const stepLabel = String(currentStep).padStart(2, '0');

  /* ─── Step transition variants ─── */
  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  /* ─── Render current step ─── */
  function renderStep() {
    const props = { onNext: handleNext, onBack: handleBack };
    switch (currentStep) {
      case 1:
        return <Step1Demographics {...props} />;
      case 2:
        return <Step2Diagnoses {...props} />;
      case 3:
        return <Step3Medications {...props} />;
      case 4:
        return <Step4Symptoms {...props} />;
      case 5:
        return <Step5Lifestyle {...props} />;
      case 6:
        return <Step6Goals {...props} />;
      case 7:
        return <Step7Complete {...props} />;
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0C0F] font-['DM_Sans',sans-serif] text-[#E2E2E6]">
      {/* ─── Top bar ─── */}
      <header className="sticky top-0 z-10 bg-[#0A0C0F]/90 backdrop-blur-xl border-b border-[#2A2E36]/30">
        <div className="max-w-lg mx-auto px-6 py-4">
          {/* Row: Logo — Step info — User icon */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-['Newsreader',serif] text-lg italic text-[#1F403D]">
              CauseHealth.
            </span>

            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
                Step {stepLabel} / {String(TOTAL_STEPS).padStart(2, '0')}
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#E2E2E6]/60 mt-0.5">
                {STEP_NAMES[currentStep - 1]}
              </p>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#15181C] border border-[#2A2E36]/50 flex items-center justify-center">
              <User className="w-4 h-4 text-[#A0ACAB]" />
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-[2px] w-full bg-[#282D33] rounded-full">
            <motion.div
              className="h-[2px] rounded-full bg-[#1F403D]"
              initial={false}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      </header>

      {/* ─── Step content ─── */}
      <main className="max-w-lg mx-auto px-6 pt-8 pb-32">
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
      </main>

      {/* ─── Bottom nav ─── */}
      {currentStep < TOTAL_STEPS && (
        <div className="fixed bottom-0 inset-x-0 bg-[#0A0C0F]/95 backdrop-blur-xl border-t border-[#2A2E36]/30">
          <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="text-[#A0ACAB] text-sm uppercase tracking-[0.15em] font-bold hover:text-[#E2E2E6] transition-colors"
              >
                &larr; Previous
              </button>
            ) : (
              <div />
            )}
            <button
              onClick={handleNext}
              className="bg-[#1F403D] text-white rounded-[10px] py-3 px-6 text-sm uppercase tracking-[0.15em] font-bold hover:opacity-90 transition-opacity"
            >
              Next Analysis &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
