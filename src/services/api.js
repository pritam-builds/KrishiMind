// src/services/api.js
// Axios service layer prepared for seamless connection to a FastAPI backend.
// Weather always uses FastAPI; other services retain their MVP mock-data toggle.

import axios from 'axios';
import {
  mockMarketData,
  mockDecisionSupportData,
  mockHistoryList,
  initialFarmerProfile
} from '../data/mockData';

// Toggle mock data for services other than weather.
// Set VITE_USE_MOCK_API=false in .env when those backend endpoints are ready.
export const USE_MOCK_API = true;
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Helper to simulate realistic network delay for mock responses
const simulateDelay = (ms = 700) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 1. Analyze Crop Health & Risk Assessment
 * Connects to FastAPI endpoint: POST /api/crop/analyze
 * Receives farmer input, symptoms, environmental conditions, and crop image.
 */
export async function analyzeCrop(formData) {
  const payload = new FormData();
  const fields = {
    ...formData,
    symptoms: JSON.stringify(formData.symptoms || [])
  };
  const excludedFields = new Set([
    'imageFile',
    'imagePreviewUrl',
    'locationStatus',
    'locationMessage',
    'symptomsLabels'
  ]);

  for (const [key, value] of Object.entries(fields)) {
    if (excludedFields.has(key) || value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      payload.append(key, JSON.stringify(value));
    } else {
      payload.append(key, String(value));
    }
  }

  if (formData.imageFile instanceof File) {
    payload.append('imageFile', formData.imageFile);
  }

  const response = await apiClient.post('/crop/analyze', payload, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return { data: response.data, success: true };
}

/**
 * 2. Get Weather Intelligence
 * Connects to FastAPI endpoint: GET /api/weather?location={location}
 */
export async function getWeather(location = "Pune") {
  const response = await apiClient.get('/weather', { params: { location } });
  const weather = response.data;
  return {
    data: {
      ...weather,
      currentTemp: weather.temperature,
      rainProbability: weather.rain_probability,
      windSpeed: `${weather.wind.speed_kmh} km/h`,
      rainfallMm: weather.rainfall_mm,
      agriculturalWeatherRisk: weather.agricultural_weather_risk,
      riskExplanation: weather.risk_explanation,
      dataSource: weather.data_source,
      isSample: weather.is_sample
    },
    success: true
  };
}

/**
 * 3. Get Market Intelligence & Mandi Prices
 * Connects to FastAPI endpoint: GET /api/market?crop={crop}&location={location}
 */
export async function getMarketPrices(crop = "Tomato", location = "Pune") {
  if (USE_MOCK_API) {
    await simulateDelay(450);
    return { data: mockMarketData, success: true };
  }

  const response = await apiClient.get('/market', { params: { crop, location } });
  return response.data;
}

/**
 * Fetch the current market snapshot directly for the Market Intelligence page.
 * This deliberately bypasses USE_MOCK_API so unrelated consumers keep their existing behavior.
 */
export async function getMarketSnapshot(crop = "Tomato", location = "Pune") {
  const response = await apiClient.get('/market', { params: { crop, location } });
  const market = response.data;
  return {
    data: {
      ...market,
      currentPrice: market.current_price,
      minPrice: market.min_price,
      maxPrice: market.max_price,
      marketLocation: market.market || market.mandi_name,
      arrivalsToday: market.arrivals,
      isSample: market.is_sample_data
    },
    success: true
  };
}

/**
 * 4. Get Decision Support Recommendations
 * Connects to FastAPI endpoint: POST /api/recommendation
 */
export async function getRecommendations(analysisData = null) {
  if (USE_MOCK_API) {
    await simulateDelay(500);
    return { data: mockDecisionSupportData, success: true };
  }

  const response = await apiClient.post('/recommendation', analysisData);
  return response.data;
}

/**
 * 5. Get Analysis History
 * Connects to FastAPI endpoint: GET /api/history
 */
export async function getAnalysisHistory() {
  if (USE_MOCK_API) {
    await simulateDelay(400);
    // Check localStorage for any newly saved user analyses
    const storedHistory = localStorage.getItem('krishimind_history');
    if (storedHistory) {
      try {
        const parsed = JSON.parse(storedHistory);
        return { data: parsed, success: true };
      } catch (e) {
        console.error("Failed to parse history from localStorage", e);
      }
    }
    return { data: mockHistoryList, success: true };
  }

  const response = await apiClient.get('/history');
  return response.data;
}

/**
 * 6. Get and Update Farmer Profile
 * Connects to FastAPI endpoints: GET /api/profile, PUT /api/profile
 */
export async function getFarmerProfile() {
  if (USE_MOCK_API) {
    await simulateDelay(300);
    const stored = localStorage.getItem('krishimind_profile');
    if (stored) {
      try {
        return { data: JSON.parse(stored), success: true };
      } catch (e) {
        console.error(e);
      }
    }
    return { data: initialFarmerProfile, success: true };
  }

  const response = await apiClient.get('/profile');
  return response.data;
}

export async function saveFarmerProfile(profileData) {
  if (USE_MOCK_API) {
    await simulateDelay(500);
    localStorage.setItem('krishimind_profile', JSON.stringify(profileData));
    return { data: profileData, success: true };
  }

  const response = await apiClient.put('/profile', profileData);
  return response.data;
}

export default apiClient;
