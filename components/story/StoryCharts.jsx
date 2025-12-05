import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Story-optimized chart components with custom styling
export function StoryBarChart({ data, dataKey, color = "#ffffff", title }) {
  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
        >
          <XAxis
            dataKey="hour"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "white", fontSize: 10, fontWeight: "bold" }}
            interval={2}
          />
          <YAxis hide />
          <Bar
            dataKey={dataKey}
            fill={color}
            radius={[4, 4, 0, 0]}
            fillOpacity={0.9}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={1}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StoryLineChart({ data, dataKey, color = "#ffffff", title }) {
  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 20, right: 10, left: 10, bottom: 20 }}
        >
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "white", fontSize: 10, fontWeight: "bold" }}
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString("en-US", { month: "short" })
            }
          />
          <YAxis hide />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={4}
            dot={{ fill: color, strokeWidth: 2, r: 5, stroke: "white" }}
            activeDot={{ r: 7, fill: color, stroke: "white", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StoryPieChart({
  data,
  colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ffeaa7"],
}) {
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    payload,
  }) => {
    // Increase radius to place label outside
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{
          fontSize: "9px",
          fontWeight: "bold",
          textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
        }}
      >
        {payload.season}
        <tspan x={x} dy="1.1em" textAnchor={x > cx ? "start" : "end"}>
          {`${(percent * 100).toFixed(0)}%`}
        </tspan>
      </text>
    );
  };

  return (
    <div className="w-full h-52 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={60} // Further reduced radius
            paddingAngle={5}
            dataKey="count"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth={2}
            label={renderCustomizedLabel}
            labelLine={true} // Add connector line
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StoryHeatmap({ data, title }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Generate mock heatmap data - in real implementation, you'd process actual data
  const heatmapData = days
    .map((day) =>
      hours.map((hour) => ({
        day,
        hour,
        value: Math.floor(Math.random() * 10) + 1,
      }))
    )
    .flat();

  const getColor = (value) => {
    const intensity = value / 10;
    return `rgba(255, 255, 255, ${intensity * 0.8 + 0.2})`;
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-24 gap-0.5 mb-2">
        {heatmapData.map((cell, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-sm border border-white/20"
            style={{ backgroundColor: getColor(cell.value) }}
          />
        ))}
      </div>
      <div
        className="flex justify-between text-xs text-white/80 font-semibold"
        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
      >
        <span>Less</span>
        <span>More</span>
      </div>
    </div>
  );
}

export function StoryProgressBar({ value, max, label, color = "#ffffff" }) {
  const percentage = (value / max) * 100;

  return (
    <div className="w-full space-y-2">
      <div
        className="flex justify-between text-sm font-semibold text-white"
        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
      >
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="w-full bg-black/30 rounded-full h-3 border border-white/20">
        <div
          className="h-3 rounded-full transition-all duration-500 border border-white/30"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}40`,
          }}
        />
      </div>
    </div>
  );
}
