"use client";

import { ChevronLeft, ChevronRight, Download, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  ActivityHeatmapStory,
  LikesByMonthStory,
  MatchesByHourStory,
  MatchProgressStory,
  MessageLengthStory,
  SeasonalActivityStory,
  TopEmojisStory,
} from "./ChartStoryTypes";
import {
  CommentStrategyStory,
  ConversionStory,
  DateNightStory,
  EmojiStory,
  LongestChatStory,
  MessageStyleStory,
  OverviewStory,
  PeakActivityStory,
  ResponseTimeStory,
  SeasonStory,
} from "./StoryTypes";

const storyComponents = {
  overview: OverviewStory,
  "peak-activity": PeakActivityStory,
  emoji: EmojiStory,
  "response-time": ResponseTimeStory,
  season: SeasonStory,
  "message-style": MessageStyleStory,
  conversion: ConversionStory,
  "matches-by-hour": MatchesByHourStory,
  "likes-by-month": LikesByMonthStory,
  "seasonal-activity": SeasonalActivityStory,
  "message-length": MessageLengthStory,
  "activity-heatmap": ActivityHeatmapStory,
  "match-progress": MatchProgressStory,
  "top-emojis": TopEmojisStory,
  "comment-strategy": CommentStrategyStory,
  "date-night": DateNightStory,
  "longest-chat": LongestChatStory,
};

export default function StoryCarousel({ stories }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const carouselRef = useRef(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToStory = (index) => {
    setCurrentIndex(index);
  };

  const generateStoryImage = async () => {
    const storyElement = carouselRef.current?.querySelector(".story-container");
    if (!storyElement) {
      console.error("Story container element not found");
      return null;
    }

    try {
      const html2canvas = (await import("html2canvas")).default;

      // Get the element's actual rendered dimensions
      const rect = storyElement.getBoundingClientRect();

      // Use offsetWidth/Height which includes padding but not margin
      const width = storyElement.offsetWidth || rect.width;
      const height = storyElement.offsetHeight || rect.height;

      const canvas = await html2canvas(storyElement, {
        backgroundColor: null, // Transparent background
        scale: 2, // 2x for better quality
        useCORS: true,
        logging: false,
        // Don't set width/height to let html2canvas detect them automatically
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        allowTaint: true,
      });

      return canvas;
    } catch (error) {
      console.error("Error generating story image:", error);
      return null;
    }
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Hinge Data Story",
          text: "Check out my Hinge dating insights!",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
        fallbackShare();
      }
    } else {
      fallbackShare();
    }
  };

  const downloadImage = (canvas) => {
    try {
      const link = document.createElement("a");
      const timestamp = new Date().toISOString().slice(0, 10);
      link.download = `hinge-story-${currentIndex + 1}-${timestamp}.png`;
      link.href = canvas.toDataURL("image/png", 1.0); // Max quality
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("Error downloading image. Please try again.");
    }
  };

  const fallbackShare = () => {
    if (typeof window === "undefined") return;

    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert("Link copied to clipboard!");
    });
  };

  const downloadStory = async () => {
    if (typeof window === "undefined" || isDownloading) return;

    setIsDownloading(true);

    try {
      const canvas = await generateStoryImage();
      if (!canvas) {
        alert("Failed to generate story image. Please try again.");
        return;
      }
      downloadImage(canvas);
    } catch (error) {
      console.error("Error in downloadStory:", error);
      alert("Error downloading story. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") prevStory();
      if (e.key === "ArrowRight") nextStory();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex]);

  if (!stories || stories.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">No stories to display</p>
      </div>
    );
  }

  const currentStory = stories[currentIndex];
  const StoryComponent = storyComponents[currentStory.type];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-semibold">My Hinge Stories</h1>
          <span className="text-sm text-gray-400">
            {currentIndex + 1} of {stories.length}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={downloadStory}
            disabled={isDownloading}
            className={`p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors ${
              isDownloading ? "opacity-50 cursor-wait" : ""
            }`}
            title="Download Story Image"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
            title="Share Link"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="flex space-x-1 px-4 pb-4">
        {stories.map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full cursor-pointer transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/30"
            }`}
            onClick={() => goToStory(index)}
          />
        ))}
      </div>

      {/* Story Container */}
      <div
        ref={carouselRef}
        className="flex-1 flex items-center justify-center p-4"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="w-full max-w-sm story-container">
          {StoryComponent && <StoryComponent story={currentStory} />}
        </div>
      </div>

      {/* Navigation Controls (Desktop) */}
      <div className="hidden md:flex absolute inset-y-0 left-4 right-4 items-center justify-between pointer-events-none">
        <button
          onClick={prevStory}
          disabled={currentIndex === 0}
          className={`p-3 rounded-full pointer-events-auto transition-colors ${
            currentIndex === 0
              ? "bg-white/10 text-white/30 cursor-not-allowed"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextStory}
          disabled={currentIndex === stories.length - 1}
          className={`p-3 rounded-full pointer-events-auto transition-colors ${
            currentIndex === stories.length - 1
              ? "bg-white/10 text-white/30 cursor-not-allowed"
              : "bg-white/20 text-white hover:bg-white/30"
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex justify-center space-x-4 p-4">
        <button
          onClick={prevStory}
          disabled={currentIndex === 0}
          className={`px-6 py-2 rounded-full transition-colors ${
            currentIndex === 0
              ? "bg-white/10 text-white/30"
              : "bg-white/20 text-white"
          }`}
        >
          Previous
        </button>

        <button
          onClick={nextStory}
          disabled={currentIndex === stories.length - 1}
          className={`px-6 py-2 rounded-full transition-colors ${
            currentIndex === stories.length - 1
              ? "bg-white/10 text-white/30"
              : "bg-white/20 text-white"
          }`}
        >
          Next
        </button>
      </div>

      {/* Story Dots */}
      <div className="flex justify-center space-x-2 pb-8">
        {stories.map((_, index) => (
          <button
            key={index}
            onClick={() => goToStory(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
