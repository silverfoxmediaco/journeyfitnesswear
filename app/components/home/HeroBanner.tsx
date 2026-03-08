import {useRef, useState} from 'react';
import {motion} from 'framer-motion';
import {ChevronDown, Pause, Play} from 'lucide-react';

const S3_BASE = 'https://journeyfitnesswear.s3.us-east-2.amazonaws.com';

const HERO_VIDEO_DESKTOP = `${S3_BASE}/newheroareavideo.mp4`;
const HERO_VIDEO_MOBILE = `${S3_BASE}/newheromobilevideo.mp4`;

export function HeroBanner() {
  const desktopVideoRef = useRef<HTMLVideoElement | null>(null);
  const mobileVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const togglePause = () => {
    setIsPaused((prev) => {
      const next = !prev;
      [desktopVideoRef.current, mobileVideoRef.current].forEach((video) => {
        if (!video) return;
        next ? video.pause() : video.play().catch(() => {});
      });
      return next;
    });
  };

  return (
    <section className="jfw-hero-video relative w-full h-[75vh] md:h-screen flex items-center overflow-hidden -mt-[var(--header-height)] bg-black">
      {/* Desktop Video (hidden on mobile) */}
      <video
        ref={desktopVideoRef}
        className="jfw-hero-video-bg-desktop absolute inset-0 w-full h-full object-cover hidden md:block"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={HERO_VIDEO_DESKTOP} type="video/mp4" />
      </video>

      {/* Mobile Video (hidden on desktop) */}
      <video
        ref={mobileVideoRef}
        className="jfw-hero-video-bg-mobile absolute inset-0 w-full h-full object-cover block md:hidden"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src={HERO_VIDEO_MOBILE} type="video/mp4" />
      </video>

      {/* Dark overlay for text readability */}
      <div className="jfw-hero-video-overlay absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />

      {/* Text Overlay — commented out until titles/taglines are finalized
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <motion.div
          className="jfw-hero-video-content max-w-lg"
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6, ease: 'easeOut'}}
        >
          <div className="jfw-hero-video-accent w-16 h-[2px] bg-jfw-blue mb-8" />
          <h1 className="jfw-hero-video-heading font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[60px] uppercase tracking-[0.15em] text-white leading-tight mb-6">
            Journey Fitness{' '}
            <span className="text-jfw-blue">Wear</span>
          </h1>
          <p className="jfw-hero-video-subtext font-body text-base sm:text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
            Placeholder text — we will update this together.
          </p>
        </motion.div>
      </div>
      */}

      {/* Pause / Play control — bottom left */}
      <div className="jfw-hero-controls absolute bottom-8 left-6 sm:left-8 z-20 flex items-center gap-3">
        <button
          onClick={togglePause}
          className="jfw-hero-pause-btn w-8 h-8 flex items-center justify-center rounded-full border border-white/30 hover:border-jfw-blue text-white/70 hover:text-jfw-blue transition-all duration-200"
          aria-label={isPaused ? 'Play video' : 'Pause video'}
        >
          {isPaused ? <Play size={12} /> : <Pause size={12} />}
        </button>
      </div>

      {/* Scroll indicator — bottom center */}
      <motion.div
        className="jfw-hero-video-scroll absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 1, delay: 1}}
      >
        <span className="font-body text-[10px] uppercase tracking-[0.3em] text-gray-400">
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
