"use client";

import { storyStyles } from "@/lib/storyGenerator";

export default function StoryTemplate({ story, children }) {
  const style = storyStyles[story.style] || storyStyles["gradient-purple"];

  return (
    <div
      className="relative w-full aspect-[9/16] flex flex-col justify-between text-white overflow-hidden rounded-2xl shadow-2xl"
      style={{ background: style.background }}
    >
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, ${style.accent} 0%, transparent 50%), 
                           radial-gradient(circle at 80% 20%, ${style.accent} 0%, transparent 50%),
                           radial-gradient(circle at 40% 40%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
        }}
      />

      {/* Content Area */}
      <div className="relative z-10 flex flex-col justify-between h-full p-8">
        {/* Header */}
        <div className="text-center">
          <h1
            className="text-3xl font-bold mb-2 text-white drop-shadow-lg"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
          >
            {story.title}
          </h1>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          <div
            className="w-full"
            style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.6)" }}
          >
            {children}
          </div>
        </div>

        {/* Watermark */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <span
              className="text-sm font-medium text-white"
              style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
            >
              by @dave_xt
            </span>
            <div className="w-1 h-1 bg-white rounded-full opacity-70" />
            <span
              className="text-xs text-white/90"
              style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
            >
              Hinge Data Analyzer
            </span>
          </div>
        </div>
      </div>

      {/* Decorative Elements with better contrast */}
      <div className="absolute top-8 right-8 w-16 h-16 border-2 border-white/30 rounded-full" />
      <div className="absolute bottom-32 left-8 w-8 h-8 border-2 border-white/30 rounded-full" />
      <div className="absolute top-1/3 left-4 w-2 h-2 bg-white/40 rounded-full" />
      <div className="absolute top-2/3 right-6 w-3 h-3 bg-white/30 rounded-full" />
    </div>
  );
}
