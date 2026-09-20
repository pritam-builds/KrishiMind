// src/components/Sidebar.jsx
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useCrop } from '../context/CropContext';
import {
  LayoutDashboard,
  PlusCircle,
  Activity,
  CloudSun,
  TrendingUp,
  Lightbulb,
  History,
  User,
  Sprout,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ className = "" }) {
  const { profile } = useCrop();

  const navItems = [
    { name: "Dashboard", path: "/farmer", icon: LayoutDashboard },
    { name: "Analyze Crop", path: "/farmer?action=analyze", icon: PlusCircle, highlight: true },
    { name: "Crop Assessment", path: "/crop-analysis", icon: Activity },
    { name: "Weather Intelligence", path: "/weather", icon: CloudSun },
    { name: "Market Intelligence", path: "/market", icon: TrendingUp },
    { name: "Recommendations", path: "/recommendation", icon: Lightbulb },
    { name: "History", path: "/history", icon: History },
    { name: "Farmer Profile", path: "/profile", icon: User },
  ];

  return (
    <aside className={`w-64 bg-white border-r border-stone-200 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none ${className}`}>
      {/* Top Brand */}
      <div>
        <div className="p-6 border-b border-stone-100">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-stone-900 tracking-tight flex items-center gap-1">
                KrishiMind
              </span>
              <p className="text-[11px] font-semibold text-emerald-700 leading-tight">
                AI Farm Decision Support
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    item.highlight
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80 mb-2'
                      : isActive
                      ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-800/20'
                      : 'text-stone-600 hover:bg-stone-100/80 hover:text-stone-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4 h-4 ${isActive && !item.highlight ? 'text-white' : item.highlight ? 'text-emerald-700' : 'text-stone-400'}`} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Summary Card */}
      <div className="p-4 border-t border-stone-100">
        <Link
          to="/profile"
          className="p-3 bg-stone-50 hover:bg-stone-100/80 rounded-2xl border border-stone-200/80 flex items-center gap-3 transition-colors block"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm">
            {profile?.name ? profile.name.charAt(0) : "R"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-stone-900 truncate">
              {profile?.name || "Ramesh Patil"}
            </div>
            <p className="text-[11px] text-stone-500 truncate">
              {profile?.district || "Pune"}, {profile?.state || "Maharashtra"}
            </p>
          </div>
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        </Link>

        <div className="mt-3 px-2 flex items-center justify-between text-[11px] text-stone-400">
          <span>KrishiMind v1.0</span>
          <span>SIH Demo Ready</span>
        </div>
      </div>
    </aside>
  );
}
