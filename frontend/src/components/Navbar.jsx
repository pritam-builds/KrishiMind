// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useCrop } from '../context/CropContext';
import { useI18n } from '../i18n';
import {
  Sprout,
  Globe,
  Sparkles,
  Menu,
  X,
  User,
  ChevronDown,
  MapPin,
  Home,
  Activity,
  LayoutDashboard,
  CloudSun,
  TrendingUp,
  History,
  Check
} from 'lucide-react';

export default function Navbar() {
  const { profile, updateProfileData } = useCrop();
  const { language, setLanguage, t } = useI18n();
  const location = useLocation();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [isSavingLanguage, setIsSavingLanguage] = useState(false);
  const [languageError, setLanguageError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const langDropdownRef = useRef(null);

  // 6 Required Navigation Links
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Crop Check', path: '/crop-analysis', icon: Activity },
    { name: 'Dashboard', path: '/farmer', icon: LayoutDashboard },
    { name: 'Weather', path: '/weather', icon: CloudSun },
    { name: 'Market', path: '/market', icon: TrendingUp },
    { name: 'History', path: '/history', icon: History }
  ];

  // Required 3 Languages: English / मराठी / हिन्दी
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'mr', label: 'मराठी' },
    { code: 'hi', label: 'हिन्दी' }
  ];

  const selectedLang = languages.find((item) => item.code === language)?.label || 'English';

  const handleLanguageChange = async (languageOption) => {
    setLanguage(languageOption.code);
    setIsSavingLanguage(true);
    setLanguageError(null);
    setShowLanguageModal(false);
    setIsMobileMenuOpen(false);
    try {
      await updateProfileData({ ...profile, preferredLanguage: languageOption.label });
    } catch (error) {
      console.error("Unable to save preferred language", error);
      setLanguageError("Could not save language preference. Please try again.");
    } finally {
      setIsSavingLanguage(false);
    }
  };

  // Auto-close dropdowns and mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowLanguageModal(false);
  }, [location.pathname]);

  // Click outside to close language dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setShowLanguageModal(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center shadow-sm shadow-emerald-800/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-stone-900 text-base leading-tight tracking-tight">KrishiMind</span>
              <span className="text-[10px] font-semibold text-emerald-700 leading-none hidden sm:inline">{t("Farm Decision Support")}</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-stone-100/70 p-1 rounded-2xl border border-stone-200/60">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-emerald-800 font-bold shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                }`
              }
            >
              {t(item.name)}
            </NavLink>
          ))}
        </nav>

        {/* Right Tools: Location, Language, Profile, CTA, Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Location Badge (Large screens) */}
          <div className="hidden 2xl:inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100/80 rounded-full text-xs font-medium text-stone-700 border border-stone-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{profile?.district || 'Pune'}, {profile?.state || 'Maharashtra'}</span>
          </div>

          {/* Language Selector Dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setShowLanguageModal(!showLanguageModal)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors border border-stone-200"
              aria-expanded={showLanguageModal}
              aria-label="Select language"
            >
              <Globe className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline font-medium">{selectedLang}</span>
              <span className="sm:hidden font-medium">
                {language === 'en' ? 'EN' : language === 'mr' ? 'म' : 'हि'}
              </span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {showLanguageModal && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-stone-200 p-1.5 z-50 animate-in fade-in duration-100">
                <div className="text-[10px] font-bold text-stone-400 px-2.5 py-1 uppercase tracking-wider">
                  {t('Language')}
                </div>
                {isSavingLanguage && (
                  <p className="px-2.5 py-1 text-[10px] text-stone-500" role="status">{t('Saving language...')}</p>
                )}
                {languageError && (
                  <p className="px-2.5 py-1 text-[10px] text-rose-700" role="alert">{t(languageError)}</p>
                )}
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                      language === lang.code
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <span>{lang.label}</span>
                    {language === lang.code && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Farmer / Profile Icon */}
          <Link
            to="/profile"
            className={`p-1.5 rounded-xl border transition-colors flex items-center gap-2 ${
              location.pathname === '/profile'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                : 'border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-stone-900'
            }`}
            title={profile?.name ? `${t('Farmer')}: ${profile.name}` : t("Farmer Profile")}
            aria-label={t("Farmer Profile")}
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              {profile?.name ? profile.name.charAt(0) : <User className="w-4 h-4 text-emerald-700" />}
            </div>
            <span className="hidden xl:inline text-xs font-semibold text-stone-700 max-w-[80px] truncate">
              {profile?.name?.split(' ')[0] || t('Profile')}
            </span>
          </Link>

          {/* Start Crop Check CTA */}
          <Link
            to="/farmer?action=analyze"
            className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            <span>{t("Start Crop Check")}</span>
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors border border-stone-200"
            aria-label={isMobileMenuOpen ? t("Close menu") : t("Open menu")}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-stone-800" /> : <Menu className="w-5 h-5 text-stone-800" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-stone-200 px-4 py-4 space-y-3.5 shadow-lg">
          {/* Navigation Links */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2 pb-1">
              {t("Navigation")}
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path === '/' 
                ? location.pathname === '/' 
                : location.pathname.startsWith(item.path);
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === '/'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
                  <span>{t(item.name)}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Primary CTA in Mobile Menu */}
          <div className="pt-2 border-t border-stone-100">
            <Link
              to="/farmer?action=analyze"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>{t("Start Crop Check")}</span>
            </Link>
          </div>

          {/* Profile Details in Mobile Menu */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <Link
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 text-xs font-semibold text-stone-700 hover:text-emerald-800"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                {profile?.name ? profile.name.charAt(0) : <User className="w-4 h-4 text-emerald-700" />}
              </div>
              <div>
                <div className="font-bold text-stone-900">{profile?.name || t('Farmer Profile')}</div>
                <div className="text-[11px] text-stone-500 font-normal">
                  {profile?.village ? `${profile.village}, ${profile.district}` : t('View profile settings')}
                </div>
              </div>
            </Link>
          </div>

          {/* Quick Language Switcher in Mobile Menu */}
          <div className="pt-2 border-t border-stone-100">
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider px-2 pb-1.5">
              {t("Select language")}
            </div>
            {isSavingLanguage && (
              <p className="px-2 py-1 text-[10px] text-stone-500" role="status">{t('Saving language...')}</p>
            )}
            {languageError && (
              <p className="px-2 py-1 text-[10px] text-rose-700" role="alert">{t(languageError)}</p>
            )}
            <div className="grid grid-cols-3 gap-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleLanguageChange(lang)}
                  className={`py-1.5 px-2 text-xs font-medium rounded-xl text-center border transition-all ${
                    language === lang.code
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
