import { motion } from 'framer-motion';
import { UserPlus, MapPin, TrendingUp, AlertCircle } from 'lucide-react';

const ICON_MAP = {
  UserPlus: UserPlus,
  MapPin: MapPin,
  TrendingUp: TrendingUp,
  AlertCircle: AlertCircle,
};

const ICON_COLORS = {
  up: { bg: 'bg-[#D1E8DA]', icon: 'text-[#1A3C2B]' },
  warn: { bg: 'bg-[#F5E6C8]', icon: 'text-[#D4A853]' },
};

export default function KPICard({ label, value, iconName, delta, trend }) {
  const Icon = ICON_MAP[iconName] || TrendingUp;
  const isUp = trend === 'up';
  const TrendIcon = isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <div className="bg-secondary p-5 rounded-xl border border-subtle flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-secondary uppercase tracking-wider">{label}</span>
        <div className="w-8 h-8 rounded-lg bg-tertiary flex items-center justify-center text-gold">
          <Icon size={18} />
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-primary">{value}</h3>
        <div className="flex items-center gap-1.5 mt-1">
          <TrendIcon size={14} className={isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} />
          <span className={`text-[12px] font-semibold ${isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {delta}
          </span>
          <span className="text-[11px] text-secondary">from last month</span>
        </div>
      </div>
    </div>
  );
}
