import {
  AQIData,
  CityId,
  CycloneData,
  ForecastPoint,
  Helpline,
  PollutantKey,
  PollutantReading,
  Shelter,
  StationInfo,
  ChecklistPhase,
} from "./types";
import { POLLUTANT_TABLES, subIndex, categoryFromAQI } from "./aqi";

interface CityBaseline {
  station: StationInfo;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
}

export const CITY_BASELINES: Record<CityId, CityBaseline> = {
  delhi: {
    station: { cityId: "delhi", cityName: "Delhi", stationName: "ITO, Central Delhi" },
    pm25: 148,
    pm10: 224,
    no2: 58,
    so2: 14,
    co: 1.9,
    o3: 34,
  },
  bengaluru: {
    station: { cityId: "bengaluru", cityName: "Bengaluru", stationName: "BTM Layout" },
    pm25: 42,
    pm10: 78,
    no2: 26,
    so2: 6,
    co: 0.7,
    o3: 28,
  },
  kolkata: {
    station: { cityId: "kolkata", cityName: "Kolkata", stationName: "Victoria Memorial" },
    pm25: 96,
    pm10: 158,
    no2: 41,
    so2: 16,
    co: 1.2,
    o3: 24,
  },
};

// Deterministic pseudo-random jitter, seeded by a string key + the current
// hour bucket, so readings stay stable within an hour (nice for live demos)
// but still evolve over time instead of looking perfectly static.
function seededJitter(seed: string, magnitude = 0.08): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const hourBucket = Math.floor(Date.now() / (1000 * 60 * 60));
  const x = Math.sin(hash + hourBucket) * 10000;
  const frac = x - Math.floor(x); // 0..1
  return 1 + (frac - 0.5) * 2 * magnitude;
}

const POLLUTANT_META: { key: PollutantKey; label: string; unit: string; safeLimit: number }[] = [
  { key: "pm25", label: "PM2.5", unit: "\u00b5g/m\u00b3", safeLimit: 60 },
  { key: "pm10", label: "PM10", unit: "\u00b5g/m\u00b3", safeLimit: 100 },
  { key: "no2", label: "NO\u2082", unit: "\u00b5g/m\u00b3", safeLimit: 80 },
  { key: "so2", label: "SO\u2082", unit: "\u00b5g/m\u00b3", safeLimit: 80 },
  { key: "co", label: "CO", unit: "mg/m\u00b3", safeLimit: 2 },
  { key: "o3", label: "O\u2083", unit: "\u00b5g/m\u00b3", safeLimit: 100 },
];

export function buildAQIData(cityId: CityId): AQIData {
  const base = CITY_BASELINES[cityId];
  const raw: Record<PollutantKey, number> = {
    pm25: base.pm25 * seededJitter(cityId + "pm25"),
    pm10: base.pm10 * seededJitter(cityId + "pm10"),
    no2: base.no2 * seededJitter(cityId + "no2"),
    so2: base.so2 * seededJitter(cityId + "so2"),
    co: base.co * seededJitter(cityId + "co"),
    o3: base.o3 * seededJitter(cityId + "o3"),
  };

  const subIndices: Record<PollutantKey, number> = {
    pm25: subIndex(raw.pm25, POLLUTANT_TABLES.pm25),
    pm10: subIndex(raw.pm10, POLLUTANT_TABLES.pm10),
    no2: subIndex(raw.no2, POLLUTANT_TABLES.no2),
    so2: subIndex(raw.so2, POLLUTANT_TABLES.so2),
    co: subIndex(raw.co, POLLUTANT_TABLES.co),
    o3: subIndex(raw.o3, POLLUTANT_TABLES.o3),
  };

  const dominantKey = (Object.entries(subIndices) as [PollutantKey, number][]).sort(
    (a, b) => b[1] - a[1]
  )[0][0];
  const aqi = subIndices[dominantKey];
  const category = categoryFromAQI(aqi);

  const pollutants: PollutantReading[] = POLLUTANT_META.map((meta) => ({
    key: meta.key,
    label: meta.label,
    unit: meta.unit,
    safeLimit: meta.safeLimit,
    value: Math.round(raw[meta.key] * 10) / 10,
  }));

  return {
    station: base.station,
    aqi,
    category,
    dominantPollutant: POLLUTANT_META.find((p) => p.key === dominantKey)?.label || dominantKey,
    pollutants,
    lastUpdated: new Date().toISOString(),
    source: "MOCK_FALLBACK",
  };
}

export function buildForecast(cityId: CityId): ForecastPoint[] {
  const current = buildAQIData(cityId).aqi;
  const offsets = [
    { h: 0, label: "Now" },
    { h: 3, label: "+3h" },
    { h: 6, label: "+6h" },
    { h: 12, label: "+12h" },
  ];
  return offsets.map(({ h, label }) => {
    // Diurnal pattern: AQI tends to dip mid-afternoon and rise at night due
    // to traffic patterns and inversion layers. Modeled with a smooth wave
    // plus deterministic jitter so the forecast feels physically motivated.
    const hourOfDay = (new Date().getHours() + h) % 24;
    const diurnalFactor = 1 + 0.18 * Math.cos(((hourOfDay - 15) / 24) * 2 * Math.PI);
    const jitter = seededJitter(cityId + "fc" + h, 0.05);
    const aqi = Math.max(10, Math.round(current * diurnalFactor * jitter));
    return { hoursFromNow: h, label, aqi, category: categoryFromAQI(aqi) };
  });
}

// ---------------- Cyclone Command Center ----------------

const LANDFALL_OFFSET_HOURS = 32;
const SCENARIO_START_LEAD_HOURS = LANDFALL_OFFSET_HOURS + 6;
const LANDFALL_TIME = new Date(Date.now() + LANDFALL_OFFSET_HOURS * 60 * 60 * 1000);

export function getCycloneData(): CycloneData {
  const now = Date.now();
  const msRemaining = LANDFALL_TIME.getTime() - now;
  const hoursRemaining = msRemaining / (1000 * 60 * 60);

  // Distance to coast shrinks steadily as landfall approaches (scenario
  // begins ~380km offshore, 6 hours before the watch phase starts).
  const startDistanceKm = 380;
  const progress = Math.min(1, Math.max(0, 1 - hoursRemaining / SCENARIO_START_LEAD_HOURS));
  const distanceToCoastKm = Math.round(startDistanceKm * (1 - progress));

  let severity: CycloneData["severity"] = "watch";
  if (hoursRemaining <= 6) severity = "evacuation";
  else if (hoursRemaining <= 24) severity = "warning";
  else severity = "watch";
  if (distanceToCoastKm <= 60) severity = "severe";

  return {
    active: true,
    name: "Cyclone Ashani",
    category: "Very Severe Cyclonic Storm",
    severity,
    maxWindKmh: Math.round(165 + 10 * Math.sin(progress * Math.PI)),
    centralPressureHpa: Math.round(962 - 8 * progress),
    stormSurgeM: Math.round((2.5 + 1.5 * progress) * 10) / 10,
    distanceToCoastKm,
    landfallTimeIso: LANDFALL_TIME.toISOString(),
    affectedRegion: "Odisha & West Bengal Coast",
    source: "MOCK_FALLBACK",
  };
}

export function getShelters(): Shelter[] {
  return [
    {
      id: "sh-1",
      name: "Govt. Higher Secondary School, Digha",
      distanceKm: 4.2,
      capacity: 800,
      occupancy: 210,
      contact: "+91-3220-266291",
      address: "Digha, Purba Medinipur, West Bengal",
    },
    {
      id: "sh-2",
      name: "Community Cyclone Shelter, Paradip",
      distanceKm: 7.8,
      capacity: 1200,
      occupancy: 540,
      contact: "+91-6722-222226",
      address: "Paradip Port Area, Jagatsinghpur, Odisha",
    },
    {
      id: "sh-3",
      name: "Multipurpose Cyclone Shelter, Balasore",
      distanceKm: 11.5,
      capacity: 950,
      occupancy: 120,
      contact: "+91-6782-262286",
      address: "Balasore Coastal Belt, Odisha",
    },
    {
      id: "sh-4",
      name: "District Indoor Stadium, Contai",
      distanceKm: 15.1,
      capacity: 1500,
      occupancy: 0,
      contact: "+91-3220-255255",
      address: "Contai, Purba Medinipur, West Bengal",
    },
  ];
}

export const HELPLINES: Helpline[] = [
  { name: "NDRF National Emergency", number: "1078" },
  { name: "State Disaster Management", number: "1070" },
  { name: "Ambulance", number: "108" },
  { name: "Coastal Police", number: "1093" },
];

export const CHECKLIST_PHASES: ChecklistPhase[] = [
  {
    id: "t48",
    title: "T-48h \u2014 Watch Phase",
    window: "48 hours before landfall",
    items: [
      { id: "t48-1", text: "Purify and store at least 4 litres of drinking water per person" },
      { id: "t48-2", text: "Stock 3 days of dry rations (rice, biscuits, dry fruits, salt)" },
      { id: "t48-3", text: "Plan and begin livestock / pet movement to higher ground" },
      { id: "t48-4", text: "Charge torches, radios, and backup batteries" },
      { id: "t48-5", text: "Review family evacuation route and meeting point" },
    ],
  },
  {
    id: "t24",
    title: "T-24h \u2014 Warning Phase",
    window: "24 hours before landfall",
    items: [
      { id: "t24-1", text: "Seal and tape glass windows; install storm shutters if available" },
      { id: "t24-2", text: "Fully charge all phones and power banks" },
      { id: "t24-3", text: "Waterproof important documents (ID, insurance, property papers)" },
      { id: "t24-4", text: "Secure or bring indoors all rooftop and loose outdoor objects" },
      { id: "t24-5", text: "Fill vehicle fuel tanks and keep cash on hand" },
    ],
  },
  {
    id: "t6",
    title: "T-6h \u2014 Evacuation Phase",
    window: "6 hours before landfall",
    items: [
      { id: "t6-1", text: "Evacuate to designated shelter immediately if in a low-lying area" },
      { id: "t6-2", text: "Turn off main LPG cylinder valve and electricity mains breaker" },
      { id: "t6-3", text: "Grab emergency go-bag (medicines, documents, water, torch)" },
      { id: "t6-4", text: "Inform a family member/neighbour of your evacuation destination" },
      { id: "t6-5", text: "Do not attempt to cross flooded roads or bridges" },
    ],
  },
];
