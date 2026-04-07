import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0A0C0F] font-['DM_Sans',sans-serif] text-[#E2E2E6] flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* ─── ECG Line SVG ─── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          viewBox="0 0 1200 200"
          className="w-full max-w-4xl opacity-100"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,100 L200,100 L230,100 L250,40 L270,160 L290,20 L310,180 L330,60 L350,100 L400,100 L1200,100"
            fill="none"
            stroke="#3F4948"
            strokeWidth="1"
            strokeOpacity="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
          />
        </svg>
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        <motion.h1
          {...fadeUp}
          className="font-['Newsreader',serif] text-6xl text-[#1F403D]/80 mb-12 tracking-tight"
        >
          CauseHealth.
        </motion.h1>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-2 mb-16"
        >
          <p className="text-[#A0ACAB] text-lg leading-relaxed">
            Your doctor has{' '}
            <span className="text-[#C9A84C] font-semibold">12 minutes.</span>
          </p>
          <p className="text-[#A0ACAB] text-lg leading-relaxed">
            We have everything they miss.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-5"
        >
          <Link to="/register">
            <button className="bg-[#1F403D] text-white rounded-[10px] py-4 px-16 uppercase tracking-[0.15em] text-sm font-bold hover:opacity-90 transition-opacity">
              Get Started
            </button>
          </Link>
          <Link
            to="/login"
            className="text-[#A0ACAB] text-sm hover:text-[#E2E2E6] transition-colors"
          >
            Sign In
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
