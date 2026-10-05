// src/context/CropContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  mockCropAnalysis,
  mockWeatherData,
  mockMarketData,
  mockDecisionSupportData,
  mockHistoryList,
  initialFarmerProfile
} from '../data/mockData';
import {
  analyzeCrop,
  getWeather,
  getMarketPrices,
  getAnalysisHistory,
  getFarmerProfile,
  saveFarmerProfile
} from '../services/api';

const CropContext = createContext();

export function CropProvider({ children }) {
  const [currentAnalysis, setCurrentAnalysis] = useState(mockCropAnalysis);
  const [weather, setWeather] = useState(mockWeatherData);
  const [market, setMarket] = useState(mockMarketData);
  const [recommendations, setRecommendations] = useState(mockDecisionSupportData);
  const [history, setHistory] = useState(mockHistoryList);
  const [profile, setProfile] = useState(initialFarmerProfile);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const [histRes, profRes, weathRes, mktRes] = await Promise.all([
          getAnalysisHistory(),
          getFarmerProfile(),
          getWeather("Pune"),
          getMarketPrices("Tomato", "Pune")
        ]);

        if (histRes?.data) setHistory(histRes.data);
        if (profRes?.data) setProfile(profRes.data);
        if (weathRes?.data) setWeather(weathRes.data);
        if (mktRes?.data) setMarket(mktRes.data);
      } catch (err) {
        console.error("Error loading initial data", err);
      }
    }
    loadData();
  }, []);

  // Submit farmer form to assess crop health
  const submitCropAssessment = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await analyzeCrop(formData);
      const result = response.data;
      const analysisResult = {
        ...result,
        location: result.location || [formData.village, formData.district, formData.state].filter(Boolean).join(', '),
        riskFactors: result.factors,
        visualObservations: {
          ...result.visualObservations,
          image: result.imagePresent ? formData.imagePreviewUrl : null
        }
      };
      setCurrentAnalysis(analysisResult);

      // Create history item
      const historyItem = {
        id: analysisResult.id,
        date: analysisResult.date,
        crop: analysisResult.crop,
        variety: analysisResult.variety,
        location: analysisResult.location,
        stage: analysisResult.stage,
        riskScore: analysisResult.riskScore,
        riskLevel: analysisResult.overallHealth,
        status: "Under Observation",
        symptoms: formData.symptomsLabels?.join(', ') || "Brown spots, Yellowing leaves",
        weatherCondition: `${weather.currentTemp}°C / ${weather.humidity}% Humidity`,
        marketPrice: `₹${market.currentPrice} / Qtl`
      };

      const updatedHistory = [historyItem, ...history.filter(h => h.id !== historyItem.id)];
      setHistory(updatedHistory);
      localStorage.setItem('krishimind_history', JSON.stringify(updatedHistory));

      setIsLoading(false);
      return analysisResult;
    } catch (err) {
      setError("Unable to complete crop risk assessment. Please verify your input and try again.");
      setIsLoading(false);
      throw err;
    }
  };

  const updateProfileData = async (newProfile) => {
    try {
      const res = await saveFarmerProfile(newProfile);
      setProfile(res.data);
      return res.data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <CropContext.Provider
      value={{
        currentAnalysis,
        setCurrentAnalysis,
        weather,
        market,
        recommendations,
        history,
        profile,
        isLoading,
        error,
        submitCropAssessment,
        updateProfileData
      }}
    >
      {children}
    </CropContext.Provider>
  );
}

export function useCrop() {
  const context = useContext(CropContext);
  if (!context) {
    throw new Error('useCrop must be used within a CropProvider');
  }
  return context;
}
