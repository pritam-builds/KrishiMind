// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CropProvider } from './context/CropContext';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import CropAnalysis from './pages/CropAnalysis';
import Weather from './pages/Weather';
import Market from './pages/Market';
import Recommendations from './pages/Recommendations';
import History from './pages/History';
import Profile from './pages/Profile';
import { LocaleProvider } from './i18n';

export default function App() {
  return (
    <LocaleProvider>
      <CropProvider>
        <BrowserRouter>
          <Routes>
          {/* Landing Page without Dashboard Sidebar */}
          <Route path="/" element={<Landing />} />

          {/* Authenticated / Dashboard Workspace Pages */}
          <Route element={<DashboardLayout />}>
            <Route path="/farmer" element={<Dashboard />} />
            <Route path="/crop-analysis" element={<CropAnalysis />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/market" element={<Market />} />
            <Route path="/recommendation" element={<Recommendations />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </CropProvider>
    </LocaleProvider>
  );
}
