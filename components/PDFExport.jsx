import { format } from "date-fns";
import jsPDF from "jspdf";
import { Download } from "lucide-react";

export default function PDFExport({ data }) {
  const generatePDF = async () => {
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "letter",
      });

      const pageHeight = 279;
      const pageWidth = 216;
      const margin = 20;
      let currentY = margin;

      // Title page
      pdf.setFontSize(24);
      pdf.setTextColor(0, 0, 0);
      pdf.text("Hinge Data Analysis Report", pageWidth / 2, 40, {
        align: "center",
      });

      pdf.setFontSize(16);
      pdf.text(
        `Generated on ${format(new Date(), "MMMM dd, yyyy")}`,
        pageWidth / 2,
        60,
        { align: "center" }
      );

      pdf.setFontSize(12);
      pdf.text("Created by @dave_xt", pageWidth / 2, pageHeight - 30, {
        align: "center",
      });
      pdf.text("Hinge Data Analyzer", pageWidth / 2, pageHeight - 20, {
        align: "center",
      });

      // Summary stats
      currentY = 80;
      pdf.setFontSize(18);
      pdf.text("Summary Statistics", margin, currentY);
      currentY += 20;

      pdf.setFontSize(12);
      const stats = [
        `People Liked: ${data.totalPeopleLiked}`,
        `Total Matches: ${data.totalMatches}`,
        `Total Conversations: ${data.totalConversations}`,
        `Total Messages: ${data.totalMessages}`,
        `Conversion Rate: ${data.analytics.likesToMatchConversion.rate.toFixed(
          1
        )}%`,
        `Average Messages per Match: ${data.analytics.averageMessages.toFixed(
          1
        )}`,
        `Average Time to First Message: ${data.analytics.avgTimeBetweenMatchAndMessage.toFixed(
          1
        )} hours`,
      ];

      stats.forEach((stat, index) => {
        pdf.text(stat, margin, currentY + index * 10);
      });

      // Generate chart pages
      await addChartPage(
        pdf,
        "Matches by Hour",
        data.analytics.matchesByHour,
        "bar"
      );
      await addChartPage(
        pdf,
        "Matches by Season",
        data.analytics.matchesBySeason,
        "pie"
      );
      await addChartPage(
        pdf,
        "Likes by Hour",
        data.analytics.likesByHour,
        "bar"
      );
      await addChartPage(
        pdf,
        "Messages by Hour",
        data.analytics.messagesByHour,
        "bar"
      );
      await addChartPage(
        pdf,
        "Message Length Distribution",
        data.analytics.messageLengthDistribution,
        "bar"
      );
      await addChartPage(
        pdf,
        "Most Used Emojis",
        data.analytics.mostUsedEmojis.slice(0, 10),
        "bar"
      );

      pdf.save(`hinge-data-analysis-${format(new Date(), "yyyy-MM-dd")}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <button
          onClick={generatePDF}
          className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
        >
          <Download className="h-5 w-5" />
          <span>Download PDF Report</span>
        </button>
      </div>
    </div>
  );
}

async function addChartPage(pdf, title, data, chartType) {
  if (!data || data.length === 0) return;

  pdf.addPage();
  const margin = 20;
  const pageWidth = 216;
  const chartWidth = pageWidth - 2 * margin;
  const chartHeight = 120;

  // Add title
  pdf.setFontSize(18);
  pdf.text(title, margin, 30);

  // Create chart
  const chartImage = await createChart(
    data,
    chartType,
    chartWidth * 3,
    chartHeight * 3
  );

  if (chartImage) {
    // Add chart to PDF
    pdf.addImage(chartImage, "PNG", margin, 40, chartWidth, chartHeight);
  }

  // Add insights below chart
  pdf.setFontSize(12);
  let currentY = 40 + chartHeight + 20;

  const insights = generateInsights(title, data);
  insights.forEach((insight, index) => {
    pdf.text(insight, margin, currentY + index * 8);
  });
}

function getItemLabel(item) {
  return (
    item.hour ||
    item.season ||
    item.range ||
    item.emoji ||
    item.month ||
    item.name ||
    "Unknown"
  );
}

function generateInsights(title, data) {
  if (!data || data.length === 0) return ["No data available for analysis."];

  const insights = [];

  if (title === "Matches by Hour") {
    const sortedData = [...data].sort((a, b) => b.count - a.count);
    const peakHour = sortedData[0];
    const peakTime = formatHour(peakHour.hour);
    const totalMatches = data.reduce((sum, item) => sum + item.count, 0);

    insights.push(
      `• You were most active getting matches around ${peakTime} with ${peakHour.count} matches.`
    );
    insights.push(
      `• Your peak matching hour represents ${(
        (peakHour.count / totalMatches) *
        100
      ).toFixed(1)}% of all matches.`
    );

    // Find quiet hours
    const quietHours = data.filter((item) => item.count <= 5);
    if (quietHours.length > 0) {
      insights.push(
        `• You had ${quietHours.length} quiet hours with 5 or fewer matches.`
      );
    }
  } else if (title === "Matches by Season") {
    const sortedData = [...data].sort((a, b) => b.count - a.count);
    const bestSeason = sortedData[0];
    const worstSeason = sortedData[sortedData.length - 1];

    insights.push(
      `• ${bestSeason.season} was your best season with ${bestSeason.count} matches.`
    );
    insights.push(
      `• ${worstSeason.season} was your quietest season with ${worstSeason.count} matches.`
    );

    const totalMatches = data.reduce((sum, item) => sum + item.count, 0);
    insights.push(
      `• Your best season had ${
        Math.round((bestSeason.count / worstSeason.count) * 100) / 100
      }x more matches than your worst.`
    );
  } else if (title === "Likes by Hour") {
    const sortedData = [...data].sort((a, b) => b.count - a.count);
    const peakHour = sortedData[0];
    const peakTime = formatHour(peakHour.hour);

    insights.push(
      `• You send the most likes around ${peakTime} with ${peakHour.count} likes sent.`
    );

    // Morning vs evening activity
    const morningLikes = data
      .filter((item) => {
        const hour = parseInt(item.hour.split(":")[0]);
        return hour >= 6 && hour < 12;
      })
      .reduce((sum, item) => sum + item.count, 0);

    const eveningLikes = data
      .filter((item) => {
        const hour = parseInt(item.hour.split(":")[0]);
        return hour >= 18 && hour < 24;
      })
      .reduce((sum, item) => sum + item.count, 0);

    if (morningLikes > eveningLikes) {
      insights.push(
        `• You're more of a morning person - ${morningLikes} likes sent in the morning vs ${eveningLikes} in the evening.`
      );
    } else {
      insights.push(
        `• You're more active in the evening - ${eveningLikes} likes sent vs ${morningLikes} in the morning.`
      );
    }
  } else if (title === "Messages by Hour") {
    const sortedData = [...data].sort((a, b) => b.count - a.count);
    const peakHour = sortedData[0];
    const peakTime = formatHour(peakHour.hour);

    insights.push(
      `• You're most talkative around ${peakTime} with ${peakHour.count} messages sent.`
    );

    // Late night activity
    const lateNightMessages = data
      .filter((item) => {
        const hour = parseInt(item.hour.split(":")[0]);
        return hour >= 22 || hour < 6;
      })
      .reduce((sum, item) => sum + item.count, 0);

    const totalMessages = data.reduce((sum, item) => sum + item.count, 0);
    const lateNightPercentage = (
      (lateNightMessages / totalMessages) *
      100
    ).toFixed(1);

    insights.push(
      `• ${lateNightPercentage}% of your messages were sent late night (10 PM - 6 AM).`
    );
  } else if (title === "Message Length Distribution") {
    const sortedData = [...data].sort((a, b) => b.count - a.count);
    const mostCommon = sortedData[0];
    const totalMessages = data.reduce((sum, item) => sum + item.count, 0);

    insights.push(
      `• Most of your messages (${mostCommon.count}) were ${mostCommon.range} characters long.`
    );

    const shortMessages = data
      .filter((item) => item.range === "0-20" || item.range === "21-50")
      .reduce((sum, item) => sum + item.count, 0);
    const longMessages = data
      .filter((item) => item.range === "101-200" || item.range === "201+")
      .reduce((sum, item) => sum + item.count, 0);

    if (shortMessages > longMessages) {
      insights.push(
        `• You prefer shorter messages - ${(
          (shortMessages / totalMessages) *
          100
        ).toFixed(1)}% were under 50 characters.`
      );
    } else {
      insights.push(
        `• You write longer messages - ${(
          (longMessages / totalMessages) *
          100
        ).toFixed(1)}% were over 100 characters.`
      );
    }
  } else if (title === "Most Used Emojis") {
    const sortedData = [...data].sort((a, b) => b.count - a.count);
    const topEmoji = sortedData[0];
    const totalEmojis = data.reduce((sum, item) => sum + item.count, 0);

    if (topEmoji) {
      insights.push(
        `• Your favorite emoji is ${topEmoji.emoji} - used ${topEmoji.count} times.`
      );
      insights.push(
        `• You used ${data.length} different emojis for a total of ${totalEmojis} emoji uses.`
      );

      const topThree = sortedData.slice(0, 3);
      const topThreeCount = topThree.reduce((sum, item) => sum + item.count, 0);
      insights.push(
        `• Your top 3 emojis represent ${(
          (topThreeCount / totalEmojis) *
          100
        ).toFixed(1)}% of all emoji usage.`
      );
    }
  }

  return insights;
}

function formatHour(hourString) {
  const hour = parseInt(hourString.split(":")[0]);
  if (hour === 0) return "midnight";
  if (hour === 12) return "noon";
  if (hour < 12) return `${hour} AM`;
  return `${hour - 12} PM`;
}

async function createChart(data, chartType, width, height) {
  return new Promise((resolve) => {
    if (typeof document === "undefined") {
      resolve("");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // Set white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    if (chartType === "bar") {
      drawBarChart(ctx, data, width, height);
    } else if (chartType === "pie") {
      drawPieChart(ctx, data, width, height);
    }

    // Convert to image
    const imageData = canvas.toDataURL("image/png");
    resolve(imageData);
  });
}

function drawBarChart(ctx, data, width, height) {
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  const maxValue = Math.max(...data.map((d) => d.count || d.value || 0));
  const barWidth = chartWidth / data.length;

  // Colors
  const colors = ["#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#06B6D4"];

  data.forEach((item, index) => {
    const value = item.count || item.value || 0;
    const barHeight = (value / maxValue) * chartHeight;
    const x = padding + index * barWidth;
    const y = height - padding - barHeight;

    // Draw bar
    ctx.fillStyle = colors[index % colors.length];
    ctx.fillRect(x + 5, y, barWidth - 10, barHeight);

    // Draw value on top
    ctx.fillStyle = "#000000";
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText(value.toString(), x + barWidth / 2, y - 5);

    // Draw label
    ctx.save();
    ctx.translate(x + barWidth / 2, height - padding + 20);
    ctx.rotate(-Math.PI / 4);
    ctx.textAlign = "right";
    ctx.fillText(getItemLabel(item), 0, 0);
    ctx.restore();
  });

  // Draw axes
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.stroke();
}

function drawPieChart(ctx, data, width, height) {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 3;

  const total = data.reduce(
    (sum, item) => sum + (item.count || item.value || 0),
    0
  );
  const colors = [
    "#8B5CF6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#06B6D4",
    "#F97316",
    "#EC4899",
  ];

  let currentAngle = 0;

  data.forEach((item, index) => {
    const value = item.count || item.value || 0;
    const sliceAngle = (value / total) * 2 * Math.PI;

    // Draw slice
    ctx.fillStyle = colors[index % colors.length];
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
    ctx.closePath();
    ctx.fill();

    // Draw label
    const labelAngle = currentAngle + sliceAngle / 2;
    const labelX = centerX + Math.cos(labelAngle) * (radius + 30);
    const labelY = centerY + Math.sin(labelAngle) * (radius + 30);

    ctx.fillStyle = "#000000";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${getItemLabel(item)}: ${value}`, labelX, labelY);

    currentAngle += sliceAngle;
  });
}
