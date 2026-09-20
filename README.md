# KrishiMind — AI Crop Decision Support System

> **Tagline:** *"AI-powered crop health and farm decision support"*

KrishiMind is a clean, professional, and accessible agricultural technology web frontend designed for Indian farmers, agricultural extension workers (KVKs), and hackathon/SIH demonstrations. 

It synthesizes **crop visual observations**, **farmer field observations**, **crop growth stages**, **microclimate weather**, and **APMC market intelligence** into practical, holistic decision support without making misleading or deceptive claims (such as guaranteed medical-style diagnoses or absolute financial directives).

---

## Tech Stack

- **Framework:** [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/) (JavaScript)
- **Styling:** [Tailwind CSS 3](https://tailwindcss.com/) with natural agricultural greens and warm earth tones
- **Routing:** [React Router 6](https://reactrouter.com/) (Browser navigation with desktop sidebar and mobile bottom nav)
- **Data Visualization:** [Recharts](https://recharts.org/) (Responsive 5-day weather trends and 14-day APMC mandi price charts)
- **Icons:** [Lucide React](https://lucide.dev/)
- **API Service Layer:** [Axios](https://axios-http.com/) structured for future FastAPI backend integration

---

## Application Structure & Routes

| Route | Page | Purpose & Content |
| :--- | :--- | :--- |
| `/` | **Landing Page** | Brand overview, hero section with "Analyze My Crop" & "Explore Dashboard" CTAs, natural visual styles, 3 feature pillars (Crop Health, Weather, Market), and ethical AI principles. |
| `/farmer` | **Farmer Dashboard & Input** | Main farmer home: "Good morning, Farmer", Pune location pill, quick action `+ Analyze New Crop` toggle, metric cards, latest crop analysis summary, important factors, and recent activity. Also hosts the comprehensive Farmer Input Form. |
| `/crop-analysis` | **Crop Health Analysis** | Section A (Visual observation with photo & detected symptoms), Section B (Risk factors), Section C (72/100 Moderate–High Risk semicircular gauge with confidence disclaimer), Section D ("What May Be Happening?"), Section E ("What To Check Next" checklist). |
| `/weather` | **Weather Intelligence** | Current Pune microclimate (28°C, 78% humidity, 65% rain probability), 5-day forecast chart, and Crop Weather Risk cards (Rainfall, Humidity, Temperature Stress). |
| `/market` | **Market Intelligence** | Tomato wholesale mandi prices (₹2,850/qtl, +8.8%), 14-day price line chart, recent APMC arrivals table, and neutral market advisory. |
| `/recommendation` | **Decision Support** | Holistic synthesis combining Crop Health + Weather + Market + Crop Stage, Current Situation summary, Factors to Consider, and interactive Suggested Next Steps checklist. |
| `/history` | **Analysis History** | Historical log of previous analyses with date, crop, location, stage, risk score, status, search/filtering, and detail modal. |
| `/profile` | **Farmer Profile** | Profile details (name, mobile, location, farm size, crops grown) with inline editing and persistence. |

---

## How to Run the Project

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Development Server
```bash
# 1. Clone or navigate to the project directory
cd KrishiMind-CEPL

# 2. Install dependencies (if not already installed)
npm install

# 3. Start Vite development server
npm run dev

# 4. Open in your browser
# The local development server will be available at:
# http://127.0.0.1:5173
```

### Production Build
```bash
npm run build
npm run preview
```

---

## Connecting the FastAPI Backend Later

The frontend is architected with a dedicated service layer in [`src/services/api.js`](src/services/api.js).

Currently, `USE_MOCK_API = true` simulates realistic responses with artificial latency for development and offline demos.

To switch to a live FastAPI backend:
1. In `src/services/api.js`, set `USE_MOCK_API = false` (or configure `.env` with `VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL=http://localhost:8000/api`).
2. Implement corresponding FastAPI endpoints:
   - `POST /api/crop/analyze` — Receives `multipart/form-data` with image and JSON fields (`crop`, `stage`, `symptoms`, `recentRainfall`, `spreadSpeed`, etc.).
   - `GET  /api/weather?location={loc}` — Returns meteorological data and crop weather risks.
   - `GET  /api/market?crop={crop}&location={loc}` — Returns mandi modal prices, arrival volumes, and trends.
   - `POST /api/recommendation` — Receives crop situation and returns synthesized decision-support checklist.
   - `GET  /api/history` — Returns previous crop assessment logs for the authenticated farmer.
   - `GET  /api/profile` & `PUT /api/profile` — Retrieves and updates farmer profile data.

---

## Ethical Agricultural AI Principles

- **No Medical/Certainty Claims:** Does not claim guaranteed diagnoses or "95% accurate disease detection". Results are clearly labeled as **"Potential Crop Health Risk"** and **"Decision Support"**.
- **No Absolute Financial Commands:** Does not tell farmers "SELL NOW"; instead provides objective mandi price movements and arrival trends to aid farmer timing.
- **Multimodal Field Corroboration:** Integrates visual foliage photos with field observations (spread speed, soil moisture, irrigation, recent rain) and weather data.
