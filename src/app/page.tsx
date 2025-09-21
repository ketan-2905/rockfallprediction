"use client";

import { NextPage } from "next";

const Landing: NextPage = () => {
  // Smooth scroll to features section
  const scrollToFeatures = (): void => {
    const element = document.getElementById("features");
    if (element instanceof HTMLElement) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            AI-Based Rockfall Prediction and Alert System for Open-Pit Mines
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Rockfalls in open-pit mines pose a serious threat to workers and
            equipment, leading to injuries, delays, and financial loss. This
            system leverages AI, predictive analytics, and multi-source data to
            transform slope stability assessments into proactive,
            life-saving insights.
          </p>
          <button
            onClick={scrollToFeatures}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
          >
            Explore Features
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gray-800 p-12 rounded-lg">
            <h3 className="text-3xl font-bold mb-8 text-center">
              Key System Capabilities
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Feature List - Left */}
              <div className="space-y-4">
                {[
                  "Multi-Source Data Processing",
                  "Real-Time Risk Maps",
                  "Probability-Based Forecasts",
                ].map((feature) => (
                  <div key={feature} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-semibold mb-1">{feature}</h4>
                      <p className="text-gray-300">
                        {feature === "Multi-Source Data Processing" &&
                          "Integrates DEM, drone imagery, geotechnical sensors, and environmental data."}
                        {feature === "Real-Time Risk Maps" &&
                          "Dynamic visualization of slope stability and vulnerable zones."}
                        {feature === "Probability-Based Forecasts" &&
                          "Machine learning models predict likelihood of rockfall events with accuracy."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Feature List - Right */}
              <div className="space-y-4">
                {[
                  "Automated Alert Mechanisms",
                  "Dashboard for Mine Planners",
                  "Open-Source & Scalable",
                ].map((feature) => (
                  <div key={feature} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="text-lg font-semibold mb-1">{feature}</h4>
                      <p className="text-gray-300">
                        {feature === "Automated Alert Mechanisms" &&
                          "Instant notifications via SMS and Email with suggested action plans."}
                        {feature === "Dashboard for Mine Planners" &&
                          "User-friendly web/mobile interface to monitor hazards and risks."}
                        {feature === "Open-Source & Scalable" &&
                          "Low-cost integration, customizable for different mines, adaptable to public/private operations."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Impact</h3>
          <p className="text-lg text-gray-300 leading-relaxed mb-8">
            The AI-powered rockfall prediction and alert system is designed to
            be cost-effective, scalable, and adaptable across diverse mine
            sites. By predicting rockfall events before they occur, it reduces
            accidents, minimizes downtime, and ensures safer and more resilient
            mining operations. The proactive approach strengthens disaster
            management capabilities while saving lives and operational costs.
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h4 className="text-2xl font-bold text-blue-400 mb-2">Safety</h4>
              <p className="text-gray-300">Reduces risks to miners & equipment</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h4 className="text-2xl font-bold text-green-400 mb-2">Scalable</h4>
              <p className="text-gray-300">
                Adaptable for small & large mining operations
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h4 className="text-2xl font-bold text-purple-400 mb-2">
                Cost-Effective
              </h4>
              <p className="text-gray-300">
                Affordable alternative to proprietary systems
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 Ministry of Mines | National Institute of Rock Mechanics
            (NIRM) | Disaster Management Theme
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;


// "use client";

// import React, { useEffect, useState, useRef } from "react";
// import { NextPage } from "next";
// import { Sun, Moon, Mail, MapPin, AlertTriangle, Database } from "lucide-react";

// // Enterprise, square-cornered, mobile-first landing for Rockfall Prediction
// // - Minimalistic, info-rich
// // - Dark / Light theme toggle (respects system pref)
// // - Heatmap explainer, services, KPI counters, photo gallery, contact footer
// // - No rounded corners (rounded-none used everywhere)

// const KPIItem: React.FC<{ label: string; value: number; suffix?: string }> = ({ label, value, suffix }) => {
//   const [display, setDisplay] = useState(0);
//   const ref = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     let raf = 0;
//     let start: number | null = null;
//     const duration = 900; // ms
//     const animate = (ts: number) => {
//       if (!start) start = ts;
//       const elapsed = ts - start;
//       const progress = Math.min(1, elapsed / duration);
//       setDisplay(Math.round(progress * value));
//       if (progress < 1) raf = requestAnimationFrame(animate);
//     };

//     // Intersection observer to trigger when visible
//     const io = new IntersectionObserver((entries) => {
//       entries.forEach((e) => {
//         if (e.isIntersecting) {
//           raf = requestAnimationFrame(animate);
//           io.disconnect();
//         }
//       });
//     });
//     if (ref.current) io.observe(ref.current);

//     return () => {
//       if (raf) cancelAnimationFrame(raf);
//       io.disconnect();
//     };
//   }, [value]);

//   return (
//     <div ref={ref} className="flex flex-col items-start">
//       <div className="text-2xl font-semibold tabular-nums">{display}{suffix ?? ""}</div>
//       <div className="text-sm text-gray-400 dark:text-gray-300 mt-1">{label}</div>
//     </div>
//   );
// };

// const EnterpriseLanding: NextPage = () => {
//   const [theme, setTheme] = useState<'dark' | 'light'>(() => {
//     if (typeof window === 'undefined') return 'dark';
//     const saved = localStorage.getItem('site-theme');
//     if (saved === 'light' || saved === 'dark') return saved;
//     return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
//   });

//   useEffect(() => {
//     const root = window.document.documentElement;
//     if (theme === 'dark') {
//       root.classList.add('dark');
//     } else {
//       root.classList.remove('dark');
//     }
//     localStorage.setItem('site-theme', theme);
//   }, [theme]);

//   // Simple heatmap grid generator (placeholder SVG)
//   const HeatmapSVG = () => {
//     // grid 6x4
//     const cols = 6;
//     const rows = 4;
//     const cellW = 120;
//     const cellH = 80;
//     // sample risk matrix (0-100)
//     const risks = [
//       10, 35, 55, 75, 90, 60,
//       5, 20, 40, 65, 80, 50,
//       2, 18, 38, 58, 72, 48,
//       6, 15, 30, 50, 68, 42,
//     ];

//     const colorFor = (v: number) => {
//       // green -> yellow -> orange -> red
//       if (v < 25) return '#16a34a';
//       if (v < 50) return '#a16207'; // amber-ish
//       if (v < 70) return '#f97316';
//       return '#dc2626';
//     };

//     return (
//       <svg viewBox={`0 0 ${cols * cellW} ${rows * cellH}`} className="w-full h-auto" role="img" aria-label="Heatmap preview">
//         <rect width="100%" height="100%" fill="transparent" />
//         {risks.map((r, i) => {
//           const cx = (i % cols) * cellW;
//           const cy = Math.floor(i / cols) * cellH;
//           return (
//             <g key={i}>
//               <rect x={cx} y={cy} width={cellW} height={cellH} fill={colorFor(r)} opacity={0.85} />
//               <rect x={cx} y={cy} width={cellW} height={cellH} fill="none" stroke={theme === 'dark' ? '#0b1220' : '#e6eef8'} strokeWidth={2} />
//               <text x={cx + 8} y={cy + 22} fill="#fff" fontSize={14} fontWeight={600}>{r}%</text>
//             </g>
//           );
//         })}
//       </svg>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-white flex flex-col">
//       {/* Header */}
//       <header className="w-full border-b border-slate-200 dark:border-slate-800">
//         <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-bold rounded-none">RN</div>
//             <div className="text-sm font-semibold">Rockfall Network</div>
//           </div>

//           <nav className="flex items-center gap-3">
//             <button
//               aria-label="Toggle theme"
//               onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
//               className="p-2 border border-slate-200 dark:border-slate-700 rounded-none"
//             >
//               {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
//             </button>

//             <a href="#contact" className="px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-none">Contact</a>
//             <button className="px-3 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-none text-sm font-semibold">Request Demo</button>
//           </nav>
//         </div>
//       </header>

//       <main className="flex-1">
//         {/* Hero */}
//         <section className="max-w-4xl mx-auto px-4 py-8">
//           <div className="grid grid-cols-1 gap-6">
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-extrabold">AI-Based Rockfall Prediction & Alert System</h1>
//               <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">Enterprise-grade monitoring & predictive alerts for open-pit mines. Sector-level heatmaps, sensor telemetry ingestion, and automated action plans — designed for operators and safety managers.</p>

//               <div className="mt-4 flex gap-3">
//                 <a href="#services" className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-none text-sm">What we offer</a>
//                 <a href="#map" className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-none text-sm">See heatmap</a>
//               </div>
//             </div>

//             {/* KPI chips */}
//             <div className="grid grid-cols-3 gap-3">
//               <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-none">
//                 <KPIItem label="Alerts today" value={12} />
//               </div>
//               <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-none">
//                 <KPIItem label="Mines monitored" value={8} />
//               </div>
//               <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-none">
//                 <KPIItem label="Avg response (mins)" value={18} suffix="m" />
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Services / Offerings */}
//         <section id="services" className="max-w-4xl mx-auto px-4 py-6">
//           <h2 className="text-lg font-semibold">Our Services</h2>
//           <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Tailored modules that together provide a complete rockfall management workflow.</p>

//           <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-none flex gap-3 items-start">
//               <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-none"><MapPin size={20} /></div>
//               <div>
//                 <div className="font-medium">Map Overview & Heatmap</div>
//                 <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Sector-based heatmap with probability overlays and grid-level severity indicators.</div>
//               </div>
//             </div>

//             <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-none flex gap-3 items-start">
//               <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-none"><AlertTriangle size={20} /></div>
//               <div>
//                 <div className="font-medium">Real-time Alerts</div>
//                 <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">SMS/email triggers and dashboard notifications with recommended action plans.</div>
//               </div>
//             </div>

//             <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-none flex gap-3 items-start">
//               <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-none"><Database size={20} /></div>
//               <div>
//                 <div className="font-medium">Sensor & DEM Integration</div>
//                 <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Connect low-cost sensors, ingest DEMs and drone imagery for terrain-aware scoring.</div>
//               </div>
//             </div>

//             <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-none flex gap-3 items-start">
//               <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-none"><Mail size={20} /></div>
//               <div>
//                 <div className="font-medium">Reports & Exports</div>
//                 <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Exportable PDF/CSV reports and integration-ready APIs for enterprise workflows.</div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Heatmap explainer */}
//         <section id="map" className="max-w-4xl mx-auto px-4 py-6">
//           <h3 className="text-lg font-semibold">Overall Risk Map</h3>
//           <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Grids are colored by risk probability and severity. Tap or click a sector to view suggested actions and responsible team.</p>

//           <div className="mt-4 border border-slate-200 dark:border-slate-700 rounded-none overflow-hidden">
//             <div className="p-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-sm">Heatmap preview (grid-based)</div>
//             <div className="p-3 bg-white dark:bg-slate-900">
//               <HeatmapSVG />
//             </div>

//             <div className="p-3 flex gap-3 items-center bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 bg-green-600 rounded-none" />
//                 <div className="text-sm">Low</div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4" style={{ background: '#f97316' }} />
//                 <div className="text-sm">Medium</div>
//               </div>

//               <div className="flex items-center gap-2">
//                 <div className="w-4 h-4 bg-red-600 rounded-none" />
//                 <div className="text-sm">High</div>
//               </div>

//               <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">Legend</div>
//             </div>
//           </div>
//         </section>

//         {/* Photo gallery */}
//         <section className="max-w-4xl mx-auto px-4 py-6">
//           <h3 className="text-lg font-semibold">Our Work & Tools</h3>
//           <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Representative images — drone surveys, sensor installations, and map exports.</p>

//           <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
//             {['/images/drone.jpg','/images/sensor.jpg','/images/team.jpg','/images/map.jpg'].map((src, i) => (
//               <div key={i} className="overflow-hidden border border-slate-200 dark:border-slate-700 rounded-none bg-gray-50 dark:bg-slate-800">
//                 <img src={src} alt={`Gallery ${i+1}`} className="w-full h-28 object-cover" loading="lazy" />
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* How it works */}
//         <section className="max-w-4xl mx-auto px-4 py-6">
//           <h3 className="text-lg font-semibold">How it works</h3>
//           <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
//             <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-none">
//               <div className="font-medium">1. Collect</div>
//               <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Sensors, DEMs, and drone imagery feed into our ingestion pipeline.</div>
//             </div>
//             <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-none">
//               <div className="font-medium">2. Analyze</div>
//               <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">AI models score sector-level risk and generate heatmap overlays.</div>
//             </div>
//             <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-none">
//               <div className="font-medium">3. Alert & Act</div>
//               <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Automated alerts and recommended action plans delivered to site teams.</div>
//             </div>
//           </div>
//         </section>

//         {/* Contact / CTA */}
//         <section id="contact" className="max-w-4xl mx-auto px-4 py-6">
//           <h3 className="text-lg font-semibold">Get in touch</h3>
//           <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">For enterprise enquiries, demo requests, or API access, contact our team.</p>

//           <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
//             <form className="p-4 border border-slate-200 dark:border-slate-700 rounded-none" onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget as HTMLFormElement); const name = f.get('name'); const email = f.get('email'); const msg = f.get('message'); alert(`Thanks ${name}. We will contact you at ${email}.`); (e.currentTarget as HTMLFormElement).reset(); }}>
//               <label className="block text-sm">Name</label>
//               <input name="name" required className="w-full mt-1 p-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-none" />

//               <label className="block text-sm mt-3">Email</label>
//               <input name="email" type="email" required className="w-full mt-1 p-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-none" />

//               <label className="block text-sm mt-3">Message</label>
//               <textarea name="message" rows={4} className="w-full mt-1 p-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-none" />

//               <div className="mt-3 flex gap-3">
//                 <button type="submit" className="px-3 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-none">Send</button>
//                 <a href="mailto:contact@rockfall.example" className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-none flex items-center gap-2"><Mail size={14}/> Email us</a>
//               </div>
//             </form>

//             <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-none flex flex-col gap-3">
//               <div className="font-medium">Contact details</div>
//               <div className="text-sm text-gray-600 dark:text-gray-300">National Institute of Rock Mechanics (NIRM)</div>
//               <div className="text-sm text-gray-600 dark:text-gray-300">Ministry of Mines</div>
//               <div className="text-sm text-gray-600 dark:text-gray-300">Email: contact@rockfall.example</div>
//               <div className="text-sm text-gray-600 dark:text-gray-300">Phone: +91 98765 43210</div>

//               <div className="mt-4">
//                 <div className="font-medium">Follow</div>
//                 <div className="flex gap-2 mt-2">
//                   <a aria-label="twitter" href="#" className="p-2 border border-slate-200 dark:border-slate-700 rounded-none text-sm">Twitter</a>
//                   <a aria-label="linkedin" href="#" className="p-2 border border-slate-200 dark:border-slate-700 rounded-none text-sm">LinkedIn</a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       </main>

//       <footer className="w-full border-t border-slate-200 dark:border-slate-800">
//         <div className="max-w-4xl mx-auto px-4 py-4 text-sm text-gray-600 dark:text-gray-300">© 2025 Ministry of Mines • National Institute of Rock Mechanics (NIRM)</div>
//       </footer>
//     </div>
//   );
// };

// export default EnterpriseLanding;



// "use client";

// import React, { useRef } from "react";
// import { NextPage } from "next";
// import { motion } from "framer-motion";
// import {
//   MapPin,
//   Bell,
//   AlertTriangle,
//   CloudRain,
//   Drone,
//   Layers,
//   Users,
// } from "lucide-react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// // Small sample data for the chart preview
// const sampleData = [
//   { time: "00:00", risk: 12 },
//   { time: "04:00", risk: 18 },
//   { time: "08:00", risk: 32 },
//   { time: "12:00", risk: 45 },
//   { time: "16:00", risk: 28 },
//   { time: "20:00", risk: 22 },
//   { time: "24:00", risk: 15 },
// ];

// const HeroBlob = () => (
//   <svg
//     viewBox="0 0 600 600"
//     className="absolute inset-0 w-full h-full mix-blend-overlay opacity-30 pointer-events-none"
//     preserveAspectRatio="xMidYMid slice"
//   >
//     <g transform="translate(300,300)">
//       <path
//         d="M120,-160C156,-125,182,-80,196,-30C210,20,212,76,188,114C165,152,116,173,64,188C12,203,-42,212,-86,190C-130,168,-165,115,-183,58C-200,1,-199,-59,-172,-98C-144,-137,-90,-154,-39,-175C12,-197,65,-223,120,-160Z"
//         fill="url(#g)"
//       />
//       <defs>
//         <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
//           <stop offset="0%" stopColor="#0ea5e9" />
//           <stop offset="100%" stopColor="#7c3aed" />
//         </linearGradient>
//       </defs>
//     </g>
//   </svg>
// );

// const InteractiveLanding: NextPage = () => {
//   const featuresRef = useRef<HTMLElement | null>(null);

//   const scrollToFeatures = (): void => {
//     const el = featuresRef.current;
//     if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-900 via-slate-900 to-gray-800 text-white overflow-x-hidden">
//       {/* HERO */}
//       <header className="relative">
//         <div className="absolute inset-0 -z-10 overflow-hidden">
//           <HeroBlob />
//         </div>

//         <section className="min-h-[80vh] flex items-center">
//           <div className="container mx-auto px-6 lg:px-16">
//             <div className="grid lg:grid-cols-2 gap-12 items-center">
//               <motion.div
//                 initial={{ opacity: 0, x: -30 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 0.6 }}
//               >
//                 <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
//                   AI-Based <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-400">Rockfall</span> Prediction
//                   <br /> and Alert System
//                 </h1>

//                 <p className="mt-6 text-lg text-gray-300 max-w-2xl">
//                   Proactively detect slope instability using multi-source data
//                   (DEM, drone imagery, sensors, and weather) with intuitive risk
//                   maps and instant alerts for safer mining operations.
//                 </p>

//                 <div className="mt-8 flex flex-wrap gap-4">
//                   <button
//                     onClick={scrollToFeatures}
//                     className="inline-flex items-center gap-3 bg-sky-500 hover:bg-sky-600 active:scale-95 transition-transform px-6 py-3 rounded-lg text-sm font-semibold shadow-lg"
//                   >
//                     Explore Features
//                   </button>

//                   <button
//                     className="inline-flex items-center gap-3 border border-gray-700 hover:border-gray-500 px-5 py-3 rounded-lg text-sm"
//                     onClick={() => window.alert("Request demo: contact@minesystem.example")}
//                   >
//                     Request Demo
//                   </button>
//                 </div>

//                 <div className="mt-8 flex items-center gap-6">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center">
//                       <Drone size={20} />
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-300 font-medium">Drone Imagery</p>
//                       <p className="text-xs text-gray-400">High-res captures</p>
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center">
//                       <MapPin size={20} />
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-300 font-medium">Geotagged DEMs</p>
//                       <p className="text-xs text-gray-400">Terrain-aware</p>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>

//               <motion.div
//                 initial={{ opacity: 0, y: 30 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.6, delay: 0.15 }}
//                 className="relative"
//               >
//                 <div className="bg-gradient-to-br from-white/5 to-white/3 rounded-2xl p-6 shadow-2xl border border-white/5">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-sm text-gray-300">Live risk overview</p>
//                       <h3 className="text-xl font-semibold">Mine — Sector A</h3>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-xs text-gray-400">Updated 2m ago</p>
//                       <div className="mt-2 inline-flex gap-2">
//                         <div className="px-3 py-1 rounded-full bg-red-600 text-xs font-semibold">High</div>
//                         <div className="px-3 py-1 rounded-full bg-gray-700 text-xs">Auto</div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mt-6 h-56">
//                     {/* Risk chart preview */}
//                     <ResponsiveContainer width="100%" height="100%">
//                       <LineChart data={sampleData}>
//                         <XAxis dataKey="time" tick={{ fill: "#9CA3AF" }} />
//                         <YAxis tick={{ fill: "#9CA3AF" }} />
//                         <Tooltip />
//                         <Line type="monotone" dataKey="risk" stroke="#60A5FA" strokeWidth={3} dot={false} />
//                       </LineChart>
//                     </ResponsiveContainer>
//                   </div>

//                   <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
//                         <Bell size={18} />
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-300">Alerts</div>
//                         <div className="text-sm font-medium">12 today</div>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
//                         <Layers size={18} />
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-300">Layers</div>
//                         <div className="text-sm font-medium">DEM, Drone, Sensors</div>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center">
//                         <Users size={18} />
//                       </div>
//                       <div>
//                         <div className="text-xs text-gray-300">Users</div>
//                         <div className="text-sm font-medium">Admin & Crew</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="absolute -bottom-6 left-6 w-56 bg-gradient-to-r from-rose-500 to-pink-500 p-1 rounded-lg shadow-lg text-xs">
//                   <div className="bg-gray-900 p-3 rounded-md text-center">Live demo mode — sample data</div>
//                 </div>
//               </motion.div>
//             </div>
//           </div>
//         </section>
//       </header>

//       {/* FEATURES */}
//       <main ref={featuresRef}>
//         <section className="py-16">
//           <div className="container mx-auto px-6 lg:px-16">
//             <motion.h2
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               className="text-3xl lg:text-4xl font-bold text-center"
//             >
//               Key Capabilities
//             </motion.h2>

//             <p className="text-center text-gray-400 mt-4 max-w-2xl mx-auto">
//               A compact, interactive overview of the system capabilities — hover
//               cards to explore and a quick glance risk map to visualize vulnerable
//               zones.
//             </p>

//             <div className="mt-12 grid md:grid-cols-3 gap-6">
//               {[
//                 {
//                   title: "Multi-Source Data",
//                   desc: "DEM, drone imagery, and geotechnical sensors combined for terrain-aware inference.",
//                   icon: <Layers size={22} />,
//                 },
//                 {
//                   title: "Real-time Alerts",
//                   desc: "Probability-based SMS/Email triggers with recommended actions.",
//                   icon: <AlertTriangle size={22} />,
//                 },
//                 {
//                   title: "Weather-aware",
//                   desc: "Incorporates rainfall & temperature into risk modelling.",
//                   icon: <CloudRain size={22} />,
//                 },
//               ].map((f) => (
//                 <motion.div
//                   key={f.title}
//                   whileHover={{ y: -8, boxShadow: "0 12px 30px rgba(2,6,23,0.6)" }}
//                   className="bg-gray-800 p-6 rounded-lg border border-white/5"
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center">{f.icon}</div>
//                     <div>
//                       <h4 className="font-semibold">{f.title}</h4>
//                       <p className="text-sm text-gray-400">{f.desc}</p>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {/* Quick risk map mock */}
//             <div className="mt-12 grid lg:grid-cols-2 gap-8 items-start">
//               <div className="bg-gray-800 p-6 rounded-lg border border-white/5">
//                 <h4 className="font-semibold text-lg mb-4">Quick Risk Map</h4>
//                 <div className="rounded-md overflow-hidden border border-white/5">
//                   {/* Placeholder SVG map */}
//                   <svg viewBox="0 0 800 400" className="w-full h-64">
//                     <defs>
//                       <linearGradient id="r1" x1="0" x2="1">
//                         <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
//                         <stop offset="100%" stopColor="#fb923c" stopOpacity="0.9" />
//                       </linearGradient>
//                     </defs>

//                     <rect width="800" height="400" fill="#0f172a" />

//                     {/* simulated contours */}
//                     <g opacity="0.7" fill="none" stroke="#94a3b8" strokeWidth="2">
//                       <path d="M20 300 C120 200 240 320 360 260 C480 200 600 300 780 180" />
//                       <path d="M20 240 C140 160 260 240 380 200 C500 160 620 240 780 140" />
//                     </g>

//                     {/* heat spots */}
//                     <circle cx="180" cy="220" r="28" fill="url(#r1)" opacity="0.9" />
//                     <circle cx="420" cy="160" r="18" fill="#f97316" opacity="0.85" />
//                     <circle cx="640" cy="210" r="12" fill="#fb7185" opacity="0.8" />

//                     {/* pins */}
//                     <g fill="#fff">
//                       <circle cx="180" cy="220" r="4" />
//                       <circle cx="420" cy="160" r="4" />
//                       <circle cx="640" cy="210" r="4" />
//                     </g>
//                   </svg>
//                 </div>

//                 <div className="mt-4 text-sm text-gray-400">
//                   Click on a hotspot to view recommended actions and contact the
//                   site admin.
//                 </div>
//               </div>

//               <div className="bg-gray-800 p-6 rounded-lg border border-white/5">
//                 <h4 className="font-semibold text-lg mb-4">Actionable Alerts</h4>
//                 <ul className="space-y-3 text-sm">
//                   <li className="flex items-start gap-3">
//                     <div className="mt-1 text-rose-400"><AlertTriangle /></div>
//                     <div>
//                       <div className="font-medium">Sector A — HIGH risk</div>
//                       <div className="text-gray-400">Evacuate non-essential personnel. Pause drilling operations.</div>
//                     </div>
//                   </li>

//                   <li className="flex items-start gap-3">
//                     <div className="mt-1 text-amber-400"><Bell /></div>
//                     <div>
//                       <div className="font-medium">Rainfall spike — MEDIUM risk</div>
//                       <div className="text-gray-400">Increase monitoring cadence for pore-pressure sensors.</div>
//                     </div>
//                   </li>

//                   <li className="flex items-start gap-3">
//                     <div className="mt-1 text-sky-400"><MapPin /></div>
//                     <div>
//                       <div className="font-medium">New DEM uploaded</div>
//                       <div className="text-gray-400">Run slope stability batch to refresh risk map.</div>
//                     </div>
//                   </li>
//                 </ul>

//                 <div className="mt-6">
//                   <button className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-violet-500 font-semibold">
//                     View All Alerts
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-12 text-center text-sm text-gray-400">
//               Want this design adapted to your branding or to include live map
//               tiles (Mapbox/Leaflet)? I can update it — tell me the brand colors
//               or provide API keys.
//             </div>
//           </div>
//         </section>
//       </main>

//       <footer className="bg-gray-900 border-t border-white/5 py-8">
//         <div className="container mx-auto px-6 lg:px-16 text-center text-sm text-gray-400">
//           © 2025 Ministry of Mines • National Institute of Rock Mechanics (NIRM)
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default InteractiveLanding;
