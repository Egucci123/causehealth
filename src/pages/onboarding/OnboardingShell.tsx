import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import Step1Demographics from './Step1_Demographics';
import Step2Diagnoses from './Step2_Diagnoses';
import Step3Medications from './Step3_Medications';
import Step4Symptoms from './Step4_Symptoms';
import Step5Lifestyle from './Step5_Lifestyle';
import Step6Goals from './Step6_Goals';
import Step7Complete from './Step7_Complete';

const STEP_LABELS = [
  'About You',
  'History',
  'Meds',
  'Symptoms',
  'Lifestyle',
  'Goals',
  'Done',
];

export default function OnboardingShell() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <div className="animate-pulse">
          <span className="font-['Fraunces',serif] text-2xl font-bold text-[#012D1D]">
            CauseHealth.
          </span>
        </div>
      </div>
    );
  }

  if (!user) return null;

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

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

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
    <div className="min-h-screen bg-[#F5F0E8] font-['Manrope',sans-serif]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#F5F0E8]/80 backdrop-blur-sm">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <span className="font-['Fraunces',serif] text-lg font-bold tracking-tight text-[#012D1D]">
            CauseHealth.
          </span>
          <span className="text-sm text-[#414844]/60 font-medium font-['Manrope',sans-serif]">
            Step {currentStep} of 7
          </span>
        </div>

        {/* Progress bar */}
        <div className="max-w-lg mx-auto px-4 pb-3">
          <div className="flex items-center gap-1">
            {STEP_LABELS.map((label, i) => {
              const stepNum = i + 1;
              const isActive = stepNum === currentStep;
              const isCompleted = stepNum < currentStep;
              return (
                <div key={label} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`h-1.5 w-full rounded-full transition-colors duration-300 ${
                      isCompleted
                        ? 'bg-[#3F665C]'
                        : isActive
                        ? 'bg-[#A6CFC3]'
                        : 'bg-[#C1ECD4]'
                    }`}
                  />
                  <span
                    className={`text-[10px] hidden sm:block transition-colors duration-300 font-['Manrope',sans-serif] ${
                      isActive
                        ? 'text-[#3F665C] font-bold'
                        : isCompleted
                        ? 'text-[#3F665C]'
                        : 'text-[#414844]/60'
                    }`}
                  >
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Step content */}
      <main className="max-w-lg mx-auto px-4 py-8">
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

      {/* Footer: Back button only (each step has its own Continue) */}
      {currentStep > 1 && currentStep < 7 && (
        <footer className="fixed bottom-0 inset-x-0 bg-[#F5F0E8]/80 backdrop-blur-sm">
          <div className="max-w-lg mx-auto px-4 py-4">
            <button
              onClick={handleBack}
              className="text-[#3F665C] font-medium text-sm font-['Manrope',sans-serif] hover:opacity-70 transition-opacity"
            >
              Back
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
