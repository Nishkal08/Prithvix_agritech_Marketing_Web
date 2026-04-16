/**
 * Crop Calendar data for Indian Kharif and Rabi seasons.
 * activityType: 'sow' | 'fertilize' | 'irrigate' | 'pesticide' | 'harvest'
 */

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const ACTIVITY_COLORS = {
  sow:       { bg: '#1A3C2B', text: '#D4A853', label: 'Sowing' },
  fertilize: { bg: '#B8860B', text: '#FFF8E7', label: 'Fertilizer' },
  irrigate:  { bg: '#1565C0', text: '#E3F2FD', label: 'Irrigation' },
  pesticide: { bg: '#AD1457', text: '#FCE4EC', label: 'Pesticide' },
  harvest:   { bg: '#E65100', text: '#FFF3E0', label: 'Harvest' },
};

export const crops = [
  {
    id: 'wheat',
    name: 'Wheat',
    emoji: '🌾',
    season: 'Rabi',
    activities: [
      { type: 'sow',       startMonth: 10, endMonth: 11, label: 'Sowing',                    detail: 'Use certified HD-2967 or GW-322 seed. 100–125 kg/ha. Optimal soil temp: 20–22°C.' },
      { type: 'irrigate',  startMonth: 11, endMonth: 0,  label: '1st Irrigation (CRI)',      detail: 'Crown Root Initiation stage. Critical — do not skip. 6–7 cm depth.' },
      { type: 'fertilize', startMonth: 11, endMonth: 1,  label: 'NPK Top Dress',             detail: 'Apply Urea 60 kg/ha at CRI + tillering. DAP 50 kg/ha at sowing.' },
      { type: 'pesticide', startMonth: 1,  endMonth: 2,  label: 'Yellow Rust Control',       detail: 'Propiconazole 25% EC @ 1 ml/L. Apply at first sign of yellowing on flag leaf.' },
      { type: 'harvest',   startMonth: 2,  endMonth: 3,  label: 'Harvest',                   detail: 'Grain moisture 14–16%. Use combine harvester. Average yield: 45–55 q/ha.' },
    ],
  },
  {
    id: 'rice',
    name: 'Paddy',
    emoji: '🌿',
    season: 'Kharif',
    activities: [
      { type: 'sow',       startMonth: 5,  endMonth: 6,  label: 'Nursery Raising',           detail: 'Sow 20–25 kg seed/ha in nursery beds. Transplant at 20–25 days after sowing.' },
      { type: 'sow',       startMonth: 6,  endMonth: 7,  label: 'Transplanting',             detail: 'Transplant 2–3 seedlings/hill at 20×15 cm spacing. Ensure standing water 2–3 cm.' },
      { type: 'fertilize', startMonth: 6,  endMonth: 8,  label: 'Nitrogen Split',            detail: 'DAP 75 kg/ha at transplant. Urea 50 kg/ha at active tillering. MOP 40 kg/ha.' },
      { type: 'pesticide', startMonth: 7,  endMonth: 9,  label: 'BLB / Blast Control',      detail: 'For Blast: Carbendazim 50% WP @ 1 g/L. For BLB: Copper Oxychloride @ 3 g/L.' },
      { type: 'harvest',   startMonth: 9,  endMonth: 10, label: 'Harvest',                   detail: 'Harvest at 80% grain ripening. Dry to 14% moisture. Average yield: 50–60 q/ha.' },
    ],
  },
  {
    id: 'soybean',
    name: 'Soybean',
    emoji: '🫘',
    season: 'Kharif',
    activities: [
      { type: 'sow',       startMonth: 5,  endMonth: 6,  label: 'Sowing',                    detail: 'Treat seed with Rhizobium culture. 70–80 kg/ha. Row spacing: 45 cm.' },
      { type: 'fertilize', startMonth: 5,  endMonth: 6,  label: 'Basal Fertilizer',          detail: 'DAP 100 kg/ha + MOP 50 kg/ha at sowing. No urea needed — fixes its own N.' },
      { type: 'pesticide', startMonth: 7,  endMonth: 8,  label: 'Pod Borer/Girdle Beetle',  detail: 'Indoxacarb 15.8% SC @ 0.5 ml/L. Apply at pod formation stage.' },
      { type: 'harvest',   startMonth: 8,  endMonth: 10, label: 'Harvest',                   detail: 'Harvest when 95% pods turn brown. Moisture: 13–14%. Yield: 20–25 q/ha.' },
    ],
  },
  {
    id: 'cotton',
    name: 'Cotton',
    emoji: '🪴',
    season: 'Kharif',
    activities: [
      { type: 'sow',       startMonth: 4,  endMonth: 5,  label: 'Sowing',                    detail: 'Approved Bt hybrid seeds. Spacing: 90 × 60 cm. Seed rate: 1 kg/ha.' },
      { type: 'fertilize', startMonth: 5,  endMonth: 8,  label: 'Nutrition Program',         detail: '19:19:19 at vegetative stage. Enhance K at boll development. Foliar boron @ 0.1%.' },
      { type: 'pesticide', startMonth: 6,  endMonth: 9,  label: 'Pink Bollworm Control',     detail: 'Emamectin Benzoate 1.9% EC @ 0.4 ml/L. Pheromone traps at 5/ha.' },
      { type: 'harvest',   startMonth: 9,  endMonth: 11, label: 'Harvest (Multi-picking)',   detail: 'Pick when bolls are fully open. 3–4 pickings typically. Average: 20–25 q/ha.' },
    ],
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    emoji: '🎋',
    season: 'Annual',
    activities: [
      { type: 'sow',       startMonth: 9,  endMonth: 10, label: 'Planting (Adsali)',         detail: 'Two-budded setts. Row spacing: 90 cm. Treat with Carbendazim @ 1 g/L before planting.' },
      { type: 'fertilize', startMonth: 10, endMonth: 4,  label: 'N-P-K Program',             detail: '250 kg N, 85 kg P, 115 kg K per ha annually. Split N application in 4–5 doses.' },
      { type: 'irrigate',  startMonth: 10, endMonth: 7,  label: 'Regular Irrigation',        detail: 'Drip irrigation preferred. 1750 mm/season. Critical at Grand Growth period (Mar–Jul).' },
      { type: 'pesticide', startMonth: 0,  endMonth: 3,  label: 'Early Shoot Borer',         detail: 'Chlorpyrifos 20% EC @ 2.5 ml/L in soil drench at 30, 60, 90 DAS.' },
      { type: 'harvest',   startMonth: 10, endMonth: 2,  label: 'Harvest',                   detail: 'Brix > 18%. Harvest with mechanical cutter. Average yield: 80–100 t/ha.' },
    ],
  },
  {
    id: 'mung',
    name: 'Moong',
    emoji: '🌱',
    season: 'Rabi / Zaid',
    activities: [
      { type: 'sow',       startMonth: 1,  endMonth: 2,  label: 'Sowing',                    detail: 'K-851 or ML-818 varieties. 20–25 kg/ha. Rhizobium seed treatment recommended.' },
      { type: 'fertilize', startMonth: 1,  endMonth: 2,  label: 'Basal Application',         detail: 'DAP 50 kg/ha + Zinc Sulphate 25 kg/ha at sowing. No top dressing needed.' },
      { type: 'pesticide', startMonth: 2,  endMonth: 3,  label: 'Yellow Mosaic Virus',       detail: 'Control whitefly vector with Imidacloprid 17.8 SL @ 0.3 ml/L. Remove infected plants.' },
      { type: 'harvest',   startMonth: 3,  endMonth: 4,  label: 'Harvest',                   detail: '75–80% pods mature. Pick in 2–3 rounds. Dry to 12% moisture. Yield: 8–12 q/ha.' },
    ],
  },
];
