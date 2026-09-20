// src/components/ImageUploader.jsx
import React, { useState, useRef } from 'react';
import { UploadCloud, Camera, Image as ImageIcon, X, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export default function ImageUploader({
  imagePreview,
  onImageSelected,
  onImageRemoved,
  required = false
}) {
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
    // Convenient sample image for hackathon / demo testing
    const sampleUrl = "https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80";
    onImageSelected({
      file: null,
      previewUrl: sampleUrl,
      name: "sample_tomato_leaf_spot.jpg"
    });
  };

  return (
    <div className="w-full">
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

      {!imagePreview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all bg-white ${
            isDragging
              ? 'border-emerald-500 bg-emerald-50/50'
              : 'border-stone-300 hover:border-emerald-400 hover:bg-stone-50/60'
          }`}
        >
          <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
            <UploadCloud className="w-7 h-7" />
          </div>

          <h4 className="text-base font-bold text-stone-800">
            Upload a clear photo of the affected plant
          </h4>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Drag and drop your image here, or select an option below
          </p>

          {/* Upload actions */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors shadow-sm"
            >
              <ImageIcon className="w-4 h-4" />
              Browse Gallery
            </button>

            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors border border-stone-200"
            >
              <Camera className="w-4 h-4 text-stone-600" />
              Camera Capture
            </button>

            <button
              type="button"
              onClick={handleUseSampleImage}
              className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-medium py-2.5 px-3 rounded-xl transition-colors border border-amber-200"
            >
              Use Sample Field Photo
            </button>
          </div>

          <div className="mt-3 text-[11px] text-stone-400">
            Supports JPG, PNG (Max 15MB)
          </div>
        </div>
      ) : (
        /* Image Preview State */
        <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
          <div className="relative rounded-xl overflow-hidden bg-stone-900 aspect-video max-h-64 flex items-center justify-center">
            <img
              src={imagePreview}
              alt="Uploaded crop preview"
              className="w-full h-full object-contain"
            />
            <div className="absolute top-2 right-2 flex items-center gap-2">
              <span className="bg-emerald-600/90 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Photo Attached
              </span>
              <button
                type="button"
                onClick={onImageRemoved}
                aria-label="Remove image"
                className="p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-stone-100">
            <span className="text-xs text-stone-500 font-medium">
              Image attached for visual evidence
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Upload Another Image
              </button>
              <button
                type="button"
                onClick={onImageRemoved}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 font-medium">
          <AlertCircle className="w-3.5 h-3.5" />
          {errorMsg}
        </div>
      )}

      {/* Required supporting note */}
      <div className="mt-2 text-xs text-stone-500 bg-stone-100/70 p-3 rounded-xl border border-stone-200/60 leading-relaxed">
        <strong>Field Guideline:</strong> Use a clear photo of the affected leaf, stem or fruit. The image is used as supporting evidence along with your crop observations.
      </div>
    </div>
  );
}
