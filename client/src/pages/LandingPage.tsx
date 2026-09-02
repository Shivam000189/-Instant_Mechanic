import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Menu, X } from 'lucide-react';

/* ─── Reusable UI ─── */
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs uppercase tracking-[0.05em] text-[#8e8e93] mb-3">
    {children}
  </p>
);

/* ─── Loader ─── */
function Loader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white transition-opacity duration-800">
      <div
        className="text-[clamp(3rem,8vw,6rem)] font-black tracking-[-0.03em] opacity-0 translate-y-8 animate-loader-fade-up"
        style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
      >
        Instant Mechanic<sup className="text-[0.4em] align-super font-bold">™</sup>
      </div>
      <div
        className="text-[clamp(0.9rem,2vw,1.1rem)] text-[#3a3a3c] mt-2 opacity-0 translate-y-5 animate-loader-fade-up"
        style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
      >
        Live Vehicle Service Operations
      </div>

      <style>{`
        @keyframes loaderFadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-loader-fade-up {
          animation: loaderFadeUp 1s ease forwards;
        }
      `}</style>
    </div>
  );
}

/* ─── Navigation ─── */
function Navbar({ onMenuOpen }: { onMenuOpen: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[1000] flex items-center justify-between px-5 md:px-10 py-5 transition-all duration-400 ${
        scrolled ? 'bg-[rgba(10,10,10,0.95)] backdrop-blur-xl py-3.5' : 'bg-transparent'
      }`}
    >
      <a href="#hero" className="text-white text-xl md:text-[1.4rem] font-extrabold tracking-[-0.02em] no-underline">
        Instant Mechanic<sup className="text-[0.5em] align-super">™</sup>
      </a>

      <div className="flex items-center gap-4 md:gap-5">
        {/* <a
          href="#contact"
          className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#0a0a0a] text-sm font-semibold hover:bg-white/90 transition-all shadow-md no-underline"
        >
          Book a Service
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a> */}
        <div className="hidden sm:flex gap-3.5 text-white opacity-80">
          <a href="#" className="hover:opacity-100 transition-opacity text-lg" aria-label="Twitter">𝕏</a>
          <a href="#" className="hover:opacity-100 transition-opacity text-lg" aria-label="Instagram">◎</a>
          <a href="#" className="hover:opacity-100 transition-opacity text-lg" aria-label="Facebook">ⓕ</a>
        </div>
        <button
          onClick={onMenuOpen}
          className="flex items-center gap-2.5 bg-none border-none text-white text-[1.1rem] font-semibold cursor-pointer"
        >
          <span className="hidden sm:inline">Menu</span>
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}

/* ─── Menu Overlay ─── */
function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const links = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#projects' },
    { label: 'Reviews', href: '#testimonials' },
    { label: 'Book a Service', href: '#contact' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <div
      className={`fixed inset-0 z-[999] flex transition-all duration-500 ${
        open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
      }`}
    >
      <div className="hidden md:block flex-1 overflow-hidden rounded-2xl m-[60px_0_60px_40px]">
        <img
          src="https://image.qwenlm.ai/public_source/166b2a19-7d9a-4e5a-b102-c13a809f544c/1671372fc-73dd-4932-b9e5-ca80f006c517.png"
          alt="Auto workshop"
          className={`w-full h-full object-cover rounded-2xl transition-transform duration-800 ${
            open ? 'scale-100' : 'scale-110'
          }`}
        />
      </div>

      <div className="flex-1 flex flex-col justify-center px-10 md:px-[60px] bg-[#0a0a0a]">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white md:hidden"
        >
          <X className="w-8 h-8" />
        </button>

        {links.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            onClick={onClose}
            className={`text-white no-underline font-bold py-3 text-[clamp(2rem,4vw,3.5rem)] tracking-[-0.02em] transition-all duration-400 hover:text-[#8e8e93] ${
              open ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
            style={{ transitionDelay: open ? `${0.1 + i * 0.05}s` : '0s' }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

/* ─── Hero ─── */
function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen min-h-[700px] flex items-end pb-16 md:pb-20 px-5 md:px-10 overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <img
          src="https://image.qwenlm.ai/public_source/166b2a19-7d9a-4e5a-b102-c13a809f544c/183252df6-f7b4-49f6-94b4-c5ae5278398a.png"
          alt="Mechanic working on engine"
          className="w-full h-full object-cover brightness-50 animate-hero-zoom"
        />
      </div>

      <div className="relative z-10 max-w-full">
        <h1 className="text-[clamp(4rem,12vw,11rem)] font-black text-white leading-[0.95] tracking-[-0.04em] opacity-0 translate-y-[60px] animate-fade-up"
          style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}
        >
          Reliable
          <span className="block text-[0.55em] font-extrabold mt-2.5">Vehicle Service</span>
        </h1>

        <div
          className="mt-8 max-w-[380px] opacity-0 translate-y-[30px] animate-fade-up"
          style={{ animationDelay: '1.8s', animationFillMode: 'forwards' }}
        >
          <p className="text-white/85 text-[0.95rem] leading-relaxed">
            Real-time operations dashboard for managing bookings, mechanics, customers and revenue — all in one place.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2.5 mt-6 px-7 py-3.5 bg-white text-[#0a0a0a] rounded-full text-[0.95rem] font-semibold opacity-0 translate-y-[30px] animate-fade-up transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] no-underline"
            style={{ animationDelay: '2s', animationFillMode: 'forwards' }}
          >
            Book a Service
            <span className="w-5 h-5 bg-[#0a0a0a] rounded-full flex items-center justify-center text-white text-[0.7rem]">
              <ArrowUpRight className="w-3 h-3" />
            </span>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes heroZoom {
          0% { transform: scale(1.05); }
          100% { transform: scale(1.12); }
        }
        .animate-hero-zoom {
          animation: heroZoom 20s ease infinite alternate;
        }
        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          animation: fadeUp 1s ease forwards;
        }
      `}</style>
    </section>
  );
}

/* ─── Counter Hook ─── */
function useCountUp(target: number, start: boolean) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf: number;
    const duration = 2000;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start]);

  return value;
}

/* ─── Stat Card ─── */
function StatCard({
  target,
  suffix,
  title,
  desc,
  dark,
  delay,
  visible,
}: {
  target: number;
  suffix: string;
  title: string;
  desc: string;
  dark?: boolean;
  delay: number;
  visible: boolean;
}) {
  const count = useCountUp(target, visible);

  return (
    <div
      className={`rounded-[20px] p-8 md:p-10 transition-all duration-600 ${
        dark ? 'bg-[#1a1a2e] text-white' : 'bg-[#f5f5f7]'
      } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-[clamp(2.5rem,5vw,4rem)] font-black tracking-[-0.03em] mb-4">
        {count}
        {suffix}
      </div>
      <div className={`w-full h-px mb-4 ${dark ? 'bg-white/20' : 'bg-[#e8e8ed]'}`} />
      <div className="text-[1.15rem] font-bold mb-2">{title}</div>
      <div className={`text-[0.88rem] leading-relaxed ${dark ? 'text-white/60' : 'text-[#8e8e93]'}`}>
        {desc}
      </div>
    </div>
  );
}

/* ─── About Section ─── */
function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" className="py-20 md:py-[120px] px-5 md:px-10 bg-white" ref={ref}>
      <div
        className={`mb-14 md:mb-[60px] transition-all duration-800 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <SectionLabel>Who we are</SectionLabel>
        <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black tracking-[-0.03em] leading-[1.05]">
          Built on trust
          <br />
          and precision
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1200px] mx-auto">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <StatCard
            target={12}
            suffix="+"
            title="Certified Mechanics"
            desc="Expert technicians ready to handle all types of vehicle repairs and diagnostics."
            delay={0}
            visible={visible}
          />
          <StatCard
            target={500}
            suffix="+"
            title="Services Completed"
            desc="Successfully delivered vehicle service operations across different fleets."
            dark
            delay={200}
            visible={visible}
          />
        </div>

        {/* Center Column */}
        <div className="hidden lg:flex flex-col gap-6">
          <div
            className={`flex-1 rounded-[20px] overflow-hidden relative transition-all duration-600 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '0.2s' }}
          >
            <img
              src="https://image.qwenlm.ai/public_source/166b2a19-7d9a-4e5a-b102-c13a809f544c/1b545dee1-f512-4f3c-a428-a22a8f8af956.png"
              alt="Mechanic team"
              className="w-full h-full object-cover rounded-[20px]"
            />
            <div className="absolute bottom-6 left-6 text-white text-[1.1rem] font-semibold drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              Trusted by fleet operators
              <br />
              across the city
            </div>
          </div>
          <div
            className={`flex-1 rounded-[20px] overflow-hidden relative transition-all duration-600 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '0.3s' }}
          >
            <img
              src="https://image.qwenlm.ai/public_source/166b2a19-7d9a-4e5a-b102-c13a809f544c/1e58657c5-2390-4f2d-8f03-c3c341579baf.png"
              alt="Fleet manager with tablet"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-6 left-6 text-white text-[1.1rem] font-semibold drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              Team Members
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <StatCard
            target={100}
            suffix="%"
            title="Client Satisfaction"
            desc="We ensure every service is completed with care, quality, and full customer satisfaction."
            delay={100}
            visible={visible}
          />
          <StatCard
            target={24}
            suffix="/7"
            title="Support Available"
            desc="Reach us anytime. Responsive and always ready to help with urgent repairs."
            delay={300}
            visible={visible}
          />
        </div>
      </div>
    </section>
  );
}

/* ─── Logo Carousel ─── */
function LogoCarousel() {
  const logos = ['FLEETCO', 'AUTOMAX', 'DRIVEON', 'MOTOPLUS', 'VEHICARE', 'TURBOFIX'];

  return (
    <section className="py-16 md:py-20 px-5 md:px-10 bg-white overflow-hidden">
      <div className="flex gap-10 animate-scroll w-max">
        {[...logos, ...logos].map((name, i) => (
          <div
            key={i}
            className="shrink-0 w-[200px] h-[100px] bg-[#f5f5f7] rounded-2xl flex items-center justify-center text-2xl font-extrabold text-[#3a3a3c] tracking-[-0.02em]"
          >
            {name}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 20s linear infinite;
        }
      `}</style>
    </section>
  );
}

/* ─── Projects / Services ─── */
function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const projects = [
    {
      name: 'Engine Diagnostics',
      category: 'Inspection',
      meta: 'Fleet • 2026',
      img: 'https://image.qwenlm.ai/public_source/166b2a19-7d9a-4e5a-b102-c13a809f544c/16b936d9d-57cd-4fda-a3c0-210a34bed8bd.png',
    },
    {
      name: 'Fleet Maintenance',
      category: 'Service',
      meta: 'Commercial • 2026',
      img: 'https://image.qwenlm.ai/public_source/166b2a19-7d9a-4e5a-b102-c13a809f544c/1671372fc-73dd-4932-b9e5-ca80f006c517.png',
    },
    {
      name: 'Brake System Repair',
      category: 'Repair',
      meta: 'Residential • 2026',
      img: 'https://image.qwenlm.ai/public_source/166b2a19-7d9a-4e5a-b102-c13a809f544c/1a8477124-e380-41dc-b431-ae54eca3e4cf.png',
    },
    {
      name: 'Dashboard Integration',
      category: 'Technology',
      meta: 'Enterprise • 2025',
      img: 'https://image.qwenlm.ai/public_source/166b2a19-7d9a-4e5a-b102-c13a809f544c/100e14376-577b-4ffd-b983-b0140c8dcecd.png',
    },
  ];

  return (
    <section id="projects" className="py-20 md:py-[120px] px-5 md:px-10 bg-[#f5f5f7]" ref={ref}>
      <div
        className={`mb-14 md:mb-[60px] transition-all duration-800 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <SectionLabel>Our Services</SectionLabel>
        <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black tracking-[-0.03em] leading-[1.05]">
          See our work
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1200px] mx-auto">
        {projects.map((p, i) => (
          <div
            key={p.name}
            className={`bg-white rounded-[20px] overflow-hidden cursor-pointer transition-all duration-600 hover:-translate-y-1 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: `${i * 0.12}s` }}
          >
            <div className="h-[300px] md:h-[380px] overflow-hidden">
              <img
                src={p.img}
                alt={p.name}
                className="w-full h-full object-cover transition-transform duration-600 hover:scale-105"
              />
            </div>
            <div className="p-6 md:px-8 md:py-7 flex justify-between items-start">
              <div>
                <div className="text-[1.3rem] font-bold mb-1">{p.name}</div>
                <div className="text-[0.85rem] text-[#8e8e93]">{p.category}</div>
              </div>
              <div className="text-[0.8rem] text-[#8e8e93] text-right">{p.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Testimonials ─── */
const testimonials = [
  {
    name: 'Daniel Cooper',
    role: 'Fleet Operations Manager',
    text: 'Quick and reliable service, fixed everything perfectly. The dashboard gives us complete visibility into our fleet operations. Very satisfied and would gladly recommend them to anyone.',
    rating: 4.9,
    reviews: '250+',
  },
  {
    name: 'Sarah Mitchell',
    role: 'Logistics Director',
    text: 'The real-time tracking and booking system transformed how we manage our vehicle fleet. Downtime reduced by 40% in the first quarter alone.',
    rating: 4.8,
    reviews: '180+',
  },
  {
    name: 'James Rodriguez',
    role: 'Fleet Owner',
    text: 'Outstanding service quality and the operations dashboard is incredibly intuitive. Our mechanics are more productive and our customers are happier.',
    rating: 5.0,
    reviews: '320+',
  },
];

function TestimonialsSection() {
  const [idx, setIdx] = useState(0);
  const t = testimonials[idx];

  const next = () => setIdx((i) => (i + 1) % testimonials.length);
  const prev = () => setIdx((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="testimonials" className="py-20 md:py-[120px] px-5 md:px-10 bg-white">
      <div className="mb-14 md:mb-[60px]">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs uppercase tracking-[0.05em] text-[#8e8e93]">
            What Clients Say
          </span>
          <span className="text-xs uppercase tracking-[0.05em] text-[#8e8e93]">
            Their words
          </span>
        </div>
        <div className="w-full h-px bg-[#0a0a0a] mb-10" />
        <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black tracking-[-0.03em] leading-[1.05]">
          Testimonials
          <span className="block text-[0.5em] font-bold text-[#3a3a3c] mt-2">
            In their own words
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-10 max-w-[1200px] mx-auto items-center">
        <div className="rounded-[20px] overflow-hidden h-[300px] md:h-[400px]">
          <img
            src="https://image.qwenlm.ai/public_source/166b2a19-7d9a-4e5a-b102-c13a809f544c/1e58657c5-2390-4f2d-8f03-c3c341579baf.png"
            alt="Client"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="bg-[#f5f5f7] rounded-[20px] p-8 md:p-12 relative">
          <div className="text-[4rem] font-black leading-none mb-4 text-[#0a0a0a]">"</div>
          <p className="text-[1.2rem] md:text-[1.4rem] font-medium leading-relaxed tracking-[-0.01em] mb-8">
            {t.text}
          </p>
          <div className="font-bold text-base mb-1">{t.name}</div>
          <div className="text-[0.85rem] text-[#8e8e93]">{t.role}</div>

          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[#e8e8ed]">
            <div className="flex">
              {['DC', 'JM', 'SK'].map((initials, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full bg-[#e8e8ed] border-2 border-white -ml-2.5 first:ml-0 flex items-center justify-center text-[0.7rem] font-bold text-[#3a3a3c]"
                >
                  {initials}
                </div>
              ))}
            </div>
            <div>
              <div>
                <span className="text-[#f5a623] tracking-widest text-sm">★★★★★</span>{' '}
                <span className="font-bold text-sm">{t.rating}</span>
              </div>
              <div className="text-[0.8rem] text-[#8e8e93]">Based on {t.reviews} Reviews</div>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-[#e8e8ed] bg-white flex items-center justify-center text-lg transition-all hover:bg-[#0a0a0a] hover:text-white hover:border-[#0a0a0a]"
            >
              ←
            </button>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-[#e8e8ed] bg-white flex items-center justify-center text-lg transition-all hover:bg-[#0a0a0a] hover:text-white hover:border-[#0a0a0a]"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Process Section ─── */
function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="process" className="py-20 md:py-[120px] px-5 md:px-10 bg-[#0a0a0a]" ref={ref}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[1000px] mx-auto">
        {[
          {
            icon: '📋',
            title: 'Schedule Service',
            text: 'Once you approve the estimate, we arrange a convenient date and time that works with your schedule. Our team coordinates every detail to ensure the service is delivered smoothly and without unnecessary delays.',
            btn: 'Book Now',
            bg: 'bg-white text-[#0a0a0a]',
            iconBg: 'bg-[#0a0a0a] text-white',
          },
          {
            icon: '✓',
            title: 'Work Completed',
            text: 'Our experienced team arrives on time and completes the work with attention to quality, safety, and lasting results. Before finishing, we ensure everything meets expectations, leaving your vehicle clean, functional, and ready to drive.',
            btn: 'Get a Free Quote',
            bg: 'bg-[#c0c0c0] text-[#0a0a0a]',
            iconBg: 'bg-[#0a0a0a] text-white',
          },
        ].map((card, i) => (
          <div
            key={card.title}
            className={`rounded-[20px] p-10 md:p-[60px_48px] text-center transition-all duration-600 ${card.bg} ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: `${i * 0.2}s` }}
          >
            <div
              className={`w-14 h-14 mx-auto mb-6 rounded-[14px] flex items-center justify-center text-2xl ${card.iconBg}`}
            >
              {card.icon}
            </div>
            <h3 className="text-[1.8rem] font-extrabold mb-4 tracking-[-0.02em]">{card.title}</h3>
            <p className="text-[0.92rem] leading-relaxed opacity-70 mb-7">{card.text}</p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-[#0a0a0a] text-white rounded-full text-[0.9rem] font-semibold no-underline transition-transform hover:-translate-y-0.5"
            >
              {card.btn}
              <span className="w-[22px] h-[22px] bg-white rounded-full flex items-center justify-center text-[#0a0a0a] text-[0.7rem]">
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer id="contact" className="bg-[#0a0a0a] pt-16 md:pt-20 pb-8 md:pb-10 px-5 md:px-10 text-white">
      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-10 md:gap-[60px] pb-10 md:pb-[60px] border-b border-white/15">
        <div>
          <div className="text-[clamp(3rem,7vw,6rem)] font-black tracking-[-0.04em] leading-none">
            Instant Mechanic<sup className="text-[0.35em] align-super">™</sup>
          </div>
          <p className="text-[0.9rem] text-white/60 mt-5 max-w-[400px] leading-relaxed">
            Expert technicians delivering refined, reliable care for every detail of your vehicle operations.
          </p>
        </div>

        <div>
          <h4 className="text-[0.85rem] text-white/50 mb-4 uppercase tracking-[0.05em]">Contact</h4>
          <p className="text-[0.95rem] text-white/85 mb-2">(555) 019-9234</p>
          <p className="text-[0.95rem] text-white/85 mb-2">hello@instantmechanic.com</p>
          <p className="text-[0.95rem] text-white/85 mb-4">
            123 Maple Street, Suite 200
            <br />
            Austin, TX 78701
          </p>
          <div className="flex gap-3.5">
            {['𝕏', '◎', 'ⓕ'].map((s, i) => (
              <a key={i} href="#" className="text-white opacity-70 hover:opacity-100 transition-opacity text-base">
                {s}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[0.85rem] text-white/50 mb-4 uppercase tracking-[0.05em]">Navigation</h4>
          {[
            { label: 'Home', href: '#hero' },
            { label: 'About', href: '#about' },
            { label: 'Services', href: '#projects' },
            { label: 'Reviews', href: '#testimonials' },
            { label: 'Contact', href: '#contact' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block text-white no-underline text-[1.05rem] font-semibold mb-3 opacity-85 hover:opacity-100 transition-opacity"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="pt-6 md:pt-8 text-[0.8rem] text-white/40">
        © 2026 All rights reserved.
      </div>
    </footer>
  );
}

/* ─── Main Landing Page ─── */
export default function LandingPage() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <div className="font-['Inter',-apple-system,BlinkMacSystemFont,sans-serif] bg-white text-[#0a0a0a] antialiased overflow-x-hidden">
      {!loaded && <Loader onDone={() => setLoaded(true)} />}

      <Navbar onMenuOpen={() => setMenuOpen(true)} />
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main>
        <Hero />
        <AboutSection />
        <LogoCarousel />
        <ProjectsSection />
        <TestimonialsSection />
        <ProcessSection />
      </main>

      <Footer />
    </div>
  );
}