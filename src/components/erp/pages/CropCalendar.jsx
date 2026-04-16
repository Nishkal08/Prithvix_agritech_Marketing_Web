import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Info, Sprout } from 'lucide-react';
import PageTransition from '../ui/PageTransition';
import { crops, MONTHS, ACTIVITY_COLORS } from '../../../data/erp/cropCalendar';

const CURRENT_MONTH = new Date().getMonth(); // 0-indexed

const LEGEND_ITEMS = Object.entries(ACTIVITY_COLORS).map(([key, val]) => ({ key, ...val }));

function ActivityBar({ activity, totalMonths = 12 }) {
  const [expanded, setExpanded] = useState(false);
  const wrap = activity.endMonth < activity.startMonth; // wraps year boundary

  // Compute columns (each month = 1 grid column)
  let colStart = activity.startMonth + 1;
  let colEnd   = activity.endMonth + 2;
  const color  = ACTIVITY_COLORS[activity.type];

  if (wrap) {
    // Render two bars — one to Dec, one from Jan
    return (
      <>
        <ActivityBarSegment activity={activity} colStart={colStart} colEnd={13} color={color} expanded={expanded} setExpanded={setExpanded} showLabel />
        <ActivityBarSegment activity={activity} colStart={1} colEnd={colEnd} color={color} expanded={expanded} setExpanded={setExpanded} />
      </>
    );
  }

  return (
    <ActivityBarSegment
      activity={activity}
      colStart={colStart}
      colEnd={colEnd}
      color={color}
      expanded={expanded}
      setExpanded={setExpanded}
      showLabel
    />
  );
}

function ActivityBarSegment({ activity, colStart, colEnd, color, expanded, setExpanded, showLabel }) {
  return (
    <div
      className="relative group cursor-pointer"
      style={{ gridColumn: `${colStart} / ${colEnd}` }}
      onClick={() => setExpanded(e => !e)}
    >
      <div
        className="h-7 rounded-full flex items-center px-2 overflow-hidden transition-all hover:opacity-90 hover:scale-y-105"
        style={{ backgroundColor: color.bg }}
      >
        {showLabel && (
          <span className="text-[10px] font-semibold truncate whitespace-nowrap" style={{ color: color.text }}>
            {activity.label}
          </span>
        )}
      </div>
    </div>
  );
}

function CropRow({ crop, activeCrop }) {
  const [expandedActivity, setExpandedActivity] = useState(null);
  const isActive = activeCrop === 'all' || activeCrop === crop.id;

  if (!isActive) return null;

  return (
    <div className="mb-3">
      {/* Crop Label */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{crop.emoji}</span>
        <div>
          <p className="text-sm font-semibold text-dark">{crop.name}</p>
          <p className="text-[10px] text-muted uppercase tracking-wide">{crop.season}</p>
        </div>
      </div>

      {/* Month Grid */}
      <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
        {crop.activities.map((activity, i) => {
          const wrap = activity.endMonth < activity.startMonth;
          const color = ACTIVITY_COLORS[activity.type];

          // For wrapped activities, render two segments
          if (wrap) {
            return (
              <div key={i} className="contents">
                {/* First segment: startMonth → Dec */}
                <div
                  className="relative cursor-pointer group"
                  style={{ gridColumn: `${activity.startMonth + 1} / 13` }}
                  onClick={() => setExpandedActivity(expandedActivity === `${i}a` ? null : `${i}a`)}
                >
                  <div className="h-7 rounded-l-full rounded-r-sm flex items-center px-2 overflow-hidden hover:opacity-90 transition-all"
                    style={{ backgroundColor: color.bg }}>
                    <span className="text-[10px] font-semibold truncate" style={{ color: color.text }}>{activity.label}</span>
                  </div>
                </div>
                {/* Second segment: Jan → endMonth */}
                <div
                  className="relative cursor-pointer group"
                  style={{ gridColumn: `1 / ${activity.endMonth + 2}` }}
                  onClick={() => setExpandedActivity(expandedActivity === `${i}b` ? null : `${i}b`)}
                >
                  <div className="h-7 rounded-l-sm rounded-r-full flex items-center px-2 overflow-hidden hover:opacity-90 transition-all"
                    style={{ backgroundColor: color.bg }}>
                  </div>
                </div>

                {/* Detail Card */}
                <AnimatePresence>
                  {(expandedActivity === `${i}a` || expandedActivity === `${i}b`) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ gridColumn: '1 / -1' }}
                      className="overflow-hidden"
                    >
                      <DetailCard activity={activity} color={color} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          }

          return (
            <div key={i} className="contents">
              <div
                className="relative cursor-pointer"
                style={{ gridColumn: `${activity.startMonth + 1} / ${activity.endMonth + 2}` }}
                onClick={() => setExpandedActivity(expandedActivity === i ? null : i)}
              >
                <div className="h-7 rounded-full flex items-center px-2 overflow-hidden hover:opacity-90 transition-all"
                  style={{ backgroundColor: color.bg }}>
                  <span className="text-[10px] font-semibold truncate" style={{ color: color.text }}>{activity.label}</span>
                </div>
              </div>

              {/* Detail Card */}
              <AnimatePresence>
                {expandedActivity === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ gridColumn: '1 / -1' }}
                    className="overflow-hidden"
                  >
                    <DetailCard activity={activity} color={color} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DetailCard({ activity, color }) {
  return (
    <div
      className="mt-1 mb-2 p-3 rounded-xl text-sm border"
      style={{ backgroundColor: color.bg + '22', borderColor: color.bg + '44' }}
    >
      <div className="flex items-start gap-2">
        <Info size={14} className="mt-0.5 shrink-0" style={{ color: color.bg }} />
        <div>
          <p className="font-semibold text-dark text-xs mb-0.5">{activity.label}</p>
          <p className="text-muted text-xs leading-relaxed">{activity.detail}</p>
        </div>
      </div>
    </div>
  );
}

export default function CropCalendar() {
  const [activeCrop, setActiveCrop] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const scrollRef = useRef(null);

  return (
    <PageTransition>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-dark">Crop Calendar</h1>
            <p className="text-muted text-sm mt-1">
              Interactive timeline of crop activities — click any bar to see product & dosage details.
            </p>
          </div>
          {/* Crop Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCrop('all')}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors border ${
                activeCrop === 'all' ? 'bg-forest text-gold border-forest' : 'bg-panel border-border text-muted hover:text-dark'
              }`}
            >
              All Crops
            </button>
            {crops.map(crop => (
              <button
                key={crop.id}
                onClick={() => setActiveCrop(activeCrop === crop.id ? 'all' : crop.id)}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors border ${
                  activeCrop === crop.id ? 'bg-forest text-gold border-forest' : 'bg-panel border-border text-muted hover:text-dark'
                }`}
              >
                {crop.emoji} {crop.name}
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 bg-panel border border-border rounded-xl px-4 py-3">
          {LEGEND_ITEMS.map(item => (
            <div key={item.key} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.bg }} />
              <span className="text-[11px] text-muted font-medium">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="bg-panel border border-border rounded-xl overflow-hidden">
          {/* Month Header */}
          <div className="border-b border-border overflow-x-auto">
            <div className="grid min-w-[700px]" style={{ gridTemplateColumns: '1fr repeat(12, 1fr)' }}>
              <div className="px-4 py-3 text-[11px] font-semibold text-muted uppercase tracking-wide">Crop</div>
              {MONTHS.map((month, i) => (
                <div
                  key={month}
                  className={`py-3 text-center text-[11px] font-semibold ${
                    i === CURRENT_MONTH 
                      ? 'text-gold bg-gold/10' 
                      : 'text-muted'
                  }`}
                >
                  {month}
                  {i === CURRENT_MONTH && (
                    <div className="mt-0.5 mx-auto w-1 h-1 rounded-full bg-gold" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Crop Rows */}
          <div className="overflow-x-auto">
            <div className="min-w-[700px] divide-y divide-border">
              {crops.map(crop => {
                const isVisible = activeCrop === 'all' || activeCrop === crop.id;
                if (!isVisible) return null;

                return (
                  <div key={crop.id} className="px-4 py-3">
                    {/* Crop header */}
                    <div className="grid items-start gap-2" style={{ gridTemplateColumns: '1fr 12fr' }}>
                      <div className="flex flex-col justify-center">
                        <span className="text-lg leading-none">{crop.emoji}</span>
                        <span className="text-[10px] text-muted mt-1 font-medium truncate">{crop.name}</span>
                        <span className="text-[9px] text-muted/60 uppercase tracking-wide">{crop.season}</span>
                      </div>

                      {/* Activities */}
                      <div className="grid gap-1.5 relative" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
                        {/* Current month highlight column */}
                        <div
                          className="absolute top-0 bottom-0 bg-gold/5 rounded pointer-events-none"
                          style={{ left: `${(CURRENT_MONTH / 12) * 100}%`, width: `${(1 / 12) * 100}%` }}
                        />

                        {crop.activities.map((activity, i) => {
                          const [detail, setDetail] = useState(false);
                          const wrap = activity.endMonth < activity.startMonth;
                          const color = ACTIVITY_COLORS[activity.type];

                          const renderBar = (colStart, colEnd, showLabel = true) => (
                            <div
                              key={`${i}-${colStart}`}
                              className="cursor-pointer"
                              style={{ gridColumn: `${colStart} / ${colEnd}` }}
                              onClick={() => setDetail(d => !d)}
                            >
                              <div
                                className="h-6 rounded-full flex items-center px-2 overflow-hidden transition-opacity hover:opacity-80"
                                style={{ backgroundColor: color.bg }}
                              >
                                {showLabel && (
                                  <span className="text-[9px] font-semibold truncate leading-tight" style={{ color: color.text }}>
                                    {activity.label}
                                  </span>
                                )}
                              </div>
                            </div>
                          );

                          return (
                            <div key={i} className="contents">
                              {wrap ? (
                                <>
                                  {renderBar(activity.startMonth + 1, 13, true)}
                                  {renderBar(1, activity.endMonth + 2, false)}
                                </>
                              ) : (
                                renderBar(activity.startMonth + 1, activity.endMonth + 2, true)
                              )}

                              <AnimatePresence>
                                {detail && (
                                  <motion.div
                                    key="detail"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ gridColumn: '1 / -1' }}
                                    className="overflow-hidden"
                                  >
                                    <div
                                      className="mt-1 p-2.5 rounded-lg text-xs border"
                                      style={{ backgroundColor: color.bg + '18', borderColor: color.bg + '40' }}
                                    >
                                      <span className="font-semibold" style={{ color: color.bg }}>{activity.label}: </span>
                                      <span className="text-muted">{activity.detail}</span>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Tips */}
        <div className="bg-forest/5 border border-forest/20 rounded-xl p-4 flex items-start gap-3">
          <Sprout size={18} className="text-gold mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-dark">Pro Tip</p>
            <p className="text-xs text-muted mt-0.5">
              Click any activity bar to see the recommended product, dosage, and timing details. 
              Highlighted column <span className="text-gold font-semibold">→</span> indicates the current month. 
              Use crop filters above to focus on specific crops for your farmers.
            </p>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
