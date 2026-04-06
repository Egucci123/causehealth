import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload, Sparkles, ClipboardList, Stethoscope, Check,
  ArrowRight, ShieldCheck, FlaskConical, Pill, FileText,
} from 'lucide-react';
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

const cardShadow = 'shadow-[0_10px_40px_-10px_rgba(29,28,23,0.06)]';

const features = [
  {
    icon: Upload,
    title: 'Upload Labs',
    description: 'Drop in a PDF from any lab — LabCorp, Quest, hospital systems. We parse every marker automatically.',
  },
  {
    icon: Sparkles,
    title: 'AI Analysis',
    description: 'Optimal ranges, not just standard. We flag what your doctor calls "normal" but functional medicine calls a red flag.',
  },
  {
    icon: ClipboardList,
    title: 'Get Your Plan',
    description: 'Supplement stacks with dosing, lifestyle changes, and root-cause explanations — all personalized to your results.',
  },
  {
    icon: Stethoscope,
    title: 'Walk In Prepared',
    description: 'ICD-10 coded test requests, medical necessity letters, and clinical summaries your doctor will actually respect.',
  },
];

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Start understanding your labs',
    features: ['1 lab upload', 'Basic optimal range analysis', 'Emergency symptom detection', 'Standard safety disclaimers'],
    cta: 'Get Started Free',
    highlight: false,
  },
  {
    name: 'Core',
    price: '$19',
    period: '/mo',
    description: 'For proactive health optimizers',
    features: ['Unlimited lab uploads', 'Full wellness plan generation', 'Medication depletion checker', 'Supplement stack with dosing', 'Trend tracking over time'],
    cta: 'Start Core',
    highlight: false,
  },
  {
    name: 'Premium',
    price: '$39',
    period: '/mo',
    description: 'The complete root cause toolkit',
    features: ['Everything in Core', 'Doctor prep documents (ICD-10)', 'Insurance coverage guide', 'Genetic data integration', 'Priority AI analysis', 'Specialist referral generation'],
    cta: 'Start Premium',
    highlight: true,
  },
];

const testimonials = [
  {
    quote: 'My ferritin was 15 and my doctor said it was fine. CauseHealth flagged it immediately. Three months of iron later, my fatigue is gone.',
    name: 'Sarah M.',
    detail: 'Hashimoto\'s patient',
  },
  {
    quote: 'I brought the doctor prep document to my endocrinologist. She ordered every test on the list without pushback.',
    name: 'James K.',
    detail: 'Type 2 diabetes',
  },
  {
    quote: 'Found out my PPI was depleting magnesium and B12. No one had connected those dots in six years of prescriptions.',
    name: 'Linda R.',
    detail: 'GERD management',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      {/* ─── TOP NAV ─── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/70 backdrop-blur-xl">
        <div className="max-w-lg mx-auto px-5 h-16 flex items-center justify-between">
          <Link to="/" className="font-headline text-2xl text-primary tracking-tight">
            CauseHealth.
          </Link>
          <Link to="/register">
            <button className="bg-primary text-on-primary text-xs font-bold uppercase tracking-widest px-5 py-2.5 rounded-lg transition-opacity hover:opacity-90">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="pt-28 pb-16 px-5">
        <div className="max-w-lg mx-auto">
          <motion.div {...fadeUp}>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-6">
              Root cause health intelligence
            </p>
            <h1 className="font-headline text-5xl font-medium text-primary leading-[1.1] mb-6">
              Your doctor has 12&nbsp;minutes. We have everything they&nbsp;miss.
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-10">
              Upload your labs. Understand your medications. Identify root causes.
              Walk into your next visit with clinically formatted documents.
            </p>
            <div className="flex flex-col gap-4">
              <Link to="/register">
                <button className="w-full bg-primary text-on-primary text-sm font-bold uppercase tracking-widest py-5 rounded-lg transition-opacity hover:opacity-90 flex items-center justify-center gap-2">
                  Upload My Labs <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <a
                href="#how-it-works"
                className="text-center text-sm font-bold uppercase tracking-widest text-on-surface-variant pb-1 border-b border-on-surface-variant/30 self-center transition-colors hover:text-primary"
              >
                See How It Works
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── PROBLEM SECTION ─── */}
      <section className="bg-primary py-20 px-5">
        <div className="max-w-lg mx-auto">
          <motion.div {...fadeUp}>
            <h2 className="font-headline text-3xl font-medium text-on-primary leading-snug mb-4">
              Conventional medicine treats symptoms.{' '}
              <span className="italic text-on-primary/70">We find causes.</span>
            </h2>
            <p className="text-on-primary/60 text-sm mb-12">
              The system wasn't built for you. Here's what falls through the cracks.
            </p>
          </motion.div>
          <div className="flex flex-col gap-5">
            {[
              { text: 'Labs say "normal." You feel terrible.', rotate: 'rotate-1' },
              { text: 'Your medication is causing new symptoms.', rotate: '-rotate-1' },
              { text: 'Your doctor has no time to connect the dots.', rotate: 'rotate-1' },
            ].map((card, i) => (
              <motion.div
                key={i}
                className={`bg-white rounded-xl p-6 ${cardShadow} transform ${card.rotate}`}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-headline text-lg font-medium text-primary">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES LIST ─── */}
      <section id="how-it-works" className="py-20 px-5 bg-white">
        <div className="max-w-lg mx-auto">
          <motion.div {...fadeUp}>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">
              How it works
            </p>
            <h2 className="font-headline text-3xl font-medium text-primary mb-12">
              Four steps to clarity.
            </h2>
          </motion.div>
          <div className="flex flex-col gap-10">
            {features.map((feature, i) => (
              <motion.div key={feature.title} className="flex gap-5" {...fadeUp} transition={{ duration: 0.6, delay: i * 0.08 }}>
                <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-headline text-lg font-medium text-primary mb-1">{feature.title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CLINICAL INTELLIGENCE ─── */}
      <section className="py-20 px-5 bg-surface">
        <div className="max-w-lg mx-auto">
          <motion.div {...fadeUp}>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">
              Deep analysis
            </p>
            <h2 className="font-headline text-3xl font-medium text-primary mb-12">
              Clinical intelligence in your pocket.
            </h2>
          </motion.div>
          <div className="flex flex-col gap-6">
            <motion.div className={`bg-white rounded-xl p-7 ${cardShadow}`} {...fadeUp}>
              <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center mb-4">
                <FlaskConical className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-headline text-xl font-medium text-primary mb-2">Beyond "Normal"</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Standard ranges are built from sick populations. We compare your markers against
                optimal, functional ranges used in integrative medicine — so you can catch problems
                years before they become diagnoses.
              </p>
            </motion.div>
            <motion.div className={`bg-white rounded-xl p-7 ${cardShadow}`} {...fadeUp}>
              <div className="flex gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
                  <Pill className="w-5 h-5 text-primary" />
                </div>
                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
              </div>
              <h3 className="font-headline text-xl font-medium text-primary mb-2">Depletion Checker &amp; Doctor Visit Prep</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Every medication has nutrient costs. We map your prescriptions to known depletions,
                then generate ICD-10 coded documents so your doctor can order the right follow-up tests
                — with insurance coverage built in.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-lg mx-auto">
          <motion.div {...fadeUp}>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">
              Real results
            </p>
            <h2 className="font-headline text-3xl font-medium text-primary mb-12">
              Lives changed by data.
            </h2>
          </motion.div>
          <div className="flex flex-col gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className={`bg-surface rounded-xl p-7 ${cardShadow}`}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <p className="font-headline text-base italic text-primary leading-relaxed mb-5">
                  "{t.quote}"
                </p>
                <div>
                  <p className="text-sm font-bold text-on-surface">{t.name}</p>
                  <p className="text-xs text-on-surface-variant">{t.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section className="py-20 px-5 bg-surface">
        <div className="max-w-lg mx-auto">
          <motion.div {...fadeUp}>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">
              Pricing
            </p>
            <h2 className="font-headline text-3xl font-medium text-primary mb-3">
              Investment in you.
            </h2>
            <p className="text-on-surface-variant text-sm mb-12">
              Start free. Upgrade when you're ready for the full picture.
            </p>
          </motion.div>
          <div className="flex flex-col gap-6">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={tier.name}
                className={`rounded-xl p-7 ${cardShadow} ${
                  tier.highlight
                    ? 'bg-primary text-on-primary'
                    : 'bg-white text-on-surface'
                }`}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className={`font-headline text-xl font-medium ${tier.highlight ? 'text-on-primary' : 'text-primary'}`}>
                    {tier.name}
                  </h3>
                  <div>
                    <span className={`font-headline text-3xl font-medium ${tier.highlight ? 'text-on-primary' : 'text-primary'}`}>
                      {tier.price}
                    </span>
                    <span className={`text-sm ${tier.highlight ? 'text-on-primary/60' : 'text-on-surface-variant'}`}>
                      {tier.period}
                    </span>
                  </div>
                </div>
                <p className={`text-sm mb-6 ${tier.highlight ? 'text-on-primary/70' : 'text-on-surface-variant'}`}>
                  {tier.description}
                </p>
                <ul className="space-y-2.5 mb-7">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.highlight ? 'text-on-primary/70' : 'text-secondary'}`} />
                      <span className={tier.highlight ? 'text-on-primary/90' : 'text-on-surface-variant'}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link to="/register">
                  <button
                    className={`w-full text-sm font-bold uppercase tracking-widest py-4 rounded-lg transition-opacity hover:opacity-90 ${
                      tier.highlight
                        ? 'bg-white text-primary'
                        : 'bg-primary text-on-primary'
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

      {/* ─── EVIDENCE ─── */}
      <section className="py-20 px-5 bg-white">
        <div className="max-w-lg mx-auto text-center">
          <motion.div {...fadeUp}>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-3">
              Trust
            </p>
            <h2 className="font-headline text-3xl font-medium text-primary mb-10">
              Evidence first. Always.
            </h2>
          </motion.div>
          <div className="flex flex-col gap-5">
            {[
              { icon: ShieldCheck, label: 'HIPAA-aligned security practices' },
              { icon: FlaskConical, label: 'Ranges sourced from peer-reviewed literature' },
              { icon: FileText, label: 'ICD-10 documents reviewed by clinicians' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className={`flex items-center gap-4 bg-surface rounded-xl p-5 ${cardShadow}`}
                {...fadeUp}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-medium text-on-surface text-left">{item.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-20 px-5 bg-surface">
        <div className="max-w-lg mx-auto text-center">
          <motion.div {...fadeUp}>
            <h2 className="font-headline text-3xl font-medium text-primary mb-4">
              Find out what your doctor missed.
            </h2>
            <p className="text-on-surface-variant text-sm mb-10">
              Upload your first lab report free. Results in under two minutes.
            </p>
            <form
              className="flex flex-col gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="you@email.com"
                className="w-full bg-white rounded-lg px-5 py-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-2 focus:ring-primary/20 transition"
              />
              <Link to="/register" className="w-full">
                <button className="w-full bg-primary text-on-primary text-sm font-bold uppercase tracking-widest py-4 rounded-lg transition-opacity hover:opacity-90 flex items-center justify-center gap-2">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 px-5 bg-white">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="font-headline text-xl text-primary">
              CauseHealth.
            </Link>
          </div>
          <div className="flex gap-6 text-xs text-on-surface-variant mb-8">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">Support</a>
          </div>
          <p className="text-xs text-on-surface-variant/60 leading-relaxed mb-4">
            &copy; {new Date().getFullYear()} CauseHealth. All rights reserved.
          </p>
          <p className="text-xs text-on-surface-variant/50 leading-relaxed">
            CauseHealth is an educational tool and does not provide medical advice, diagnosis,
            or treatment. All content is for informational purposes only and is not a substitute
            for professional medical advice. Always consult your healthcare provider before making
            changes to medications, supplements, or health practices.
          </p>
        </div>
      </footer>
    </div>
  );
}
