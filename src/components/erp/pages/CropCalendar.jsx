import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Info, Sprout, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import PageTransition from '../ui/PageTransition';
import { crops, MONTHS, ACTIVITY_COLORS } from '../../../data/erp/cropCalendar';

const CURRENT_MONTH = new Date().getMonth(); // 0-indexed
const LEGEND_ITEMS = Object.entries(ACTIVITY_COLORS).map(([key, val]) => ({ key, ...val }));

// Helper to determine active wrapping logic
function getSegmentKey(cropId, activityIndex, suffix) {
  return `${cropId}-${activityIndex}-${suffix}`;
}

export default function CropCalendar() {
  const [activeCrop, setActiveCrop] = useState('all');
  const [expandedActivity, setExpandedActivity] = useState(null);
  const scrollRef = useRef(null);

  // Scroll to current month on mount
  useEffect(() => {
    scrollToMonth(CURRENT_MONTH, true);
  }, []);

  const scrollToMonth = (monthIndex, instant = false) => {
    if (!scrollRef.current) return;
    
    // Each month roughly has a width of 1/12th of the calendar container's scrollWidth
    // Or we can just calculate it based on the exact DOM nodes:
    const monthHeaderNode = scrollRef.current.querySelector(`[data-month="${monthIndex}"]`);
    if (monthHeaderNode) {
      // Find the relative offset within the scrolling container
      const containerRect = scrollRef.current.getBoundingClientRect();
      const nodeRect = monthHeaderNode.getBoundingClientRect();
      
      // Calculate target scrollLeft: current scrollLeft + node's distance from container left bound, minus some padding
      const targetScroll = scrollRef.current.scrollLeft + (nodeRect.left - containerRect.left) - 100;
      
      if (instant) {
        scrollRef.current.scrollLeft = targetScroll;
      } else {
        gsap.to(scrollRef.current, {
          scrollLeft: targetScroll,
          duration: 0.6,
          ease: "power2.out"
        });
      }
    }
  };

  const scrollHorizontally = (direction) => {
    if (!scrollRef.current) return;
    const amount = direction === 'left' ? -300 : 300;
    gsap.to(scrollRef.current, {
      scrollLeft: scrollRef.current.scrollLeft + amount,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const toggleDetail = (key) => {
    setExpandedActivity(prev => prev === key ? null : key);
  };

  return (
    <PageTransition>
      <div className="space-y-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5 bg-panel border border-border p-6 rounded-2xl shadow-sm">
          <div>
            <h1 className="font-display font-bold text-2xl text-dark mb-2">Interactive Crop Tracker</h1>
            <p className="text-secondary text-sm max-w-lg leading-relaxed">
              Plan and monitor seasonal agricultural activities. Click on any specific timeline bar to view dosage recommendations, pesticide choices, and field instructions.
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex flex-col gap-3 min-w-[280px]">
            <label className="text-[11px] font-bold text-muted uppercase tracking-wider">Crop Filter</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCrop('all')}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all border ${
                  activeCrop === 'all' ? 'bg-forest text-gold border-forest shadow-md' : 'bg-surface border-border text-secondary hover:text-dark hover:border-muted'
                }`}
              >
                All Crops
              </button>
              {crops.map(crop => (
                <button
                  key={crop.id}
                  onClick={() => setActiveCrop(activeCrop === crop.id ? 'all' : crop.id)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all border ${
                    activeCrop === crop.id ? 'bg-forest text-gold border-forest shadow-md' : 'bg-surface border-border text-secondary hover:text-dark hover:border-muted'
                  }`}
                >
                  {crop.emoji} {crop.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar Card */}
        <div className="bg-panel border border-border rounded-2xl overflow-hidden flex flex-col shadow-sm">
          
          {/* Calendar Toolbar */}
          <div className="px-5 py-4 border-b border-border bg-surface/50 flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-sm font-semibold text-dark">Timeline view</div>
              <div className="hidden sm:flex items-center gap-3 border-l border-border pl-4">
                {LEGEND_ITEMS.map(item => (
                  <div key={item.key} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: item.bg }} />
                    <span className="text-[11px] text-secondary font-medium tracking-wide">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button onClick={() => scrollToMonth(CURRENT_MONTH)} className="text-xs font-semibold text-forest hover:text-dark transition-colors px-3 py-1.5 bg-forest/5 rounded-lg mr-2">
                Today
              </button>
              <button onClick={() => scrollHorizontally('left')} className="p-1.5 rounded-lg bg-white border border-border text-secondary hover:text-dark hover:border-muted transition-colors shadow-sm">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => scrollHorizontally('right')} className="p-1.5 rounded-lg bg-white border border-border text-secondary hover:text-dark hover:border-muted transition-colors shadow-sm">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Scrolling Grid */}
          <div ref={scrollRef} className="overflow-x-auto overflow-y-hidden custom-scrollbar relative pb-2 min-h-[400px]">
            <div className="min-w-[850px] relative px-4">
              
              {/* Header Row: Months */}
              <div className="grid sticky top-0 bg-panel z-10 border-b border-border" style={{ gridTemplateColumns: 'minmax(120px, 1fr) repeat(12, minmax(70px, 1fr))' }}>
                <div className="py-4 font-semibold text-xs text-muted">Crops</div>
                {MONTHS.map((month, i) => (
                  <div
                    key={month}
                    data-month={i}
                    onClick={() => scrollToMonth(i)}
                    className={`py-4 text-center text-xs font-bold cursor-pointer transition-colors relative group hover:text-forest ${
                      i === CURRENT_MONTH ? 'text-forest' : 'text-muted'
                    }`}
                  >
                    {month}
                    {i === CURRENT_MONTH && (
                      <motion.div layoutId="activeMonth" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[3px] rounded-t bg-forest" />
                    )}
                    {/* Hover indicator for non-current months */}
                    {i !== CURRENT_MONTH && (
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[3px] rounded-t bg-forest opacity-0 group-hover:opacity-30 transition-opacity" />
                    )}
                  </div>
                ))}
              </div>

              {/* Vertical Grid Lines (Background visually behind content) */}
              <div className="absolute inset-0 pt-14 px-4 pointer-events-none grid" style={{ gridTemplateColumns: 'minmax(120px, 1fr) repeat(12, minmax(70px, 1fr))' }}>
                 <div /> {/* Crop name column empty */}
                 {MONTHS.map((_, i) => (
                   <div key={i} className={`border-l border-border/40 h-full ${i === CURRENT_MONTH ? 'bg-forest/[0.03]' : ''}`} />
                 ))}
                 {/* Rightmost bounding border */}
                 <div className="absolute right-4 top-14 bottom-0 border-r border-border/40" />
              </div>

              {/* Main Timeline Data */}
              <div className="divide-y divide-border/60 relative z-0">
                {crops.map(crop => {
                  const isVisible = activeCrop === 'all' || activeCrop === crop.id;
                  if (!isVisible) return null;

                  return (
                    <div key={crop.id} className="py-5">
                      <div className="grid items-start" style={{ gridTemplateColumns: 'minmax(120px, 1fr) repeat(12, minmax(70px, 1fr))' }}>
                        
                        {/* Crop Info Column */}
                        <div className="flex items-center gap-3 pr-4">
                          <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-xl shadow-sm shrink-0">
                            {crop.emoji}
                          </div>
                          <div>
                            <p className="font-bold text-dark text-sm">{crop.name}</p>
                            <span className="text-[10px] font-semibold text-muted bg-surface px-1.5 py-0.5 rounded uppercase tracking-widest mt-1 inline-block">
                              {crop.season}
                            </span>
                          </div>
                        </div>

                        {/* Activities Row */}
                        <div className="col-span-12 grid relative h-10 items-center gap-y-2 group" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
                          {crop.activities.map((activity, i) => {
                            const wrap = activity.endMonth < activity.startMonth;
                            const color = ACTIVITY_COLORS[activity.type];

                            const renderBarSegment = (colStart, colEnd, segmentId, showLabel) => {
                              const isActive = expandedActivity === segmentId;
                              
                              return (
                                <motion.div
                                  key={segmentId}
                                  layoutId={`bar-${segmentId}`}
                                  className="cursor-pointer relative z-10 mx-1"
                                  style={{ gridColumn: `${colStart} / ${colEnd}` }}
                                  onClick={() => toggleDetail(segmentId)}
                                  whileHover={{ scaleY: 1.15, zIndex: 20 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                  <div
                                    className={`h-7 rounded-lg flex items-center px-2.5 overflow-hidden shadow-sm transition-all border ${isActive ? 'ring-2 ring-offset-2' : ''}`}
                                    style={{ 
                                      backgroundColor: color.bg, 
                                      borderColor: color.bg,
                                      '--tw-ring-color': color.bg 
                                    }}
                                  >
                                    {showLabel && (
                                      <span className="text-[10px] font-bold truncate tracking-wide" style={{ color: color.text }}>
                                        {activity.label}
                                      </span>
                                    )}
                                  </div>
                                </motion.div>
                              );
                            };

                            const contents = [];
                            if (wrap) {
                              // Crosses Dec-Jan boundary
                              contents.push(renderBarSegment(activity.startMonth + 1, 14, getSegmentKey(crop.id, i, 'end'), true));
                              contents.push(renderBarSegment(1, activity.endMonth + 2, getSegmentKey(crop.id, i, 'start'), false));
                            } else {
                              contents.push(renderBarSegment(activity.startMonth + 1, activity.endMonth + 2, getSegmentKey(crop.id, i, 'full'), true));
                            }

                            // Detail Card Expansion
                            return (
                              <div key={`activity-wrapper-${i}`} className="contents">
                                {contents}
                                <AnimatePresence>
                                  {(expandedActivity === getSegmentKey(crop.id, i, 'end') || 
                                    expandedActivity === getSegmentKey(crop.id, i, 'start') || 
                                    expandedActivity === getSegmentKey(crop.id, i, 'full')) && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                      transition={{ duration: 0.2 }}
                                      className="absolute z-30 top-10 left-0 right-0 pt-2"
                                      style={{ gridColumn: '1 / -1' }} // Takes full width of the activities row
                                    >
                                      <div
                                        className="p-4 rounded-xl shadow-lg border backdrop-blur-sm"
                                        style={{ backgroundColor: color.bg + 'FA', borderColor: color.bg }}
                                      >
                                        <div className="flex items-start justify-between gap-4">
                                          <div className="flex items-start gap-3">
                                            <div className="p-1.5 rounded-lg bg-white/40 shrink-0 mt-0.5">
                                              <Info size={16} style={{ color: color.text }} />
                                            </div>
                                            <div>
                                              <p className="font-bold text-sm mb-1 line-clamp-1" style={{ color: color.text }}>{activity.label}</p>
                                              <p className="text-xs leading-relaxed max-w-2xl font-medium" style={{ color: color.text + 'E6' }}>{activity.detail}</p>
                                            </div>
                                          </div>
                                          <button 
                                            onClick={(e) => { e.stopPropagation(); setExpandedActivity(null); }}
                                            className="p-1 hover:bg-white/30 rounded-lg transition-colors"
                                            style={{ color: color.text }}
                                          >
                                            <ChevronDown size={18} className="rotate-180" />
                                          </button>
                                        </div>
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
        </div>

        {/* Helper Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-forest/5 border border-forest/20 rounded-xl p-4 flex items-start gap-4 shadow-sm"
        >
          <div className="w-8 h-8 rounded-full bg-forest/10 flex items-center justify-center shrink-0 mt-0.5">
            <Sprout size={16} className="text-forest" />
          </div>
          <div>
            <p className="text-sm font-bold text-dark mb-1">Advanced Ag-Planning</p>
            <p className="text-[13px] text-secondary leading-relaxed">
              Use the month headers to quickly navigate the timeline. Clicking on a crop stage reveals precise agrochemical recommendations and dosage volumes required for optimal growth.
            </p>
          </div>
        </motion.div>

      </div>
    </PageTransition>
  );
}
