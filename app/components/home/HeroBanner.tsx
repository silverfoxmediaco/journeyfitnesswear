import {useState, useEffect, useRef, useCallback} from 'react';
import {Link} from 'react-router';
import {motion, AnimatePresence} from 'framer-motion';
import {ChevronDown, Pause, Play} from 'lucide-react';

const S3_BASE = 'https://journeyfitnesswear.s3.us-east-2.amazonaws.com';

const HERO_SLIDES = [
  {
    src: `${S3_BASE}/kling_20260305_Image_to_Video_keep_eleme_1148_0.mp4`,
    poster: '/images/woman-powerlifting.webp',
    heading: 'Train in',
    headingAccent: 'Style',
    subtext: 'Recycled padded bikini sports bra — built for performance, designed for you.',
    cta: 'Shop Now',
    link: '/products/journey-fitness-wear-womens-recycled-padded-bikini-sports-bra-red?ref=womens',
  },
  {
    src: `${S3_BASE}/kling_20260305_Image_to_Video_keep_eleme_1027_0.mp4`,
    poster: '/images/woman-powerlifting.webp',
    heading: 'Made in',
    headingAccent: 'America',
    subtext: 'Bold graphics, premium comfort — proudly made in the USA.',
    cta: 'Shop Now',
    link: '/products/made-in-america-logo-on-front?ref=mens',
  },
];

const SLIDE_DURATION = 8000; // ms per slide

export function HeroBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToSlide = useCallback(
    (index: number) => {
      setActiveIndex(index);
      videoRefs.current.forEach((video, i) => {
        if (!video) return;
        if (i === index) {
          video.currentTime = 0;
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    [],
  );

  const nextSlide = useCallback(() => {
    goToSlide((activeIndex + 1) % HERO_SLIDES.length);
  }, [activeIndex, goToSlide]);

  // Auto-rotate timer
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setTimeout(nextSlide, SLIDE_DURATION);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIndex, isPaused, nextSlide]);

  const togglePause = () => {
    setIsPaused((prev) => {
      const next = !prev;
      const video = videoRefs.current[activeIndex];
      if (video) {
        next ? video.pause() : video.play().catch(() => {});
      }
      return next;
    });
  };

  const slide = HERO_SLIDES[activeIndex];

  return (
    <section className="jfw-hero-video relative w-full h-[75vh] md:h-screen flex items-center overflow-hidden -mt-[var(--header-height)] bg-black">
      {/* Video Slides */}
      {HERO_SLIDES.map((s, index) => (
        <video
          key={s.src}
          ref={(el) => {
            videoRefs.current[index] = el;
          }}
          className={`jfw-hero-video-bg absolute inset-0 w-full h-full object-cover md:object-contain transition-opacity duration-1000 ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay={index === 0}
          muted
          loop
          playsInline
          preload={index === 0 ? 'metadata' : 'none'}
          poster={s.poster}
        >
          <source src={s.src} type="video/mp4" />
        </video>
      ))}

      {/* Dark overlay — gradient from left for text readability while showing model on right */}
      <div className="jfw-hero-video-overlay absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />

      {/* Slide Content — left aligned */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className="max-w-lg"
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -20}}
            transition={{duration: 0.5, ease: 'easeOut'}}
          >
            {/* Accent line */}
            <div className="jfw-hero-video-accent w-16 h-[2px] bg-jfw-blue mb-8" />

            <h1 className="jfw-hero-video-heading font-heading text-2xl sm:text-3xl md:text-4xl lg:text-[60px] uppercase tracking-[0.15em] text-white leading-tight mb-6">
              {slide.heading}{' '}
              <span className="text-jfw-blue">{slide.headingAccent}</span>
            </h1>

            <p className="jfw-hero-video-subtext font-body text-base sm:text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
              {slide.subtext}
            </p>

            <Link
              to={slide.link}
              prefetch="intent"
              className="jfw-hero-video-cta inline-block bg-jfw-blue hover:bg-jfw-blue-dark text-jfw-black font-heading text-sm sm:text-base uppercase tracking-[0.2em] px-10 py-4 rounded-lg transition-all duration-300 hover:shadow-jfw-glow-lg hover:scale-105"
            >
              {slide.cta}
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Carousel Controls — bottom left */}
      <div className="jfw-hero-carousel-controls absolute bottom-8 left-6 sm:left-8 z-20 flex items-center gap-3">
        {/* Pause/Play */}
        <button
          onClick={togglePause}
          className="jfw-hero-carousel-pause w-8 h-8 flex items-center justify-center rounded-full border border-white/30 hover:border-jfw-blue text-white/70 hover:text-jfw-blue transition-all duration-200"
          aria-label={isPaused ? 'Play slide rotation' : 'Pause slide rotation'}
        >
          {isPaused ? <Play size={12} /> : <Pause size={12} />}
        </button>

        {/* Slide Indicators */}
        <div className="jfw-hero-carousel-dots flex items-center gap-2">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`jfw-hero-carousel-dot h-[3px] rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-8 bg-jfw-blue'
                  : 'w-4 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
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
