// src/pages/Profile.jsx
import React, { useState } from 'react';
import { useCrop } from '../context/CropContext';
import {
  User,
  Phone,
  MapPin,
  Sprout,
  Layers,
  Droplets,
  CheckCircle,
  Save,
  ShieldCheck,
  Edit3
} from 'lucide-react';

export default function Profile() {
  const { profile, updateProfileData } = useCrop();

  const [formData, setFormData] = useState({
    name: profile.name || "Ramesh Patil",
    mobile: profile.mobile || "+91 98221 44556",
    state: profile.state || "Maharashtra",
    district: profile.district || "Pune",
    village: profile.village || "Khed Shivapur",
    farmSize: profile.farmSize || "3.5 Acres",
    soilType: profile.soilType || "Medium Black (Clay Loam)",
    irrigationType: profile.irrigationType || "Drip Irrigation",
    mainCrops: profile.mainCrops || ["Tomato", "Onion", "Wheat"]
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfileData(formData);
    setSavedSuccess(true);
    setIsEditing(false);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddCrop = (cropName) => {
    if (!formData.mainCrops.includes(cropName)) {
      setFormData({
        ...formData,
        mainCrops: [...formData.mainCrops, cropName]
      });
    }
  };

  const handleRemoveCrop = (cropName) => {
    setFormData({
      ...formData,
      mainCrops: formData.mainCrops.filter(c => c !== cropName)
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white font-bold text-2xl flex items-center justify-center shadow-md shadow-emerald-800/20">
            {formData.name ? formData.name.charAt(0) : "R"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {formData.name}
              </h1>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Verified Farmer • {formData.village}, {formData.district}
            </p>
          </div>
        </div>

        <div>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs py-2.5 px-4 rounded-xl border border-stone-200 transition-colors"
            >
              <Edit3 className="w-4 h-4 text-stone-600" />
              <span>Edit Details</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-stone-500 hover:text-stone-800 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Farmer profile updated successfully!</span>
        </div>
      )}

      {/* Your Crops Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Your Crops</h2>
            <p className="text-xs text-stone-500">
              Primary cultivation crops actively monitored in KrishiMind
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
            {formData.mainCrops.length} Active
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {formData.mainCrops.map((crop) => (
            <div
              key={crop}
              className="inline-flex items-center gap-2 bg-stone-50 border border-stone-200/80 px-4 py-2.5 rounded-2xl"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Sprout className="w-3.5 h-3.5" />
              </div>
              <span className="text-sm font-bold text-stone-800">{crop}</span>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => handleRemoveCrop(crop)}
                  className="text-stone-400 hover:text-rose-600 ml-1 text-xs font-bold"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {isEditing && (
            <div className="flex items-center gap-1">
              {['Cotton', 'Rice', 'Soybean', 'Maize'].filter(c => !formData.mainCrops.includes(c)).map(opt => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleAddCrop(opt)}
                  className="px-3 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold rounded-xl border border-dashed border-emerald-300 transition-colors"
                >
                  + Add {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Profile Details Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs">
        <div className="pb-3 mb-6 border-b border-stone-100">
          <h2 className="text-lg font-bold text-stone-900">Farmer & Land Information</h2>
          <p className="text-xs text-stone-500">
            Used for localized weather alerts and nearby APMC market mapping
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm disabled:opacity-80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all font-medium text-stone-900"
                />
              </div>
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm disabled:opacity-80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all font-medium text-stone-900"
                />
              </div>
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                State
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm disabled:opacity-80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all font-medium text-stone-900"
              />
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                District
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm disabled:opacity-80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all font-medium text-stone-900"
              />
            </div>

            {/* Village */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Village / Taluka
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm disabled:opacity-80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all font-medium text-stone-900"
              />
            </div>

            {/* Farm Size */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Farm Size
              </label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.farmSize}
                onChange={(e) => setFormData({ ...formData, farmSize: e.target.value })}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm disabled:opacity-80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all font-medium text-stone-900"
              />
            </div>
          </div>

          {isEditing && (
            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
