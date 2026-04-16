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
  const colors = ICON_COLORS[trend] || ICON_COLORS.up;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-[#E8E3DA] rounded-xl p-5"
    >
      <div className="flex items-start justify-between mb-4">
        <p className="text-[13px] text-secondary font-medium">{label}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors.bg}`}>
          <Icon size={18} className={colors.icon} />
        </div>
      </div>
      <p className="font-display font-bold text-[28px] text-dark leading-none mb-2">{value}</p>
      <div className="flex items-center gap-1">
        <span className={`text-[12px] font-medium ${trend === 'warn' ? 'text-[#D4A853]' : 'text-[#2D9E5A]'}`}>
          {trend === 'up' ? '↑' : '⚠'} {delta}
        </span>
      </div>
    </motion.div>
  );
}
