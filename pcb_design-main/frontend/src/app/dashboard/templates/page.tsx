"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, LibraryBig, Loader2, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { usePlatform } from "@/lib/platform-context";

interface BackendTemplate {
  name: string;
  filename: string;
  description: string;
  component_count: number;
  net_count: number;
  category: string;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<BackendTemplate[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { addLog } = usePlatform();

  useEffect(() => {
    api
      .templates()
      .then((data) => {
        setTemplates(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(search.toLowerCase()) ||
      template.description.toLowerCase().includes(search.toLowerCase())
  );

  function openTemplate(template: BackendTemplate) {
    addLog({
      time: new Date().toLocaleTimeString("en-US", { hour12: false }),
      type: "INFO",
      msg: `Template loaded: ${template.name}`,
    });
    router.push("/dashboard/generate");
  }

  return (
    <div className="min-h-full bg-transparent px-6 py-6 text-[#17141f]">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-[2rem] border border-[#17141f]/10 bg-white/60 p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[#8a3f20]">
                <LibraryBig className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-[0.24em]">Template library</p>
              </div>
              <h1 className="font-display text-4xl font-black uppercase tracking-[-0.04em]">
                Start from a stable circuit pattern.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#17141f]/65">
                Browse reusable starting points, then jump into the generator with a cleaner baseline.
              </p>
            </div>

            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#17141f]/30" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search templates"
                className="h-12 rounded-[1.25rem] border-[#17141f]/10 bg-[#fffaf4] pl-11 text-[#17141f]"
              />
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#17141f]/10 bg-white/50 p-6">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-24 text-[#17141f]/50">
              <Loader2 className="h-5 w-5 animate-spin text-[#8a3f20]" />
              <span className="text-sm">Loading templates</span>
            </div>
          ) : error ? (
            <div className="py-24 text-center text-sm text-[#8a3f20]">{error}</div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((template, index) => (
                <motion.button
                  key={template.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => openTemplate(template)}
                  className="rounded-[1.75rem] border border-[#17141f]/10 bg-[#fffaf4] p-5 text-left transition hover:border-[#ff9b71]/35 hover:bg-white"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <Badge className="border-none bg-[#17141f]/8 text-[#17141f]/60">
                      {template.category || "template"}
                    </Badge>
                    <span className="text-xs uppercase tracking-[0.18em] text-[#8a3f20]">{template.filename}</span>
                  </div>
                  <h2 className="font-display text-2xl font-black uppercase tracking-tight text-[#17141f]">
                    {template.name.replaceAll("_", " ")}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-[#17141f]/62">{template.description}</p>
                  <div className="mt-5 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[#17141f]/45">
                    <span>{template.component_count} parts</span>
                    <span>{template.net_count} nets</span>
                  </div>
                  <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#8a3f20]">
                    Open template <ArrowRight className="h-4 w-4" />
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
