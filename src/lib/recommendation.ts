// src/lib/recommendation.ts
export type Severity = "Info" | "Advisory" | "Urgent" | "Immediate";

export interface Recommendation {
  title: string;
  severity: Severity;
  precautions: string[];
  technicalReasons: string[];
  recommendedActions: string[];
  confidence: number; // 0-100
  channels: ("SMS" | "Push" | "Siren" | "Email" | "Onsite")[];
  timestamp: string;
}

interface SensorData {
  id: string;
  type: "temperature" | "humidity" | "rainfall" | "wind" | "pore_pressure" | "displacement";
  value: number;
  unit: string;
  status: "online" | "offline" | "warning";
  lastUpdate: string;
  coordinates: { lat: number; lng: number };
}

interface ZoneData {
  id: string;
  coordinateId: string;
  risk: "Low" | "Medium" | "High" | "Critical";
  riskLevel: number; // 0-100
  riskColor: string;
  status: "Active" | "Restricted" | "Monitoring" | "Maintenance";
  lastUpdated: string;
  sensors: SensorData[];
  coordinates: { lat: number; lng: number; coordinateId?: string };
  bounds: [[number, number], [number, number]];
  trend24h: { t: string; v: number }[]; // for charts
}

// thresholds you can tune
const SENSOR_THRESHOLDS: Record<string, number> = {
  temperature: 45, // degC (example)
  humidity: 85, // %
  gas: 300, // ppm (example)
  pressure: 1015, // hPa (warning >)
  vibration: 15, // Hz (example)
};

export function sensorAnomalyScore(s: SensorData) {
  const t = s.type;
  const val = s.value;
  const thr = SENSOR_THRESHOLDS[t] ?? Number.POSITIVE_INFINITY;
  if (s.status === "offline") return 20;
  if (s.status === "warning") return 40;
  if (val >= thr) {
    // magnitude proportion (capped)
    return Math.min(60, Math.round(((val - thr) / Math.max(1, thr)) * 60 + 20));
  }
  return 0;
}

function primaryCauseFromSensors(sensors: SensorData[]) {
  // rank by anomaly score
  const scored = sensors.map((s) => ({ s, score: sensorAnomalyScore(s) }));
  scored.sort((a, b) => b.score - a.score);
  const top = scored[0];
  if (!top || top.score === 0) return { cause: "General instability", evidence: [] as string[] };

  const s = top.s;
  let cause = "";
  if (s.type === "pore_pressure") cause = "Elevated pore/ground pressure";
  else if (s.type === "displacement") cause = "Increased ground/rock vibration";
  else if (s.type === "humidity") cause = "High soil moisture";
  else if (s.type === "temperature") cause = "Temperature-driven freeze/thaw effects";
  const evidence = scored
    .slice(0, 3)
    .map((x) => `${x.s.type}=${x.s.value}${x.s.unit} (${x.s.status})`);
  return { cause, evidence };
}

export function generateRecommendation(zone: ZoneData): Recommendation {
  const sensors = zone.sensors || [];
  const zoneRisk = zone.riskLevel ?? 0;

  // base severity from risk band
  let severity: Severity = "Info";
  if (zoneRisk > 90) severity = "Immediate";
  else if (zoneRisk > 60) severity = "Urgent";
  else if (zoneRisk > 30) severity = "Advisory";

  // primary cause
  const { cause, evidence } = primaryCauseFromSensors(sensors);

  // compute confidence: weighted sum
  const riskScore = zoneRisk; // 0..100 (weight 0.5)
  const sensorScores = sensors.reduce((acc, s) => acc + sensorAnomalyScore(s), 0); // 0..N*100
  const sensorScoreNormalized = sensors.length ? Math.min(100, Math.round((sensorScores / (sensors.length * 100)) * 100)) : 0;
  const confidence = Math.round(riskScore * 0.5 + sensorScoreNormalized * 0.35 + (severity === "Immediate" ? 15 : 0));
  const conf = Math.min(100, confidence);

  // default channels
  const channels: Recommendation["channels"] =
    severity === "Immediate"
      ? ["SMS", "Push", "Siren", "Onsite"]
      : severity === "Urgent"
      ? ["SMS", "Push", "Email"]
      : ["Push", "Email"];

  // build text bullets
  const precautions: string[] = [];
  const recommendedActions: string[] = [];
  if (severity === "Immediate") {
    precautions.push("Evacuate to nearest assembly area immediately.");
    precautions.push("Avoid all slope-facing areas and do not drive on affected roads.");
    recommendedActions.push("Trigger mass-alert (SMS, push, siren).");
    recommendedActions.push("Close nearby roads and start field inspection teams.");
  } else if (severity === "Urgent") {
    precautions.push("Prepare for possible evacuation if conditions worsen.");
    precautions.push("Avoid entering steep/loose slopes.");
    recommendedActions.push("Alert local emergency teams and schedule urgent site inspection.");
    recommendedActions.push("Increase monitoring frequency to 15 mins.");
  } else if (severity === "Advisory") {
    precautions.push("Avoid hiking or unnecessary activities on slopes after rain.");
    recommendedActions.push("Monitor trends and validate sensors on-site.");
  } else {
    precautions.push("Normal monitoring. Observe posted signage.");
    recommendedActions.push("No immediate action required; continue standard monitoring.");
  }

  // add cause-specific actions
  if (cause.includes("pressure")) {
    recommendedActions.push("Check drainage and relieve pore pressure (inspection & borehole readings).");
    precautions.push("Avoid low-lying areas near slope toe.");
  } else if (cause.includes("vibration")) {
    recommendedActions.push("Halt heavy machinery near the zone until inspected.");
    precautions.push("Do not stand below cliff edges.");
  } else if (cause.includes("gas")) {
    recommendedActions.push("Test for combustible gases and ventilate if needed.");
    precautions.push("Avoid ignition sources near the zone.");
  } else if (cause.includes("moisture") || cause.includes("humidity")) {
    recommendedActions.push("Improve surface drainage and check for blocked drains.");
  }

  const title = `${zone.id} — ${zone.risk} (${zone.riskLevel}%) — ${severity}`;

  const technicalReasons = [
    `Primary cause: ${cause}.`,
    `Evidence: ${evidence.join("; ") || "No strong anomalies detected."}`,
    `Zone status: ${zone.status}. Last updated ${zone.lastUpdated}.`,
  ];

  return {
    title,
    severity,
    precautions,
    technicalReasons,
    recommendedActions,
    confidence: conf,
    channels,
    timestamp: new Date().toISOString(),
  };
}
