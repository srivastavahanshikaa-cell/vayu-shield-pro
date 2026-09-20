export type CityId = "delhi" | "bengaluru" | "kolkata";

export interface StationInfo {
  cityId: CityId;
  cityName: string;
  stationName: string;
}

export type PollutantKey = "pm25" | "pm10" | "no2" | "so2" | "co" | "o3";

export interface PollutantReading {
  key: PollutantKey;
  label: string;
  value: number;
  unit: string;
  safeLimit: number;
}

export type AQICategory =
  | "Good"
  | "Satisfactory"
  | "Moderate"
  | "Poor"
  | "Very Poor"
  | "Severe";

export interface AQIData {
  station: StationInfo;
  aqi: number;
  category: AQICategory;
  dominantPollutant: string;
  pollutants: PollutantReading[];
  lastUpdated: string;
  source: "CPCB_LIVE" | "MOCK_FALLBACK";
}

export interface ForecastPoint {
  hoursFromNow: number;
  label: string;
  aqi: number;
  category: AQICategory;
}

export type HealthProfile =
  | "general"
  | "asthma"
  | "elderly"
  | "children"
  | "pregnant";

export interface HealthRecommendation {
  profileLabel: string;
  headline: string;
  tips: string[];
  maskAdvice: string;
  outdoorAdvice: string;
}

export type CycloneSeverity = "watch" | "warning" | "evacuation" | "severe";

export interface CycloneData {
  active: boolean;
  name: string;
  category: string;
  severity: CycloneSeverity;
  maxWindKmh: number;
  centralPressureHpa: number;
  stormSurgeM: number;
  distanceToCoastKm: number;
  landfallTimeIso: string;
  affectedRegion: string;
  source: "IMD_LIVE" | "MOCK_FALLBACK";
}

export interface Shelter {
  id: string;
  name: string;
  distanceKm: number;
  capacity: number;
  occupancy: number;
  contact: string;
  address: string;
}

export interface Helpline {
  name: string;
  number: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
}

export interface ChecklistPhase {
  id: "t48" | "t24" | "t6";
  title: string;
  window: string;
  items: ChecklistItem[];
}
