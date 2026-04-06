import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Check, FlaskConical, Pill, Brain,
  ChevronDown,
} from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

const stats = [
  { value: '47+', label: 'Medications tracked with depletion data' },
  { value: '81+', label: 'Lab markers with optimal ranges' },
  { value: '39', label: 'Symptom root cause clusters' },
];

const precisionFeatures = [
  {
    icon: FlaskConical,
    title: 'Advanced Lab Analysis',
    description:
      'Upload your lab PDFs from any provider. 81+ biomarkers analyzed against optimal functional ranges — not just the standard ranges built from sick populations.',
  },
  {
    icon: Pill,
    title: 'Medication Intelligence',
    description:
      '47+ medications tracked for known nutrient depletions. Get supplement recommendations with dosing to offset what your prescriptions quietly strip away.',
  },
  {
    icon: Brain,
    title: 'Root Cause Mapping',
    description:
      'Connect your symptoms to biochemical root causes across 39 clusters. Stop chasing symptoms — start understanding the upstream drivers.',
  },
];

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Start understanding your labs',
    features: [
      '1 lab upload',
      'Basic optimal range analysis',
      'Emergency symptom detection',
    ],
    cta: 'Get Started Free',
    highlight: false,
  },
  {
    name: 'Core',
    price: '$19',
    period: '/mo',
    description: 'For proactive health optimizers',
    features: [
      'Unlimited lab uploads',
      'Full wellness plan generation',
      'Medication depletion checker',
      'Supplement stacks with dosing',
      'Trend tracking over time',
    ],
    cta: 'Start Core',
    highlight: false,
  },
  {
    name: 'Premium',
    price: '$39',
    period: '/mo',
    description: 'The complete root cause toolkit',
    features: [
      'Everything in Core',
      'Doctor prep documents (ICD-10)',
      'Insurance coverage guide',
      'Genetic data integration',
      'Priority AI analysis',
    ],
    cta: 'Start Premium',
    highlight: true,
  },
  {
    name: 'Family',
    price: '$59',
    period: '/mo',
    description: 'Root cause care for the whole household',
    features: [
      'Everything in Premium',
      'Up to 4 individual profiles',
      'Shared family dashboard',
    ],
    cta: 'Start Family',
    highlight: false,
  },
];

const faqs = [
  {
    question: 'How are your labs different from a standard lab?',
    answer:
      'Standard lab ranges are built from averages of tested populations — including people who are already sick. We compare your markers against optimal, functional ranges used in integrative and root cause medicine, catching imbalances years before they become diagnoses.',
  },
  {
    question: 'Can I use CauseHealth with my existing medications?',
    answer:
      'Absolutely. Our Medication Intelligence feature tracks 47+ common prescriptions and maps them to known nutrient depletions. You will see exactly which vitamins and minerals your medications may be affecting, along with evidence-based supplement recommendations.',
  },
  {
    question: 'Is this covered by insurance?',
    answer:
      'CauseHealth itself is a subscription service not billed through insurance. However, our Premium plan generates ICD-10 coded doctor prep documents and insurance coverage guides designed to help your provider order follow-up tests that are covered by your plan.',
  },
  {
    question: 'Is my health data secure?',
    answer:
      'Your data is encrypted in transit and at rest. We follow HIPAA-aligned security practices and never sell or share your personal health information with third parties.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes. All paid plans are month-to-month with no contracts. You can cancel from your settings at any time and retain access through the end of your billing period.',
  },
];

export default function Landing() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#FBF9F6] font-['Manrope',sans-serif] text-[#1B1C1A]">
      {/* ─── TOP NAV ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#FBF9F6]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="font-['Fraunces',serif] text-2xl font-bold text-[#012D1D] tracking-tight"
          >
            CauseHealth.
          </Link>
          <Link to="/register">
            <button className="bg-[#1B4332] text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-opacity hover:opacity-90">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="min-h-screen flex items-center px-5 pt-16">
        <div className="max-w-5xl mx-auto w-full py-24">
          <motion.div {...fadeUp} className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#414844] mb-6">
              Root cause health intelligence
            </p>
            <h1 className="font-['Fraunces',serif] text-5xl md:text-6xl font-bold text-[#012D1D] leading-[1.08] tracking-tight mb-6">
              The Revolution of{' '}
              <span className="italic font-light">Personal Vitality.</span>
            </h1>
            <p className="text-[#414844] text-lg leading-relaxed mb-10 max-w-xl">
              CauseHealth transforms your lab work, medications, and symptoms into
              a clear map of root causes — so you stop guessing and start healing
              with precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <button className="bg-[#1B4332] text-white text-sm font-semibold px-8 py-4 rounded-lg transition-opacity hover:opacity-90 flex items-center gap-2">
                  Begin Your Transformation <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <a href="#precision">
                <button className="bg-[#EAE8E5] text-[#1B1C1A] text-sm font-semibold px-8 py-4 rounded-lg transition-opacity hover:opacity-90">
                  See How It Works
                </button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="py-24 px-5">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-16">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              {...fadeUp}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="font-['Fraunces',serif] text-5xl md:text-6xl font-bold text-[#012D1D] mb-3">
                {stat.value}
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-[#414844]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── PRECISION MASTERY ─── */}
      <section id="precision" className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#414844] mb-4">
              How it works
            </p>
            <h2 className="font-['Fraunces',serif] text-4xl md:text-5xl font-bold text-[#012D1D] tracking-tight mb-4">
              Precision Mastery.
            </h2>
            <p className="text-[#414844] text-lg max-w-xl">
              Root cause medicine meets modern intelligence. Every feature is
              designed to surface what conventional care overlooks.
            </p>
          </motion.div>
          <div className="flex flex-col gap-6">
            {precisionFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="bg-[#F5F3F0] rounded-lg p-8"
                style={{ boxShadow: '0 40px 60px -20px rgba(1,45,29,0.05)' }}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="w-12 h-12 rounded-lg bg-[#EAE8E5] flex items-center justify-center mb-5">
                  <feature.icon className="w-5 h-5 text-[#012D1D]" />
                </div>
                <h3 className="font-['Fraunces',serif] text-xl font-bold text-[#012D1D] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#414844] text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── INSPIRATIONAL QUOTE ─── */}
      <section className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="bg-[#F5F3F0] rounded-lg p-10 md:p-16 text-center"
            style={{ boxShadow: '0 40px 60px -20px rgba(1,45,29,0.05)' }}
            {...fadeUp}
          >
            <p className="font-['Fraunces',serif] text-2xl md:text-3xl italic text-[#012D1D] leading-relaxed max-w-2xl mx-auto">
              "The physician of the future will give no medicine, but will
              instruct his patients in care of the human frame, in diet, and in
              the cause and prevention of disease."
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-[#414844] mt-8">
              Thomas Edison
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#414844] mb-4">
              Pricing
            </p>
            <h2 className="font-['Fraunces',serif] text-4xl md:text-5xl font-bold text-[#012D1D] tracking-tight mb-3">
              Select Your Protocol.
            </h2>
            <p className="text-[#414844] text-lg">
              Investment in your longevity. Start free, upgrade when you are ready.
            </p>
          </motion.div>
          <div className="flex flex-col gap-6">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                className={`rounded-lg p-8 ${
                  tier.highlight
                    ? 'bg-[#1B4332] text-white'
                    : 'bg-[#F5F3F0] text-[#1B1C1A]'
                }`}
                style={{ boxShadow: '0 40px 60px -20px rgba(1,45,29,0.05)' }}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-baseline justify-between mb-1">
                  <h3
                    className={`font-['Fraunces',serif] text-xl font-bold ${
                      tier.highlight ? 'text-white' : 'text-[#012D1D]'
                    }`}
                  >
                    {tier.name}
                  </h3>
                  <div>
                    <span
                      className={`font-['Fraunces',serif] text-3xl font-bold ${
                        tier.highlight ? 'text-white' : 'text-[#012D1D]'
                      }`}
                    >
                      {tier.price}
                    </span>
                    <span
                      className={`text-sm ${
                        tier.highlight ? 'text-white/60' : 'text-[#414844]'
                      }`}
                    >
                      {tier.period}
                    </span>
                  </div>
                </div>
                <p
                  className={`text-sm mb-6 ${
                    tier.highlight ? 'text-white/70' : 'text-[#414844]'
                  }`}
                >
                  {tier.description}
                </p>
                <ul className="space-y-2.5 mb-7">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                          tier.highlight ? 'text-white/70' : 'text-[#1B4332]'
                        }`}
                      />
                      <span
                        className={
                          tier.highlight ? 'text-white/90' : 'text-[#414844]'
                        }
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <button
                    className={`w-full text-sm font-bold py-4 rounded-lg transition-opacity hover:opacity-90 ${
                      tier.highlight
                        ? 'bg-white text-[#1B4332]'
                        : 'bg-[#1B4332] text-white'
                    }`}
                  >
                    {tier.cta}
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp} className="mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-[#414844] mb-4">
              FAQ
            </p>
            <h2 className="font-['Fraunces',serif] text-4xl md:text-5xl font-bold text-[#012D1D] tracking-tight">
              Curiosities &amp; Clarifications.
            </h2>
          </motion.div>
          <div className="flex flex-col gap-0">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="py-6"
                style={{ borderBottom: '1px solid #C1C8C2' }}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <h3 className="font-['Fraunces',serif] text-lg font-bold text-[#012D1D] pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-[#414844] flex-shrink-0 transition-transform duration-300 ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="text-[#414844] text-sm leading-relaxed pt-4 max-w-2xl">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-16 px-5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link
              to="/"
              className="font-['Fraunces',serif] text-xl font-bold text-[#012D1D]"
            >
              CauseHealth.
            </Link>
            <p className="text-sm text-[#414844]">
              Root cause health intelligence.
            </p>
          </div>
          <div className="flex gap-6 text-xs text-[#414844] mb-8">
            <a href="#" className="hover:text-[#012D1D] transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-[#012D1D] transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-[#012D1D] transition-colors">
              Support
            </a>
          </div>
          <p className="text-xs text-[#414844]/60 leading-relaxed mb-4">
            &copy; {new Date().getFullYear()} CauseHealth. All rights reserved.
          </p>
          <p className="text-xs text-[#414844]/50 leading-relaxed">
            CauseHealth is an educational tool and does not provide medical
            advice, diagnosis, or treatment. All content is for informational
            purposes only and is not a substitute for professional medical
            advice. Always consult your healthcare provider before making changes
            to medications, supplements, or health practices.
          </p>
        </div>
      </footer>
    </div>
  );
}
