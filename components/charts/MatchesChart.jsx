import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00ff00"];

export function MatchesByDayChart({ data }) {
  if (!data || data.length === 0) return null;

  // Determine chart type and title based on data aggregation
  const getChartInfo = () => {
    if (data.length > 100) {
      return { title: "Matches by Month", type: "monthly" };
    } else if (data.length > 50) {
      return { title: "Matches by Week", type: "weekly" };
    } else {
      return { title: "Matches by Day", type: "daily" };
    }
  };

  const chartInfo = getChartInfo();

  // Smart tick formatter
  const formatTick = (value, index) => {
    const date = new Date(value);
    const totalTicks = data.length;

    // Only show every nth tick to avoid overcrowding
    const tickInterval = Math.max(1, Math.floor(totalTicks / 8));
    if (index % tickInterval !== 0) return "";

    if (chartInfo.type === "monthly") {
      return date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      });
    } else if (chartInfo.type === "weekly") {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{chartInfo.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.3}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              tickFormatter={formatTick}
              axisLine={{ stroke: "#4B5563" }}
              tickLine={{ stroke: "#4B5563" }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={{ stroke: "#4B5563" }}
              tickLine={{ stroke: "#4B5563" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "6px",
                color: "#F9FAFB",
              }}
              labelFormatter={(value) => {
                const date = new Date(value);
                if (chartInfo.type === "monthly") {
                  return date.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  });
                } else if (chartInfo.type === "weekly") {
                  return `Week of ${date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}`;
                } else {
                  return date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });
                }
              }}
              formatter={(value) => [value, "Matches"]}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 5,
                fill: "#8B5CF6",
                stroke: "#1F2937",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function MatchesByHourChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matches by Hour</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.3}
            />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={{ stroke: "#4B5563" }}
              tickLine={{ stroke: "#4B5563" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#9CA3AF" }}
              axisLine={{ stroke: "#4B5563" }}
              tickLine={{ stroke: "#4B5563" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "6px",
                color: "#F9FAFB",
              }}
            />
            <Bar dataKey="count" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function MatchesBySeasonChart({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matches by Season</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ season, count, percent }) =>
                `${season}: ${count} (${(percent * 100).toFixed(0)}%)`
              }
              outerRadius={120}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "6px",
                color: "#F9FAFB",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
