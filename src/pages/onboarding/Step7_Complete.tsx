import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface StepProps {
  onNext: () => void;
  onBack: () => void;
}

function getFirstRecommendation(
  diagnoses: string[],
  goals: string[],
  symptoms: string[]
): { title: string; description: string } | null {
  if (
    diagnoses.some((d) =>
      ['high cholesterol', 'hyperlipidemia'].includes(d.toLowerCase())
    ) ||
    goals.includes('Cardiovascular Health')
  ) {
    return {
      title: 'Consider CoQ10 Supplementation',
      description:
        'If you are taking a statin medication, it may deplete CoQ10 levels. Uploading your labs will let us check your baseline and track this marker.',
    };
  }

  if (
    goals.includes('Improve Energy') ||
    diagnoses.some((d) =>
      ['hypothyroidism', "hashimoto's"].includes(d.toLowerCase())
    )
  ) {
    return {
      title: 'Get a Comprehensive Thyroid Panel',
      description:
        'Beyond standard TSH, we recommend checking Free T3, Free T4, Reverse T3, and thyroid antibodies for a complete picture of your thyroid health.',
    };
  }

  if (
    goals.includes('Fix Hair Loss') ||
    symptoms.includes('Hair Loss') ||
    symptoms.includes('Thinning Hair')
  ) {
    return {
      title: 'Check Ferritin and Iron Levels',
      description:
        'Low ferritin is one of the most common and overlooked causes of hair loss, especially in women. Upload your labs and we will flag if your levels need attention.',
    };
  }

  if (
    goals.includes('Better Digestion') ||
    goals.includes('Autoimmune Management') ||
    diagnoses.some((d) =>
      ['ulcerative colitis', "crohn's disease", 'ibs', 'celiac disease'].includes(
        d.toLowerCase()
      )
    )
  ) {
    return {
      title: 'Check Vitamin D and B12',
      description:
        'Digestive conditions frequently impair nutrient absorption. Vitamin D and B12 are among the first to drop and can drive fatigue, mood changes, and inflammation.',
    };
  }

  if (goals.includes('Improve Mood')) {
    return {
      title: 'Consider a Methylation Panel',
      description:
        'Folate, B12, and homocysteine levels heavily influence mood and neurotransmitter production. Upload your labs and we will evaluate your methylation status.',
    };
  }

  return {
    title: 'Upload Your First Lab Results',
    description:
      'Our analysis engine works best with recent lab results. Upload a CBC, CMP, or thyroid panel to get personalized insights right away.',
  };
}

export default function Step7Complete(_props: StepProps) {
  const navigate = useNavigate();
  const { profile, healthProfile, updateProfile } = useAuth();
  const [completed, setCompleted] = useState(false);

  const diagnoses = healthProfile?.diagnoses || [];
  const goals = profile?.primary_goals || [];
  const symptoms: string[] = [];

  const recommendation = getFirstRecommendation(diagnoses, goals, symptoms);

  useEffect(() => {
    async function markComplete() {
      try {
        await updateProfile({ onboarding_completed: true });
        setCompleted(true);
      } catch (err) {
        console.error('Failed to mark onboarding as complete:', err);
        setCompleted(true);
      }
    }
    markComplete();
  }, []);

  return (
    <div className="space-y-8 font-['DM_Sans',sans-serif]">
      {/* Pulse checkmark animation */}
      <div className="text-center space-y-6 py-8">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#1F403D]/20 relative"
        >
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#1F403D]/40"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#1F403D]/20"
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1.5, delay: 0.3, repeat: Infinity, repeatDelay: 0.5 }}
          />
          <Check className="w-10 h-10 text-[#1F403D]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-['Newsreader',serif] text-3xl text-[#E2E2E6]"
        >
          Your health intelligence is ready.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-[#A0ACAB] text-sm max-w-md mx-auto leading-relaxed"
        >
          Your profile is calibrated. CauseHealth. will now personalize every
          analysis to your unique biology, conditions, and goals.
        </motion.p>
      </div>

      {/* Recommendation / detected risk card */}
      {recommendation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#15181C] rounded-[10px] p-6 border border-[#2A2E36]/50"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-[10px] bg-[#1F403D]/20">
              <Sparkles className="w-5 h-5 text-[#1F403D]" />
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0ACAB]">
                First Intelligence Insight
              </p>
              <p className="text-sm font-bold text-[#E2E2E6]">
                {recommendation.title}
              </p>
              <p className="text-sm text-[#A0ACAB] leading-relaxed">
                {recommendation.description}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-3"
      >
        <button
          onClick={() => navigate('/app')}
          disabled={!completed}
          className="w-full bg-[#1F403D] text-white rounded-[10px] py-4 uppercase tracking-[0.15em] text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Enter CauseHealth.
        </button>
        <button
          onClick={() => navigate('/app/labs/upload')}
          disabled={!completed}
          className="w-full text-[#A0ACAB] rounded-[10px] py-3 text-sm uppercase tracking-[0.15em] font-bold hover:text-[#E2E2E6] transition-colors disabled:opacity-50"
        >
          Upload Labs First
        </button>
      </motion.div>
    </div>
  );
}
