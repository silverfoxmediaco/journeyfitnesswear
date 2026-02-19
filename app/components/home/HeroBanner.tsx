import {Link} from 'react-router';
import {motion} from 'framer-motion';
import {ChevronDown} from 'lucide-react';

export function HeroBanner() {
  return (
    <section className="jfw-hero relative w-full h-screen flex items-center justify-center overflow-hidden -mt-[var(--header-height)]">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-jfw-black via-jfw-black/90 to-jfw-dark z-10" />

      {/* Animated background accents */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-jfw-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-jfw-blue/3 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8, ease: 'easeOut'}}
        >
          {/* Accent line */}
          <div className="jfw-hero-accent w-16 h-[2px] bg-jfw-blue mx-auto mb-8" />

          <h1 className="jfw-hero-heading font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl uppercase tracking-[0.15em] text-jfw-white leading-tight mb-6">
            What&apos;s Your{' '}
            <span className="text-jfw-blue">Journey</span>?
          </h1>
        </motion.div>

        <motion.p
          className="jfw-hero-subtext font-body text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8, delay: 0.2, ease: 'easeOut'}}
        >
          Performance wear built for every rep, every mile, every goal.
        </motion.p>

        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8, delay: 0.4, ease: 'easeOut'}}
        >
          <Link
            to="/collections"
            prefetch="intent"
            className="jfw-hero-cta inline-block bg-jfw-blue hover:bg-jfw-blue-dark text-jfw-black font-heading text-sm sm:text-base uppercase tracking-[0.2em] px-10 py-4 rounded-lg transition-all duration-300 hover:shadow-jfw-glow-lg hover:scale-105"
          >
            Shop Now
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="jfw-hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 1, delay: 1}}
      >
        <span className="font-body text-[10px] uppercase tracking-[0.3em] text-gray-500">
          Scroll
        </span>
        <motion.div
          animate={{y: [0, 8, 0]}}
          transition={{duration: 1.5, repeat: Infinity, ease: 'easeInOut'}}
        >
          <ChevronDown size={20} className="text-jfw-blue" />
        </motion.div>
      </motion.div>
    </section>
  );
}
