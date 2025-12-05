import {
  differenceInDays,
  differenceInHours,
  format,
  getHours,
  getMonth,
  isValid,
  parse,
  parseISO,
} from "date-fns";

function parseTimestamp(timestamp) {
  // First try ISO parsing
  let date = parseISO(timestamp);
  if (isValid(date)) {
    return date;
  }

  // Try parsing without timezone info
  try {
    date = parse(timestamp, "yyyy-MM-dd HH:mm:ss", new Date());
    if (isValid(date)) {
      return date;
    }
  } catch (e) {
    // Continue to next format
  }

  // Try parsing with milliseconds
  try {
    date = parse(timestamp, "yyyy-MM-dd HH:mm:ss.SSS", new Date());
    if (isValid(date)) {
      return date;
    }
  } catch (e) {
    // Continue to next format
  }

  // Fallback to current date if all parsing fails
  console.warn(`Failed to parse timestamp: ${timestamp}`);
  return new Date();
}

export function processHingeData(data) {
  if (!data || !Array.isArray(data)) {
    return null;
  }

  const matches = [];
  const messages = [];
  const likes = [];
  const weMet = [];
  const blocks = [];

  let totalMatches = 0;
  let totalMessages = 0;
  let totalLikes = 0;
  let totalDates = 0;
  let totalConversations = 0;
  let totalUnmatches = 0;
  let totalPeopleLiked = 0; // Unique profiles liked (entries with likes)

  // Process each entry (each entry represents a unique person/profile)
  data.forEach((entry) => {
    let hasMatch = false;
    let hasConversation = false;

    // Process likes - each entry.like array item is a separate like action to the same person
    if (entry.like && entry.like.length > 0) {
      totalPeopleLiked++; // This person was liked
      entry.like.forEach((likeEntry) => {
        totalLikes++; // Count each like action
        const likeData = {
          timestamp: likeEntry.timestamp,
          date: parseTimestamp(likeEntry.timestamp),
          hasComment:
            likeEntry.like && likeEntry.like[0] && likeEntry.like[0].comment,
          comment:
            (likeEntry.like &&
              likeEntry.like[0] &&
              likeEntry.like[0].comment) ||
            null,
          type: "sent", // This is a like sent by the user
        };
        likes.push(likeData);
      });
    }

    // Process matches - each entry.match represents when this person matched with you
    if (entry.match && entry.match.length > 0) {
      hasMatch = true;
      entry.match.forEach((match) => {
        totalMatches++;
        const matchData = {
          timestamp: match.timestamp,
          date: parseTimestamp(match.timestamp),
          hasMessages: entry.chats && entry.chats.length > 0,
          messageCount: entry.chats ? entry.chats.length : 0,
          messages: entry.chats || [],
        };
        matches.push(matchData);
      });
    }

    // Process messages - each entry.chats item is a single message
    if (entry.chats && entry.chats.length > 0) {
      hasConversation = true;
      entry.chats.forEach((chat) => {
        totalMessages++;
        const messageData = {
          body: chat.body,
          timestamp: chat.timestamp,
          date: parseTimestamp(chat.timestamp),
          length: chat.body.length,
          wordCount: chat.body.split(" ").length,
          hasEmojis:
            /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu.test(
              chat.body
            ),
          matchTimestamp:
            entry.match && entry.match[0] ? entry.match[0].timestamp : null,
        };
        messages.push(messageData);
      });
    }

    // Process we_met (dates)
    if (entry.we_met && entry.we_met.length > 0) {
      entry.we_met.forEach((meeting) => {
        if (meeting.did_meet_subject === "Yes") {
          totalDates++;
          const dateData = {
            timestamp: meeting.timestamp,
            date: parseTimestamp(meeting.timestamp),
            wasMyType: meeting.was_my_type || false,
          };
          weMet.push(dateData);
        }
      });
    }

    // Process blocks (unmatches)
    if (entry.block && entry.block.length > 0) {
      entry.block.forEach((block) => {
        if (block.block_type === "remove") {
          totalUnmatches++;
          blocks.push({
            timestamp: block.timestamp,
            date: parseTimestamp(block.timestamp),
            type: block.block_type,
          });
        }
      });
    }

    // Count conversations - only count if this person was matched AND had messages
    if (hasMatch && hasConversation) {
      totalConversations++;
    }
  });

  return {
    matches,
    messages,
    likes,
    weMet,
    blocks,
    totalMatches,
    totalMessages,
    totalLikes,
    totalDates,
    totalConversations,
    totalUnmatches,
    totalPeopleLiked,
    analytics: generateAnalytics(
      matches,
      messages,
      likes,
      weMet,
      blocks,
      totalMatches,
      totalPeopleLiked
    ),
  };
}

function generateAnalytics(
  matches,
  messages,
  likes,
  weMet,
  blocks,
  totalMatches,
  totalPeopleLiked
) {
  return {
    // Existing analytics
    matchesByDay: getMatchesByDay(matches),
    matchesByHour: getMatchesByHour(matches),
    messagesByHour: getMessagesByHour(messages),
    matchesBySeason: getMatchesBySeason(matches),
    messagesBySeason: getMessagesBySeason(messages),
    messageLengthDistribution: getMessageLengthDistribution(messages),
    avgTimeBetweenMatchAndMessage: getAvgTimeBetweenMatchAndMessage(matches),
    messagesBeforeNumberExchange: getMessagesBeforeNumberExchange(messages),
    mostUsedEmojis: getMostUsedEmojis(messages),
    averageMessages: messages.length / Math.max(matches.length, 1),
    messageStats: getMessageStats(messages),

    // New analytics
    likesByMonth: getLikesByMonth(likes),
    likesByHour: getLikesByHour(likes),
    likesToMatchConversion: getLikesToMatchConversion(
      likes,
      matches,
      totalMatches,
      totalPeopleLiked
    ),
    likesWithComments: getLikesWithComments(likes),
    peakActivityHour: getPeakActivityHour(likes),
    daysAgoStats: getDaysAgoStats(likes, matches, messages, weMet),
  };
}

function getMatchesByDay(matches) {
  const dayCount = {};
  matches.forEach((match) => {
    const day = format(match.date, "yyyy-MM-dd");
    dayCount[day] = (dayCount[day] || 0) + 1;
  });

  const sortedData = Object.entries(dayCount)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // If we have more than 180 data points, aggregate by week
  if (sortedData.length > 180) {
    return aggregateByWeek(sortedData);
  }
  // If we have more than 90 data points, aggregate by month
  else if (sortedData.length > 90) {
    return aggregateByMonth(sortedData);
  }

  return sortedData;
}

function aggregateByWeek(dailyData) {
  const weeklyData = {};

  dailyData.forEach(({ date, count }) => {
    const dateObj = new Date(date);
    // Get Monday of the week
    const monday = new Date(dateObj);
    monday.setDate(dateObj.getDate() - dateObj.getDay() + 1);
    const weekKey = format(monday, "yyyy-MM-dd");

    weeklyData[weekKey] = (weeklyData[weekKey] || 0) + count;
  });

  return Object.entries(weeklyData)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

function aggregateByMonth(dailyData) {
  const monthlyData = {};

  dailyData.forEach(({ date, count }) => {
    const monthKey = format(new Date(date), "yyyy-MM-01");
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + count;
  });

  return Object.entries(monthlyData)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

function getMatchesByHour(matches) {
  const hourCount = Array(24).fill(0);
  matches.forEach((match) => {
    const hour = getHours(match.date);
    hourCount[hour]++;
  });

  return hourCount.map((count, hour) => ({
    hour: `${hour}:00`,
    count,
  }));
}

function getMessagesByHour(messages) {
  const hourCount = Array(24).fill(0);
  messages.forEach((message) => {
    const hour = getHours(message.date);
    hourCount[hour]++;
  });

  return hourCount.map((count, hour) => ({
    hour: `${hour}:00`,
    count,
  }));
}

function getMatchesBySeason(matches) {
  const seasonCount = { Spring: 0, Summer: 0, Fall: 0, Winter: 0 };

  matches.forEach((match) => {
    const month = getMonth(match.date);
    if (month >= 2 && month <= 4) seasonCount.Spring++;
    else if (month >= 5 && month <= 7) seasonCount.Summer++;
    else if (month >= 8 && month <= 10) seasonCount.Fall++;
    else seasonCount.Winter++;
  });

  return Object.entries(seasonCount).map(([season, count]) => ({
    season,
    count,
  }));
}

function getMessagesBySeason(messages) {
  const seasonCount = { Spring: 0, Summer: 0, Fall: 0, Winter: 0 };

  messages.forEach((message) => {
    const month = getMonth(message.date);
    if (month >= 2 && month <= 4) seasonCount.Spring++;
    else if (month >= 5 && month <= 7) seasonCount.Summer++;
    else if (month >= 8 && month <= 10) seasonCount.Fall++;
    else seasonCount.Winter++;
  });

  return Object.entries(seasonCount).map(([season, count]) => ({
    season,
    count,
  }));
}

function getMessageLengthDistribution(messages) {
  const ranges = [
    { range: "0-20", min: 0, max: 20, count: 0 },
    { range: "21-50", min: 21, max: 50, count: 0 },
    { range: "51-100", min: 51, max: 100, count: 0 },
    { range: "101-200", min: 101, max: 200, count: 0 },
    { range: "201+", min: 201, max: Infinity, count: 0 },
  ];

  messages.forEach((message) => {
    const length = message.length;
    const range = ranges.find((r) => length >= r.min && length <= r.max);
    if (range) range.count++;
  });

  return ranges;
}

function getAvgTimeBetweenMatchAndMessage(matches) {
  const times = [];

  matches.forEach((match) => {
    if (match.messages && match.messages.length > 0) {
      const firstMessage = match.messages[0];
      const matchTime = match.date;
      const messageTime = parseTimestamp(firstMessage.timestamp);
      const diffHours = differenceInHours(messageTime, matchTime);
      if (diffHours >= 0) {
        times.push(diffHours);
      }
    }
  });

  return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
}

function getMessagesBeforeNumberExchange(messages) {
  const numberKeywords = [
    "text me",
    "my number",
    "your number",
    "phone",
    "call me",
  ];
  let messagesBeforeExchange = 0;

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i].body.toLowerCase();
    const hasNumberKeyword = numberKeywords.some((keyword) =>
      message.includes(keyword)
    );

    if (hasNumberKeyword) {
      messagesBeforeExchange = i;
      break;
    }
  }

  return messagesBeforeExchange || messages.length;
}

function getMostUsedEmojis(messages) {
  const emojiCount = {};
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;

  messages.forEach((message) => {
    const emojis = message.body.match(emojiRegex);
    if (emojis) {
      emojis.forEach((emoji) => {
        emojiCount[emoji] = (emojiCount[emoji] || 0) + 1;
      });
    }
  });

  return Object.entries(emojiCount)
    .map(([emoji, count]) => ({ emoji, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function getMessageStats(messages) {
  if (messages.length === 0) return { avg: 0, total: 0 };

  const totalLength = messages.reduce((sum, msg) => sum + msg.length, 0);
  const avgLength = totalLength / messages.length;

  return {
    avg: Math.round(avgLength),
    total: messages.length,
    totalLength,
  };
}

// New analytics functions
function getLikesByMonth(likes) {
  const monthCount = {};
  likes.forEach((like) => {
    const monthKey = format(like.date, "yyyy-MM");
    monthCount[monthKey] = (monthCount[monthKey] || 0) + 1;
  });

  return Object.entries(monthCount)
    .map(([month, count]) => ({ month, count, date: month + "-01" }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}

function getLikesByHour(likes) {
  const hourCount = Array(24).fill(0);
  likes.forEach((like) => {
    const hour = getHours(like.date);
    hourCount[hour]++;
  });

  return hourCount.map((count, hour) => ({
    hour: `${hour}:00`,
    count,
  }));
}

function getLikesToMatchConversion(
  likes,
  matches,
  totalMatches,
  totalPeopleLiked
) {
  // totalPeopleLiked = unique profiles you liked
  // totalMatches = number of those that matched back
  // likes.length = total number of like actions (some people were liked multiple times)

  const totalLikes = likes.length;

  if (totalPeopleLiked === 0) {
    return {
      rate: 0,
      matched: 0,
      unmatched: totalPeopleLiked,
      totalLikes,
      totalPeopleLiked,
    };
  }

  // Conversion rate: what % of people you liked matched back
  const conversionRate = (totalMatches / totalPeopleLiked) * 100;

  return {
    rate: conversionRate,
    matched: totalMatches,
    unmatched: totalPeopleLiked - totalMatches,
    totalLikes, // Total like actions (may include re-likes)
    totalPeopleLiked, // Unique people liked
  };
}

function getLikesWithComments(likes) {
  const withComments = likes.filter((like) => like.hasComment).length;
  const withoutComments = likes.length - withComments;
  const percentage = likes.length > 0 ? (withComments / likes.length) * 100 : 0;

  return {
    withComments,
    withoutComments,
    percentage,
    total: likes.length,
  };
}

function getPeakActivityHour(likes) {
  const hourCount = Array(24).fill(0);
  likes.forEach((like) => {
    const hour = getHours(like.date);
    hourCount[hour]++;
  });

  let peakHour = 0;
  let maxCount = 0;
  hourCount.forEach((count, hour) => {
    if (count > maxCount) {
      maxCount = count;
      peakHour = hour;
    }
  });

  const formatHour = (hour) => {
    if (hour === 0) return "12 am";
    if (hour === 12) return "12 pm";
    if (hour < 12) return `${hour} am`;
    return `${hour - 12} pm`;
  };

  return {
    hour: peakHour,
    count: maxCount,
    formatted: formatHour(peakHour),
  };
}

function getDaysAgoStats(likes, matches, messages, weMet) {
  const now = new Date();

  const getLastActivity = (items) => {
    if (items.length === 0) return null;
    const latest = items.reduce((latest, item) =>
      item.date > latest.date ? item : latest
    );
    return differenceInDays(now, latest.date);
  };

  return {
    lastLike: getLastActivity(likes),
    lastMatch: getLastActivity(matches),
    lastMessage: getLastActivity(messages),
    lastDate: getLastActivity(weMet),
  };
}
