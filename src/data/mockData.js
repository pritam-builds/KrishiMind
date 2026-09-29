// src/data/mockData.js
// Realistic agricultural data for KrishiMind decision support system

export const initialFarmerProfile = {
  name: "Ramesh Patil",
  mobile: "+91 98221 44556",
  state: "Maharashtra",
  district: "Pune",
  village: "Khed Shivapur",
  farmSize: "3.5 Acres",
  soilType: "Medium Black (Clay Loam)",
  irrigationType: "Drip Irrigation",
  mainCrops: ["Tomato", "Onion", "Wheat"]
};

export const cropMasterList = [
  { id: "tomato", name: "Tomato", stages: ["Seedling", "Vegetative", "Flowering", "Fruiting", "Harvest"], varieties: ["Abhinav (F1)", "US-440", "Shivam", "Local Desi"] },
  { id: "onion", name: "Onion", stages: ["Seedling", "Vegetative", "Bulb Formation", "Bulb Development", "Harvest"], varieties: ["Bhima Super", "Bhima Red", "AgriFound Dark Red"] },
  { id: "wheat", name: "Wheat", stages: ["Germination", "Tillering", "Stem Extension", "Heading", "Ripening"], varieties: ["Lokwan", "GW-322", "Sharbati", "HD-2967"] },
  { id: "rice", name: "Rice", stages: ["Seedling", "Vegetative", "Panicle Initiation", "Flowering", "Grain Filling", "Harvest"], varieties: ["Basmati 1121", "Indrayani", "IR-64", "Swarna"] },
  { id: "cotton", name: "Cotton", stages: ["Seedling", "Vegetative", "Squaring", "Flowering", "Boll Development", "Maturity"], varieties: ["Bt Cotton RCH-2", "Bollgard II", "Ajit 155"] }
];

export const commonSymptomsList = [
  { id: "yellow_leaves", label: "Yellow leaves", category: "Color change", description: "Leaves turning pale, yellow chlorosis or loss of green luster" },
  { id: "brown_spots", label: "Brown spots", category: "Foliar lesions", description: "Circular or irregular necrotic brown, black or tan spots on leaves" },
  { id: "wilting", label: "Wilting", category: "Plant vigor", description: "Drooping leaves or stems, loss of firmness despite watering" },
  { id: "pest_activity", label: "Pest activity", category: "Insect signs", description: "Visible insects, larvae, chewed holes or sticky sap residues" },
  { id: "slow_growth", label: "Slow growth", category: "Growth & vigor", description: "Stunted height, weak branching or delayed developmental progress" },
  { id: "other", label: "Other", category: "Additional signs", description: "Other atypical field observations or specific irregularities" }
];

export const mockCropAnalysis = {
  id: "KM-2026-0919-01",
  crop: "Tomato",
  variety: "Abhinav (F1 Hybrid)",
  stage: "Fruiting",
  date: "19 Sep 2026",
  location: "Pune, Maharashtra",
  village: "Khed Shivapur",
  farmSize: "3.5 Acres",
  riskScore: 72,
  riskBand: "Moderate–High Risk",
  overallHealth: "Moderate Risk",
  assessmentSummary: "Visual symptoms and environmental conditions indicate a possible crop health issue.",
  disclaimer: "Confidence depends on image quality, crop stage and available field information. This assessment provides decision support and risk indicators, not a guaranteed medical-style diagnosis.",
  visualObservations: {
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80",
    detectedSymptoms: [
      { name: "Brown leaf spots", detail: "Concentric target-like necrotic rings observed on lower foliar canopy", severity: "Noticeable" },
      { name: "Leaf yellowing", detail: "Chlorotic margins surrounding spot lesions", severity: "Moderate" },
      { name: "Canopy humidity trace", detail: "Slight foliar moisture lingering on leaf surfaces", severity: "Environmental" }
    ],
    spreadRate: "Moderately spreading over past 4 days"
  },
  riskFactors: [
    {
      title: "High Humidity",
      metric: "78% RH",
      status: "High",
      badgeColor: "bg-red-50 text-red-700 border-red-200",
      description: "Sustained high humidity creates ideal microclimate conditions for fungal spore germination and leaf spot expansion."
    },
    {
      title: "Recent Rainfall",
      metric: "Moderate (24mm)",
      status: "Elevated",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      description: "Rain splash transfers soil-borne fungal spores onto lower leaves and keeps foliage moist."
    },
    {
      title: "Fruiting Stage",
      metric: "High canopy density",
      status: "Sensitive",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      description: "Plant redirects nutrients to developing fruit, making mature foliage slightly more susceptible to foliar stresses."
    },
    {
      title: "Leaf Spot Symptoms",
      metric: "Brown lesions",
      status: "Active",
      badgeColor: "bg-red-50 text-red-700 border-red-200",
      description: "Visible necrosis on lower leaves indicates an active foliar disturbance requiring close monitoring."
    }
  ],
  whatMayBeHappening: "The observed leaf spots combined with recent rainfall and humid conditions may indicate increased risk of a fungal-related crop health issue (such as early blight tendencies). Visual symptoms and environmental conditions indicate a possible crop health issue.",
  whatToCheckNext: [
    { id: 1, text: "Inspect nearby plants across 10 random spots in the plot to evaluate spread pattern", checked: false },
    { id: 2, text: "Check the underside of affected leaves for fuzzy growth or tiny pest colonies", checked: false },
    { id: 3, text: "Monitor whether spots are actively spreading upward to newer canopy leaves over next 48 hours", checked: false },
    { id: 4, text: "Check soil moisture — avoid flood irrigation or evening watering that prolongs wet leaves", checked: false },
    { id: 5, text: "Review upcoming 5-day weather conditions for rain and high humidity before spraying", checked: false },
    { id: 6, text: "Consult a local agricultural extension officer (KVK) if symptoms worsen or spread to green fruit", checked: false }
  ]
};

export const mockWeatherData = {
  location: "Pune, Maharashtra",
  district: "Pune",
  coordinates: "18.5204° N, 73.8567° E",
  currentTemp: 28,
  tempUnit: "°C",
  condition: "Partly Cloudy with Humidity",
  humidity: 78,
  rainProbability: 65,
  windSpeed: "14 km/h",
  uvIndex: "Moderate (5)",
  soilTemp: "25°C",
  weatherRisks: [
    {
      title: "Rainfall Risk",
      level: "Moderate",
      badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
      icon: "CloudRain",
      description: "65% rain probability over the next 36 hours may prolong leaf wetness and wash off unprotected foliar treatments."
    },
    {
      title: "Humidity Risk",
      level: "High",
      badgeClass: "bg-red-100 text-red-800 border-red-300",
      icon: "Droplets",
      description: "78% relative humidity promotes rapid spore germination for fungal foliar diseases like Alternaria and downy mildew."
    },
    {
      title: "Temperature Stress",
      level: "Low",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
      icon: "Sun",
      description: "Daytime 28°C and nighttime 21°C remain within the optimal physiological growth range for solanaceous crops."
    }
  ],
  cropWeatherExplanation: "High humidity and recent rainfall may increase crop health risks for some crops. Ensuring proper field drainage and avoiding late evening irrigation can help reduce prolonged leaf wetness.",
  forecast: [
    { day: "Today", date: "19 Sep", temp: 28, minTemp: 21, humidity: 78, rainProb: 65, rainMm: 12, condition: "Scattered Showers" },
    { day: "Sun", date: "20 Sep", temp: 29, minTemp: 22, humidity: 75, rainProb: 60, rainMm: 8, condition: "Light Rain" },
    { day: "Mon", date: "21 Sep", temp: 27, minTemp: 20, humidity: 82, rainProb: 70, rainMm: 18, condition: "Moderate Rain" },
    { day: "Tue", date: "22 Sep", temp: 30, minTemp: 22, humidity: 68, rainProb: 35, rainMm: 2, condition: "Partly Cloudy" },
    { day: "Wed", date: "23 Sep", temp: 31, minTemp: 23, humidity: 62, rainProb: 20, rainMm: 0, condition: "Sunny / Clear" }
  ]
};

export const mockMarketData = {
  crop: "Tomato",
  variety: "Hybrid Red / Local",
  marketLocation: "Pune APMC Market Yard",
  currentPrice: 2850,
  previousPrice: 2620,
  priceChange: 230,
  priceChangePct: 8.8,
  unit: "₹ / quintal",
  trend: "Trending upward",
  trendDirection: "up",
  arrivalsToday: "1,450 Quintals",
  arrivalsTrend: "Down 12% compared to last week",
  priceTrendHistory: [
    { date: "06 Sep", price: 2350, arrivals: 1800 },
    { date: "08 Sep", price: 2420, arrivals: 1750 },
    { date: "10 Sep", price: 2480, arrivals: 1650 },
    { date: "12 Sep", price: 2550, arrivals: 1600 },
    { date: "14 Sep", price: 2620, arrivals: 1520 },
    { date: "16 Sep", price: 2710, arrivals: 1480 },
    { date: "18 Sep", price: 2850, arrivals: 1450 }
  ],
  recentPricesTable: [
    { date: "19 Sep 2026", market: "Pune Market Yard", variety: "Hybrid Red", price: 2850, arrivals: "1,450 Qtl", trend: "+3.2%" },
    { date: "18 Sep 2026", market: "Pune Market Yard", variety: "Hybrid Red", price: 2780, arrivals: "1,510 Qtl", trend: "+2.5%" },
    { date: "17 Sep 2026", market: "Khed APMC", variety: "Desi / Local", price: 2690, arrivals: "820 Qtl", trend: "+1.8%" },
    { date: "16 Sep 2026", market: "Narayangaon APMC", variety: "Hybrid Grade-A", price: 2750, arrivals: "2,100 Qtl", trend: "+4.1%" },
    { date: "15 Sep 2026", market: "Manchar Sub-Market", variety: "Hybrid Red", price: 2640, arrivals: "950 Qtl", trend: "-0.8%" }
  ],
  marketObservation: "Prices have increased over the selected period (+8.8%). Lower arrivals from surrounding producing clusters and consistent consumption demand are supporting current rates. Consider monitoring local market prices, transit costs, and crop readiness before deciding when to harvest and sell."
};

export const mockDecisionSupportData = {
  title: "KrishiMind Decision Support",
  currentSituation: "Your tomato crop is in the fruiting stage. The system has identified moderate crop-health risk, high humidity and an upward market-price trend.",
  factorsToConsider: [
    {
      id: "crop_health",
      title: "1. Crop Health",
      status: "Moderate–High Risk",
      detail: "Visual observations show brown leaf spots on lower foliage. Risk score calculated at 72/100 based on foliar lesions and humid microclimate.",
      badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
      accent: "border-amber-400"
    },
    {
      id: "weather",
      title: "2. Weather",
      status: "High Humidity",
      detail: "Current 78% humidity with 65% probability of rain over next 36 hours. Damp canopies favor disease spore progression.",
      badgeClass: "bg-blue-100 text-blue-800 border-blue-300",
      accent: "border-blue-400"
    },
    {
      id: "market",
      title: "3. Market",
      status: "Upward Price Trend",
      detail: "Current Pune APMC price is ₹2,850/quintal (+8.8% over past 10 days). Arrival volumes are tightening, which supports healthy farmgate rates.",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
      accent: "border-emerald-400"
    },
    {
      id: "crop_stage",
      title: "4. Crop Stage",
      status: "Fruiting",
      detail: "Plants are carrying developing fruit. Protecting canopy foliage from early defoliation ensures continuous photosynthesis and sunscald protection.",
      badgeClass: "bg-purple-100 text-purple-800 border-purple-300",
      accent: "border-purple-400"
    }
  ],
  suggestedNextSteps: [
    {
      id: "step-1",
      title: "Inspect affected plants",
      description: "Examine 10–15 sample plants across the field. Look closely at lower vs. upper foliage to quantify lesion intensity.",
      type: "Field Inspection",
      importance: "High Priority"
    },
    {
      id: "step-2",
      title: "Monitor disease spread",
      description: "Track whether leaf spots expand to newly formed leaves or stem junctions over the next 48 to 72 hours.",
      type: "Surveillance",
      importance: "High Priority"
    },
    {
      id: "step-3",
      title: "Check upcoming rainfall",
      description: "Review hourly rain forecast before scheduling any foliar protective measures; avoid spraying immediately prior to rain.",
      type: "Weather Planning",
      importance: "Moderate"
    },
    {
      id: "step-4",
      title: "Review local market prices",
      description: "Monitor daily APMC rates in Pune and Narayangaon. If fruit has reached breaker/pink stage, plan selective early pickings.",
      type: "Market Planning",
      importance: "Moderate"
    },
    {
      id: "step-5",
      title: "Record changes in crop condition",
      description: "Take follow-up photos under consistent daylight conditions in 3 days to document whether conditions stabilize or advance.",
      type: "Documentation",
      importance: "Recommended"
    }
  ],
  advisoryNote: "KrishiMind decision-support insights are advisory and synthesize observed field variables, localized meteorology, and agricultural mandi patterns. They do not replace hands-on agricultural officer consultation or guarantee economic outcomes."
};

export const mockHistoryList = [
  {
    id: "KM-2026-0919",
    date: "19 Sep 2026",
    crop: "Tomato",
    variety: "Abhinav (F1)",
    location: "Pune, Maharashtra",
    stage: "Fruiting",
    riskScore: 72,
    riskLevel: "Moderate Risk",
    status: "Under Observation",
    symptoms: "Brown spots, Yellowing leaves",
    weatherCondition: "28°C / 78% Humidity",
    marketPrice: "₹2,850 / Qtl"
  },
  {
    id: "KM-2026-0912",
    date: "12 Sep 2026",
    crop: "Tomato",
    variety: "Abhinav (F1)",
    location: "Pune, Maharashtra",
    stage: "Flowering",
    riskScore: 48,
    riskLevel: "Low–Moderate",
    status: "Monitored",
    symptoms: "Slight leaf curling, No spots",
    weatherCondition: "30°C / 65% Humidity",
    marketPrice: "₹2,550 / Qtl"
  },
  {
    id: "KM-2026-0828",
    date: "28 Aug 2026",
    crop: "Onion",
    variety: "Bhima Red",
    location: "Pune, Maharashtra",
    stage: "Vegetative",
    riskScore: 32,
    riskLevel: "Low Risk",
    status: "Healthy",
    symptoms: "Normal growth, good vigor",
    weatherCondition: "27°C / 70% Humidity",
    marketPrice: "₹1,850 / Qtl"
  },
  {
    id: "KM-2026-0810",
    date: "10 Aug 2026",
    crop: "Wheat",
    variety: "Lokwan",
    location: "Pune, Maharashtra",
    stage: "Seedling",
    riskScore: 22,
    riskLevel: "Low Risk",
    status: "Healthy",
    symptoms: "No visible symptoms",
    weatherCondition: "26°C / 60% Humidity",
    marketPrice: "₹2,400 / Qtl"
  },
  {
    id: "KM-2026-0722",
    date: "22 Jul 2026",
    crop: "Cotton",
    variety: "Bollgard II",
    location: "Nagpur, Maharashtra",
    stage: "Vegetative",
    riskScore: 65,
    riskLevel: "Moderate Risk",
    status: "Resolved",
    symptoms: "Leaf reddening, minor holes",
    weatherCondition: "31°C / 80% Humidity",
    marketPrice: "₹7,200 / Qtl"
  }
];
