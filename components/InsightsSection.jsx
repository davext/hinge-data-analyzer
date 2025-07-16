import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MessageSquare, TrendingUp } from "lucide-react";

export default function InsightsSection({ data }) {
  if (!data || !data.analytics) return null;

  const {
    totalLikes,
    totalMatches,
    totalConversations,
    totalMessages,
    analytics: {
      likesToMatchConversion,
      likesWithComments,
      peakActivityHour,
      averageMessages,
    },
  } = data;

  // Calculate interaction statistics
  const totalInteractions = totalLikes; // Assuming we're only tracking likes sent
  const likesPercentage = totalLikes > 0 ? 100 : 0;
  const conversationRate =
    totalMatches > 0 ? (totalConversations / totalMatches) * 100 : 0;

  const insights = [
    {
      title: "Likes to Matches Conversion",
      icon: TrendingUp,
      color: "text-green-500",
      stats: [
        {
          label: "Conversion Rate",
          value: `${likesToMatchConversion.rate.toFixed(2)}%`,
          description: "of your likes turned into matches",
        },
        {
          label: "Total Likes Sent",
          value: totalLikes.toLocaleString(),
          description: `${likesPercentage.toFixed(
            2
          )}% of your total interactions`,
        },
        {
          label: "Reciprocated",
          value: `${likesToMatchConversion.matched.toLocaleString()} matches`,
          description: `${likesToMatchConversion.rate.toFixed(
            2
          )}% were reciprocated`,
        },
        {
          label: "Not Reciprocated",
          value: `${likesToMatchConversion.unmatched.toLocaleString()} likes`,
          description: `${(100 - likesToMatchConversion.rate).toFixed(
            2
          )}% didn't result in a match`,
        },
      ],
    },
    {
      title: "Activity Patterns",
      icon: Clock,
      color: "text-blue-500",
      stats: [
        {
          label: "Peak Activity Time",
          value: peakActivityHour.formatted,
          description: `You really like to send likes at ${peakActivityHour.formatted}`,
        },
        {
          label: "Likes with Comments",
          value: `${likesWithComments.percentage.toFixed(2)}%`,
          description: `${likesWithComments.withComments.toLocaleString()} of ${totalLikes.toLocaleString()} likes sent with comments`,
        },
        {
          label: "Conversation Rate",
          value: `${conversationRate.toFixed(2)}%`,
          description: `You chatted with ${conversationRate.toFixed(
            2
          )}% of your matches`,
        },
        {
          label: "Average Messages per Match",
          value: averageMessages.toFixed(1),
          description: "messages exchanged per connection",
        },
      ],
    },
    {
      title: "Communication Style",
      icon: MessageSquare,
      color: "text-purple-500",
      stats: [
        {
          label: "Total Messages",
          value: totalMessages.toLocaleString(),
          description: "messages sent across all conversations",
        },
        {
          label: "Active Conversations",
          value: totalConversations.toLocaleString(),
          description: "matches that led to conversations",
        },
        {
          label: "Silent Matches",
          value: (totalMatches - totalConversations).toLocaleString(),
          description: `${(
            ((totalMatches - totalConversations) / Math.max(totalMatches, 1)) *
            100
          ).toFixed(1)}% of matches with no conversation`,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Your Dating Insights</h2>
        <p className="text-muted-foreground">
          Deep dive into your Hinge activity patterns and success metrics
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {insights.map((insight, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <insight.icon className={`h-5 w-5 ${insight.color}`} />
                <span>{insight.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insight.stats.map((stat, statIndex) => (
                  <div
                    key={statIndex}
                    className="border-b last:border-b-0 pb-3 last:pb-0"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </span>
                      <span className="text-lg font-bold">{stat.value}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Your Hinge Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {totalLikes.toLocaleString()}
                </div>
                <div className="text-gray-600">Total Likes Sent</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {likesToMatchConversion.rate.toFixed(1)}%
                </div>
                <div className="text-gray-600">Success Rate</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {totalConversations.toLocaleString()}
                </div>
                <div className="text-gray-600">Conversations Started</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">
                  {peakActivityHour.formatted}
                </div>
                <div className="text-gray-600">Peak Activity Time</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
