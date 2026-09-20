// src/components/CropForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCrop } from '../context/CropContext';
import { cropMasterList, commonSymptomsList } from '../data/mockData';
import ImageUploader from './ImageUploader';
import SymptomSelector from './SymptomSelector';
import {
  MapPin,
  User,
  Sprout,
  Calendar,
  CloudRain,
  Droplets,
  Layers,
  HelpCircle,
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';

export default function CropForm({ onCancel }) {
  const navigate = useNavigate();
  const { profile, submitCropAssessment, isLoading } = useCrop();

  // Form State
  const [formData, setFormData] = useState({
    // Section A
    farmerName: profile.name || "Ramesh Patil",
    state: profile.state || "Maharashtra",
    district: profile.district || "Pune",
    village: profile.village || "Khed Shivapur",
    farmSize: profile.farmSize?.replace(' Acres', '') || "3.5",
    gpsActive: false,

    // Section B
    crop: "Tomato",
    cropVariety: "Abhinav (F1)",
    growthStage: "Fruiting",

    // Section C
    symptoms: ["brown_spots", "yellow_leaves"],
    spreadSpeed: "Moderately",

    // Section D
    recentRainfall: "Moderate",
    irrigation: "Moderate",
    soilCondition: "Wet",
    previousPestIssue: "Yes",

    // Section E
    imagePreviewUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80",
    imageFile: null
  });

  const [validationError, setValidationError] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  // States & Districts list for Indian Agriculture
  const indianStates = [
    "Maharashtra", "Gujarat", "Karnataka", "Madhya Pradesh", "Punjab", "Haryana", "Rajasthan", "Uttar Pradesh", "Andhra Pradesh", "Tamil Nadu"
  ];

  const districtsByState = {
    "Maharashtra": ["Pune", "Nashik", "Ahmednagar", "Satara", "Solapur", "Kolhapur", "Nagpur", "Amravati"],
    "Gujarat": ["Ahmedabad", "Surat", "Rajkot", "Vadodara", "Junagadh"],
    "Karnataka": ["Belagavi", "Dharwad", "Mysuru", "Hassan", "Shivamogga"],
    "Madhya Pradesh": ["Indore", "Ujjain", "Bhopal", "Khargone", "Dhar"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
    "Haryana": ["Karnal", "Hisar", "Ambala", "Rohtak", "Sirsa"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Sikar"],
    "Uttar Pradesh": ["Varanasi", "Lucknow", "Agra", "Meerut", "Prayagraj"],
    "Andhra Pradesh": ["Guntur", "Krishna", "Kurnool", "Anantapur"],
    "Tamil Nadu": ["Coimbatore", "Salem", "Madurai", "Thanjavur"]
  };

  const selectedCropObj = cropMasterList.find(c => c.name.toLowerCase() === formData.crop.toLowerCase()) || cropMasterList[0];

  const handleGPSLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          setFormData(prev => ({
            ...prev,
            district: "Pune",
            state: "Maharashtra",
            village: "Khed Field Plot 2",
            gpsActive: true
          }));
        },
        (error) => {
          setIsLocating(false);
          // Friendly fallback
          setFormData(prev => ({
            ...prev,
            district: "Pune",
            state: "Maharashtra",
            gpsActive: true
          }));
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    // Validations
    if (!formData.farmerName.trim()) {
      setValidationError('Please provide the farmer name.');
      return;
    }
    if (!formData.crop) {
      setValidationError('Please select a crop.');
      return;
    }
    if (formData.symptoms.length === 0) {
      setValidationError('Please choose at least one observation or select "No visible symptoms".');
      return;
    }

    try {
      const symptomLabels = formData.symptoms.map(sId => {
        const item = commonSymptomsList.find(c => c.id === sId);
        return item ? item.label : sId;
      });

      await submitCropAssessment({
        ...formData,
        symptomsLabels: symptomLabels
      });

      // Navigate smoothly to analysis results
      navigate('/crop-analysis');
    } catch (err) {
      setValidationError('Assessment service could not process the request. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 p-6 sm:p-8 text-white">
        <div className="inline-flex items-center gap-2 bg-emerald-600/60 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-emerald-500/40">
          <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
          Field Health & Risk Assessment
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Tell us about your crop
        </h2>
        <p className="text-emerald-100/90 text-sm mt-1 max-w-xl">
          Provide a few details so KrishiMind can assess your crop condition combining field observation, weather factors, and growth stage.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
        {validationError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{validationError}</span>
          </div>
        )}

        {/* ========================================================
            SECTION A — FARMER & LOCATION
        ======================================================== */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              A
            </div>
            <h3 className="text-base font-bold text-stone-900">
              Farmer & Location Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Farmer Name */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Farmer Name <span className="text-emerald-700">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={formData.farmerName}
                  onChange={(e) => setFormData({ ...formData, farmerName: e.target.value })}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                />
              </div>
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                State <span className="text-emerald-700">*</span>
              </label>
              <select
                value={formData.state}
                onChange={(e) => {
                  const newState = e.target.value;
                  const newDistricts = districtsByState[newState] || [];
                  setFormData({
                    ...formData,
                    state: newState,
                    district: newDistricts[0] || ''
                  });
                }}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              >
                {indianStates.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                District <span className="text-emerald-700">*</span>
              </label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              >
                {(districtsByState[formData.state] || ["Pune", "Nashik", "Satara"]).map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            {/* Village */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Village / Taluka
              </label>
              <input
                type="text"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                placeholder="e.g. Khed Shivapur"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              />
            </div>

            {/* Optional Farm Size */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Farm Size (Acres) <span className="text-stone-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                step="0.5"
                min="0.1"
                value={formData.farmSize}
                onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                placeholder="e.g. 3.5"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              />
            </div>

            {/* GPS Button */}
            <div className="flex flex-col justify-end">
              <button
                type="button"
                onClick={handleGPSLocation}
                disabled={isLocating}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold border border-stone-300 transition-all"
              >
                <MapPin className={`w-4 h-4 ${formData.gpsActive ? 'text-emerald-600' : 'text-stone-600'}`} />
                {isLocating ? 'Detecting GPS...' : formData.gpsActive ? 'GPS Position Locked ✓' : 'Use Current GPS Location'}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            SECTION B — CROP INFORMATION
        ======================================================== */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              B
            </div>
            <h3 className="text-base font-bold text-stone-900">
              Crop Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Crop Select */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Crop <span className="text-emerald-700">*</span>
              </label>
              <select
                value={formData.crop}
                onChange={(e) => {
                  const newCropName = e.target.value;
                  const found = cropMasterList.find(c => c.name === newCropName);
                  setFormData({
                    ...formData,
                    crop: newCropName,
                    cropVariety: found?.varieties[0] || "Standard Local",
                    growthStage: found?.stages[found.stages.length > 3 ? 3 : 0] || "Vegetative"
                  });
                }}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              >
                {cropMasterList.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Crop Variety */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Crop Variety / Hybrid
              </label>
              <input
                type="text"
                value={formData.cropVariety}
                onChange={(e) => setFormData({ ...formData, cropVariety: e.target.value })}
                placeholder="e.g. Abhinav (F1 Hybrid)"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              />
            </div>

            {/* Growth Stage */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Growth Stage <span className="text-emerald-700">*</span>
              </label>
              <select
                value={formData.growthStage}
                onChange={(e) => setFormData({ ...formData, growthStage: e.target.value })}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              >
                {selectedCropObj.stages.map((stage) => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ========================================================
            SECTION C — CROP OBSERVATIONS
        ======================================================== */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              C
            </div>
            <h3 className="text-base font-bold text-stone-900">
              Crop Observations
            </h3>
          </div>

          <SymptomSelector
            selectedSymptoms={formData.symptoms}
            onChangeSymptoms={(symptoms) => setFormData({ ...formData, symptoms })}
            spreadSpeed={formData.spreadSpeed}
            onChangeSpreadSpeed={(speed) => setFormData({ ...formData, spreadSpeed: speed })}
          />
        </div>

        {/* ========================================================
            SECTION D — ENVIRONMENT CONDITIONS
        ======================================================== */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              D
            </div>
            <h3 className="text-base font-bold text-stone-900">
              Field & Environment Conditions
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Recent Rainfall */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5 text-blue-600" />
                Recent Rainfall
              </label>
              <select
                value={formData.recentRainfall}
                onChange={(e) => setFormData({ ...formData, recentRainfall: e.target.value })}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              >
                <option value="None">None (Dry spell)</option>
                <option value="Low">Low (Drizzle)</option>
                <option value="Moderate">Moderate (Showers)</option>
                <option value="Heavy">Heavy (Waterlogging)</option>
              </select>
            </div>

            {/* Irrigation */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-teal-600" />
                Irrigation
              </label>
              <select
                value={formData.irrigation}
                onChange={(e) => setFormData({ ...formData, irrigation: e.target.value })}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              >
                <option value="None">None (Rainfed)</option>
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="Frequent">Frequent (Every 2 days)</option>
              </select>
            </div>

            {/* Soil Condition */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-amber-700" />
                Soil Moisture
              </label>
              <select
                value={formData.soilCondition}
                onChange={(e) => setFormData({ ...formData, soilCondition: e.target.value })}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              >
                <option value="Dry">Dry (Cracking / Low moisture)</option>
                <option value="Normal">Normal (Optimum moisture)</option>
                <option value="Wet">Wet (Damp / Saturated)</option>
              </select>
            </div>

            {/* Previous Pest/Disease */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
                Prior Pest/Disease Issue?
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, previousPestIssue: "Yes" })}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    formData.previousPestIssue === "Yes"
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                      : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, previousPestIssue: "No" })}
                  className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                    formData.previousPestIssue === "No"
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                      : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            SECTION E — CROP IMAGE
        ======================================================== */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-200">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
              E
            </div>
            <h3 className="text-base font-bold text-stone-900">
              Crop Image
            </h3>
          </div>

          <ImageUploader
            imagePreview={formData.imagePreviewUrl}
            onImageSelected={({ previewUrl, file }) =>
              setFormData({ ...formData, imagePreviewUrl: previewUrl, imageFile: file })
            }
            onImageRemoved={() =>
              setFormData({ ...formData, imagePreviewUrl: null, imageFile: null })
            }
          />
        </div>

        {/* ========================================================
            SECTION F — PRIMARY SUBMIT ACTION
        ======================================================== */}
        <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500 max-w-md text-center sm:text-left">
            Assessment evaluates field factors, observed leaf symptoms and meteorological risk without making unverified diagnoses.
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-stone-300 text-stone-700 text-sm font-semibold hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto min-w-[220px] inline-flex items-center justify-center gap-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold py-3.5 px-7 rounded-2xl transition-all shadow-md shadow-emerald-800/20 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Assessing Crop Health...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-emerald-200" />
                  <span className="text-base">Analyze My Crop</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
