// src/pages/Market.jsx
import React, { useEffect, useState } from 'react';
import { getMarketSnapshot } from '../services/api';
import { mockMarketData } from '../data/mockData';
import ChartCard from '../components/ChartCard';
import {
  TrendingUp,
  ArrowUpRight,
  Store,
  MapPin,
  Calendar,
  Layers,
  Info,
  ShieldCheck,
  CheckCircle2,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Area,
  AreaChart
} from 'recharts';

export default function Market() {
  const [selectedCrop, setSelectedCrop] = useState("Tomato");
  const [selectedMandi, setSelectedMandi] = useState("Pune");
  const [market, setMarket] = useState(() => ({
    ...mockMarketData,
    location: "Pune",
    market: "Pune Sample Mandi",
    minPrice: 2400,
    maxPrice: 3200,
    arrivalsToday: 1450,
    source: "KrishiMind local sample fallback; no live mandi API is connected.",
    is_sample_data: true,
    timestamp: new Date().toISOString()
  }));
  const [marketError, setMarketError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    async function loadMarket() {
      setIsLoading(true);
      try {
        const response = await getMarketSnapshot(selectedCrop, selectedMandi);
        if (isActive) {
          setMarket(response.data);
          setMarketError(null);
        }
      } catch (error) {
        console.error("Error loading market data", error);
        if (isActive) {
          setMarket({
            ...mockMarketData,
            crop: selectedCrop,
            location: selectedMandi,
            market: `${selectedMandi} Sample Mandi`,
            marketLocation: `${selectedMandi} Sample Mandi`,
            minPrice: 2400,
            maxPrice: 3200,
            arrivalsToday: 1450,
            source: "KrishiMind local sample fallback; market API unavailable.",
            is_sample_data: true,
            timestamp: new Date().toISOString()
          });
          setMarketError("Market API is unavailable. Showing local sample/fallback data.");
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    loadMarket();
    return () => {
      isActive = false;
    };
  }, [selectedCrop, selectedMandi]);

  const priceTrendData = market?.priceTrendHistory || [
    { date: "06 Sep", price: 2350, arrivals: 1800 },
    { date: "08 Sep", price: 2420, arrivals: 1750 },
    { date: "10 Sep", price: 2480, arrivals: 1650 },
    { date: "12 Sep", price: 2550, arrivals: 1600 },
    { date: "14 Sep", price: 2620, arrivals: 1520 },
    { date: "16 Sep", price: 2710, arrivals: 1480 },
    { date: "18 Sep", price: 2850, arrivals: 1450 }
  ];

  const recentPrices = market?.recentPricesTable || [
    { date: "19 Sep 2026", market: "Pune Market Yard", variety: "Hybrid Red", price: 2850, arrivals: "1,450 Qtl", trend: "+3.2%" },
    { date: "18 Sep 2026", market: "Pune Market Yard", variety: "Hybrid Red", price: 2780, arrivals: "1,510 Qtl", trend: "+2.5%" },
    { date: "17 Sep 2026", market: "Khed APMC", variety: "Desi / Local", price: 2690, arrivals: "820 Qtl", trend: "+1.8%" },
    { date: "16 Sep 2026", market: "Narayangaon APMC", variety: "Hybrid Grade-A", price: 2750, arrivals: "2,100 Qtl", trend: "+4.1%" },
    { date: "15 Sep 2026", market: "Manchar Sub-Market", variety: "Hybrid Red", price: 2640, arrivals: "950 Qtl", trend: "-0.8%" }
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold mb-2">
              <Store className="w-3.5 h-3.5 text-emerald-700" />
              <span>APMC Market Intelligence</span>
            </div>
            <div className="inline-flex items-center px-2.5 py-1 ml-2 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-[11px] font-bold">
              {market?.is_sample_data ? "Sample/Fallback Data" : "Market Data"}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Market Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 flex items-center gap-1.5">
              <span>Selected Crop: <strong className="text-stone-800">{market?.crop || selectedCrop}</strong></span>
              <span className="text-stone-300">•</span>
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mandi Location: <strong className="text-stone-800">{market?.marketLocation || market?.market || market?.location || selectedMandi}</strong></span>
            </p>
          </div>

          {/* Current Average Price Box */}
          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 text-left sm:text-right self-start sm:self-auto">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wide">
              Current Average Market Price
            </span>
            <div className="text-3xl font-extrabold text-stone-900 mt-0.5">
              ₹{(market?.currentPrice ?? market?.current_price ?? 0).toLocaleString()} <span className="text-sm font-semibold text-stone-600">/ quintal</span>
            </div>
            <div className="mt-1 text-xs text-stone-600">
              Range: ₹{(market?.minPrice ?? market?.min_price ?? 0).toLocaleString()}–₹{(market?.maxPrice ?? market?.max_price ?? 0).toLocaleString()} / quintal
            </div>
          </div>
        </div>

        {/* Market Trend Badge Row */}
        <div className="mt-6 pt-5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs">
              <TrendingUp className="w-4 h-4 text-emerald-700" />
              <span>Arrivals: {Number(market?.arrivalsToday ?? market?.arrivals ?? 0).toLocaleString()} quintals</span>
            </div>
            <span className="text-xs text-stone-500 hidden sm:inline">
              Illustrative sample figures; not live mandi prices
            </span>
          </div>

          <div className="text-xs text-stone-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-stone-400" />
            <span>
              {isLoading
                ? "Loading market data…"
                : `Timestamp: ${market?.timestamp ? new Date(market.timestamp).toLocaleString() : "Unavailable"}`}
            </span>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-stone-500">
          Source: {market?.source || "Sample/fallback data; no live mandi API is connected."}
        </p>
        {marketError && (
          <p role="status" className="mt-2 text-xs font-medium text-amber-800">
            {marketError}
          </p>
        )}
      </div>

      {/* 14-Day Price Line Chart */}
      <ChartCard
        title="Tomato Price Movement (Last 14 Days)"
        subtitle="Pune APMC wholesale modal price in ₹ per quintal"
        badgeText="Trending Upward"
        badgeColor="bg-emerald-100 text-emerald-800 border border-emerald-200"
      >
        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceTrendData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis domain={[2000, 3100]} tick={{ fontSize: 12, fill: '#64748b' }} unit="₹" />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                formatter={(val) => [`₹${val} / Qtl`, 'Wholesale Price']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#16a34a"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#priceGradient)"
                name="Price (₹/Qtl)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* Neutral Decision Support Card */}
      <div className="bg-stone-100/90 rounded-3xl p-6 sm:p-7 border border-stone-300/70">
        <div className="flex items-center gap-2 pb-2 mb-3 border-b border-stone-200">
          <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
            💡
          </div>
          <h3 className="text-base font-bold text-stone-900">
            Market Observation
          </h3>
        </div>

        <p className="text-sm text-stone-800 leading-relaxed font-medium">
          "{market?.marketObservation ||
            "Prices have increased over the selected period (+8.8%). Lower arrivals from surrounding producing clusters and consistent consumption demand are supporting current rates. Consider monitoring local market prices, transit costs, and crop readiness before deciding when to sell."
          }"
        </p>

        <div className="mt-4 p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <p>
            <strong>Agricultural Market Advisory:</strong> KrishiMind provides neutral decision support and market trends. We do NOT provide absolute financial mandates or tell farmers "SELL NOW". Harvest and sales decisions depend on fruit maturity, perishability, local transport access, and weather forecast during picking.
          </p>
        </div>
      </div>

      {/* Recent Market Prices Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-stone-100">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900">
              Recent Market Prices & Daily Arrivals
            </h3>
            <p className="text-xs text-stone-500">
              Comparative data across major APMC mandis in Pune region
            </p>
          </div>

          <div className="text-xs text-stone-500">
            Sorted by most recent trading date
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Market / Mandi</th>
                <th className="py-3 px-3">Variety</th>
                <th className="py-3 px-3 text-right">Modal Price</th>
                <th className="py-3 px-3 text-right">Daily Arrivals</th>
                <th className="py-3 px-3 text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentPrices.map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-3 font-medium text-stone-800 whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="py-3.5 px-3 font-bold text-stone-900 whitespace-nowrap">
                    {row.market}
                  </td>
                  <td className="py-3.5 px-3 text-stone-600">
                    {row.variety}
                  </td>
                  <td className="py-3.5 px-3 text-right font-extrabold text-stone-900 whitespace-nowrap">
                    ₹{typeof row.price === 'number' ? row.price.toLocaleString() : row.price} <span className="text-[11px] font-normal text-stone-500">/ Qtl</span>
                  </td>
                  <td className="py-3.5 px-3 text-right text-stone-600 font-medium whitespace-nowrap">
                    {row.arrivals}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                      row.trend?.startsWith('+')
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-stone-100 text-stone-600'
                    }`}>
                      {row.trend}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
