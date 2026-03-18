"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Orbit, Sparkles, Waves, Zap } from "lucide-react";
import { MechButton } from "@/components/ui/MechButton";

const featureCards = [
  {
    eyebrow: "Adaptive synthesis",
    title: "Describe the board in plain language.",
    body: "Turn a rough product idea into a schematic-ready system with structured outputs and reusable templates.",
  },
  {
    eyebrow: "Visual flow",
    title: "Inspect the design before export.",
    body: "Preview topology, follow generated components, and keep the experience grounded in a clear interface.",
  },
  {
    eyebrow: "Build handoff",
    title: "Move from concept to files quickly.",
    body: "Package the generated circuit data, schematic exports, and supporting files in one place for the next step.",
  },
];

const signalRows = [
  { label: "Signal map", value: "stable" },
  { label: "Component graph", value: "live" },
  { label: "Export stack", value: "ready" },
];

function NovaMark() {
  return (
    <div className="relative flex h-14 w-14 items-center justify-center rounded-[1.5rem] border border-white/15 bg-[#13111c] shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
      <div className="absolute h-9 w-9 rounded-full border border-[#ff9b71]/45" />
      <div className="absolute h-5 w-5 rotate-45 rounded-[0.7rem] border border-[#ffd166]/70 bg-[#ffd166]/15" />
      <div className="absolute h-2.5 w-2.5 rounded-full bg-[#7ae7c7]" />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f6efe5] text-[#17141f]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,155,113,0.28),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(122,231,199,0.22),transparent_22%),linear-gradient(180deg,#f6efe5_0%,#efe5d4_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(23,20,31,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(23,20,31,0.04)_1px,transparent_1px)] bg-[size:68px_68px] opacity-60" />

      <main className="relative mx-auto max-w-7xl px-6 py-8">
        <nav className="flex items-center justify-between rounded-full border border-[#17141f]/10 bg-white/65 px-5 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <NovaMark />
            <div>
              <p className="font-display text-2xl font-black uppercase tracking-[0.18em] text-[#17141f]">
                Novaforge
              </p>
              <p className="text-xs uppercase tracking-[0.28em] text-[#17141f]/45">
                Circuit generation studio
              </p>
            </div>
          </div>

          <Link href="/dashboard">
            <MechButton variant="primary" size="md" className="border-[#17141f] bg-[#17141f] text-[#fff7ed] hover:bg-[#262132]">
              Open Workspace <ArrowRight className="ml-2 h-4 w-4" />
            </MechButton>
          </Link>
        </nav>

        <section className="grid min-h-[calc(100vh-7rem)] items-center gap-10 py-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#17141f]/12 bg-white/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#17141f]/70"
            >
              <Sparkles className="h-4 w-4 text-[#ff8a5b]" />
              Generative electronics canvas
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="max-w-4xl font-display text-5xl font-black uppercase leading-[0.92] tracking-[-0.05em] text-[#17141f] md:text-7xl"
            >
              Shape ideas into circuit systems with a calmer, sharper workflow.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="max-w-2xl text-lg leading-relaxed text-[#17141f]/68"
            >
              Novaforge brings prompt-driven circuit generation, structured outputs, and a focused design surface into one place so the first draft feels usable instead of speculative.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/dashboard">
                <MechButton variant="primary" size="lg" className="border-[#17141f] bg-[#17141f] text-[#fff7ed] hover:bg-[#262132]">
                  Enter Studio <ArrowRight className="ml-2 h-5 w-5" />
                </MechButton>
              </Link>
              <a href="#features">
                <MechButton variant="outline" size="lg" className="border-[#17141f]/15 bg-white/40 text-[#17141f] hover:bg-white/80">
                  Explore Flow
                </MechButton>
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12 }}
            className="relative overflow-hidden rounded-[2.5rem] border border-[#17141f]/10 bg-[#17141f] p-6 text-[#fff7ed] shadow-[0_24px_60px_rgba(23,20,31,0.18)]"
          >
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#ff9b71] blur-3xl opacity-30" />
            <div className="absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-[#7ae7c7] blur-3xl opacity-20" />

            <div className="relative space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[#fff7ed]/45">Live surface</p>
                  <h2 className="font-display text-3xl font-black uppercase">System pulse</h2>
                </div>
                <div className="rounded-full bg-[#7ae7c7]/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#7ae7c7]">
                  Active
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#ff9b71]/16 text-[#ffb18c]">
                    <Orbit className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#fff7ed]/45">Current mode</p>
                    <p className="font-display text-xl font-black uppercase">Topology synthesis</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {signalRows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                      <span className="text-sm text-[#fff7ed]/62">{row.label}</span>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ffd166]">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
                  <div className="mb-3 flex items-center gap-2 text-[#7ae7c7]">
                    <Waves className="h-4 w-4" />
                    <p className="text-xs font-semibold uppercase tracking-[0.2em]">Flow</p>
                  </div>
                  <p className="text-sm leading-relaxed text-[#fff7ed]/70">
                    Guide the circuit from prompt to structured output in a layout that stays readable.
                  </p>
                </div>
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
                  <div className="mb-3 flex items-center gap-2 text-[#ffb18c]">
                    <Zap className="h-4 w-4" />
                    <p className="text-xs font-semibold uppercase tracking-[0.2em]">Engine</p>
                  </div>
                  <p className="text-sm leading-relaxed text-[#fff7ed]/70">
                    Blend template stability and AI-assisted generation without overwhelming the interface.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="grid gap-5 pb-12 md:grid-cols-3">
          {featureCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 + index * 0.08 }}
              className="rounded-[2rem] border border-[#17141f]/10 bg-white/55 p-6 backdrop-blur"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#ff8a5b]">{card.eyebrow}</p>
              <h3 className="font-display text-3xl font-black uppercase leading-tight text-[#17141f]">{card.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-[#17141f]/68">{card.body}</p>
            </motion.div>
          ))}
        </section>
      </main>
    </div>
  );
}
