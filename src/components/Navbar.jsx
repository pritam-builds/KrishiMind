// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCrop } from '../context/CropContext';
import {
  MapPin,
  Globe,
  Bell,
  Sparkles,
  Menu,
  X,
  Sprout,
  ChevronRight
} from 'lucide-react';

export default function Navbar() {
  const { profile } = useCrop();
  const location = useLocation();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Map route pathname to user-friendly titles
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/farmer') return 'Farmer Dashboard';
    if (path === '/crop-analysis') return 'Crop Health Assessment';
    if (path === '/weather') return 'Weather Intelligence';
    if (path === '/market') return 'Market Intelligence';
    if (path === '/recommendation') return 'Decision Support';
    if (path === '/history') return 'Previous Analyses';
    if (path === '/profile') return 'Farmer Profile';
    return 'KrishiMind';
  };

  const languages = ['English', 'मराठी (Marathi)', 'हिंदी (Hindi)', 'ಕನ್ನಡ (Kannada)', 'తెలుగు (Telugu)'];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Mobile Brand / Page Title */}
        <div className="flex items-center gap-3">
          <Link to="/" className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-stone-900 text-base">KrishiMind</span>
          </Link>

          <div className="hidden md:flex items-center gap-2 text-xs text-stone-500">
            <span className="font-medium text-stone-400">KrishiMind</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
            <span className="font-bold text-stone-800">{getPageTitle()}</span>
          </div>
        </div>

        {/* Right tools: Location pill, Language switcher, Quick CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Location Badge */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100/80 rounded-full text-xs font-medium text-stone-700 border border-stone-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{profile?.district || 'Pune'}, {profile?.state || 'Maharashtra'}</span>
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLanguageModal(!showLanguageModal)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors border border-stone-200"
            >
              <Globe className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">{selectedLang}</span>
              <span className="sm:hidden">EN</span>
            </button>

            {showLanguageModal && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50">
                <div className="text-[11px] font-bold text-stone-400 px-3 py-1 uppercase tracking-wider">
                  Select Language
                </div>
                {languages.map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      setSelectedLang(lang.split(' ')[0]);
                      setShowLanguageModal(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl transition-colors"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* New Crop Quick Action */}
          <Link
            to="/farmer?action=analyze"
            className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-1.5 px-3.5 rounded-xl shadow-xs transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span>+ Analyze Crop</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
