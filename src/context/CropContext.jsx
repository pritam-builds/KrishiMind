// src/context/CropContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  mockCropAnalysis,
  mockMarketData,
  mockDecisionSupportData,
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
import { hasSavedLanguagePreference, useI18n } from '../i18n';

const CropContext = createContext();

export function CropProvider({ children }) {
  const { setLanguage } = useI18n();
  const [currentAnalysis, setCurrentAnalysis] = useState(mockCropAnalysis);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(null);
  const [market, setMarket] = useState(mockMarketData);
  const [recommendations, setRecommendations] = useState(mockDecisionSupportData);
  const [history, setHistory] = useState([]);
  const [historyError, setHistoryError] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [profile, setProfile] = useState(initialFarmerProfile);
  const [profilePersisted, setProfilePersisted] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load initial data
  useEffect(() => {
    async function loadData() {
      const profilePromise = getFarmerProfile()
        .then(response => {
          if (response?.data) {
            setProfile(response.data);
            if (!hasSavedLanguagePreference()) {
              const profileLanguage = response.data.preferredLanguage;
              const languageCode = profileLanguage === 'मराठी' ? 'mr'
                : profileLanguage === 'हिन्दी' ? 'hi'
                  : profileLanguage === 'English' ? 'en' : null;
              if (languageCode) setLanguage(languageCode);
            }
          }
          setProfilePersisted(Boolean(response?.persisted));
          setProfileError(null);
          return response?.data || initialFarmerProfile;
        })
        .catch(err => {
          console.error("Error loading farmer profile", err);
          setProfilePersisted(false);
          setProfileError("Saved farmer profile could not be loaded. You can retry by refreshing the page.");
          return initialFarmerProfile;
        })
        .finally(() => setProfileLoading(false));

      try {
        const [loadedProfile, mktRes] = await Promise.all([
          profilePromise,
          getMarketPrices("Tomato", "Pune").catch(err => {
            console.error("Error loading market data", err);
            return null;
          })
        ]);

        if (mktRes?.data) setMarket(mktRes.data);

        try {
          const histRes = await getAnalysisHistory();
          setHistory(Array.isArray(histRes?.data) ? histRes.data : []);
          setHistoryError(null);
        } catch (err) {
          console.error("Error loading assessment history", err);
          setHistoryError("Saved crop assessments are currently unavailable.");
        } finally {
          setHistoryLoading(false);
        }

        try {
          const weatherRes = await getWeather(loadedProfile?.district || "Pune");
          if (weatherRes?.data) setWeather(weatherRes.data);
          setWeatherError(null);
        } catch (err) {
          console.error("Error loading weather data", err);
          setWeatherError("Weather data is currently unavailable.");
        }
      } catch (err) {
        console.error("Error loading initial data", err);
        setHistoryLoading(false);
        setProfileLoading(false);
      }
    }
    loadData();
  }, [setLanguage]);

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
          image: result.imagePresent && formData.imageFile ? formData.imagePreviewUrl : null
        }
      };
      setCurrentAnalysis(analysisResult);
      setRecommendations(result.suggestedNextSteps || result.recommendations || []);

      const historyItem = {
        id: analysisResult.id,
        date: analysisResult.date,
        crop: analysisResult.crop,
        variety: analysisResult.variety,
        location: analysisResult.location || "",
        stage: analysisResult.stage,
        riskScore: analysisResult.assessment.riskScore,
        riskCategory: analysisResult.assessment.riskCategory,
        riskLevel: analysisResult.assessment.riskCategory,
        status: "Completed",
        symptoms: analysisResult.receivedInputs.symptoms,
        assessedAt: analysisResult.assessment.assessedAt,
        modelStatus: analysisResult.assessment.modelStatus
      };
      setHistory(prev => [historyItem, ...prev.filter(item => item.id !== historyItem.id)]);
      setHistoryError(null);

      setIsLoading(false);
      return analysisResult;
    } catch (err) {
      setError("Unable to complete crop risk assessment. Please verify your input and try again.");
      setIsLoading(false);
      throw err;
    }
  };

  const updateProfileData = async (newProfile) => {
    setProfileError(null);
    try {
      const res = await saveFarmerProfile(newProfile);
      setProfile(res.data);
      setProfilePersisted(Boolean(res.persisted));
      return res.data;
    } catch (err) {
      setProfileError("Farmer profile could not be saved to the backend. Your changes have not been marked as saved.");
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
        weatherError,
        market,
        recommendations,
        history,
        setHistory,
        historyError,
        historyLoading,
        profile,
        profilePersisted,
        profileLoading,
        profileError,
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
