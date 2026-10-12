// src/components/ImageUploader.jsx
import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Camera,
  Image as ImageIcon,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
  Sparkles
} from 'lucide-react';
import { useI18n } from '../i18n';

export default function ImageUploader({
  imagePreview,
  onImageSelected,
  onImageRemoved,
  required = false
}) {
  const { t } = useI18n();
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFile = (file) => {
    setErrorMsg('');
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|jpg|webp)$/)) {
      setErrorMsg('Please upload a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('Image size should be less than 15MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onImageSelected({
        file: file,
        previewUrl: e.target.result,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleUseSampleImage = () => {
    // Convenient sample image for demo testing
    const sampleUrl = "https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80";
    onImageSelected({
      file: null,
      previewUrl: sampleUrl,
      name: "sample_tomato_leaf_spot.jpg"
    });
  };

  return (
    <div className="w-full space-y-3.5">
      {/* Clear Guidance Banner: Photo is ONE input among several */}
      <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-3.5 sm:p-4 text-emerald-950 flex items-start gap-3">
        <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          <Info className="w-4 h-4" />
        </div>
        <div className="text-xs space-y-1">
          <p className="font-bold text-emerald-900 text-xs sm:text-sm">
            {t("Important Note on Crop Health Assessment")}
          </p>
          <p className="text-emerald-800 leading-relaxed">
            {t("A valid crop photo can be attached to your assessment, but visual disease detection is not connected. The risk indicator uses your selected symptoms, growth stage, and reported field conditions only.")}
          </p>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {/* Upload Box or Image Preview */}
      {!imagePreview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all bg-white ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/50'
              : 'border-stone-300 hover:border-emerald-500 hover:bg-stone-50/70'
          }`}
        >
          <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h4 className="text-sm sm:text-base font-bold text-stone-900">
            {t("Upload a clear photo of your crop or affected leaf")}
          </h4>
          <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
            {t("Attach a clear JPG, PNG, or WEBP photo as supporting input. It will not be analyzed for disease. Drag and drop here or choose an option:")}
          </p>

          {/* Upload actions */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-xs"
            >
              <ImageIcon className="w-4 h-4" />
              <span>{t("Browse Photos")}</span>
            </button>

            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors border border-stone-300"
            >
              <Camera className="w-4 h-4 text-stone-600" />
              <span>{t("Take Photo")}</span>
            </button>

            <button
              type="button"
              onClick={handleUseSampleImage}
              className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-medium py-2.5 px-3.5 rounded-xl transition-colors border border-amber-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{t("Use Demo Field Photo")}</span>
            </button>
          </div>

          <div className="mt-3 text-[11px] text-stone-400">
            {t("JPG, PNG or WEBP up to 15MB • Optional but recommended")}
          </div>
        </div>
      ) : (
        /* Image Preview State with Replace and Remove controls */
        <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            {/* Image Preview Box */}
            <div className="relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 w-full sm:w-64 aspect-4/3 shrink-0 flex items-center justify-center shadow-xs group">
              <img
                src={imagePreview}
                alt={t("Uploaded crop preview")}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2">
                <span className="bg-emerald-700/95 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-xs">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-200" />
                  <span>{t("Photo Ready")}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={onImageRemoved}
                title={t("Remove photo")}
                aria-label={t("Remove image")}
                className="absolute top-2 right-2 p-1.5 bg-stone-900/80 hover:bg-stone-900 text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Actions & Information next to preview */}
            <div className="flex-1 w-full space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                    {t("Supporting Input Attached")}
                  </span>
                </div>
                <h5 className="text-sm font-bold text-stone-900">
                  {t("Crop photo attached")}
                </h5>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {t("The photo is accepted as supporting input but is not analyzed for disease. Your risk indicator uses reported symptoms and field conditions. You can replace or remove the photo at any time.")}
                </p>
              </div>

              {/* Action Buttons: Replace & Remove */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl border border-emerald-300 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t("Replace Photo")}</span>
                </button>

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 px-3.5 py-2 rounded-xl border border-stone-200 transition-colors"
                >
                  <Camera className="w-3.5 h-3.5 text-stone-500" />
                  <span>{t("Retake with Camera")}</span>
                </button>

                <button
                  type="button"
                  onClick={onImageRemoved}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 hover:text-rose-800 hover:bg-rose-50 px-3 py-2 rounded-xl border border-rose-200 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{t("Remove Photo")}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{t(errorMsg)}</span>
        </div>
      )}
    </div>
  );
}
