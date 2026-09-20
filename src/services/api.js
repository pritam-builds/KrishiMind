// src/services/api.js
// Axios service layer prepared for seamless connection to a FastAPI backend.
// Currently serves realistic agricultural mock data with simulated network latency.

import axios from 'axios';
import {
  mockCropAnalysis,
  mockWeatherData,
  mockMarketData,
  mockDecisionSupportData,
  mockHistoryList,
  initialFarmerProfile
} from '../data/mockData';

// Toggle between mock data and real FastAPI backend
// When ready to connect FastAPI, set VITE_USE_MOCK_API=false in .env or change this constant to false.
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
  if (USE_MOCK_API) {
    await simulateDelay(1200);

    // Dynamically adjust mock risk score based on farmer symptoms & conditions
    const symptoms = formData.symptoms || [];
    const spreadSpeed = formData.spreadSpeed || "Moderately";
    const recentRainfall = formData.recentRainfall || "Moderate";
    const crop = formData.crop || "Tomato";
    const growthStage = formData.growthStage || "Fruiting";

    let calculatedRisk = 50;
    if (symptoms.includes("brown_spots") || symptoms.includes("Brown spots")) calculatedRisk += 12;
    if (symptoms.includes("yellow_leaves") || symptoms.includes("Yellowing leaves")) calculatedRisk += 8;
    if (symptoms.includes("holes_leaves")) calculatedRisk += 7;
    if (spreadSpeed === "Quickly") calculatedRisk += 10;
    else if (spreadSpeed === "Slowly") calculatedRisk -= 5;
    if (recentRainfall === "Heavy") calculatedRisk += 8;
    if (recentRainfall === "None") calculatedRisk -= 6;
    if (symptoms.includes("no_visible")) calculatedRisk = 22;

    calculatedRisk = Math.min(Math.max(calculatedRisk, 20), 92);

    let riskBand = "Low Risk";
    let overallHealth = "Good Condition";
    if (calculatedRisk >= 68) {
      riskBand = "Moderate–High Risk";
      overallHealth = "Moderate Risk";
    } else if (calculatedRisk >= 45) {
      riskBand = "Moderate Risk";
      overallHealth = "Moderate Condition";
    }

    const customAnalysis = {
      ...mockCropAnalysis,
      id: `KM-${Date.now().toString().slice(-6)}`,
      crop: crop,
      variety: formData.cropVariety || "Hybrid Local",
      stage: growthStage,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      location: `${formData.district || 'Pune'}, ${formData.state || 'Maharashtra'}`,
      village: formData.village || 'Local Farm',
      farmSize: formData.farmSize ? `${formData.farmSize} Acres` : '3.5 Acres',
      riskScore: calculatedRisk,
      riskBand: riskBand,
      overallHealth: overallHealth,
      visualObservations: {
        ...mockCropAnalysis.visualObservations,
        image: formData.imagePreviewUrl || mockCropAnalysis.visualObservations.image,
        spreadRate: `${spreadSpeed} spread reported by farmer`
      }
    };

    return { data: customAnalysis, success: true };
  }

  // Real FastAPI call
  const response = await apiClient.post('/crop/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}

/**
 * 2. Get Weather Intelligence
 * Connects to FastAPI endpoint: GET /api/weather?location={location}
 */
export async function getWeather(location = "Pune") {
  if (USE_MOCK_API) {
    await simulateDelay(400);
    return { data: mockWeatherData, success: true };
  }

  const response = await apiClient.get('/weather', { params: { location } });
  return response.data;
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
