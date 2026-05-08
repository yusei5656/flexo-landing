"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, animate, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, GraduationCap, ShieldCheck, Check, Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

const gradientTextStyle = {
  backgroundImage: "linear-gradient(135deg, #22d3ee 0%, #3b82f6 50%, #8b5cf6 100%)",
  WebkitBackgroundClip: "text" as const,
  backgroundClip: "text" as const,
  WebkitTextFillColor: "transparent" as const,
  color: "transparent",
};

// Animated number that counts from 0 when in view
function AnimatedNumber({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (val) => setDisplay(val),
    });
    return () => controls.stop();
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {display.toFixed(decimals)}%
    </span>
  );
}

const navLinks = [
  { id: "vision", label: "Vision" },
  { id: "trust", label: "Trust" },
  { id: "voices", label: "Voices" },
  { id: "how", label: "How it works" },
  { id: "founder", label: "Story" },
];

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeRole, setActiveRole] = useState<"worker" | "employer">("employer");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const { error } = await supabase
        .from("waitlist")
        .insert({
          name: name.trim(),
          email: email.toLowerCase().trim(),
        });

      if (error) {
        if (error.code === "23505") {
          setErrorMsg("You're already on the list. We'll be in touch!");
        } else {
          setErrorMsg("Something went wrong. Please try again.");
        }
        setStatus("error");
        return;
      }

      setStatus("success");
      setEmail("");
      setName("");
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <main className="min-h-screen bg-white text-black">
      {/* NAV */}
      <nav className="sticky top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <button
            onClick={() => scrollTo("top")}
            className="text-xl font-bold tracking-tight"
          >
            Flexo
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="hover:text-black transition"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side: Join waitlist + Mobile hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollTo("waitlist")}
              className="px-5 py-2 bg-black text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition whitespace-nowrap"
            >
              Join waitlist
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1 text-black"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-white z-[60] md:hidden"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div className="text-xl font-bold tracking-tight">Flexo</div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                    onClick={() => scrollTo(link.id)}
                    className="text-3xl font-bold text-black hover:text-gray-500 transition"
                  >
                    {link.label}
                  </motion.button>
                ))}
              </div>

              <div className="px-6 pb-12">
                <button
                  onClick={() => scrollTo("waitlist")}
                  className="w-full px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                  Join the waitlist
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top anchor */}
      <div id="top" />

      {/* === 1. HERO VIDEO === */}
      <section className="px-4 md:px-6 pt-8 pb-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl overflow-hidden mb-24"
            style={{ aspectRatio: "21 / 9" }}
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="/hero.mp4" type="video/mp4" />
            </video>
          </motion.div>

          {/* === 2. HERO COPY === */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-center max-w-5xl mx-auto"
          >
            <p className="label-en text-gray-500 mb-8">FLEXO · MATCH · TRAIN · VERIFY</p>
            <h1 className="heading-display text-5xl md:text-7xl lg:text-8xl mb-10 text-black leading-tight">
              <span className="block text-black">Looking for work?</span>
              <span className="block text-black">Looking for workers?</span>
              <span className="block mt-4" style={gradientTextStyle}>Flexo.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
              The workforce platform that instantly matches workers and businesses — built on speed, skill, and respect.
            </p>
            <button
              onClick={() => scrollTo("waitlist")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition group"
            >
              Join the waitlist
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* === 3. STATS === */}
      <section className="px-4 md:px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <div className="border-y border-gray-200 py-16 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-4">
              {[
                { value: 84, decimals: 0, label: "want faster hiring" },
                { value: 77, decimals: 0, label: "still rely on walk-ins" },
                { value: 28.1, decimals: 1, label: "struggle with skill assessment" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div
                    className="text-5xl md:text-7xl font-black mb-3 tracking-tight tabular-nums"
                    style={gradientTextStyle}
                  >
                    <AnimatedNumber value={stat.value} decimals={stat.decimals} />
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 uppercase tracking-widest font-semibold leading-tight px-2">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400 mt-12 italic">
              Source: Flexo restaurant employer and manager survey, Dec 2025 – Mar 2026
            </p>
          </div>
        </motion.div>
      </section>

      {/* === 4. NEW CATEGORY: Full-time. Part-time. + Flexo. === */}
      <section className="py-32 md:py-48 px-6 border-t border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center"
        >
          <p className="label-en text-gray-400 mb-10">A NEW CATEGORY</p>
          <h2 className="heading-display text-5xl md:text-7xl lg:text-8xl text-black mb-12 leading-tight">
            <span className="block text-black">Full-time.</span>
            <span className="block text-black">Part-time.</span>
            <span className="block mt-6" style={gradientTextStyle}>+ Flexo.</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            A new way to work — one that fits your life, not the other way around. Built for the people who keep cities running.
          </p>
        </motion.div>
      </section>

      {/* === 5. BRIDGE / VISION (For workers / For employers) === */}
      <section id="vision" className="py-32 md:py-48 px-6 border-t border-gray-100 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-20">
            <p className="label-en text-gray-400 mb-8">A BRIDGE, NOT A MARKETPLACE</p>
            <h2 className="heading-display text-5xl md:text-7xl text-black mb-10">
              Connecting people<br />
              and the work<br />
              that <span style={gradientTextStyle}>needs them.</span>
            </h2>
            <p className="text-sm text-gray-500 mt-6">Tap a card to switch view</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* For Workers */}
            <button
              type="button"
              onClick={() => setActiveRole("worker")}
              className={`text-left rounded-3xl p-10 md:p-14 transition-all duration-500 cursor-pointer ${
                activeRole === "worker" ? "bg-black" : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <p className={`label-en mb-6 transition-colors duration-500 ${
                activeRole === "worker" ? "text-gray-400" : "text-gray-500"
              }`}>
                FOR WORKERS
              </p>
              <h3 className={`heading-section text-3xl md:text-4xl mb-8 transition-colors duration-500 ${
                activeRole === "worker" ? "text-white" : "text-black"
              }`}>
                A way in,<br />on your terms.
              </h3>
              <ul className={`space-y-4 text-lg transition-colors duration-500 ${
                activeRole === "worker" ? "text-white/80" : "text-gray-700"
              }`}>
                {[
                  "Job opportunities, instantly visible",
                  "Language support, built in",
                  "Cultural respect, by default",
                  "Skill training through Flexo Sense",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className={`font-bold transition-colors duration-500 ${
                      activeRole === "worker" ? "text-white" : "text-black"
                    }`}>·</span> {item}
                  </li>
                ))}
              </ul>
            </button>

            {/* For Employers */}
            <button
              type="button"
              onClick={() => setActiveRole("employer")}
              className={`text-left rounded-3xl p-10 md:p-14 transition-all duration-500 cursor-pointer ${
                activeRole === "employer" ? "bg-black" : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <p className={`label-en mb-6 transition-colors duration-500 ${
                activeRole === "employer" ? "text-gray-400" : "text-gray-500"
              }`}>
                FOR EMPLOYERS
              </p>
              <h3 className={`heading-section text-3xl md:text-4xl mb-8 transition-colors duration-500 ${
                activeRole === "employer" ? "text-white" : "text-black"
              }`}>
                A team,<br />when you need one.
              </h3>
              <ul className={`space-y-4 text-lg transition-colors duration-500 ${
                activeRole === "employer" ? "text-white/80" : "text-gray-700"
              }`}>
                {[
                  "Fast & reliable staffing",
                  "Automated matching solutions",
                  "Stable, repeatable operations",
                  "Verified profiles, day one",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className={`font-bold transition-colors duration-500 ${
                      activeRole === "employer" ? "text-white" : "text-black"
                    }`}>·</span> {item}
                  </li>
                ))}
              </ul>
            </button>
          </div>
        </motion.div>
      </section>

      {/* === 6. VOICES === */}
      <section id="voices" className="py-32 md:py-48 px-6 border-t border-gray-100 bg-gray-50 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-20">
            <p className="label-en text-gray-500 mb-8">REAL VOICES, REAL PROBLEMS</p>
            <h2 className="heading-display text-5xl md:text-7xl text-black">
              Four people.<br />
              One broken system.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                quote: "I want to work to earn more money. Where can I find work fast for short term?",
                persona: "Student, 18",
              },
              {
                quote: "I'm looking for new opportunities, but how can I find work that fits my schedule?",
                persona: "Part-time worker, 32",
              },
              {
                quote: "I know exactly who's holding this place together — but I'm afraid of losing them.",
                persona: "HR Manager, 36",
              },
              {
                quote: "I've been hiring for weeks and still can't find the right person. Where can I find a worker fast?",
                persona: "Business Owner, 45",
              },
            ].map((v) => (
              <div key={v.persona} className="bg-white border border-gray-200 rounded-3xl p-10 hover:border-black transition">
                <p className="text-xl md:text-2xl text-black font-medium leading-relaxed mb-6">
                  &ldquo;{v.quote}&rdquo;
                </p>
                <p className="label-en text-gray-500">— {v.persona}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mt-16 leading-relaxed">
            Different lives, different needs — but all stuck in the same outdated system. Flexo is built to answer all of them, at once.
          </p>
        </motion.div>
      </section>

      {/* === 7. TRUST === */}
      <section id="trust" className="px-4 md:px-6 py-16 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <div className="bg-black rounded-3xl py-32 md:py-48 px-8 md:px-16">
            <div className="text-center mb-20">
              <p className="label-en text-gray-500 mb-8">TRUST</p>
              <h2 className="heading-display text-5xl md:text-7xl text-white mb-10">
                Trust isn&apos;t a feature.<br />
                It&apos;s the foundation.
              </h2>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
                Three integrated systems work together so every shift on Flexo is filled by someone ready, vetted, and reliable.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {[
                {
                  icon: <Zap className="w-8 h-8" />,
                  num: "I — MATCH",
                  title: "Instant Matching",
                  desc: "Businesses post shifts in minutes. Nearby workers are notified instantly. Staff secured within hours, not weeks.",
                },
                {
                  icon: <GraduationCap className="w-8 h-8" />,
                  num: "II — TRAIN",
                  title: "Flexo Sense",
                  desc: "Workers build industry-specific soft and practical skills through AI-powered roleplay before they even apply.",
                },
                {
                  icon: <ShieldCheck className="w-8 h-8" />,
                  num: "III — VERIFY",
                  title: "Verified Profiles",
                  desc: "Training completion and past shift ratings are visible on every profile. Hire with confidence, day one.",
                },
              ].map((pillar) => (
                <div key={pillar.num} className="text-center">
                  <div className="text-white/60 mb-6 flex justify-center">{pillar.icon}</div>
                  <p className="label-en text-white/40 mb-3">{pillar.num}</p>
                  <h3 className="text-2xl font-bold text-white mb-4">{pillar.title}</h3>
                  <p className="text-white/70 leading-relaxed">{pillar.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* === 8. HOW IT WORKS === */}
      <section id="how" className="py-32 md:py-48 px-6 border-t border-gray-100 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-20">
            <p className="label-en text-gray-500 mb-8">HOW IT WORKS</p>
            <h2 className="heading-display text-5xl md:text-7xl text-black">
              From idea to income,<br />
              in four steps.
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { step: "01", title: "Post a shift", desc: "Employers set pay, time, and required skills in minutes." },
              { step: "02", title: "Pick a shift", desc: "Workers see nearby openings and claim what fits their day." },
              { step: "03", title: "Get matched fast", desc: "The system pairs ready workers with the right shifts — within hours." },
              { step: "04", title: "Work, get paid, build trust", desc: "Complete the shift. Get paid. Earn ratings that grow your reputation." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="text-7xl font-black text-black/10 mb-4">{s.step}</div>
                <h3 className="text-xl md:text-2xl font-bold text-black mb-3">{s.title}</h3>
                <p className="text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* === 9. A STANDARD, REDEFINED === */}
      <section className="py-32 md:py-48 px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <p className="label-en text-gray-400 mb-8">OUR STANDARD</p>
          <h2 className="heading-display text-5xl md:text-7xl text-black mb-10">
            A standard,<br />
            <span style={gradientTextStyle}>redefined.</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Flexo is more than an app. It&apos;s a quiet argument that shift work deserves the same care, design, and respect as any other kind of work. We built it for the people who keep cities running. We hope you&apos;ll see the difference.
          </p>
        </motion.div>
      </section>

      {/* === 10. STORY === */}
      <section id="founder" className="py-32 md:py-48 px-6 border-t border-gray-100 bg-gray-50 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-16">
            <p className="label-en text-gray-500 mb-6">STORY</p>
            <h2 className="heading-display text-4xl md:text-6xl text-black">
              Why Flexo exists.
            </h2>
          </div>

          <div className="space-y-8 text-lg md:text-xl text-gray-700 leading-relaxed italic">
            <p>
              Born from my experiences living across different countries, cultures, and communities, Flexo was inspired by the challenges, voices, and stories of people from many different backgrounds.
            </p>
            <p>
              Flexo&apos;s mission is to help create a society where differences are embraced with respect, and where people feel more connected to one another.
            </p>
            <p className="text-black">
              Helping even one more person look forward to tomorrow — through Flexo.
            </p>
          </div>

          {/* Signature */}
          <div className="mt-16 pt-10 border-t border-gray-200">
            <p className="text-base font-bold text-black not-italic">Yusei Okada</p>
            <p className="text-sm text-gray-500 mt-1 not-italic">Founder, Flexo</p>
          </div>
        </motion.div>
      </section>

      {/* === 11. WAITLIST === */}
      <section id="waitlist" className="py-32 md:py-48 px-6 border-t border-gray-100 scroll-mt-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="label-en text-gray-500 mb-6">LAUNCHING SOON</p>
          <h2 className="heading-display text-5xl md:text-7xl text-black mb-8">
            Be among the<br />
            <span style={gradientTextStyle}>first to know.</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-xl mx-auto leading-relaxed">
            Join the waitlist and we&apos;ll let you know the moment Flexo goes live. Early members will receive exclusive perks at launch.
          </p>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black text-white rounded-3xl p-12 max-w-md mx-auto"
            >
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">You&apos;re in.</h3>
              <p className="text-white/70">
                Thanks for joining{name ? `, ${name}` : ""}. We&apos;ll be in touch when Flexo launches.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-3">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-6 py-4 border border-gray-200 rounded-full focus:outline-none focus:border-black transition text-base"
                disabled={status === "loading"}
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-6 py-4 border border-gray-200 rounded-full focus:outline-none focus:border-black transition text-base"
                  disabled={status === "loading"}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {status === "loading" ? (
                    "Joining..."
                  ) : (
                    <>
                      Join
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </>
                  )}
                </button>
              </div>

              {errorMsg && (
                <p className="text-sm text-red-500 mt-4">{errorMsg}</p>
              )}

              <p className="text-xs text-gray-400 mt-6">
                No spam. Just one email when we&apos;re ready. Unsubscribe anytime.
              </p>
            </form>
          )}
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500">
          {/* Left: Logo + Instagram */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="font-bold text-black text-lg">Flexo</div>
            <a
              href="https://www.instagram.com/flexo.ca"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow Flexo on Instagram"
              className="flex items-center gap-2 group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <defs>
                  <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f09433" />
                    <stop offset="25%" stopColor="#e6683c" />
                    <stop offset="50%" stopColor="#dc2743" />
                    <stop offset="75%" stopColor="#cc2366" />
                    <stop offset="100%" stopColor="#bc1888" />
                  </linearGradient>
                </defs>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="url(#instagram-gradient)" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="url(#instagram-gradient)" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="url(#instagram-gradient)" />
              </svg>
              <span className="text-gray-600 group-hover:text-black transition font-medium">
                @flexo.ca
              </span>
            </a>
          </div>

          {/* Center: Legal links */}
          <div className="flex items-center gap-6">
            <a
              href="https://yusei5656.github.io/Flexo-Legal/Privacy-policy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition"
            >
              Privacy
            </a>
            <a
              href="https://yusei5656.github.io/Flexo-Legal/Terms.html"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition"
            >
              Terms
            </a>
            <a
              href="mailto:flexoapp.team@gmail.com"
              className="hover:text-black transition"
            >
              Contact
            </a>
          </div>

          {/* Right: Copyright */}
          <div>© 2026 Flexo. All rights reserved.</div>
        </div>
      </footer>
    </main>
  );
}
