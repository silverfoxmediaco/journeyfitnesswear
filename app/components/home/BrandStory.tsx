import {Link} from 'react-router';
import {motion} from 'framer-motion';

export function BrandStory() {
  return (
    <section className="jfw-brand-story py-20 md:py-28 bg-jfw-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <motion.div
            className="jfw-brand-image relative"
            initial={{opacity: 0, x: -30}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true, margin: '-100px'}}
            transition={{duration: 0.7, ease: 'easeOut'}}
          >
            <div className="aspect-[4/5] rounded-lg overflow-hidden bg-jfw-gray relative">
              {/* Placeholder — replace with brand lifestyle image */}
              <div className="absolute inset-0 bg-gradient-to-br from-jfw-dark to-jfw-gray flex items-center justify-center">
                <img
                  src="/logos/JOURNEY800V1BLUE.png"
                  alt="Journey Fitness Wear"
                  className="w-48 md:w-64 opacity-20"
                />
              </div>
            </div>
            {/* Cyan accent detail */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-jfw-blue/20 rounded-lg hidden lg:block" />
          </motion.div>

          {/* Text Side */}
          <motion.div
            className="jfw-brand-text"
            initial={{opacity: 0, x: 30}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true, margin: '-100px'}}
            transition={{duration: 0.7, delay: 0.15, ease: 'easeOut'}}
          >
            <div className="jfw-brand-accent w-12 h-[2px] bg-jfw-blue mb-6" />

            <h2 className="jfw-brand-heading font-heading text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.1em] text-jfw-white leading-tight mb-6">
              Built for the <span className="text-jfw-blue">Journey</span>
            </h2>

            <p className="font-body text-base md:text-lg text-gray-400 leading-relaxed mb-6">
              Journey Fitness Wear was born from a simple belief — your gear
              should match your ambition. We design performance apparel that
              moves with you, looks bold, and stands up to every challenge you
              throw at it.
            </p>

            <p className="font-body text-base md:text-lg text-gray-400 leading-relaxed mb-8">
              Whether you&apos;re crushing PRs in the gym, hitting the trails at
              dawn, or pushing through one more mile — we&apos;re here for every
              step of your journey.
            </p>

            <Link
              to="/pages/about"
              prefetch="intent"
              className="jfw-brand-cta inline-block border-2 border-jfw-blue text-jfw-blue hover:bg-jfw-blue hover:text-jfw-black font-heading text-sm uppercase tracking-[0.2em] px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-jfw-glow"
            >
              Our Story
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
