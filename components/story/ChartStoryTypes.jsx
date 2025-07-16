"use client";

import {
  Calendar,
  Clock,
  Heart,
  MessageSquare,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  StoryBarChart,
  StoryLineChart,
  StoryPieChart,
  StoryProgressBar,
} from "./StoryCharts";
import StoryTemplate from "./StoryTemplate";

export function MatchesByHourStory({ story }) {
  const { storyStyles } = require("@/lib/storyGenerator");
  const style = storyStyles[story.style];

  return (
    <StoryTemplate story={story}>
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <Clock className="w-12 h-12 mx-auto opacity-90" />
          <h2 className="text-2xl font-bold">Hourly Match Pattern</h2>
          <p className="text-sm opacity-80">When you get the most matches</p>
        </div>

        <StoryBarChart
          data={story.data.hourlyData}
          dataKey="count"
          color={style.accent}
        />

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="text-lg font-semibold">
            Peak: {story.data.peakHour} ({story.data.peakCount} matches)
          </div>
        </div>
      </div>
    </StoryTemplate>
  );
}

export function LikesByMonthStory({ story }) {
  const { storyStyles } = require("@/lib/storyGenerator");
  const style = storyStyles[story.style];

  return (
    <StoryTemplate story={story}>
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <TrendingUp className="w-12 h-12 mx-auto opacity-90" />
          <h2 className="text-2xl font-bold">Monthly Likes Trend</h2>
          <p className="text-sm opacity-80">Your activity over time</p>
        </div>

        <StoryLineChart
          data={story.data.monthlyData}
          dataKey="count"
          color={style.accent}
        />

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="text-lg font-semibold">
            Best Month: {story.data.bestMonth}
          </div>
          <div className="text-sm opacity-80">
            {story.data.bestMonthCount} likes sent
          </div>
        </div>
      </div>
    </StoryTemplate>
  );
}

export function SeasonalActivityStory({ story }) {
  const seasonColors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4"];

  return (
    <StoryTemplate story={story}>
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <Calendar className="w-12 h-12 mx-auto opacity-90" />
          <h2 className="text-2xl font-bold">Seasonal Breakdown</h2>
          <p className="text-sm opacity-80">Your activity by season</p>
        </div>

        <StoryPieChart data={story.data.seasonalData} colors={seasonColors} />

        <div className="grid grid-cols-2 gap-3">
          {story.data.seasonalData.map((season, index) => (
            <div
              key={season.season}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-3"
            >
              <div className="text-sm font-semibold">{season.season}</div>
              <div className="text-lg">{season.count}</div>
            </div>
          ))}
        </div>
      </div>
    </StoryTemplate>
  );
}

export function MessageLengthStory({ story }) {
  const { storyStyles } = require("@/lib/storyGenerator");
  const style = storyStyles[story.style];

  return (
    <StoryTemplate story={story}>
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <MessageSquare className="w-12 h-12 mx-auto opacity-90" />
          <h2 className="text-2xl font-bold">Message Length Distribution</h2>
          <p className="text-sm opacity-80">How long are your messages?</p>
        </div>

        <div className="space-y-4">
          {story.data.lengthData.map((range, index) => (
            <StoryProgressBar
              key={range.range}
              value={range.count}
              max={story.data.maxCount}
              label={`${range.range} chars`}
              color={style.accent}
            />
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="text-lg font-semibold">
            Most Common: {story.data.mostCommon}
          </div>
        </div>
      </div>
    </StoryTemplate>
  );
}

export function ActivityHeatmapStory({ story }) {
  return (
    <StoryTemplate story={story}>
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <Zap className="w-12 h-12 mx-auto opacity-90" />
          <h2 className="text-2xl font-bold">Activity Heatmap</h2>
          <p className="text-sm opacity-80">Your weekly activity pattern</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="space-y-3">
            <div className="grid grid-cols-7 gap-1 text-xs text-center">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="opacity-75">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {story.data.heatmapData.map((day, index) => (
                <div key={index} className="space-y-1">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div
                      key={i}
                      className="w-full h-2 rounded-sm"
                      style={{
                        backgroundColor: `rgba(255, 255, 255, ${
                          day.intensity[i] || 0.1
                        })`,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-sm opacity-80">
          Most active: {story.data.mostActiveDay}
        </div>
      </div>
    </StoryTemplate>
  );
}

export function MatchProgressStory({ story }) {
  const { storyStyles } = require("@/lib/storyGenerator");
  const style = storyStyles[story.style];

  return (
    <StoryTemplate story={story}>
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <Heart className="w-12 h-12 mx-auto opacity-90" />
          <h2 className="text-2xl font-bold">Match Journey</h2>
          <p className="text-sm opacity-80">Your progress breakdown</p>
        </div>

        <div className="space-y-4">
          <StoryProgressBar
            value={story.data.totalLikes}
            max={story.data.totalLikes}
            label="Likes Sent"
            color={style.accent}
          />
          <StoryProgressBar
            value={story.data.totalMatches}
            max={story.data.totalLikes}
            label="Matches"
            color={style.accent}
          />
          <StoryProgressBar
            value={story.data.totalConversations}
            max={story.data.totalMatches}
            label="Conversations"
            color={style.accent}
          />
          <StoryProgressBar
            value={story.data.totalDates}
            max={story.data.totalConversations}
            label="Dates"
            color={style.accent}
          />
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="text-lg font-semibold">
            Success Rate: {story.data.successRate}%
          </div>
        </div>
      </div>
    </StoryTemplate>
  );
}

export function TopEmojisStory({ story }) {
  return (
    <StoryTemplate story={story}>
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Top Emojis</h2>
          <p className="text-sm opacity-80">Your emoji personality</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {story.data.topEmojis.slice(0, 9).map((emoji, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
            >
              <div className="text-3xl mb-2">{emoji.emoji}</div>
              <div className="text-sm font-semibold">{emoji.count}</div>
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="text-lg">
            Total emojis used: {story.data.totalEmojis}
          </div>
        </div>
      </div>
    </StoryTemplate>
  );
}
