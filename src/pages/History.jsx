// src/pages/History.jsx
import React, { useState } from 'react';
import { useCrop } from '../context/CropContext';
import { Link, useNavigate } from 'react-router-dom';
import {
  History as HistoryIcon,
  Search,
  Filter,
  Sprout,
  Calendar,
  MapPin,
  Activity,
  ArrowRight,
  Eye,
  X,
  ShieldAlert,
  Clock
} from 'lucide-react';

export default function History() {
  const { history, setCurrentAnalysis } = useCrop();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCrop, setFilterCrop] = useState('All');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const cropsList = ['All', ...Array.from(new Set(history.map(h => h.crop)))];

  const filteredHistory = history.filter(item => {
    const matchesSearch =
      item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.stage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = filterCrop === 'All' || item.crop === filterCrop;
    return matchesSearch && matchesCrop;
  });

  const handleOpenDetail = (record) => {
    setSelectedRecord(record);
  };

  const handleLoadIntoAnalysis = (record) => {
    // Populate currentAnalysis with this historical record and navigate
    setCurrentAnalysis({
      ...record,
      riskBand: record.riskLevel,
      overallHealth: record.riskLevel,
      visualObservations: {
        image: "https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80",
        detectedSymptoms: [
          { name: record.symptoms || "Brown leaf spots", detail: "Archived field observation record", severity: "Recorded" }
        ],
        spreadRate: "Recorded in historical assessment"
      }
    });
    navigate('/crop-analysis');
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold mb-2">
            <HistoryIcon className="w-3.5 h-3.5 text-emerald-700" />
            <span>Farm Records Log</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Previous Crop Analyses
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Historical log of crop health assessments, growth stages, and observed risk conditions
          </p>
        </div>

        <Link
          to="/farmer?action=analyze"
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <span>+ New Analysis</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by crop, location, stage..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-stone-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Crop:
          </span>
          {cropsList.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilterCrop(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                filterCrop === c
                  ? 'bg-emerald-700 text-white font-bold shadow-xs'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* History Table (Desktop) & Cards (Mobile) */}
      <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-semibold uppercase text-[11px] tracking-wider bg-stone-50/50">
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Crop</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Growth Stage</th>
                <th className="py-3.5 px-4">Risk Level</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredHistory.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleOpenDetail(item)}
                  className="hover:bg-stone-50/80 cursor-pointer transition-colors group"
                >
                  <td className="py-4 px-4 font-medium text-stone-800 whitespace-nowrap">
                    {item.date}
                  </td>
                  <td className="py-4 px-4 font-bold text-stone-900 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                        <Sprout className="w-4 h-4" />
                      </div>
                      <span>{item.crop}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-stone-600 whitespace-nowrap">
                    {item.location}
                  </td>
                  <td className="py-4 px-4 text-stone-700 font-medium whitespace-nowrap">
                    {item.stage}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                        item.riskScore >= 68
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : item.riskScore >= 45
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {item.riskLevel} ({item.riskScore}%)
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span className="text-xs text-stone-600 font-medium bg-stone-100 px-2.5 py-1 rounded-md">
                      {item.status || "Completed"}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(item);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 group-hover:underline"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-stone-100">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenDetail(item)}
              className="p-4 space-y-2 hover:bg-stone-50 active:bg-stone-100 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-700" />
                  <span className="font-bold text-stone-900 text-sm">{item.crop}</span>
                  <span className="text-xs text-stone-500 font-medium">({item.stage})</span>
                </div>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold border ${
                    item.riskScore >= 68
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : item.riskScore >= 45
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {item.riskLevel}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
                <span>{item.date} • {item.location}</span>
                <span className="text-emerald-700 font-semibold">Details →</span>
              </div>
            </div>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <div className="p-8 text-center text-xs text-stone-500">
            No historical crop records found matching your filters.
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900">{selectedRecord.crop} Health Record</h3>
                  <p className="text-xs text-stone-500">Assessment ID: {selectedRecord.id}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                aria-label="Close modal"
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-2xl">
                <div>
                  <span className="text-stone-400 text-xs block">Date Recorded</span>
                  <strong className="text-stone-800">{selectedRecord.date}</strong>
                </div>
                <div>
                  <span className="text-stone-400 text-xs block">Growth Stage</span>
                  <strong className="text-stone-800">{selectedRecord.stage}</strong>
                </div>
                <div>
                  <span className="text-stone-400 text-xs block">Location</span>
                  <strong className="text-stone-800">{selectedRecord.location}</strong>
                </div>
                <div>
                  <span className="text-stone-400 text-xs block">Calculated Risk</span>
                  <strong className="text-stone-800">{selectedRecord.riskLevel} ({selectedRecord.riskScore}/100)</strong>
                </div>
              </div>

              <div>
                <span className="text-xs text-stone-500 block mb-1 font-semibold">Reported Symptoms</span>
                <p className="p-3 bg-stone-50 rounded-xl text-stone-700 text-xs">
                  {selectedRecord.symptoms || "Brown spots, Yellowing leaves on lower canopy"}
                </p>
              </div>

              {selectedRecord.weatherCondition && (
                <div>
                  <span className="text-xs text-stone-500 block mb-1 font-semibold">Weather at Assessment</span>
                  <p className="p-3 bg-stone-50 rounded-xl text-stone-700 text-xs">
                    {selectedRecord.weatherCondition}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleLoadIntoAnalysis(selectedRecord)}
                className="px-4 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-xs"
              >
                <span>Open in Crop Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
