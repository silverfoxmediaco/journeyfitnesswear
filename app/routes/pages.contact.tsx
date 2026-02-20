import type {Route} from './+types/pages.contact';
import {motion} from 'framer-motion';
import {Mail, Clock, MapPin, Instagram, Facebook, Twitter, Youtube, Send} from 'lucide-react';
import {SOCIAL_LINKS} from '~/lib/constants';
import {useState} from 'react';
import {getSeoMeta} from '~/lib/seo';

export const meta: Route.MetaFunction = () => {
  return getSeoMeta({
    title: 'Journey Fitness Wear | Contact Us',
    description:
      'Get in touch with Journey Fitness Wear. Questions about orders, sizing, or partnerships? We\'d love to hear from you.',
    url: 'https://journeyfitnesswear.com/pages/contact',
  });
};

export default function ContactPage() {
  return (
    <div className="jfw-contact-page">
      <ContactHero />
      <ContactContent />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Section 1 — Contact Hero
   ───────────────────────────────────────────── */
function ContactHero() {
  return (
    <section className="jfw-contact-hero relative w-full py-24 md:py-32 flex items-center justify-center overflow-hidden bg-jfw-dark">
      {/* Animated background accents */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-jfw-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-jfw-blue/3 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6">
        <motion.div
          initial={{opacity: 0, y: 30}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8, ease: 'easeOut'}}
        >
          <div className="jfw-contact-hero-accent w-16 h-[2px] bg-jfw-blue mx-auto mb-8" />
          <h1 className="jfw-contact-hero-heading font-heading text-4xl sm:text-5xl md:text-6xl uppercase tracking-[0.15em] text-jfw-white leading-tight mb-4">
            Get in <span className="text-jfw-blue">Touch</span>
          </h1>
          <p className="jfw-contact-hero-subtext font-body text-base sm:text-lg text-gray-400 max-w-xl mx-auto">
            Questions, feedback, or partnership inquiries — we&apos;d love to hear from you.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Section 2 — Contact Form + Info
   ───────────────────────────────────────────── */
function ContactContent() {
  return (
    <section className="jfw-contact-content py-16 md:py-24 bg-jfw-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Contact Form — takes 3 of 5 columns */}
          <motion.div
            className="jfw-contact-form-wrapper lg:col-span-3"
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: '-50px'}}
            transition={{duration: 0.6, ease: 'easeOut'}}
          >
            <ContactForm />
          </motion.div>

          {/* Contact Info — takes 2 of 5 columns */}
          <motion.div
            className="jfw-contact-info-wrapper lg:col-span-2"
            initial={{opacity: 0, y: 20}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: '-50px'}}
            transition={{duration: 0.6, delay: 0.15, ease: 'easeOut'}}
          >
            <ContactInfo />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   Contact Form Component
   ───────────────────────────────────────────── */
function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="jfw-contact-success p-8 md:p-12 bg-jfw-dark border border-jfw-gray rounded-xl text-center" role="status" aria-live="polite">
        <div className="w-16 h-16 rounded-full bg-jfw-blue/10 flex items-center justify-center mx-auto mb-6">
          <Mail size={28} className="text-jfw-blue" />
        </div>
        <h3 className="font-heading text-xl uppercase tracking-[0.15em] text-jfw-white mb-3">
          Message Sent
        </h3>
        <p className="font-body text-sm text-gray-400 max-w-sm mx-auto">
          Thanks for reaching out! We&apos;ll get back to you within 24–48 hours.
        </p>
      </div>
    );
  }

  return (
    <form
      className="jfw-contact-form p-8 md:p-12 bg-jfw-dark border border-jfw-gray rounded-xl space-y-6"
      onSubmit={handleSubmit}
    >
      <h2 className="jfw-contact-form-heading font-heading text-lg uppercase tracking-[0.15em] text-jfw-white mb-2">
        Send Us a Message
      </h2>
      <p className="font-body text-sm text-gray-500 mb-6">
        Fill out the form below and we&apos;ll respond as soon as possible.
      </p>

      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="contact-name"
            className="jfw-contact-label block font-heading text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2"
          >
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className="jfw-contact-input w-full bg-jfw-black border border-jfw-gray rounded-lg px-4 py-3 font-body text-sm text-jfw-white placeholder-gray-600 focus:outline-none focus:border-jfw-blue/50 focus:ring-1 focus:ring-jfw-blue/20 transition-all duration-200"
          />
        </div>
        <div>
          <label
            htmlFor="contact-email"
            className="jfw-contact-label block font-heading text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2"
          >
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="you@email.com"
            className="jfw-contact-input w-full bg-jfw-black border border-jfw-gray rounded-lg px-4 py-3 font-body text-sm text-jfw-white placeholder-gray-600 focus:outline-none focus:border-jfw-blue/50 focus:ring-1 focus:ring-jfw-blue/20 transition-all duration-200"
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="contact-subject"
          className="jfw-contact-label block font-heading text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2"
        >
          Subject
        </label>
        <select
          id="contact-subject"
          name="subject"
          required
          className="jfw-contact-select w-full bg-jfw-black border border-jfw-gray rounded-lg px-4 py-3 font-body text-sm text-jfw-white focus:outline-none focus:border-jfw-blue/50 focus:ring-1 focus:ring-jfw-blue/20 transition-all duration-200 appearance-none"
        >
          <option value="">Select a topic</option>
          <option value="order">Order Inquiry</option>
          <option value="sizing">Sizing &amp; Fit</option>
          <option value="returns">Returns &amp; Exchanges</option>
          <option value="wholesale">Wholesale / Partnerships</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="contact-message"
          className="jfw-contact-label block font-heading text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          placeholder="How can we help?"
          className="jfw-contact-textarea w-full bg-jfw-black border border-jfw-gray rounded-lg px-4 py-3 font-body text-sm text-jfw-white placeholder-gray-600 focus:outline-none focus:border-jfw-blue/50 focus:ring-1 focus:ring-jfw-blue/20 transition-all duration-200 resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="jfw-contact-submit w-full inline-flex items-center justify-center gap-3 bg-jfw-blue hover:bg-jfw-blue-dark text-jfw-black font-heading text-sm uppercase tracking-[0.2em] px-8 py-4 rounded-lg transition-all duration-300 hover:shadow-jfw-glow-lg"
      >
        Send Message
        <Send size={16} strokeWidth={2.5} />
      </button>
    </form>
  );
}

/* ─────────────────────────────────────────────
   Contact Info Sidebar
   ───────────────────────────────────────────── */
function ContactInfo() {
  return (
    <div className="jfw-contact-info space-y-8">
      {/* Email */}
      <div className="jfw-contact-info-card p-6 bg-jfw-dark border border-jfw-gray rounded-xl">
        <div className="flex items-start gap-4">
          <div className="jfw-contact-info-icon w-10 h-10 rounded-full bg-jfw-blue/10 flex items-center justify-center flex-shrink-0">
            <Mail size={18} className="text-jfw-blue" />
          </div>
          <div>
            <h3 className="font-heading text-xs uppercase tracking-[0.2em] text-jfw-white mb-1">
              Email Us
            </h3>
            <a
              href="mailto:support@journeyfitnesswear.com"
              className="font-body text-sm text-gray-400 hover:text-jfw-blue transition-colors duration-200"
            >
              support@journeyfitnesswear.com
            </a>
          </div>
        </div>
      </div>

      {/* Response Time */}
      <div className="jfw-contact-info-card p-6 bg-jfw-dark border border-jfw-gray rounded-xl">
        <div className="flex items-start gap-4">
          <div className="jfw-contact-info-icon w-10 h-10 rounded-full bg-jfw-blue/10 flex items-center justify-center flex-shrink-0">
            <Clock size={18} className="text-jfw-blue" />
          </div>
          <div>
            <h3 className="font-heading text-xs uppercase tracking-[0.2em] text-jfw-white mb-1">
              Response Time
            </h3>
            <p className="font-body text-sm text-gray-400">
              We typically respond within 24–48 hours during business days.
            </p>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="jfw-contact-info-card p-6 bg-jfw-dark border border-jfw-gray rounded-xl">
        <div className="flex items-start gap-4">
          <div className="jfw-contact-info-icon w-10 h-10 rounded-full bg-jfw-blue/10 flex items-center justify-center flex-shrink-0">
            <MapPin size={18} className="text-jfw-blue" />
          </div>
          <div>
            <h3 className="font-heading text-xs uppercase tracking-[0.2em] text-jfw-white mb-1">
              Based In
            </h3>
            <p className="font-body text-sm text-gray-400">
              United States
            </p>
            <p className="font-body text-xs text-gray-500 mt-1">
              Shipping worldwide via Printful
            </p>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="jfw-contact-social p-6 bg-jfw-dark border border-jfw-gray rounded-xl">
        <h3 className="font-heading text-xs uppercase tracking-[0.2em] text-jfw-white mb-4">
          Follow Us
        </h3>
        <div className="flex items-center gap-3">
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="jfw-contact-social-link w-10 h-10 rounded-full bg-jfw-black border border-jfw-gray flex items-center justify-center text-gray-500 hover:text-jfw-blue hover:border-jfw-blue/30 transition-all duration-200 hover:shadow-jfw-glow"
            aria-label="Instagram"
          >
            <Instagram size={18} />
          </a>
          <a
            href={SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="jfw-contact-social-link w-10 h-10 rounded-full bg-jfw-black border border-jfw-gray flex items-center justify-center text-gray-500 hover:text-jfw-blue hover:border-jfw-blue/30 transition-all duration-200 hover:shadow-jfw-glow"
            aria-label="Facebook"
          >
            <Facebook size={18} />
          </a>
          <a
            href={SOCIAL_LINKS.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="jfw-contact-social-link w-10 h-10 rounded-full bg-jfw-black border border-jfw-gray flex items-center justify-center text-gray-500 hover:text-jfw-blue hover:border-jfw-blue/30 transition-all duration-200 hover:shadow-jfw-glow"
            aria-label="Twitter"
          >
            <Twitter size={18} />
          </a>
          <a
            href={SOCIAL_LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="jfw-contact-social-link w-10 h-10 rounded-full bg-jfw-black border border-jfw-gray flex items-center justify-center text-gray-500 hover:text-jfw-blue hover:border-jfw-blue/30 transition-all duration-200 hover:shadow-jfw-glow"
            aria-label="YouTube"
          >
            <Youtube size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}
