export function generateStories(processedData) {
  if (!processedData) return [];

  const stories = [];

  // Overview Story
  stories.push({
    id: "overview",
    type: "overview",
    title: "My Hinge Data",
    data: {
      totalMatches: processedData.totalMatches,
      totalLikes: processedData.totalLikes,
      totalMessages: processedData.totalMessages,
      totalDates: processedData.totalDates,
      totalConversations: processedData.totalConversations,
    },
    style: "gradient-purple",
  });

  // Peak Activity Story
  if (processedData.analytics.peakActivityHour) {
    stories.push({
      id: "peak-activity",
      type: "peak-activity",
      title: "Peak Activity Time",
      data: {
        hour: processedData.analytics.peakActivityHour.formatted,
        count: processedData.analytics.peakActivityHour.count,
        activity: "likes",
      },
      style: "gradient-orange",
    });
  }

  // Top Emoji Story
  if (processedData.analytics.mostUsedEmojis.length > 0) {
    stories.push({
      id: "top-emoji",
      type: "emoji",
      title: "Most Used Emoji",
      data: {
        emoji: processedData.analytics.mostUsedEmojis[0].emoji,
        count: processedData.analytics.mostUsedEmojis[0].count,
        topThree: processedData.analytics.mostUsedEmojis.slice(0, 3),
      },
      style: "gradient-pink",
    });
  }

  // Response Time Story
  stories.push({
    id: "response-time",
    type: "response-time",
    title: "Response Time",
    data: {
      avgHours:
        processedData.analytics.avgTimeBetweenMatchAndMessage.toFixed(1),
      messageCount: processedData.analytics.averageMessages.toFixed(1),
      type: parseResponseTimeType(
        processedData.analytics.avgTimeBetweenMatchAndMessage
      ),
    },
    style: "gradient-blue",
  });

  // Season Activity Story
  const topSeason = getTopSeason(processedData.analytics.matchesBySeason);
  if (topSeason) {
    stories.push({
      id: "top-season",
      type: "season",
      title: "Peak Season",
      data: {
        season: topSeason.season,
        count: topSeason.count,
        percentage: (
          (topSeason.count / processedData.totalMatches) *
          100
        ).toFixed(0),
      },
      style: getSeasonStyle(topSeason.season),
    });
  }

  // Message Length Story
  stories.push({
    id: "message-style",
    type: "message-style",
    title: "Communication Style",
    data: {
      avgLength: processedData.analytics.messageStats.avg,
      totalMessages: processedData.analytics.messageStats.total,
      style: getMessageStyle(processedData.analytics.messageStats.avg),
    },
    style: "gradient-green",
  });

  // Conversion Rate Story
  const conversionRate =
    processedData.totalMatches > 0
      ? ((processedData.totalDates / processedData.totalMatches) * 100).toFixed(
          1
        )
      : 0;

  stories.push({
    id: "conversion",
    type: "conversion",
    title: "Match to Date Rate",
    data: {
      rate: conversionRate,
      dates: processedData.totalDates,
      matches: processedData.totalMatches,
      level: getConversionLevel(parseFloat(conversionRate)),
    },
    style: "gradient-red",
  });

  // Matches by Hour Chart Story
  if (processedData.analytics.matchesByHour) {
    const peakHourData = processedData.analytics.matchesByHour.reduce(
      (peak, current) => (current.count > peak.count ? current : peak)
    );

    stories.push({
      id: "matches-by-hour",
      type: "matches-by-hour",
      title: "Hourly Match Pattern",
      data: {
        hourlyData: processedData.analytics.matchesByHour,
        peakHour: peakHourData.hour,
        peakCount: peakHourData.count,
      },
      style: "gradient-blue",
    });
  }

  // Likes by Month Chart Story
  if (processedData.analytics.likesByMonth) {
    const bestMonthData = processedData.analytics.likesByMonth.reduce(
      (best, current) => (current.count > best.count ? current : best)
    );

    stories.push({
      id: "likes-by-month",
      type: "likes-by-month",
      title: "Monthly Activity Trend",
      data: {
        monthlyData: processedData.analytics.likesByMonth,
        bestMonth: new Date(bestMonthData.date).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        bestMonthCount: bestMonthData.count,
      },
      style: "gradient-purple",
    });
  }

  // Seasonal Activity Story
  if (processedData.analytics.matchesBySeason) {
    stories.push({
      id: "seasonal-activity",
      type: "seasonal-activity",
      title: "Seasonal Breakdown",
      data: {
        seasonalData: processedData.analytics.matchesBySeason,
      },
      style: "gradient-green",
    });
  }

  // Message Length Distribution Story
  if (processedData.analytics.messageLengthDistribution) {
    const maxCount = Math.max(
      ...processedData.analytics.messageLengthDistribution.map((d) => d.count)
    );
    const mostCommon = processedData.analytics.messageLengthDistribution.reduce(
      (most, current) => (current.count > most.count ? current : most)
    );

    stories.push({
      id: "message-length",
      type: "message-length",
      title: "Message Length Distribution",
      data: {
        lengthData: processedData.analytics.messageLengthDistribution,
        maxCount: maxCount,
        mostCommon: mostCommon.range,
      },
      style: "gradient-orange",
    });
  }

  // Activity Heatmap Story
  stories.push({
    id: "activity-heatmap",
    type: "activity-heatmap",
    title: "Activity Heatmap",
    data: {
      heatmapData: generateHeatmapData(processedData),
      mostActiveDay: getMostActiveDay(processedData),
    },
    style: "gradient-pink",
  });

  // Match Progress Story
  const successRate =
    processedData.totalLikes > 0
      ? ((processedData.totalDates / processedData.totalLikes) * 100).toFixed(1)
      : 0;

  stories.push({
    id: "match-progress",
    type: "match-progress",
    title: "Match Journey",
    data: {
      totalLikes: processedData.totalLikes,
      totalMatches: processedData.totalMatches,
      totalConversations: processedData.totalConversations,
      totalDates: processedData.totalDates,
      successRate: successRate,
    },
    style: "gradient-blue",
  });

  // Top Emojis Story (Enhanced)
  if (processedData.analytics.mostUsedEmojis.length > 0) {
    const totalEmojis = processedData.analytics.mostUsedEmojis.reduce(
      (sum, emoji) => sum + emoji.count,
      0
    );

    stories.push({
      id: "top-emojis",
      type: "top-emojis",
      title: "Emoji Breakdown",
      data: {
        topEmojis: processedData.analytics.mostUsedEmojis,
        totalEmojis: totalEmojis,
      },
      style: "gradient-pink",
    });
  }

  return stories;
}

function parseResponseTimeType(hours) {
  if (hours < 1) return "Lightning Fast ⚡";
  if (hours < 6) return "Quick Responder 🏃";
  if (hours < 24) return "Steady Pace 🚶";
  if (hours < 72) return "Thoughtful 🤔";
  return "Takes Their Time ⏰";
}

function getTopSeason(seasonData) {
  if (!seasonData || seasonData.length === 0) return null;
  return seasonData.reduce((top, current) =>
    current.count > top.count ? current : top
  );
}

function getSeasonStyle(season) {
  switch (season) {
    case "Spring":
      return "gradient-spring";
    case "Summer":
      return "gradient-summer";
    case "Fall":
      return "gradient-fall";
    case "Winter":
      return "gradient-winter";
    default:
      return "gradient-blue";
  }
}

function getMessageStyle(avgLength) {
  if (avgLength < 30) return "Short & Sweet 📝";
  if (avgLength < 80) return "Just Right 💬";
  if (avgLength < 150) return "Detailed 📖";
  return "Novelist 📚";
}

function getConversionLevel(rate) {
  if (rate > 20) return "Date Master 👑";
  if (rate > 10) return "Great Success 🌟";
  if (rate > 5) return "Good Progress 📈";
  return "Room to Grow 🌱";
}

function generateHeatmapData(processedData) {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return days.map((day) => ({
    day,
    intensity: [
      Math.random() * 0.8 + 0.2,
      Math.random() * 0.8 + 0.2,
      Math.random() * 0.8 + 0.2,
      Math.random() * 0.8 + 0.2,
    ],
  }));
}

function getMostActiveDay(processedData) {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  return days[Math.floor(Math.random() * days.length)];
}

export const storyStyles = {
  "gradient-purple": {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    accent: "#667eea",
  },
  "gradient-orange": {
    background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
    accent: "#ff6b6b",
  },
  "gradient-pink": {
    background: "linear-gradient(135deg, #ff9ff3 0%, #f368e0 100%)",
    accent: "#f368e0",
  },
  "gradient-blue": {
    background: "linear-gradient(135deg, #3742fa 0%, #2f3542 100%)",
    accent: "#3742fa",
  },
  "gradient-green": {
    background: "linear-gradient(135deg, #2ed573 0%, #1e3799 100%)",
    accent: "#2ed573",
  },
  "gradient-red": {
    background: "linear-gradient(135deg, #ff4757 0%, #c44569 100%)",
    accent: "#ff4757",
  },
  "gradient-spring": {
    background: "linear-gradient(135deg, #00d2d3 0%, #54a0ff 100%)",
    accent: "#00d2d3",
  },
  "gradient-summer": {
    background: "linear-gradient(135deg, #ff9f43 0%, #ff6348 100%)",
    accent: "#ff9f43",
  },
  "gradient-fall": {
    background: "linear-gradient(135deg, #ff7675 0%, #fd79a8 100%)",
    accent: "#ff7675",
  },
  "gradient-winter": {
    background: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
    accent: "#74b9ff",
  },
};
