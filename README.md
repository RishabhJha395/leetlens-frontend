# LeetLens - Frontend

LeetLens is a modern, dynamic web application designed to track, analyze, and visualize LeetCode profiles. It provides deep AI-driven insights, head-to-head comparisons, study notes, and goal tracking to help developers level up their algorithmic skills.

## 🚀 Features

- **Profile Analytics**: Visualize your LeetCode progress, acceptance rates, and topic mastery using beautiful charts (Recharts).
- **AI Insights**: Get personalized learning roadmaps and weakness analysis powered by AI.
- **Head-to-Head Comparison**: Compare your algorithmic expertise and contest ratings against friends using interactive bar charts.
- **Goal Tracking & Study Notes**: Built-in tools to manage your daily coding targets and interview notes.
- **Authentication**: Secure JWT-based login, Google OAuth integration, and email verification.
- **Modern UI**: Fully responsive, sleek dark-mode aesthetic with fluid micro-animations powered by Tailwind CSS and Framer Motion.

## 🛠️ Tech Stack

- **Framework**: React.js (via Vite)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **Authentication**: `@react-oauth/google`, Axios (with credentials)
- **Routing**: React Router DOM

## ⚙️ Environment Variables

Create a `.env` file in the `client` directory:

```env
# URL of your deployed backend or local server
VITE_API_URL=http://localhost:5000

# Your Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## 📦 Installation & Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## 🌐 Deployment

This frontend is optimized for deployment on **Vercel**. 
Make sure to add the `VITE_API_URL` to your Vercel Environment Variables pointing to your production backend URL.

---
*Made with ❤️ by Rishabh Jha*
