"use client";

import { storyStyles } from "@/lib/storyGenerator";
import { Sparkles } from "lucide-react";

export default function StoryTemplate({ story, children }) {
  const style = storyStyles[story.style] || storyStyles["gradient-purple"];

  return (
    <div
      className="relative w-full aspect-[9/16] flex flex-col justify-between text-white overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/10"
      style={{ background: style.background }}
    >
      {/* Noise Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40 pointer-events-none z-0" />

      {/* Dynamic Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-[10%] -right-[10%] w-[60%] h-[60%] rounded-full blur-[80px] opacity-40 animate-pulse"
          style={{ backgroundColor: style.accent }}
        />
        <div
          className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[80px] opacity-40 animate-pulse delay-1000"
          style={{ backgroundColor: style.accent }}
        />
      </div>

      {/* Content Area */}
      <div className="relative z-10 flex flex-col justify-between h-full p-8">
        {/* Header */}
        <div className="text-center pt-2">
          <div className="inline-flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-3 py-1 mb-3 border border-white/20 shadow-lg">
            <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/90">
              {new Date().getFullYear()} Hinge Wrapped
            </span>
            <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
          </div>
          <h1
            className="text-3xl font-black mb-1 text-white leading-tight tracking-tight"
            style={{ textShadow: "0 4px 12px rgba(0,0,0,0.3)" }}
          >
            {story.title}
          </h1>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center py-6">
          <div className="w-full relative">{children}</div>
        </div>

        {/* Footer / Watermark */}
        <div className="text-center pb-4">
          <div className="flex flex-col items-center space-y-2">
            <div className="h-px w-12 bg-white/30 mb-2" />
            <div className="flex items-center space-x-2 opacity-80">
              <span className="font-bold tracking-tight">
                Hinge Data Analyzer
              </span>
              <span className="text-white/50">•</span>
              <span className="text-sm">hinge-data-analyzer.pages.dev</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
