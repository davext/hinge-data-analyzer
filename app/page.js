"use client";

import FileUpload from "@/components/FileUpload";
import InsightsSection from "@/components/InsightsSection";
import StatsCards from "@/components/StatsCards";
import {
  LikesByHourChart,
  LikesByMonthChart,
} from "@/components/charts/LikesChart";
import {
  MatchesByDayChart,
  MatchesByHourChart,
  MatchesBySeasonChart,
} from "@/components/charts/MatchesChart";
import {
  EmojiChart,
  MessageLengthDistributionChart,
  MessagesByHourChart,
  MessagesBySeasonChart,
} from "@/components/charts/MessagesChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { processHingeData } from "@/lib/dataProcessor";
import {
  BarChart3,
  Heart,
  MessageCircle,
  ThumbsUp,
  TrendingUp,
  Twitter,
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);
  const [processedData, setProcessedData] = useState(null);

  const handleDataLoaded = (rawData) => {
    setData(rawData);
    if (rawData) {
      const processed = processHingeData(rawData);
      setProcessedData(processed);
    } else {
      setProcessedData(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
              <h1 className="text-xl sm:text-3xl font-bold">
                Hinge Data Analyzer
              </h1>
            </div>
            <a
              href="https://twitter.com/dave_xt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">@dave_xt</span>
            </a>
          </div>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Analyze your Hinge dating app data with beautiful charts and
            insights
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!processedData ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <FileUpload onDataLoaded={handleDataLoaded} />
            <div className="mt-8 text-center max-w-2xl">
              <h2 className="text-xl font-semibold mb-4">
                How to get your data:
              </h2>
              <ol className="text-left text-muted-foreground space-y-2">
                <li>1. Go to Hinge app settings</li>
                <li>2. Select "Download My Data"</li>
                <li>3. Wait for the email with your data</li>
                <li>4. Upload the matches.json file here</li>
              </ol>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Stats Overview */}
            <StatsCards data={processedData} />

            {/* Charts */}
            <Tabs defaultValue="matches" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
                <TabsTrigger
                  value="matches"
                  className="flex items-center space-x-1 lg:space-x-2"
                >
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Matches</span>
                </TabsTrigger>
                <TabsTrigger
                  value="likes"
                  className="flex items-center space-x-1 lg:space-x-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Likes</span>
                </TabsTrigger>
                <TabsTrigger
                  value="messages"
                  className="flex items-center space-x-1 lg:space-x-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Messages</span>
                </TabsTrigger>
                <TabsTrigger
                  value="patterns"
                  className="flex items-center space-x-1 lg:space-x-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Patterns</span>
                </TabsTrigger>
                <TabsTrigger
                  value="insights"
                  className="flex items-center space-x-1 lg:space-x-2"
                >
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Insights</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="matches" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <MatchesByDayChart
                    data={processedData.analytics.matchesByDay}
                  />
                  <MatchesByHourChart
                    data={processedData.analytics.matchesByHour}
                  />
                </div>
                <MatchesBySeasonChart
                  data={processedData.analytics.matchesBySeason}
                />
              </TabsContent>

              <TabsContent value="likes" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <LikesByMonthChart
                    data={processedData.analytics.likesByMonth}
                  />
                  <LikesByHourChart
                    data={processedData.analytics.likesByHour}
                  />
                </div>
              </TabsContent>

              <TabsContent value="messages" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <MessagesByHourChart
                    data={processedData.analytics.messagesByHour}
                  />
                  <MessagesBySeasonChart
                    data={processedData.analytics.messagesBySeason}
                  />
                </div>
                <MessageLengthDistributionChart
                  data={processedData.analytics.messageLengthDistribution}
                />
              </TabsContent>

              <TabsContent value="patterns" className="space-y-6">
                <EmojiChart data={processedData.analytics.mostUsedEmojis} />
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <InsightsSection data={processedData} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Response Time Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Average time to first message
                          </p>
                          <p className="text-2xl font-bold">
                            {processedData.analytics.avgTimeBetweenMatchAndMessage.toFixed(
                              1
                            )}{" "}
                            hours
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Messages before number exchange
                          </p>
                          <p className="text-2xl font-bold">
                            {
                              processedData.analytics
                                .messagesBeforeNumberExchange
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Communication Style</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Average message length
                          </p>
                          <p className="text-2xl font-bold">
                            {processedData.analytics.messageStats.avg}{" "}
                            characters
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Messages per match
                          </p>
                          <p className="text-2xl font-bold">
                            {processedData.analytics.averageMessages.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            {/* Reset Button */}
            <div className="text-center pt-8">
              <button
                onClick={() => handleDataLoaded(null)}
                className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Upload New Data
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
          <p>
            Made with ❤️ for data lovers. Connect with me on{" "}
            <a
              href="https://twitter.com/dave_xt"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              @dave_xt
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
