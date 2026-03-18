"use client";

import React, { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AppWindow, ArrowRight, Download, Loader2, Sparkles, Wand2 } from "lucide-react";
import { MechButton } from "@/components/ui/MechButton";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { usePlatform } from "@/lib/platform-context";

const quickPrompts = [
  "555 timer astable LED blinker",
  "3.3V regulator with input filtering",
  "MOSFET low-side switch for motor load",
  "Op-amp buffer for analog sensor",
];

const stageLabels = [
  "Prompt parsed",
  "Template scan",
  "Circuit graph formed",
  "Schematic exported",
];

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("3.3V regulator with input filtering");
  const [stageIndex, setStageIndex] = useState(-1);
  const [isOpeningKiCad, setIsOpeningKiCad] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { setGenerationResult, setActiveComponents, generationResult, addLog } = usePlatform();

  const previewComponents = generationResult?.components ?? [];
  const componentPairs = useMemo(() => previewComponents.slice(0, 8), [previewComponents]);

  function runGeneration() {
    if (!prompt.trim()) {
      return;
    }

    setStageIndex(0);
    addLog({
      time: new Date().toLocaleTimeString("en-US", { hour12: false }),
      type: "AI",
      msg: `Generating circuit for: ${prompt}`,
    });

    startTransition(async () => {
      try {
        stageLabels.forEach((_, index) => {
          window.setTimeout(() => setStageIndex(index), index * 280);
        });

        const result = await api.generate(prompt.trim());
        if (!result.success) {
          throw new Error(result.error ?? "Generation failed");
        }

        setGenerationResult({
          success: result.success,
          description: result.description,
          component_count: result.component_count,
          net_count: result.net_count,
          template_used: result.template_used,
          generation_time: result.generation_time,
          components: result.components,
          bom: result.bom,
          violations: result.violations,
          download_url: result.download_url,
        });
        setActiveComponents(result.components);
        setStageIndex(stageLabels.length - 1);
        addLog({
          time: new Date().toLocaleTimeString("en-US", { hour12: false }),
          type: "INFO",
          msg: `${result.component_count} parts generated in ${result.generation_time}.`,
        });
      } catch (error) {
        addLog({
          time: new Date().toLocaleTimeString("en-US", { hour12: false }),
          type: "ERROR",
          msg: error instanceof Error ? error.message : "Generation failed",
        });
      }
    });
  }

  async function openLatestInKiCad() {
    setIsOpeningKiCad(true);
    try {
      const result = await api.openLatestInKiCad();
      addLog({
        time: new Date().toLocaleTimeString("en-US", { hour12: false }),
        type: result.success ? "INFO" : "ERROR",
        msg: result.message,
      });
    } catch (error) {
      addLog({
        time: new Date().toLocaleTimeString("en-US", { hour12: false }),
        type: "ERROR",
        msg: error instanceof Error ? error.message : "Failed to open KiCad",
      });
    } finally {
      setIsOpeningKiCad(false);
    }
  }

  return (
    <div className="min-h-full bg-transparent px-6 py-6 text-[#17141f]">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-6">
          <div className="rounded-[2rem] border border-[#17141f]/10 bg-white/60 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3">
              <Badge className="border-none bg-[#ff9b71]/16 text-[#8a3f20]">Generation Studio</Badge>
              <Badge className="border-none bg-[#17141f]/8 text-[#17141f]/60">Prompt driven</Badge>
            </div>
            <h1 className="font-display text-4xl font-black uppercase tracking-[-0.04em]">
              Start from an idea and turn it into circuit files.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#17141f]/65">
              Write the circuit in plain language, choose a starting pattern, and let Novaforge create the first structured pass.
            </p>

            <div className="mt-6 space-y-3">
              <label className="text-xs font-semibold uppercase tracking-[0.22em] text-[#17141f]/50">
                Circuit prompt
              </label>
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                className="h-44 w-full rounded-[1.5rem] border border-[#17141f]/10 bg-[#fffaf4] p-4 text-sm leading-relaxed outline-none transition focus:border-[#ff9b71]/40"
                placeholder="Describe the board you want to generate"
              />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {quickPrompts.map((item) => (
                <button
                  key={item}
                  onClick={() => setPrompt(item)}
                  className="rounded-full border border-[#17141f]/10 bg-white/65 px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-[#17141f]/65 transition hover:border-[#ff9b71]/35 hover:bg-white"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <MechButton variant="primary" size="lg" onClick={runGeneration} disabled={isPending || !prompt.trim()}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate Circuit
              </MechButton>
              {generationResult?.download_url && (
                <a href={api.downloadUrl(generationResult.download_url)} download>
                  <MechButton variant="outline" size="lg">
                    <Download className="h-4 w-4" />
                    Download Schematic
                  </MechButton>
                </a>
              )}
              {generationResult?.components?.length ? (
                <Link href="/dashboard/placement">
                  <MechButton variant="outline" size="lg">
                    Placement View <ArrowRight className="h-4 w-4" />
                  </MechButton>
                </Link>
              ) : null}
              {generationResult?.download_url ? (
                <MechButton variant="outline" size="lg" onClick={openLatestInKiCad} disabled={isOpeningKiCad}>
                  {isOpeningKiCad ? <Loader2 className="h-4 w-4 animate-spin" /> : <AppWindow className="h-4 w-4" />}
                  Open in KiCad
                </MechButton>
              ) : null}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#17141f]/10 bg-white/55 p-6">
            <div className="mb-4 flex items-center gap-2 text-[#8a3f20]">
              <Wand2 className="h-4 w-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.22em]">Generation progress</p>
            </div>
            <div className="space-y-3">
              {stageLabels.map((label, index) => {
                const active = index <= stageIndex;
                return (
                  <div
                    key={label}
                    className={`flex items-center justify-between rounded-[1.25rem] border px-4 py-3 text-sm ${
                      active
                        ? "border-[#ff9b71]/30 bg-[#ff9b71]/12 text-[#8a3f20]"
                        : "border-[#17141f]/8 bg-white/45 text-[#17141f]/45"
                    }`}
                  >
                    <span>{label}</span>
                    <span className="text-xs uppercase tracking-[0.18em]">{active ? "done" : "waiting"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-[2.25rem] border border-[#17141f]/10 bg-[#17141f] p-6 text-[#fff7ed] shadow-[0_24px_60px_rgba(23,20,31,0.18)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#fff7ed]/45">Live preview</p>
                <h2 className="font-display text-3xl font-black uppercase">Circuit topology</h2>
              </div>
              <Badge className="border-none bg-white/10 text-[#fff7ed]/75">
                {generationResult ? `${generationResult.component_count} parts` : "awaiting input"}
              </Badge>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {componentPairs.length ? (
                  componentPairs.map((component, index) => (
                    <motion.div
                      key={component.ref}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="rounded-[1.5rem] border border-white/10 bg-black/10 px-4 py-4"
                    >
                      <p className="font-display text-xl font-black uppercase">{component.ref}</p>
                      <p className="mt-1 text-sm text-[#fff7ed]/65">{component.value}</p>
                      <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-[#ffd166]">
                        {component.footprint || "footprint pending"}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full rounded-[1.5rem] border border-dashed border-white/12 bg-black/10 p-8 text-center text-sm text-[#fff7ed]/50">
                    Generate a circuit to populate the preview grid.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[2rem] border border-[#17141f]/10 bg-white/55 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[#17141f]/45">Summary</p>
              <p className="mt-3 font-display text-2xl font-black uppercase text-[#17141f]">
                {generationResult?.description ?? "No generation yet"}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#17141f]/62">
                {generationResult
                  ? `${generationResult.component_count} components across ${generationResult.net_count} nets.`
                  : "Once generated, this area reflects the first-pass structure and file exports."}
              </p>
            </div>

            <div className="rounded-[2rem] border border-[#17141f]/10 bg-white/55 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[#17141f]/45">Timing</p>
              <p className="mt-3 font-mono text-4xl font-black text-[#8a3f20]">
                {generationResult?.generation_time ?? "0.00s"}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-[#17141f]/62">
                Prompt generation stays visible and compact instead of hiding the result behind a heavy console.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
