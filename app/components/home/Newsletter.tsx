import {motion} from 'framer-motion';
import {Send} from 'lucide-react';

export function Newsletter() {
  return (
    <section className="jfw-newsletter py-20 md:py-28 bg-jfw-dark relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/dumbbellrows.webp"
          alt=""
          className="jfw-newsletter-bg w-full h-full object-cover opacity-10"
        />
      </div>
      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-jfw-dark/80 z-[1]" />
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-jfw-blue/5 rounded-full blur-3xl z-[2]" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: '-100px'}}
          transition={{duration: 0.6, ease: 'easeOut'}}
        >
          <div className="jfw-newsletter-accent w-12 h-[2px] bg-jfw-blue mx-auto mb-6" />

          <h2 className="jfw-newsletter-heading font-heading text-3xl md:text-4xl lg:text-5xl uppercase tracking-[0.15em] text-jfw-white mb-4">
            Join the <span className="text-jfw-blue">Journey</span>
          </h2>

          <p className="font-body text-base md:text-lg text-gray-400 mb-3">
            Get 15% off your first order and stay updated on new drops.
          </p>

          <p className="font-body text-sm text-gray-500 mb-10">
            No spam. Just fresh gear and motivation delivered to your inbox.
          </p>
        </motion.div>

        <motion.form
          className="jfw-newsletter-signup flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          onSubmit={(e) => e.preventDefault()}
          initial={{opacity: 0, y: 20}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true, margin: '-50px'}}
          transition={{duration: 0.6, delay: 0.2, ease: 'easeOut'}}
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="jfw-newsletter-email flex-1 bg-jfw-gray border border-jfw-gray text-jfw-white text-sm font-body px-5 py-4 rounded-lg focus:outline-none focus:border-jfw-blue focus:shadow-jfw-glow transition-all duration-200 placeholder:text-gray-500"
            aria-label="Email for newsletter"
            required
          />
          <button
            type="submit"
            className="jfw-newsletter-submit inline-flex items-center justify-center gap-2 bg-jfw-blue hover:bg-jfw-blue-dark text-jfw-black font-heading text-sm uppercase tracking-[0.15em] px-8 py-4 rounded-lg transition-all duration-300 hover:shadow-jfw-glow-lg hover:scale-105"
          >
            <span>Subscribe</span>
            <Send size={16} />
          </button>
        </motion.form>
      </div>
    </section>
  );
}
