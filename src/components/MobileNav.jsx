// src/components/MobileNav.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useI18n } from '../i18n';
import {
  LayoutDashboard,
  PlusCircle,
  CloudSun,
  TrendingUp,
  Lightbulb,
  User
} from 'lucide-react';

export default function MobileNav() {
  const { t } = useI18n();
  const items = [
    { name: "Home", path: "/farmer", icon: LayoutDashboard },
    { name: "Analyze", path: "/farmer?action=analyze", icon: PlusCircle, isPrimary: true },
    { name: "Weather", path: "/weather", icon: CloudSun },
    { name: "Market", path: "/market", icon: TrendingUp },
    { name: "Advisory", path: "/recommendation", icon: Lightbulb },
    { name: "Profile", path: "/profile", icon: User }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1.5 shadow-lg shadow-stone-900/10 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                item.isPrimary
                  ? 'text-emerald-700 font-bold'
                  : isActive
                  ? 'text-emerald-800 font-bold'
                  : 'text-stone-500 hover:text-stone-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1 rounded-xl transition-all ${
                    item.isPrimary
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 font-medium">{t(item.name)}</span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
