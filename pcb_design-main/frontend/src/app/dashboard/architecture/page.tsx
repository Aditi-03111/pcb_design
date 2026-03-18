"use client";

import React from "react";
import { BarChart3, Cpu, Database, Globe, Network, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const pipelineSteps = [
  { id: "ing", name: "Input parsing", desc: "Turns a natural language prompt into structured intent and template matches.", icon: Globe },
  { id: "syn", name: "Circuit synthesis", desc: "Builds the component set, connection graph, and exportable schematic payload.", icon: Sparkles },
  { id: "opt", name: "Placement pass", desc: "Produces a first-pass layout suggestion for the current set of components.", icon: Cpu },
  { id: "dfm", name: "Review layer", desc: "Surfaces readiness, warnings, and design notes after generation.", icon: ShieldCheck },
  { id: "exp", name: "Export layer", desc: "Packages schematic, BOM, manifest, and related files for KiCad handoff.", icon: Database },
];

const stackRows = [
  { label: "Frontend", value: "Next.js workspace", detail: "Prompt entry, workspace, export actions" },
  { label: "Backend", value: "FastAPI orchestration", detail: "Generation, bundles, KiCad integration endpoints" },
  { label: "Export", value: "KiCad schematic output", detail: "Structured `.kicad_sch` generation and download flow" },
  { label: "KiCad bridge", value: "Plugin + open handoff", detail: "Website and plugin both target the latest generated schematic" },
];

export default function ArchitecturePage() {
  return (
    <div className="min-h-full bg-transparent px-6 py-6 text-[#17141f]">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[2.25rem] border border-[#17141f]/10 bg-white/60 p-7 backdrop-blur-xl">
          <div className="mb-4 flex items-center gap-2 text-[#8a3f20]">
            <BarChart3 className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em]">System architecture</p>
          </div>
          <h1 className="max-w-4xl font-display text-5xl font-black uppercase leading-[0.94] tracking-[-0.05em]">
            The product flow is simple on the surface and layered underneath.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#17141f]/65">
            Novaforge is organized around a practical chain: prompt in, circuit model out, review it, package the artifacts, and hand the latest schematic off to KiCad.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[2rem] border border-[#17141f]/10 bg-white/55 p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-[#17141f]/45">Core pipeline</p>
                <h2 className="font-display text-3xl font-black uppercase">Operational flow</h2>
              </div>
              <Badge className="border-none bg-[#17141f]/8 text-[#17141f]/60">Live stack</Badge>
            </div>

            <div className="space-y-4">
              {pipelineSteps.map((step, index) => (
                <div key={step.id} className="grid gap-3 rounded-[1.75rem] border border-[#17141f]/10 bg-[#fffaf4] p-5 md:grid-cols-[auto_1fr_auto] md:items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-[#17141f] text-[#fff7ed]">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-[#17141f]/38">Stage 0{index + 1}</p>
                    <h3 className="mt-1 font-display text-2xl font-black uppercase text-[#17141f]">{step.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#17141f]/62">{step.desc}</p>
                  </div>
                  <div className="justify-self-start rounded-full bg-[#ff9b71]/16 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#8a3f20] md:justify-self-end">
                    active
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6">
            <div className="rounded-[2rem] border border-[#17141f]/10 bg-[#17141f] p-6 text-[#fff7ed] shadow-[0_24px_60px_rgba(23,20,31,0.16)]">
              <div className="mb-4 flex items-center gap-2 text-[#ffd166]">
                <Network className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.22em]">System map</p>
              </div>
              <div className="grid gap-4">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#fff7ed]/45">Prompt layer</p>
                  <p className="mt-2 text-lg font-display font-black uppercase">Website workspace</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#fff7ed]/45">Generation layer</p>
                  <p className="mt-2 text-lg font-display font-black uppercase">FastAPI circuit pipeline</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#fff7ed]/45">Delivery layer</p>
                  <p className="mt-2 text-lg font-display font-black uppercase">KiCad file handoff</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#17141f]/10 bg-white/55 p-6">
              <div className="mb-4 flex items-center gap-2 text-[#8a3f20]">
                <Zap className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.22em]">Implementation notes</p>
              </div>
              <div className="space-y-3">
                {stackRows.map((row) => (
                  <div key={row.label} className="rounded-[1.5rem] border border-[#17141f]/10 bg-[#fffaf4] px-4 py-4">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#17141f]/40">{row.label}</p>
                    <p className="mt-1 font-display text-xl font-black uppercase text-[#17141f]">{row.value}</p>
                    <p className="mt-2 text-sm leading-relaxed text-[#17141f]/60">{row.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
