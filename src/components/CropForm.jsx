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
  Sparkles,
  Loader2,
  AlertCircle,
  FileText,
  Compass,
  CheckCircle2,
  Camera
} from 'lucide-react';

export default function CropForm({ onCancel }) {
  const navigate = useNavigate();
  const { profile, submitCropAssessment, isLoading } = useCrop();

  // Form State
  const [formData, setFormData] = useState({
    // 1. Farmer & Location
    farmerName: profile?.name || "Ramesh Patil",
    village: profile?.village || "Khed Shivapur",
    district: profile?.district || "Pune",
    state: profile?.state || "Maharashtra",
    farmSize: profile?.farmSize ? profile.farmSize.replace(/[^0-9.]/g, '') : "3.5",
    locationStatus: null, // null | 'locating' | 'success' | 'error'
    locationMessage: '',

    // 2. Crop Information
    crop: "Tomato",
    cropVariety: "Abhinav (F1)",
    growthStage: "Fruiting",

    // 3. Crop Observations
    symptoms: ["brown_spots", "yellow_leaves"],
    otherSymptomText: "",
    spreadSpeed: "Moderately",

    // 4. Crop Image
    imagePreviewUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80",
    imageFile: null,

    // 5. Farm Conditions
    irrigationCondition: "Adequate",
    soilCondition: "Normal",
    recentRainfall: "Moderate",

    // 6. Additional Observation
    additionalObservation: ""
  });

  const [validationError, setValidationError] = useState('');

  // States & Districts list for Indian Agriculture
  const indianStates = [
    "Maharashtra", "Gujarat", "Karnataka", "Madhya Pradesh", "Punjab", "Haryana", "Rajasthan", "Uttar Pradesh", "Andhra Pradesh", "Tamil Nadu", "Telangana", "Bihar"
  ];

  const districtsByState = {
    "Maharashtra": ["Pune", "Nashik", "Ahmednagar", "Satara", "Solapur", "Kolhapur", "Nagpur", "Amravati", "Aurangabad", "Sangli"],
    "Gujarat": ["Ahmedabad", "Surat", "Rajkot", "Vadodara", "Junagadh", "Mehsana", "Bhavnagar"],
    "Karnataka": ["Belagavi", "Dharwad", "Mysuru", "Hassan", "Shivamogga", "Mandya", "Vijayapura"],
    "Madhya Pradesh": ["Indore", "Ujjain", "Bhopal", "Khargone", "Dhar", "Dewas", "Ratlam"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Firozpur"],
    "Haryana": ["Karnal", "Hisar", "Ambala", "Rohtak", "Sirsa", "Sonipat"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Sikar", "Ganganagar"],
    "Uttar Pradesh": ["Varanasi", "Lucknow", "Agra", "Meerut", "Prayagraj", "Kanpur"],
    "Andhra Pradesh": ["Guntur", "Krishna", "Kurnool", "Anantapur", "West Godavari"],
    "Tamil Nadu": ["Coimbatore", "Salem", "Madurai", "Thanjavur", "Erode"],
    "Telangana": ["Warangal", "Karimnagar", "Nalgonda", "Nizamabad"],
    "Bihar": ["Patna", "Muzaffarpur", "Gaya", "Bhagalpur"]
  };

  // Extended crops list including popular choices
  const availableCrops = cropMasterList || [
    { id: "tomato", name: "Tomato", stages: ["Seedling", "Vegetative", "Flowering", "Fruiting", "Harvest"], varieties: ["Abhinav (F1)", "US-440", "Shivam", "Local Desi"] },
    { id: "onion", name: "Onion", stages: ["Seedling", "Vegetative", "Bulb Formation", "Bulb Development", "Harvest"], varieties: ["Bhima Super", "Bhima Red", "AgriFound Dark Red"] },
    { id: "wheat", name: "Wheat", stages: ["Germination", "Tillering", "Stem Extension", "Heading", "Ripening"], varieties: ["Lokwan", "GW-322", "Sharbati", "HD-2967"] },
    { id: "rice", name: "Rice", stages: ["Seedling", "Vegetative", "Panicle Initiation", "Flowering", "Grain Filling", "Harvest"], varieties: ["Basmati 1121", "Indrayani", "IR-64", "Swarna"] },
    { id: "cotton", name: "Cotton", stages: ["Seedling", "Vegetative", "Squaring", "Flowering", "Boll Development", "Maturity"], varieties: ["Bt Cotton RCH-2", "Bollgard II", "Ajit 155"] }
  ];

  const selectedCropObj = availableCrops.find(c => c.name.toLowerCase() === formData.crop.toLowerCase()) || availableCrops[0];

  // Geolocation handler
  const handleUseMyLocation = () => {
    setFormData(prev => ({
      ...prev,
      locationStatus: 'locating',
      locationMessage: 'Acquiring GPS location...'
    }));

    if (!navigator.geolocation) {
      setFormData(prev => ({
        ...prev,
        locationStatus: 'error',
        locationMessage: 'Geolocation is not supported by your browser.'
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Successfully acquired GPS coordinates
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          locationStatus: 'success',
          locationMessage: `GPS detected (${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E)`,
          // If village was blank, set friendly label
          village: prev.village || `Field Near ${prev.district}`
        }));
      },
      (error) => {
        // Fallback for permission denial or offline
        setFormData(prev => ({
          ...prev,
          locationStatus: 'error',
          locationMessage: 'GPS permission denied or unavailable. You can enter village manually.'
        }));
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
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

    if (formData.symptoms.length === 0 && !formData.additionalObservation.trim()) {
      setValidationError('Please select at least one symptom or describe your observation in the crop.');
      return;
    }

    try {
      // Map symptom IDs to readable labels
      const symptomLabels = formData.symptoms.map(sId => {
        if (sId === 'other' && formData.otherSymptomText.trim()) {
          return `Other: ${formData.otherSymptomText.trim()}`;
        }
        const item = commonSymptomsList.find(c => c.id === sId);
        return item ? item.label : sId;
      });

      const submissionPayload = {
        ...formData,
        symptomsLabels: symptomLabels,
        farmSize: formData.farmSize ? `${formData.farmSize} Acres` : undefined
      };

      await submitCropAssessment(submissionPayload);

      // Navigate smoothly to analysis view
      navigate('/crop-analysis');
    } catch (err) {
      setValidationError('Assessment could not be processed at this moment. Please check your details and try again.');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 p-6 sm:p-8 text-white">
        <div className="inline-flex items-center gap-2 bg-emerald-600/70 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs font-semibold mb-3 border border-emerald-400/40">
          <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
          <span>Field Health & Risk Assessment</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Crop Input & Observation Form
        </h2>
        <p className="text-emerald-100/90 text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed">
          Fill in your field observations, crop stage, and growing conditions. KrishiMind brings together your observations with available environmental signals to evaluate crop health.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
        {validationError && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-800 text-xs sm:text-sm animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{validationError}</span>
          </div>
        )}

        {/* ========================================================
            1. FARMER & LOCATION
        ======================================================== */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-stone-200">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shadow-2xs">
              1
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Farmer & Location
              </h3>
              <p className="text-[11px] text-stone-500">
                Identify the grower and plot location for localized agronomic evaluation
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Farmer Name */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
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
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                />
              </div>
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
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
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              >
                {indianStates.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                District <span className="text-emerald-700">*</span>
              </label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              >
                {(districtsByState[formData.state] || ["Pune", "Nashik", "Satara"]).map((dist) => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            {/* Location / Village */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Location / Village
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  placeholder="e.g. Khed Shivapur, Plot 2"
                  className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
                />
              </div>
            </div>

            {/* Farm Size */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Farm Size (Acres) <span className="text-stone-400 font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                step="0.25"
                min="0.1"
                value={formData.farmSize}
                onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                placeholder="e.g. 3.5"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              />
            </div>

            {/* Optional "Use my location" button */}
            <div className="flex flex-col justify-end">
              <button
                type="button"
                onClick={handleUseMyLocation}
                disabled={formData.locationStatus === 'locating'}
                className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-3.5 rounded-xl text-xs font-semibold border transition-all shadow-2xs ${
                  formData.locationStatus === 'success'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                }`}
              >
                {formData.locationStatus === 'locating' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                    <span>Detecting location...</span>
                  </>
                ) : formData.locationStatus === 'success' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Location detected ✓</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4 text-emerald-700" />
                    <span>Use my location</span>
                  </>
                )}
              </button>
              {formData.locationMessage && (
                <span className={`text-[10px] mt-1 truncate ${formData.locationStatus === 'error' ? 'text-rose-600' : 'text-emerald-700'}`}>
                  {formData.locationMessage}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ========================================================
            2. CROP INFORMATION
        ======================================================== */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-stone-200">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shadow-2xs">
              2
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Crop Information
              </h3>
              <p className="text-[11px] text-stone-500">
                Specify what crop is planted, hybrid variety, and stage of development
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Crop */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1">
                <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                <span>Crop</span> <span className="text-emerald-700">*</span>
              </label>
              <select
                value={formData.crop}
                onChange={(e) => {
                  const newCropName = e.target.value;
                  const found = availableCrops.find(c => c.name.toLowerCase() === newCropName.toLowerCase());
                  setFormData({
                    ...formData,
                    crop: newCropName,
                    cropVariety: found?.varieties ? found.varieties[0] : "Standard Variety",
                    growthStage: found?.stages ? found.stages[Math.min(3, found.stages.length - 1)] : "Vegetative"
                  });
                }}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-semibold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              >
                {availableCrops.map((c) => (
                  <option key={c.id || c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Variety */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Variety / Hybrid
              </label>
              <input
                type="text"
                value={formData.cropVariety}
                onChange={(e) => setFormData({ ...formData, cropVariety: e.target.value })}
                placeholder="e.g. Abhinav (F1), Bhima Red"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              />
            </div>

            {/* Growth Stage */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>Growth Stage</span> <span className="text-emerald-700">*</span>
              </label>
              <select
                value={formData.growthStage}
                onChange={(e) => setFormData({ ...formData, growthStage: e.target.value })}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-medium text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              >
                {selectedCropObj.stages.map((stage) => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ========================================================
            3. CROP OBSERVATIONS
        ======================================================== */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-stone-200">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shadow-2xs">
              3
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Crop Observations
              </h3>
              <p className="text-[11px] text-stone-500">
                Select observed symptoms on leaves, stems, or fruits (multiple selections allowed)
              </p>
            </div>
          </div>

          <SymptomSelector
            selectedSymptoms={formData.symptoms}
            onChangeSymptoms={(symptoms) => setFormData({ ...formData, symptoms })}
            otherSymptomText={formData.otherSymptomText}
            onChangeOtherText={(text) => setFormData({ ...formData, otherSymptomText: text })}
            spreadSpeed={formData.spreadSpeed}
            onChangeSpreadSpeed={(speed) => setFormData({ ...formData, spreadSpeed: speed })}
          />
        </div>

        {/* ========================================================
            4. CROP IMAGE
        ======================================================== */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-stone-200">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shadow-2xs">
              4
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Crop Image
              </h3>
              <p className="text-[11px] text-stone-500">
                Attach a clear photo of the plant or affected leaves for visual symptom support
              </p>
            </div>
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
            5. FARM CONDITIONS
        ======================================================== */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-stone-200">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shadow-2xs">
              5
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Farm Conditions
              </h3>
              <p className="text-[11px] text-stone-500">
                Simple indicators to understand water availability, soil state, and recent rain exposure
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Irrigation condition */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-teal-600" />
                <span>Irrigation Condition</span>
              </label>
              <select
                value={formData.irrigationCondition}
                onChange={(e) => setFormData({ ...formData, irrigationCondition: e.target.value })}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              >
                <option value="Adequate">Regular / Adequate watering</option>
                <option value="Low">Low / Irregular watering</option>
                <option value="Rainfed">Rainfed only (No irrigation)</option>
                <option value="Excess">Flood / Excess watering</option>
              </select>
              <p className="text-[10px] text-stone-500 mt-1">Watering schedule & source status</p>
            </div>

            {/* Soil condition */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-700" />
                <span>Soil Condition</span>
              </label>
              <select
                value={formData.soilCondition}
                onChange={(e) => setFormData({ ...formData, soilCondition: e.target.value })}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              >
                <option value="Normal">Normal / Moist (Optimal)</option>
                <option value="Dry">Dry / Hard or Cracking</option>
                <option value="Wet">Wet / Damp</option>
                <option value="Waterlogged">Waterlogged / Poor drainage</option>
              </select>
              <p className="text-[10px] text-stone-500 mt-1">Current root-zone moisture feeling</p>
            </div>

            {/* Recent rainfall / water exposure */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 flex items-center gap-1.5">
                <CloudRain className="w-3.5 h-3.5 text-blue-600" />
                <span>Recent Rainfall / Water Exposure</span>
              </label>
              <select
                value={formData.recentRainfall}
                onChange={(e) => setFormData({ ...formData, recentRainfall: e.target.value })}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              >
                <option value="None">No rain (Dry spell in past 7 days)</option>
                <option value="Light">Light drizzle / Few drops</option>
                <option value="Moderate">Moderate rain (Showers in past 3 days)</option>
                <option value="Heavy">Heavy rain / Water accumulated</option>
              </select>
              <p className="text-[10px] text-stone-500 mt-1">Weather exposure over recent days</p>
            </div>
          </div>
        </div>

        {/* ========================================================
            6. ADDITIONAL OBSERVATION
        ======================================================== */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 pb-2.5 border-b border-stone-200">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shadow-2xs">
              6
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Additional Observation
              </h3>
              <p className="text-[11px] text-stone-500">
                Share any other nuances, previous sprays, or unusual pattern observed in the field
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Describe anything else you noticed in the crop
            </label>
            <textarea
              rows={3}
              value={formData.additionalObservation}
              onChange={(e) => setFormData({ ...formData, additionalObservation: e.target.value })}
              placeholder="e.g., Spots started on lower leaves after heavy morning dew, leaves curling inwards at top canopy, fertilizer applied 5 days ago, or noticed small flying insects under the leaves..."
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all leading-relaxed"
            />
            <p className="text-[11px] text-stone-500 mt-1">
              Farmer observation details help refine risk interpretation beyond single-factor indicators.
            </p>
          </div>
        </div>

        {/* ========================================================
            7. PRIMARY ACTION
        ======================================================== */}
        <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Supporting Line */}
          <div className="text-center sm:text-left max-w-md">
            <p className="text-xs sm:text-[13px] font-medium text-stone-600 leading-snug">
              KrishiMind combines your observations, crop information and available environmental signals.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-stone-300 text-stone-700 text-xs sm:text-sm font-semibold hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto min-w-[200px] inline-flex items-center justify-center gap-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold py-3.5 px-7 rounded-2xl transition-all shadow-md shadow-emerald-800/20 disabled:opacity-75 disabled:cursor-not-allowed hover:scale-[1.01]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm sm:text-base">Analyzing Crop...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-emerald-200" />
                  <span className="text-sm sm:text-base">Analyze Crop</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
