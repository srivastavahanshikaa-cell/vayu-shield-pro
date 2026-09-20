import { AQICategory, ForecastPoint, HealthProfile, PollutantKey } from "./types";

type Breakpoint = { cLow: number; cHigh: number; iLow: number; iHigh: number };

// Simplified Indian (CPCB) AQI sub-index breakpoint tables. These mirror the
// official methodology closely enough for demo/education purposes.
const PM25: Breakpoint[] = [
  { cLow: 0, cHigh: 30, iLow: 0, iHigh: 50 },
  { cLow: 31, cHigh: 60, iLow: 51, iHigh: 100 },
  { cLow: 61, cHigh: 90, iLow: 101, iHigh: 200 },
  { cLow: 91, cHigh: 120, iLow: 201, iHigh: 300 },
  { cLow: 121, cHigh: 250, iLow: 301, iHigh: 400 },
  { cLow: 251, cHigh: 500, iLow: 401, iHigh: 500 },
];

const PM10: Breakpoint[] = [
  { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50 },
  { cLow: 51, cHigh: 100, iLow: 51, iHigh: 100 },
  { cLow: 101, cHigh: 250, iLow: 101, iHigh: 200 },
  { cLow: 251, cHigh: 350, iLow: 201, iHigh: 300 },
  { cLow: 351, cHigh: 430, iLow: 301, iHigh: 400 },
  { cLow: 431, cHigh: 600, iLow: 401, iHigh: 500 },
];

const NO2: Breakpoint[] = [
  { cLow: 0, cHigh: 40, iLow: 0, iHigh: 50 },
  { cLow: 41, cHigh: 80, iLow: 51, iHigh: 100 },
  { cLow: 81, cHigh: 180, iLow: 101, iHigh: 200 },
  { cLow: 181, cHigh: 280, iLow: 201, iHigh: 300 },
  { cLow: 281, cHigh: 400, iLow: 301, iHigh: 400 },
  { cLow: 401, cHigh: 500, iLow: 401, iHigh: 500 },
];

const SO2: Breakpoint[] = [
  { cLow: 0, cHigh: 40, iLow: 0, iHigh: 50 },
  { cLow: 41, cHigh: 80, iLow: 51, iHigh: 100 },
  { cLow: 81, cHigh: 380, iLow: 101, iHigh: 200 },
  { cLow: 381, cHigh: 800, iLow: 201, iHigh: 300 },
  { cLow: 801, cHigh: 1600, iLow: 301, iHigh: 400 },
  { cLow: 1601, cHigh: 2100, iLow: 401, iHigh: 500 },
];

const CO: Breakpoint[] = [
  { cLow: 0, cHigh: 1, iLow: 0, iHigh: 50 },
  { cLow: 1.1, cHigh: 2, iLow: 51, iHigh: 100 },
  { cLow: 2.1, cHigh: 10, iLow: 101, iHigh: 200 },
  { cLow: 10.1, cHigh: 17, iLow: 201, iHigh: 300 },
  { cLow: 17.1, cHigh: 34, iLow: 301, iHigh: 400 },
  { cLow: 34.1, cHigh: 50, iLow: 401, iHigh: 500 },
];

const O3: Breakpoint[] = [
  { cLow: 0, cHigh: 50, iLow: 0, iHigh: 50 },
  { cLow: 51, cHigh: 100, iLow: 51, iHigh: 100 },
  { cLow: 101, cHigh: 168, iLow: 101, iHigh: 200 },
  { cLow: 169, cHigh: 208, iLow: 201, iHigh: 300 },
  { cLow: 209, cHigh: 748, iLow: 301, iHigh: 400 },
  { cLow: 749, cHigh: 1000, iLow: 401, iHigh: 500 },
];

export const POLLUTANT_TABLES: Record<PollutantKey, Breakpoint[]> = {
  pm25: PM25,
  pm10: PM10,
  no2: NO2,
  so2: SO2,
  co: CO,
  o3: O3,
};

export function subIndex(value: number, table: Breakpoint[]): number {
  const clamped = Math.max(0, value);
  for (const bp of table) {
    if (clamped >= bp.cLow && clamped <= bp.cHigh) {
      return Math.round(
        ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) * (clamped - bp.cLow) + bp.iLow
      );
    }
  }
  const last = table[table.length - 1];
  return last.iHigh;
}

export function categoryFromAQI(aqi: number): AQICategory {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Satisfactory";
  if (aqi <= 200) return "Moderate";
  if (aqi <= 300) return "Poor";
  if (aqi <= 400) return "Very Poor";
  return "Severe";
}

export function categoryStyles(category: AQICategory) {
  switch (category) {
    case "Good":
      return { bg: "bg-emerald-500/15", text: "text-emerald-400", ring: "ring-emerald-500/40" };
    case "Satisfactory":
      return { bg: "bg-lime-500/15", text: "text-lime-400", ring: "ring-lime-500/40" };
    case "Moderate":
      return { bg: "bg-yellow-500/15", text: "text-yellow-400", ring: "ring-yellow-500/40" };
    case "Poor":
      return { bg: "bg-orange-500/15", text: "text-orange-400", ring: "ring-orange-500/40" };
    case "Very Poor":
      return { bg: "bg-red-500/15", text: "text-red-400", ring: "ring-red-500/40" };
    case "Severe":
      return { bg: "bg-red-900/30", text: "text-red-300", ring: "ring-red-700/60" };
  }
}

export function healthRecommendation(
  profile: HealthProfile,
  category: AQICategory,
  dominantPollutant: string
) {
  const severityRank: Record<AQICategory, number> = {
    Good: 0,
    Satisfactory: 1,
    Moderate: 2,
    Poor: 3,
    "Very Poor": 4,
    Severe: 5,
  };
  const rank = severityRank[category];

  const profileLabels: Record<HealthProfile, string> = {
    general: "General Public",
    asthma: "Asthma / Respiratory Condition",
    elderly: "Elderly (60+)",
    children: "Children (under 12)",
    pregnant: "Pregnant",
  };

  const sensitivity: Record<HealthProfile, number> = {
    general: 0,
    asthma: 2,
    elderly: 1,
    children: 1,
    pregnant: 1,
  };

  const effectiveRank = Math.min(5, rank + sensitivity[profile]);

  const tips: string[] = [];
  let headline = "";
  let maskAdvice = "Not required";
  let outdoorAdvice = "Outdoor activity is generally safe.";

  if (effectiveRank <= 0) {
    headline = "Air is clean — enjoy the outdoors";
    tips.push("Great day for outdoor exercise, walks, or ventilating your home.");
    outdoorAdvice = "No restrictions on outdoor activity.";
  } else if (effectiveRank === 1) {
    headline = "Air quality is acceptable";
    tips.push("Sensitive individuals should watch for minor symptoms like throat irritation.");
    outdoorAdvice = "Outdoor activity is fine; unusually sensitive people should pace themselves.";
  } else if (effectiveRank === 2) {
    headline = "Moderate exposure — take light precautions";
    tips.push(
      "Dominant pollutant is " + dominantPollutant.toUpperCase() + ". Reduce prolonged outdoor exertion."
    );
    tips.push("Keep windows closed during traffic-peak hours.");
    outdoorAdvice = "Limit intense outdoor exercise to under 45 minutes.";
  } else if (effectiveRank === 3) {
    headline = "Poor air — precautions recommended";
    tips.push("Wear an N95 mask outdoors, especially near traffic corridors.");
    tips.push("Avoid outdoor cardio; prefer indoor workouts.");
    maskAdvice = "N95 recommended outdoors";
    outdoorAdvice = "Limit outdoor time to essential trips.";
  } else if (effectiveRank === 4) {
    headline = "Very poor air — minimize exposure";
    tips.push("Stay indoors as much as possible; run an air purifier if available.");
    tips.push("N95/N99 mask mandatory for any outdoor exposure.");
    maskAdvice = "N95/N99 mandatory outdoors";
    outdoorAdvice = "Avoid outdoor activity; essential travel only.";
  } else {
    headline = "Severe air — health emergency conditions";
    tips.push("Remain indoors with windows sealed and purifier running continuously.");
    tips.push("Seek medical attention immediately for breathlessness, chest tightness, or dizziness.");
    maskAdvice = "N99/P100 mandatory; avoid going outside";
    outdoorAdvice = "Do not go outside unless medically necessary.";
  }

  if (profile === "asthma" && effectiveRank >= 2) {
    tips.push("Keep rescue inhaler accessible at all times today.");
  }
  if (profile === "pregnant" && effectiveRank >= 2) {
    tips.push("Avoid areas with heavy vehicular traffic; prioritise rest indoors.");
  }
  if (profile === "children" && effectiveRank >= 2) {
    tips.push("Postpone outdoor school sports/PE sessions today.");
  }
  if (profile === "elderly" && effectiveRank >= 2) {
    tips.push("Monitor for shortness of breath and keep prescribed medication nearby.");
  }

  return {
    profileLabel: profileLabels[profile],
    headline,
    tips,
    maskAdvice,
    outdoorAdvice,
  };
}

export function bestTimeToGoOut(forecast: ForecastPoint[]) {
  if (forecast.length === 0) {
    return { label: "No forecast data available", point: null as ForecastPoint | null };
  }
  const best = forecast.reduce((min, p) => (p.aqi < min.aqi ? p : min), forecast[0]);
  return {
    label:
      best.label +
      " looks best — AQI ~" +
      best.aqi +
      " (" +
      best.category +
      "), minimizing cumulative respiratory exposure.",
    point: best,
  };
}
