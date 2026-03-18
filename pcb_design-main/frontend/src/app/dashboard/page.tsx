"use client";

import React, { useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { AppWindow, ArrowRight, Download, Loader2, Play, Sparkles, TerminalSquare, TriangleAlert } from "lucide-react";
import { MechButton } from "@/components/ui/MechButton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { usePlatform } from "@/lib/platform-context";

interface DemoCircuit {
  name: string;
  title: string;
  prompt: string;
  description: string;
  component_count: number;
  net_count: number;
  category: string;
}

function nowTime() {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

export default function DashboardPage() {
  const [prompt, setPrompt] = useState("3.3V regulator from 5V input with decoupling capacitor");
  const [demos, setDemos] = useState<DemoCircuit[]>([]);
  const [backendStatus, setBackendStatus] = useState("checking");
  const [isOpeningKiCad, setIsOpeningKiCad] = useState(false);
  const [bundle, setBundle] = useState<Awaited<ReturnType<typeof api.generateJudge>> | null>(null);
  const [isPending, startTransition] = useTransition();
  const { logs, addLog, setGenerationResult, setActiveComponents } = usePlatform();

  useEffect(() => {
    api.health().then(() => setBackendStatus("online")).catch(() => setBackendStatus("offline"));
    api.demoCircuits().then(setDemos).catch((error: Error) => {
      addLog({ time: nowTime(), type: "ERROR", msg: `Demo list unavailable: ${error.message}` });
    });
  }, [addLog]);

  function pushBundleToContext(result: Awaited<ReturnType<typeof api.generateJudge>>) {
    setBundle(result);
    setActiveComponents(result.components);
    setGenerationResult({
      success: result.success,
      description: result.summary,
      component_count: result.component_count,
      net_count: result.net_count,
      template_used: result.template_used,
      generation_time: `${(result.generation_time_ms / 1000).toFixed(2)}s`,
      components: result.components,
      bom: [],
      violations: result.top_issues.map((issue) => ({
        severity: "warning",
        type: "workspace_issue",
        message: issue,
      })),
      download_url: result.files.schematic,
      bundle_download_url: result.bundle_download_url,
      dfm_score: result.dfm_score,
      risk_level: result.risk_level,
    });
  }

  function runPromptBundle() {
    if (!prompt.trim()) {
      return;
    }

    addLog({ time: nowTime(), type: "AI", msg: `Generating workspace bundle for: ${prompt}` });
    startTransition(async () => {
      try {
        const result = await api.generateJudge(prompt.trim());
        pushBundleToContext(result);
        addLog({ time: nowTime(), type: "INFO", msg: `Bundle ready: ${result.component_count} parts, score ${result.dfm_score}` });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown failure";
        addLog({ time: nowTime(), type: "ERROR", msg: `Bundle failed: ${message}` });
      }
    });
  }

  function runDemoBundle(name: string, title: string) {
    addLog({ time: nowTime(), type: "SYNC", msg: `Loading starter circuit: ${title}` });
    startTransition(async () => {
      try {
        const result = await api.demoBundle(name);
        pushBundleToContext(result);
        setPrompt(result.prompt);
        addLog({ time: nowTime(), type: "INFO", msg: `${title} loaded into the workspace.` });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown failure";
        addLog({ time: nowTime(), type: "ERROR", msg: `Demo bundle failed: ${message}` });
      }
    });
  }

  async function openLatestInKiCad() {
    setIsOpeningKiCad(true);
    try {
      const result = await api.openLatestInKiCad();
      addLog({ time: nowTime(), type: result.success ? "INFO" : "ERROR", msg: result.message });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to open KiCad";
      addLog({ time: nowTime(), type: "ERROR", msg: message });
    } finally {
      setIsOpeningKiCad(false);
    }
  }

  const activeLogs =
    logs.length > 0
      ? logs
      : [{ time: nowTime(), type: "INFO" as const, msg: "Waiting for a prompt or starter circuit." }];

  return (
    <div className="min-h-full bg-transparent px-6 py-6 text-[#17141f]">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-6">
          <div className="rounded-[2.25rem] border border-[#17141f]/10 bg-white/60 p-7 backdrop-blur-xl">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <Badge className="border-none bg-[#ff9b71]/16 text-[#8a3f20]">Novaforge Studio</Badge>
              <Badge className="border-none bg-[#17141f]/8 text-[#17141f]/60">Backend {backendStatus}</Badge>
            </div>
            <h1 className="max-w-3xl font-display text-5xl font-black uppercase leading-[0.94] tracking-[-0.05em]">
              Generate a circuit, inspect the result, and hand it off cleanly.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#17141f]/65">
              This workspace keeps the first-run flow simple: start from a prompt or a starter design, review the output, then open the latest schematic in KiCad.
            </p>

            <div className="mt-6 flex flex-col gap-3 md:flex-row">
              <Input
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                className="h-12 rounded-[1.25rem] border-[#17141f]/10 bg-[#fffaf4] text-[#17141f] placeholder:text-[#17141f]/32"
                placeholder="Describe the circuit you want to build"
              />
              <MechButton variant="primary" size="lg" onClick={runPromptBundle} disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Files
              </MechButton>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {demos.map((demo) => (
              <motion.button
                key={demo.name}
                whileHover={{ y: -3 }}
                onClick={() => runDemoBundle(demo.name, demo.title)}
                className="rounded-[1.75rem] border border-[#17141f]/10 bg-white/55 p-5 text-left transition hover:border-[#ff9b71]/30 hover:bg-white/80"
              >
                <div className="mb-4 flex items-center justify-between">
                  <Badge className="border-none bg-[#17141f]/8 text-[#17141f]/55">{demo.category || "starter"}</Badge>
                  <Play className="h-4 w-4 text-[#8a3f20]" />
                </div>
                <h2 className="font-display text-2xl font-black uppercase tracking-tight text-[#17141f]">{demo.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#17141f]/62">{demo.description}</p>
                <div className="mt-4 flex gap-4 text-xs uppercase tracking-[0.18em] text-[#17141f]/42">
                  <span>{demo.component_count} parts</span>
                  <span>{demo.net_count} nets</span>
                </div>
                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#8a3f20]">
                  Use starter <ArrowRight className="h-4 w-4" />
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="grid gap-6">
          <div className="rounded-[2.25rem] border border-[#17141f]/10 bg-[#17141f] p-6 text-[#fff7ed] shadow-[0_24px_60px_rgba(23,20,31,0.16)]">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[#fff7ed]/45">Current output</p>
                <h2 className="font-display text-3xl font-black uppercase">Generation status</h2>
              </div>
              {bundle?.bundle_download_url ? (
                <div className="flex items-center gap-2">
                  <a href={api.downloadUrl(bundle.bundle_download_url)} download>
                    <MechButton variant="outline" size="sm" className="border-white/14 bg-white/8 text-[#fff7ed] hover:bg-white/14">
                      <Download className="mr-2 h-4 w-4" />
                      Download Zip
                    </MechButton>
                  </a>
                  <MechButton
                    variant="outline"
                    size="sm"
                    className="border-white/14 bg-white/8 text-[#fff7ed] hover:bg-white/14"
                    onClick={openLatestInKiCad}
                    disabled={isOpeningKiCad}
                  >
                    {isOpeningKiCad ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AppWindow className="mr-2 h-4 w-4" />}
                    Open in KiCad
                  </MechButton>
                </div>
              ) : null}
            </div>

            {bundle ? (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#fff7ed]/45">Readiness</p>
                    <p className="mt-2 font-mono text-4xl font-black text-[#ffd166]">{bundle.dfm_score}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#fff7ed]/45">Risk</p>
                    <p className="mt-2 font-display text-2xl font-black uppercase">{bundle.risk_level}</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-[#fff7ed]/45">Output</p>
                    <p className="mt-2 font-display text-2xl font-black uppercase">{bundle.component_count} parts</p>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-[#ff9b71]/20 bg-[#ff9b71]/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#ffd9a0]">Overview</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#fff7ed]/78">{bundle.summary}</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                    <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#fff7ed]/45">Design notes</p>
                    <div className="space-y-2">
                      {bundle.top_issues.length ? (
                        bundle.top_issues.map((issue) => (
                          <div key={issue} className="rounded-[1rem] border border-white/8 bg-black/10 px-3 py-3 text-sm text-[#fff7ed]/74">
                            {issue}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-[#fff7ed]/60">No blocking DFM issues detected.</p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                    <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#fff7ed]/45">Artifacts</p>
                    <div className="grid gap-2 text-sm">
                      {Object.entries(bundle.files).map(([label, path]) => (
                        <a
                          key={label}
                          href={api.downloadUrl(path)}
                          download
                          className="rounded-[1rem] border border-white/8 bg-black/10 px-3 py-3 capitalize text-[#fff7ed]/74 transition hover:border-[#ff9b71]/30 hover:text-[#fff7ed]"
                        >
                          {label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-white/12 bg-black/10 p-8 text-center text-sm text-[#fff7ed]/58">
                Your first generation will populate this area with readiness, notes, and downloadable files.
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-[#17141f]/10 bg-white/55 p-6">
            <div className="mb-4 flex items-center gap-2">
              <TerminalSquare className="h-4 w-4 text-[#8a3f20]" />
              <h3 className="font-display text-xl font-black uppercase text-[#17141f]">Run log</h3>
            </div>
            <ScrollArea className="h-[320px] rounded-[1.25rem] border border-[#17141f]/10 bg-[#fffaf4] p-4">
              <div className="space-y-2 font-mono text-sm">
                {activeLogs.map((log, index) => (
                  <div key={`${log.time}-${index}`} className="flex gap-3 rounded-[1rem] border border-[#17141f]/8 bg-white/70 px-3 py-3">
                    <span className="text-[#17141f]/38">{log.time}</span>
                    <span className={log.type === "ERROR" ? "text-[#b54833]" : log.type === "SYNC" ? "text-[#8a3f20]" : "text-[#2f73ad]"}>
                      {log.type}
                    </span>
                    <span className="text-[#17141f]/74">{log.msg}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
            {backendStatus === "offline" ? (
              <div className="mt-4 flex items-start gap-2 rounded-[1.25rem] border border-[#ff9b71]/25 bg-[#ff9b71]/14 px-4 py-3 text-sm text-[#8a3f20]">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                Start the FastAPI backend at `http://127.0.0.1:8765` before using the workspace.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
