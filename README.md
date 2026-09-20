# Weather Intelligence App (Cloudflare Deployment)

A responsive AI-native Weather Intelligence web application generated with **Google AI Studio App Build**, connected to **GitHub**, and deployed on **Cloudflare Pages**.

## 🌐 Live URL
- **Production URL:** https://weather-intelligence-app-93j.pages.dev/

## 🛠 Tech Stack & Architecture
- **AI Tool:** Google AI Studio (Gemini 2.5 Pro / App Build)
- **Frontend Framework:** React + Vite + TypeScript + Tailwind CSS
- **APIs:** 
  - [Open-Meteo Geocoding API](https://geocoding-api.open-meteo.com/v1/search) (City to Coordinates)
  - [Open-Meteo Forecast API](https://api.open-meteo.com/v1/forecast) (Current Weather & 7-day Forecast)
- **Version Control:** GitHub Direct Sync
- **Deployment Platform:** Cloudflare Pages (Edge network)

## 📋 Features
1. **Location Resolution:** Instant city search with coordinate resolution via Open-Meteo.
2. **Current Conditions:** Real-time temperature, apparent temperature, humidity, and wind speed.
3. **7-Day Forecast:** Detailed daily forecast cards with condition icons and temperature limits.
4. **Intelligent Recommendations:** Activity & outfit guidance computed dynamically from live weather parameters.
5. **Error Resilience:** Graceful handling of non-existent cities and network dropouts.

## 🚀 Deployment Instructions

### 1. From AI Studio to GitHub
- In Google AI Studio App Build, navigate to **Save to GitHub**.
- Authenticate GitHub, create repository `weather-intelligence-app`, and stage all files.

### 2. From GitHub to Cloudflare Pages
- Go to Cloudflare Dashboard -> **Workers & Pages** -> **Create application** -> **Pages**.
- Connect GitHub repository `weather-intelligence-app`.
- Set Build Settings:
  - **Framework Preset:** `Vite`
  - **Build Command:** `npm run build`
  - **Build Output Directory:** `dist`
- Deploy project to obtain `*.pages.dev` URL.

## 🔒 Responsible AI & Security Compliance
- Uses strictly open, public API endpoints from Open-Meteo.
- No private keys, Gemini API keys, or GCP credentials are exposed in the client code.
