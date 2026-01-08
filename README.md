# Hinge Data Analyzer 📊💕

A beautiful, modern web application to analyze your Hinge dating app data with interactive charts and insights.

🔗 **Live Demo**: [hinge-data-analyzer.slug.workers.dev](https://hinge-data-analyzer.slug.workers.dev/)

## Features ✨

- **File Upload**: Easy drag-and-drop interface for JSON data
- **Comprehensive Analytics**:
  - Matches by day, hour, and season
  - Message patterns and frequency analysis
  - Average response times and message lengths
  - Emoji usage statistics
  - Number exchange detection
  - Message length distribution
- **Beautiful Charts**: Interactive visualizations using Recharts
- **Dark Mode**: Modern dark theme by default
- **Mobile Responsive**: Works perfectly on all devices
- **Privacy First**: All data processing happens locally in your browser

## Getting Started 🚀

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/davext/hinge-data-analyzer.git
cd hinge-data-analyzer
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Get Your Hinge Data 📱

1. Open the Hinge app on your phone
2. Go to **Settings** → **Privacy** → **Download My Data**
3. Enter your email address and submit the request
4. Wait for Hinge to email you a link to download your data (usually takes a few hours)
5. Download the ZIP file and extract it
6. Upload the `matches.json` file to this analyzer

## Data Privacy 🔒

- **No data is sent to any server** - all processing happens locally in your browser
- **No tracking or analytics** - your data stays private
- **Open source** - you can verify the code yourself

## Deployment 🚀

This app is configured to deploy to Cloudflare Workers using OpenNext.

### Prerequisites

- [Cloudflare account](https://dash.cloudflare.com/sign-up)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) authenticated

### Deploy to Cloudflare

1. Login to Cloudflare (first time only):

```bash
pnpm wrangler login
```

2. Deploy to production:

```bash
pnpm run deploy
```

3. Preview locally:

```bash
pnpm run preview
```

The deployment will:
- Build your Next.js app
- Transform it for Cloudflare Workers using OpenNext
- Deploy to Cloudflare's edge network

## Technology Stack 🛠️

- **Next.js 16** - React framework
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Recharts** - Data visualization
- **Lucide React** - Icons
- **date-fns** - Date manipulation
- **OpenNext** - Cloudflare Workers adapter
- **Cloudflare Workers** - Edge deployment platform

## Analytics Provided 📈

### Match Analytics

- Daily match patterns
- Peak matching hours
- Seasonal trends
- Success rate insights

### Message Analytics

- Messaging frequency by hour
- Average message length
- Response time analysis
- Conversation progression

### Advanced Insights

- Most used emojis
- Time to number exchange
- Communication patterns
- Seasonal messaging trends

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is licensed under the MIT License.

## Contact 📧

Created by [@dave_xt](https://twitter.com/dave_xt) - feel free to reach out!

---

Made with ❤️ for data lovers and dating app enthusiasts!
