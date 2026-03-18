"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Cpu, Loader2, Move, Sparkles, Target } from "lucide-react";
import { MechButton } from "@/components/ui/MechButton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/api";
import { usePlatform, type GeneratedComponent } from "@/lib/platform-context";

type CompType = "IC" | "R" | "C" | "LED" | "CONN" | "Q" | "L" | "D" | "XTAL" | "MISC";

interface PlacedNode {
  id: string;
  x: number;
  y: number;
  type: CompType;
  value: string;
  part: string;
  footprint: string;
}

const VB = { W: 1000, H: 700 };
const PAD = 100;

const TYPE_VISUALS: Record<CompType, { color: string; label: string; width: number; height: number }> = {
  IC: { color: "#8a3f20", label: "IC", width: 110, height: 70 },
  R: { color: "#6b4fd3", label: "RES", width: 78, height: 28 },
  C: { color: "#2b8b73", label: "CAP", width: 52, height: 52 },
  LED: { color: "#d46a32", label: "LED", width: 56, height: 56 },
  CONN: { color: "#9b7b13", label: "CON", width: 42, height: 90 },
  Q: { color: "#b74f82", label: "FET", width: 56, height: 56 },
  L: { color: "#2f73ad", label: "IND", width: 68, height: 34 },
  D: { color: "#d46a32", label: "DIO", width: 56, height: 56 },
  XTAL: { color: "#8f52be", label: "OSC", width: 56, height: 56 },
  MISC: { color: "#5c5c6b", label: "GEN", width: 64, height: 48 },
};

function deriveType(ref: string): CompType {
  const prefix = ref.replace(/[0-9]/g, "").toUpperCase();
  if (prefix === "U") return "IC";
  if (prefix === "R") return "R";
  if (prefix === "C") return "C";
  if (prefix === "D") return "LED";
  if (prefix === "Q" || prefix === "T") return "Q";
  if (prefix === "J" || prefix === "P") return "CONN";
  if (prefix === "L") return "L";
  if (prefix === "Y") return "XTAL";
  return "MISC";
}

function mapToNodes(components: GeneratedComponent[]): PlacedNode[] {
  if (!components.length) {
    return [];
  }

  const contentW = VB.W - PAD * 2;
  const contentH = VB.H - PAD * 2;
  const cols = Math.max(2, Math.ceil(Math.sqrt(components.length * 1.5)));
  const rows = Math.ceil(components.length / cols);
  const cellW = contentW / cols;
  const cellH = contentH / Math.max(rows, 1);

  return components.map((component, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    return {
      id: component.ref,
      x: PAD + col * cellW + cellW / 2,
      y: PAD + row * cellH + cellH / 2,
      type: deriveType(component.ref),
      value: component.value,
      part: component.part ?? "",
      footprint: component.footprint ?? "",
    };
  });
}

function TypeBadge({ type }: { type: CompType }) {
  const visual = TYPE_VISUALS[type];
  return (
    <span
      className="inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]"
      style={{
        color: visual.color,
        borderColor: `${visual.color}33`,
        backgroundColor: `${visual.color}12`,
      }}
    >
      {visual.label}
    </span>
  );
}

function PlacementShape({
  node,
  selected,
  onClick,
}: {
  node: PlacedNode;
  selected: boolean;
  onClick: () => void;
}) {
  const visual = TYPE_VISUALS[node.type];
  const x = node.x - visual.width / 2;
  const y = node.y - visual.height / 2;

  return (
    <g onClick={onClick} className="cursor-pointer">
      <rect
        x={x}
        y={y}
        width={visual.width}
        height={visual.height}
        rx={18}
        fill={selected ? `${visual.color}22` : "#fffaf4"}
        stroke={selected ? visual.color : "rgba(23,20,31,0.14)"}
        strokeWidth={selected ? 2.4 : 1.3}
      />
      <text x={node.x} y={node.y - 3} textAnchor="middle" fill="#17141f" fontSize="14" fontWeight="700">
        {node.id}
      </text>
      <text x={node.x} y={node.y + 16} textAnchor="middle" fill="rgba(23,20,31,0.55)" fontSize="11">
        {node.value}
      </text>
    </g>
  );
}

export default function PlacementPage() {
  const { activeComponents, setActiveComponents, generationResult, addLog } = usePlatform();
  const [nodes, setNodes] = useState<PlacedNode[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    if (activeComponents.length) {
      setNodes(mapToNodes(activeComponents));
      setSelectedId((current) => current ?? activeComponents[0]?.ref ?? null);
    } else {
      setNodes([]);
      setSelectedId(null);
    }
  }, [activeComponents]);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedId) ?? null,
    [nodes, selectedId]
  );

  const handleOptimize = useCallback(async () => {
    if (!nodes.length || isOptimizing) {
      return;
    }

    setIsOptimizing(true);
    const time = () => new Date().toLocaleTimeString("en-US", { hour12: false });
    addLog({ time: time(), type: "AI", msg: "Running placement optimization." });

    try {
      const result = await api.optimizePlacement({
        components: activeComponents.map((component) => ({
          ref: component.ref,
          value: component.value,
          x: component.x,
          y: component.y,
          rotation: component.rotation,
          layer: "top",
        })),
        board_width: 100,
        board_height: 80,
      });

      if (!result.positions) {
        throw new Error(result.error ?? "No placement positions returned.");
      }

      const contentW = VB.W - PAD * 2;
      const contentH = VB.H - PAD * 2;
      const positions = result.positions;

      setNodes((current) =>
        current.map((node) => {
          const pos = positions[node.id];
          if (!pos) {
            return node;
          }
          return {
            ...node,
            x: (pos.x / 100) * contentW + PAD,
            y: (pos.y / 80) * contentH + PAD,
          };
        })
      );

      setActiveComponents(
        activeComponents.map((component) => {
          const pos = positions[component.ref];
          return pos ? { ...component, x: pos.x, y: pos.y, rotation: pos.rotation } : component;
        })
      );

      addLog({ time: time(), type: "INFO", msg: result.improvement ?? "Placement updated." });
    } catch (error) {
      addLog({
        time: time(),
        type: "ERROR",
        msg: error instanceof Error ? error.message : "Placement optimization failed.",
      });
    } finally {
      setIsOptimizing(false);
    }
  }, [activeComponents, addLog, isOptimizing, nodes.length, setActiveComponents]);

  if (!activeComponents.length) {
    return (
      <div className="flex min-h-full items-center justify-center px-6 py-10 text-[#17141f]">
        <div className="w-full max-w-xl rounded-[2rem] border border-[#17141f]/10 bg-white/60 p-8 text-center backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a3f20]">Placement workspace</p>
          <h1 className="mt-4 font-display text-4xl font-black uppercase tracking-[-0.04em]">
            Generate a circuit before arranging the board.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#17141f]/65">
            Once a circuit is generated, this view will render the parts, let you inspect them, and run the optimizer.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/dashboard/generate">
              <MechButton variant="primary" size="lg">
                <ArrowLeft className="h-4 w-4" />
                Go to Generate
              </MechButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-transparent px-6 py-6 text-[#17141f]">
      <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[0.34fr_1fr_0.34fr]">
        <section className="rounded-[2rem] border border-[#17141f]/10 bg-white/60 p-5 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a3f20]">Parts list</p>
              <h2 className="font-display text-2xl font-black uppercase">Components</h2>
            </div>
            <Badge className="border-none bg-[#17141f]/8 text-[#17141f]/60">{nodes.length}</Badge>
          </div>

          <ScrollArea className="h-[660px] pr-2">
            <div className="space-y-2">
              {nodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => setSelectedId(node.id)}
                  className={`w-full rounded-[1.25rem] border px-4 py-3 text-left transition ${
                    selectedId === node.id
                      ? "border-[#ff9b71]/35 bg-[#ff9b71]/12"
                      : "border-[#17141f]/8 bg-[#fffaf4] hover:border-[#17141f]/16"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-lg font-black uppercase text-[#17141f]">{node.id}</p>
                      <p className="text-sm text-[#17141f]/60">{node.value}</p>
                    </div>
                    <TypeBadge type={node.type} />
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </section>

        <section className="rounded-[2rem] border border-[#17141f]/10 bg-white/55 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a3f20]">Board canvas</p>
              <h1 className="font-display text-3xl font-black uppercase">Placement view</h1>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="border-none bg-[#17141f]/8 text-[#17141f]/60">
                {generationResult?.description ?? "Current circuit"}
              </Badge>
              <MechButton variant="primary" size="md" onClick={handleOptimize} disabled={isOptimizing}>
                {isOptimizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Auto Optimize
              </MechButton>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#17141f]/10 bg-[#fffaf4] p-4">
            <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[#17141f]/45">
              <span>Interactive board map</span>
              <span>{nodes.length} nodes</span>
            </div>
            <svg viewBox={`0 0 ${VB.W} ${VB.H}`} className="h-[640px] w-full rounded-[1.5rem] bg-[linear-gradient(180deg,#fffdf8_0%,#f7f0e7_100%)]">
              <defs>
                <pattern id="nova-grid" width="36" height="36" patternUnits="userSpaceOnUse">
                  <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(23,20,31,0.05)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#nova-grid)" />

              {nodes.map((node) => (
                <PlacementShape
                  key={node.id}
                  node={node}
                  selected={selectedId === node.id}
                  onClick={() => setSelectedId(node.id)}
                />
              ))}
            </svg>
          </div>
        </section>

        <section className="rounded-[2rem] border border-[#17141f]/10 bg-white/60 p-5 backdrop-blur-xl">
          <div className="mb-4 flex items-center gap-2 text-[#8a3f20]">
            <Target className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-[0.22em]">Selection</p>
          </div>

          {selectedNode ? (
            <div className="space-y-4">
              <div className="rounded-[1.5rem] border border-[#17141f]/10 bg-[#fffaf4] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-3xl font-black uppercase text-[#17141f]">{selectedNode.id}</h2>
                    <p className="text-sm text-[#17141f]/62">{selectedNode.part || "Generated component"}</p>
                  </div>
                  <TypeBadge type={selectedNode.type} />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#17141f]/70">{selectedNode.value}</p>
              </div>

              <div className="grid gap-3">
                {[
                  { label: "Footprint", value: selectedNode.footprint || "Not assigned yet" },
                  { label: "Canvas X", value: `${selectedNode.x.toFixed(0)} px` },
                  { label: "Canvas Y", value: `${selectedNode.y.toFixed(0)} px` },
                  { label: "Board role", value: TYPE_VISUALS[selectedNode.type].label },
                ].map((item) => (
                  <div key={item.label} className="rounded-[1.25rem] border border-[#17141f]/10 bg-[#fffaf4] px-4 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#17141f]/40">{item.label}</p>
                    <p className="mt-1 text-sm text-[#17141f]/74">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.5rem] border border-[#17141f]/10 bg-[#17141f] px-4 py-4 text-[#fff7ed]">
                <div className="mb-2 flex items-center gap-2">
                  <Move className="h-4 w-4 text-[#ffd166]" />
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#fff7ed]/55">Placement note</p>
                </div>
                <p className="text-sm leading-relaxed text-[#fff7ed]/72">
                  Use the auto optimizer to rebalance component spacing, then fine-tune placement inside KiCad after opening the latest schematic.
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-[#17141f]/12 bg-[#fffaf4] p-6 text-sm text-[#17141f]/55">
              Select a component from the list or the board map to inspect it here.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
