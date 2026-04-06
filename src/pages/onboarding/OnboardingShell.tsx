import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Step1Demographics from './Step1_Demographics';
import Step2Diagnoses from './Step2_Diagnoses';
import Step3Medications from './Step3_Medications';
import Step4Symptoms from './Step4_Symptoms';
import Step5Lifestyle from './Step5_Lifestyle';
import Step6Goals from './Step6_Goals';
import Step7Complete from './Step7_Complete';

const TOTAL_STEPS = 7;

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
      <div className="min-h-screen bg-[#FBF9F6] flex items-center justify-center">
        <div className="animate-pulse">
          <span className="font-['Fraunces',serif] text-2xl font-bold text-[#012D1D]">
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
    <div className="min-h-screen bg-[#FBF9F6] font-['Manrope',sans-serif] text-[#1B1C1A]">
      {/* ─── Top bar ─── */}
      <header className="sticky top-0 z-10 bg-[#FBF9F6]/80 backdrop-blur-xl">
        <div className="max-w-lg mx-auto px-5 pt-5 pb-4">
          {/* Row: Back — Logo — spacer */}
          <div className="flex items-center justify-between mb-5">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 text-sm font-medium text-[#414844] hover:text-[#012D1D] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div className="w-14" />
            )}

            <span className="font-['Fraunces',serif] text-xl font-bold text-[#012D1D] tracking-tight">
              CauseHealth.
            </span>

            {/* Spacer to keep logo centered */}
            <div className="w-14" />
          </div>

          {/* Progress row */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#414844]">
              Step {stepLabel} of 07
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-[#414844]">
              {progressPercent}% Complete
            </p>
          </div>

          {/* Progress bar */}
          <div className="h-1 w-full rounded-full bg-[#EAE8E5]">
            <motion.div
              className="h-1 rounded-full bg-[#1B4332]"
              initial={false}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      </header>

      {/* ─── Step content ─── */}
      <main className="max-w-lg mx-auto px-5 py-12">
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
    </div>
  );
}
