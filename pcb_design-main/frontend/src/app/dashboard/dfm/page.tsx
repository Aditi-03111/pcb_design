"use client";

import React from "react";
import { AlertTriangle, CheckCircle2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePlatform } from "@/lib/platform-context";

const fallbackNotes = [
  "No generated circuit yet. Run a prompt first to see design notes.",
  "Readiness reflects current warning and critical issue counts.",
  "Use this space to review issues before refining the board.",
];

export default function DFMPage() {
  const { generationResult } = usePlatform();

  const notes =
    generationResult?.violations?.length
      ? generationResult.violations.map((item) => item.message)
      : fallbackNotes;

  const criticalCount = generationResult?.violations.filter((item) => item.severity === "critical" || item.severity === "error").length ?? 0;
  const warningCount = generationResult?.violations.filter((item) => item.severity === "warning").length ?? 0;
  const readiness = Math.max(62, 100 - criticalCount * 14 - warningCount * 7);

  return (
    <div className="min-h-full bg-transparent px-6 py-6 text-[#17141f]">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-[#17141f]/10 bg-white/60 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-[#8a3f20]">
              <ShieldCheck className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.24em]">Design review</p>
            </div>
            <h1 className="font-display text-4xl font-black uppercase tracking-[-0.04em]">
              Read the generated design with a calmer lens.
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-[#17141f]/65">
              This panel summarizes warnings, critical issues, and overall readiness from the latest generated circuit.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.75rem] border border-[#17141f]/10 bg-white/55 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[#17141f]/45">Readiness</p>
              <p className="mt-3 font-mono text-4xl font-black text-[#8a3f20]">{readiness}</p>
            </div>
            <div className="rounded-[1.75rem] border border-[#17141f]/10 bg-white/55 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[#17141f]/45">Critical</p>
              <p className="mt-3 font-mono text-4xl font-black text-[#b54833]">{criticalCount}</p>
            </div>
            <div className="rounded-[1.75rem] border border-[#17141f]/10 bg-white/55 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[#17141f]/45">Warnings</p>
              <p className="mt-3 font-mono text-4xl font-black text-[#d28339]">{warningCount}</p>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[#17141f]/10 bg-white/55 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[#17141f]/45">Current circuit</p>
            <p className="mt-3 font-display text-2xl font-black uppercase text-[#17141f]">
              {generationResult?.description ?? "No generated circuit"}
            </p>
            <p className="mt-3 text-sm text-[#17141f]/62">
              {generationResult
                ? `${generationResult.component_count} components and ${generationResult.net_count} nets are in the current workspace.`
                : "Generate a circuit to populate this review surface."}
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-[#17141f]/10 bg-[#17141f] p-6 text-[#fff7ed] shadow-[0_24px_60px_rgba(23,20,31,0.16)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[#fff7ed]/45">Notes</p>
              <h2 className="font-display text-3xl font-black uppercase">Design findings</h2>
            </div>
            <Badge className="border-none bg-white/10 text-[#fff7ed]/70">
              {notes.length} items
            </Badge>
          </div>

          <div className="space-y-3">
            {notes.map((note, index) => {
              const isCritical = generationResult?.violations?.[index]?.severity === "critical" || generationResult?.violations?.[index]?.severity === "error";
              const isWarning = generationResult?.violations?.[index]?.severity === "warning";
              return (
                <div
                  key={`${note}-${index}`}
                  className="rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    {isCritical ? (
                      <AlertTriangle className="h-4 w-4 text-[#ff9b71]" />
                    ) : isWarning ? (
                      <ShieldCheck className="h-4 w-4 text-[#ffd166]" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-[#7ae7c7]" />
                    )}
                    <span className="text-xs uppercase tracking-[0.18em] text-[#fff7ed]/50">
                      {isCritical ? "critical" : isWarning ? "warning" : "note"}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-[#fff7ed]/74">{note}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
