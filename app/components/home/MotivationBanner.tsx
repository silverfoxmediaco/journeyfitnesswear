import {motion} from 'framer-motion';
import {Link} from 'react-router';

export function MotivationBanner() {
  return (
    <section className="jfw-motivation-banner relative w-full overflow-hidden">
      {/* Background Image — desktop */}
      <img
        src="/images/kettleballs.webp"
        alt=""
        className="jfw-motivation-bg-desktop hidden md:block w-full h-[500px] lg:h-[550px] object-cover object-center"
      />
      {/* Background Image — mobile */}
      <img
        src="/images/kettleballsmobile.webp"
        alt=""
        className="jfw-motivation-bg-mobile md:hidden w-full h-[450px] object-cover object-top"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-jfw-black/85 via-jfw-black/60 to-jfw-black/40" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            className="jfw-motivation-content max-w-lg"
            initial={{opacity: 0, x: -30}}
            whileInView={{opacity: 1, x: 0}}
            viewport={{once: true, margin: '-100px'}}
            transition={{duration: 0.7, ease: 'easeOut'}}
          >
            <div className="jfw-motivation-accent w-12 h-[2px] bg-jfw-blue mb-6" />

            <h2 className="jfw-motivation-heading font-heading text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.1em] text-jfw-white leading-tight mb-4">
              Push Your{' '}
              <span className="text-jfw-blue">Limits</span>
            </h2>

            <p className="jfw-motivation-text font-body text-base md:text-lg text-gray-300 leading-relaxed mb-8">
              Every set, every rep, every drop of sweat brings you closer to who
              you&apos;re meant to be. Gear up for the grind.
            </p>

            <Link
              to="/collections"
              prefetch="intent"
              className="jfw-motivation-cta inline-block bg-jfw-blue hover:bg-jfw-blue-dark text-jfw-black font-heading text-sm uppercase tracking-[0.2em] px-8 py-3 rounded-lg transition-all duration-300 hover:shadow-jfw-glow-lg hover:scale-105"
            >
              Shop Collections
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
