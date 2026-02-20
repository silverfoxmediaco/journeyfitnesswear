import type {Route} from './+types/pages.about';
import {Link} from 'react-router';
import {motion} from 'framer-motion';
import {Zap, Palette, Users, Shield, ArrowRight} from 'lucide-react';
import {getSeoMeta} from '~/lib/seo';

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
    title: 'Journey Fitness Wear | Our Story',
    description:
      'Journey Fitness Wear was born from a belief that your gear should match your ambition. Learn about our mission, values, and the journey behind the brand.',
    url: 'https://journeyfitnesswear.com/pages/about',
  });
};

export default function AboutPage() {
  return (
    <div className="jfw-about-page">
      <AboutHero />
      <BrandOrigin />
      <BrandValues />
      <TaglineBanner />
      <AboutCTA />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Section 1 — About Hero
   ───────────────────────────────────────────── */
function AboutHero() {
  return (
    <section className="jfw-about-hero relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/dumbbell-raises.webp"
          alt=""
          className="jfw-about-hero-bg w-full h-full object-cover object-center"
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-jfw-black/75 via-jfw-black/65 to-jfw-dark/90 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-4 sm:px-6">
        <motion.div
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8, ease: 'easeOut'}}
        >
          <div className="jfw-about-hero-accent w-16 h-[2px] bg-jfw-blue mx-auto mb-8" />
          <h1 className="jfw-about-hero-heading font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-[0.15em] text-jfw-white leading-tight mb-4">
            Our <span className="text-jfw-blue">Story</span>
          </h1>
          <p className="jfw-about-hero-subtext font-body text-base sm:text-lg md:text-xl text-gray-400 max-w-xl mx-auto">
            Built by athletes. Designed for the grind.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Section 2 — Brand Origin
   ───────────────────────────────────────────── */
function BrandOrigin() {
  return (
    <section className="jfw-about-origin py-20 md:py-28 bg-jfw-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <motion.div
            className="jfw-about-origin-image relative order-2 lg:order-1"
            initial={{opacity: 0, x: -30}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true, margin: '-100px'}}
            transition={{duration: 0.7, ease: 'easeOut'}}
          >
            <div className="aspect-[4/5] rounded-lg overflow-hidden bg-jfw-gray relative">
              {/* Desktop image */}
              <img
                src="/images/mobiledumbbellrows-e1695130735884.webp"
                alt="Intense dumbbell training — Journey Fitness Wear"
                className="jfw-about-origin-img w-full h-full object-cover"
              />
              {/* Subtle gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-jfw-black/20 to-transparent" />
            </div>
            {/* Cyan accent detail */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-2 border-jfw-blue/20 rounded-lg hidden lg:block" />
          </motion.div>

          {/* Text Side */}
          <motion.div
            className="jfw-about-origin-text order-1 lg:order-2"
            initial={{opacity: 0, x: 30}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true, margin: '-100px'}}
            transition={{duration: 0.7, delay: 0.15, ease: 'easeOut'}}
          >
            <div className="w-12 h-[2px] bg-jfw-blue mb-6" />

            <h2 className="jfw-about-origin-heading font-heading text-3xl md:text-4xl uppercase tracking-[0.1em] text-jfw-white leading-tight mb-6">
              The <span className="text-jfw-blue">Mission</span>
            </h2>

            <p className="font-body text-base md:text-lg text-gray-400 leading-relaxed mb-6">
              Journey Fitness Wear started with a simple idea — your gear should
              work as hard as you do. Too many brands sacrifice performance for
              looks, or style for function. We refuse to choose.
            </p>

            <p className="font-body text-base md:text-lg text-gray-400 leading-relaxed mb-6">
              Founded by athletes who were tired of settling, JFW was built from
              the ground up to deliver bold, premium performance apparel that
              moves with you — from the weight room floor to the streets outside.
            </p>

            <p className="font-body text-base md:text-lg text-gray-400 leading-relaxed">
              Every stitch, every fabric choice, and every design detail is made
              with intention. Because your journey deserves gear that keeps up.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Section 3 — Brand Values
   ───────────────────────────────────────────── */
const VALUES = [
  {
    icon: Zap,
    title: 'Performance',
    description:
      'Every piece is engineered for movement. Moisture-wicking fabrics, 4-way stretch, and breathable construction that performs when it matters most.',
  },
  {
    icon: Palette,
    title: 'Style',
    description:
      'Bold designs that stand out. We blend athletic function with streetwear edge so you look as good as you feel — in and out of the gym.',
  },
  {
    icon: Users,
    title: 'Community',
    description:
      'JFW is more than a brand — it\'s a movement. We celebrate every athlete, every body, and every level. Your journey is our journey.',
  },
  {
    icon: Shield,
    title: 'Quality',
    description:
      'Premium materials. Reinforced stitching. Built to last through countless workouts, washes, and wins. No shortcuts, no compromises.',
  },
];

function BrandValues() {
  return (
    <section className="jfw-about-values py-20 md:py-28 bg-jfw-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: '-100px'}}
          transition={{duration: 0.6, ease: 'easeOut'}}
        >
          <div className="w-12 h-[2px] bg-jfw-blue mx-auto mb-6" />
          <h2 className="jfw-about-values-heading font-heading text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.1em] text-jfw-white">
            What We <span className="text-jfw-blue">Stand For</span>
          </h2>
        </motion.div>

        {/* Values Grid */}
        <div className="jfw-about-values-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALUES.map((value, index) => (
            <motion.div
              key={value.title}
              className="jfw-about-value-card group text-center p-8 rounded-xl bg-jfw-black border border-jfw-gray hover:border-jfw-blue/30 transition-all duration-300 hover:shadow-jfw-glow"
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, margin: '-50px'}}
              transition={{duration: 0.5, delay: index * 0.1, ease: 'easeOut'}}
            >
              {/* Icon */}
              <div className="jfw-about-value-icon w-14 h-14 rounded-full bg-jfw-blue/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-jfw-blue/20 transition-colors duration-300">
                <value.icon
                  size={24}
                  className="text-jfw-blue"
                  strokeWidth={1.5}
                />
              </div>

              {/* Title */}
              <h3 className="jfw-about-value-title font-heading text-sm uppercase tracking-[0.2em] text-jfw-white mb-3">
                {value.title}
              </h3>

              {/* Description */}
              <p className="font-body text-sm text-gray-500 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Section 4 — Tagline Banner
   ───────────────────────────────────────────── */
function TaglineBanner() {
  return (
    <section className="jfw-about-tagline relative w-full overflow-hidden">
      {/* Background Image */}
      <img
        src="/images/kettleballs.webp"
        alt=""
        className="jfw-about-tagline-bg w-full h-[400px] md:h-[500px] object-cover object-center"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-jfw-black/70" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <motion.div
          className="jfw-about-tagline-content text-center px-4"
          initial={{opacity: 0, scale: 0.95}}
          whileInView={{opacity: 1, scale: 1}}
          viewport={{once: true, margin: '-100px'}}
          transition={{duration: 0.7, ease: 'easeOut'}}
        >
          <h2 className="jfw-about-tagline-heading font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-[0.15em] text-jfw-white leading-tight">
            What&apos;s Your{' '}
            <span className="text-jfw-blue">Journey</span>?
          </h2>
          <div className="w-20 h-[2px] bg-jfw-blue mx-auto mt-8" />
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Section 5 — Shop CTA
   ───────────────────────────────────────────── */
function AboutCTA() {
  return (
    <section className="jfw-about-cta py-20 md:py-28 bg-jfw-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: '-100px'}}
          transition={{duration: 0.6, ease: 'easeOut'}}
        >
          <h2 className="jfw-about-cta-heading font-heading text-2xl md:text-3xl uppercase tracking-[0.1em] text-jfw-white mb-4">
            Ready to Start Your <span className="text-jfw-blue">Journey</span>?
          </h2>
          <p className="font-body text-base md:text-lg text-gray-400 mb-10">
            Explore our full collection of performance apparel built for
            athletes who refuse to settle.
          </p>
          <Link
            to="/collections"
            prefetch="intent"
            className="jfw-about-cta-btn inline-flex items-center gap-3 bg-jfw-blue hover:bg-jfw-blue-dark text-jfw-black font-heading text-sm uppercase tracking-[0.2em] px-10 py-4 rounded-lg transition-all duration-300 hover:shadow-jfw-glow-lg hover:scale-105"
          >
            Shop the Collection
            <ArrowRight size={18} strokeWidth={2.5} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
