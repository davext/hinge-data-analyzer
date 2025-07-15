import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function LikesByMonthChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Likes Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No likes data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatTooltip = (value, name, props) => {
    if (name === "count") {
      const monthYear = format(new Date(props.payload.date), "MMMM yyyy");
      return [`${value} likes`, monthYear];
    }
    return [value, name];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Likes Over Time (Monthly)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickFormatter={(value) =>
                format(new Date(value + "-01"), "MMM yy")
              }
            />
            <YAxis />
            <Tooltip formatter={formatTooltip} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function LikesByHourChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Likes by Hour of Day</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No likes data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatTooltip = (value, name) => {
    if (name === "count") {
      return [`${value} likes`, "Likes"];
    }
    return [value, name];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Likes by Hour of Day</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip formatter={formatTooltip} />
            <Bar dataKey="count" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
