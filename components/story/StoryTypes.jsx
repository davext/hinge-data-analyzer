"use client";

import {
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  MessageSquare,
  Target,
  ThumbsUp,
} from "lucide-react";
import StoryTemplate from "./StoryTemplate";

export function OverviewStory({ story }) {
  return (
    <StoryTemplate story={story}>
      <div className="text-center space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <Heart className="w-8 h-8 mb-2" />
            </div>
            <div className="text-4xl font-bold">{story.data.totalMatches}</div>
            <div className="text-sm opacity-80">Matches</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <ThumbsUp className="w-8 h-8 mb-2" />
            </div>
            <div className="text-4xl font-bold">{story.data.totalLikes}</div>
            <div className="text-sm opacity-80">Likes Sent</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <MessageCircle className="w-8 h-8 mb-2" />
            </div>
            <div className="text-4xl font-bold">{story.data.totalMessages}</div>
            <div className="text-sm opacity-80">Messages</div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center">
              <Calendar className="w-8 h-8 mb-2" />
            </div>
            <div className="text-4xl font-bold">{story.data.totalDates}</div>
            <div className="text-sm opacity-80">Dates</div>
          </div>
        </div>

        <div className="pt-4">
          <div className="text-lg opacity-90">
            {story.data.totalConversations} conversations started
          </div>
        </div>
      </div>
    </StoryTemplate>
  );
}

export function PeakActivityStory({ story }) {
  return (
    <StoryTemplate story={story}>
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <Clock className="w-16 h-16 mx-auto opacity-90" />
          <div className="space-y-2">
            <div className="text-6xl font-bold">{story.data.hour}</div>
            <div className="text-xl opacity-80">Peak Activity Time</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <div className="text-lg">
            You're most active at{" "}
            <span className="font-bold">{story.data.hour}</span>
          </div>
          <div className="text-sm opacity-75 mt-2">
            {story.data.count} {story.data.activity} sent during this hour
          </div>
        </div>
      </div>
    </StoryTemplate>
  );
}

export function EmojiStory({ story }) {
  return (
    <StoryTemplate story={story}>
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <div className="text-8xl">{story.data.emoji}</div>
          <div className="space-y-2">
            <div className="text-2xl font-bold">Your Go-To Emoji</div>
            <div className="text-lg opacity-80">
              Used {story.data.count} times
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <div className="text-lg mb-4">Top 3 Emojis</div>
          <div className="flex justify-center space-x-6">
            {story.data.topThree.map((emoji, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-1">{emoji.emoji}</div>
                <div className="text-sm opacity-75">{emoji.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </StoryTemplate>
  );
}

export function ResponseTimeStory({ story }) {
  return (
    <StoryTemplate story={story}>
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <MessageCircle className="w-16 h-16 mx-auto opacity-90" />
          <div className="space-y-4">
            <div>
              <div className="text-5xl font-bold">{story.data.avgHours}h</div>
              <div className="text-xl opacity-80">Average Response Time</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-xl font-semibold">{story.data.type}</div>
            </div>
          </div>
        </div>

        <div className="text-lg opacity-90">
          {story.data.messageCount} messages per match on average
        </div>
      </div>
    </StoryTemplate>
  );
}

export function SeasonStory({ story }) {
  const seasonEmojis = {
    Spring: "🌸",
    Summer: "☀️",
    Fall: "🍂",
    Winter: "❄️",
  };

  return (
    <StoryTemplate story={story}>
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <div className="text-8xl">{seasonEmojis[story.data.season]}</div>
          <div className="space-y-2">
            <div className="text-3xl font-bold">{story.data.season}</div>
            <div className="text-xl opacity-80">Your Peak Season</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-3">
          <div className="text-4xl font-bold">{story.data.percentage}%</div>
          <div className="text-lg">
            of your matches happened in {story.data.season}
          </div>
          <div className="text-sm opacity-75">
            {story.data.count} total matches
          </div>
        </div>
      </div>
    </StoryTemplate>
  );
}

export function MessageStyleStory({ story }) {
  return (
    <StoryTemplate story={story}>
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <MessageCircle className="w-16 h-16 mx-auto opacity-90" />
          <div className="space-y-4">
            <div>
              <div className="text-5xl font-bold">{story.data.avgLength}</div>
              <div className="text-xl opacity-80">Characters Per Message</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-xl font-semibold">{story.data.style}</div>
            </div>
          </div>
        </div>

        <div className="text-lg opacity-90">
          {story.data.totalMessages.toLocaleString()} total messages sent
        </div>
      </div>
    </StoryTemplate>
  );
}

export function ConversionStory({ story }) {
  return (
    <StoryTemplate story={story}>
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <Target className="w-16 h-16 mx-auto opacity-90" />
          <div className="space-y-4">
            <div>
              <div className="text-6xl font-bold">{story.data.rate}%</div>
              <div className="text-xl opacity-80">Match to Date Rate</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-xl font-semibold">{story.data.level}</div>
            </div>
          </div>
        </div>

        <div className="text-lg opacity-90">
          {story.data.dates} dates from {story.data.matches} matches
        </div>
      </div>
    </StoryTemplate>
  );
}

export function CommentStrategyStory({ story }) {
  return (
    <StoryTemplate story={story}>
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <MessageSquare className="w-16 h-16 mx-auto opacity-90" />
          <div className="space-y-4">
            <div>
              <div className="text-6xl font-bold">{story.data.percentage}%</div>
              <div className="text-xl opacity-80">Likes with Comments</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-xl font-semibold">{story.data.style}</div>
            </div>
          </div>
        </div>

        <div className="text-lg opacity-90">
          <div>{story.data.withComments} comments sent</div>
          <div className="text-sm opacity-75 mt-1">
            vs {story.data.withoutComments} regular likes
          </div>
        </div>
      </div>
    </StoryTemplate>
  );
}

export function LongestChatStory({ story }) {
  return (
    <StoryTemplate story={story}>
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <div className="text-8xl">🏆</div>
          <div className="space-y-4">
            <div>
              <div className="text-6xl font-bold">{story.data.count}</div>
              <div className="text-xl opacity-80">Messages in One Chat</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-xl font-semibold">Your Longest Convo</div>
              <div className="text-sm opacity-75 mt-1">
                Happened on {story.data.date}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StoryTemplate>
  );
}

export function DateNightStory({ story }) {
  return (
    <StoryTemplate story={story}>
      <div className="text-center space-y-8">
        <div className="space-y-6">
          <Calendar className="w-16 h-16 mx-auto opacity-90" />
          <div className="space-y-4">
            <div>
              <div className="text-5xl font-bold">{story.data.day}</div>
              <div className="text-xl opacity-80">Is Your Date Night</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
              <div className="text-xl font-semibold">Most Active Day</div>
              <div className="text-sm opacity-75 mt-1">
                {story.data.count} dates on {story.data.day}s
              </div>
            </div>
          </div>
        </div>
      </div>
    </StoryTemplate>
  );
}
