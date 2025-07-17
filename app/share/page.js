"use client";

import StoryCarousel from "@/components/story/StoryCarousel";
import { generateStories } from "@/lib/storyGenerator";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SharePage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get processed data from sessionStorage or localStorage (client-side only)
    if (typeof window !== "undefined") {
      const storedData =
        sessionStorage.getItem("hingeProcessedData") ||
        localStorage.getItem("hingeProcessedData");

      if (storedData) {
        try {
          const processedData = JSON.parse(storedData);
          const generatedStories = generateStories(processedData);
          setStories(generatedStories);
        } catch (error) {
          console.error("Error parsing stored data:", error);
          router.push("/");
        }
      } else {
        // No data found, redirect to home
        router.push("/");
      }
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Generating your stories...</p>
        </div>
      </div>
    );
  }

  if (stories.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <p className="text-lg">No data available to create stories.</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            Upload Your Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 z-50 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
        title="Back to Analyzer"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <StoryCarousel stories={stories} />
    </div>
  );
}
