import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Hash,
  Heart,
  MessageCircle,
  ThumbsUp,
  TrendingUp,
  Users,
  UserX,
} from "lucide-react";

export default function StatsCards({ data }) {
  if (!data || !data.analytics) return null;

  const {
    totalMatches,
    totalMessages,
    totalLikes,
    totalDates,
    totalConversations,
    totalUnmatches,
    analytics: {
      averageMessages,
      avgTimeBetweenMatchAndMessage,
      messagesBeforeNumberExchange,
      messageStats,
      daysAgoStats,
    },
  } = data;

  const formatLastActivity = (daysAgo) => {
    if (daysAgo === null || daysAgo === undefined) return "Never";
    if (daysAgo === 0) return "Today";
    if (daysAgo === 1) return "Yesterday";
    return `${daysAgo} days ago`;
  };

  const mainStats = [
    {
      title: "Total Likes",
      value: totalLikes.toLocaleString(),
      icon: ThumbsUp,
      color: "text-yellow-500",
      subtitle: `Last: ${formatLastActivity(daysAgoStats.lastLike)}`,
    },
    {
      title: "Conversations",
      value: totalConversations.toLocaleString(),
      icon: MessageCircle,
      color: "text-blue-500",
      subtitle: `Last: ${formatLastActivity(daysAgoStats.lastMessage)}`,
    },
    {
      title: "Matches",
      value: totalMatches.toLocaleString(),
      icon: Heart,
      color: "text-red-500",
      subtitle: `Last: ${formatLastActivity(daysAgoStats.lastMatch)}`,
    },
    {
      title: "Unmatches",
      value: totalUnmatches.toLocaleString(),
      icon: UserX,
      color: "text-gray-500",
      subtitle: "Removed connections",
    },
    {
      title: "Dates",
      value: totalDates.toLocaleString(),
      icon: Calendar,
      color: "text-green-500",
      subtitle: `Last: ${formatLastActivity(daysAgoStats.lastDate)}`,
    },
    {
      title: "Total Messages",
      value: totalMessages.toLocaleString(),
      icon: Hash,
      color: "text-purple-500",
      subtitle: `${messageStats.avg} avg chars`,
    },
  ];

  const detailedStats = [
    {
      title: "Avg Messages per Match",
      value: averageMessages.toFixed(1),
      icon: TrendingUp,
      color: "text-emerald-500",
    },
    {
      title: "Avg Time to First Message",
      value: `${avgTimeBetweenMatchAndMessage.toFixed(1)}h`,
      icon: Clock,
      color: "text-orange-500",
    },
    {
      title: "Messages Before Number Exchange",
      value: messagesBeforeNumberExchange,
      icon: Users,
      color: "text-teal-500",
    },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Main Statistics */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {mainStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                {stat.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.subtitle}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Detailed Statistics */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Activity Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {detailedStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
