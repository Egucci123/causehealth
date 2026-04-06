import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Upload, LayoutDashboard, Sparkles } from 'lucide-react';
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
    goals.includes('Cardiovascular health')
  ) {
    return {
      title: 'Consider CoQ10 Supplementation',
      description:
        'If you are taking a statin medication, it may deplete CoQ10 levels. Uploading your labs will let us check your baseline and track this marker.',
    };
  }

  if (
    goals.includes('Improve energy') ||
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
    goals.includes('Fix hair loss') ||
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
    goals.includes('Better digestion') ||
    goals.includes('Autoimmune management') ||
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

  if (goals.includes('Improve mood')) {
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

function ConfettiParticle({ delay, x }: { delay: number; x: number }) {
  const colors = ['#1B4332', '#3F665C', '#BEE8DC', '#A6CFC3', '#C1ECD4'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{ backgroundColor: color, left: `${x}%`, top: '50%' }}
      initial={{ y: 0, opacity: 1, scale: 1 }}
      animate={{
        y: [0, -80 - Math.random() * 60],
        x: [(Math.random() - 0.5) * 100],
        opacity: [1, 1, 0],
        scale: [1, 1.2, 0.6],
        rotate: [0, Math.random() * 360],
      }}
      transition={{
        duration: 1.2,
        delay,
        ease: 'easeOut',
      }}
    />
  );
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
        // Still allow user to proceed even if the flag fails to save
        setCompleted(true);
      }
    }
    markComplete();
  }, []);

  return (
    <div className="space-y-8 pb-24 font-['Manrope',sans-serif]">
      {/* Celebration area */}
      <div className="text-center space-y-4 relative overflow-hidden py-8">
        {/* Confetti particles */}
        <div className="relative h-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <ConfettiParticle
              key={i}
              delay={0.3 + i * 0.05}
              x={10 + Math.random() * 80}
            />
          ))}
        </div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#BEE8DC] text-[#3F665C]"
        >
          <CheckCircle2 className="w-10 h-10" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-['Fraunces',serif] text-3xl font-semibold text-[#012D1D]"
        >
          You're All Set!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-[#414844] text-sm max-w-md mx-auto"
        >
          Your profile is ready. CauseHealth will now personalize everything
          based on what you told us.
        </motion.p>
      </div>

      {/* First recommendation */}
      {recommendation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="bg-white rounded-3xl shadow-[0_8px_24px_rgba(14,55,39,0.05)] p-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-2xl bg-[#BEE8DC] text-[#3F665C]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-[#414844]/60">
                  Your First Recommendation
                </h3>
                <p className="text-sm font-semibold text-[#012D1D]">
                  {recommendation.title}
                </p>
                <p className="text-sm text-[#414844]">
                  {recommendation.description}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-3"
      >
        <button
          onClick={() => navigate('/app/labs/upload')}
          disabled={!completed}
          className="w-full bg-[#1B4332] text-white rounded-full py-4 font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 font-['Manrope',sans-serif]"
        >
          <Upload className="w-5 h-5" />
          Upload Your First Labs
        </button>
        <button
          onClick={() => navigate('/app')}
          disabled={!completed}
          className="w-full text-[#3F665C] rounded-full py-4 font-semibold text-sm hover:opacity-70 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 font-['Manrope',sans-serif]"
        >
          <LayoutDashboard className="w-5 h-5" />
          Go to Dashboard
        </button>
      </motion.div>
    </div>
  );
}
