// ZoneRecommendationCard.tsx
"use client";

import React, { useMemo, useState } from "react";

/** ----------------- Minimal types (self-contained) ----------------- **/
export type SensorType = "temperature" | "humidity" | "rainfall" | "wind" | "pore_pressure" | "displacement";
export type SensorStatus = "online" | "offline" | "warning";

export interface SensorData {
  id: string;
  type: SensorType;
  value: number;
  unit: string;
  status: SensorStatus;
  lastUpdate: string;
  coordinates: { lat: number; lng: number };
}

export type ZoneRiskBand = "Low" | "Medium" | "High" | "Critical";
export type ZoneStatus = "Active" | "Restricted" | "Monitoring" | "Maintenance";

export interface ZoneData {
  id: string;
  coordinateId?: string;
  risk: ZoneRiskBand;
  riskLevel: number; // 0-100
  riskColor: string;
  status: ZoneStatus;
  lastUpdated: string;
  sensors: SensorData[];
  bounds?: [[number, number], [number, number]];
  trend24h?: { t: string; v: number }[];
}

/** ----------------- Recommendation types ----------------- **/
type Severity = "Info" | "Advisory" | "Urgent" | "Immediate";
type Channel = "SMS" | "Push" | "Siren" | "Email" | "Onsite";

interface Recommendation {
  title: string;
  severity: Severity;
  precautions: string[];
  technicalReasons: string[];
  recommendedActions: string[];
  confidence: number; // 0-100
  channels: Channel[];
  timestamp: string;
}

/** ----------------- Helper logic: rule-based generator ----------------- **/
const SENSOR_THRESHOLDS: Record<SensorType, number> = {
  temperature: 45,
  humidity: 85,
  pore_pressure: 1015,
  displacement: 15,
  rainfall: 12,
  wind: 10,
};

function sensorAnomalyScore(s: SensorData) {
  const thr = SENSOR_THRESHOLDS[s.type] ?? Number.POSITIVE_INFINITY;
  if (s.status === "offline") return 20;
  if (s.status === "warning") return 40;
  if (s.value >= thr) {
    return Math.min(60, Math.round(((s.value - thr) / Math.max(1, thr)) * 60 + 20));
  }
  return 0;
}

function primaryCauseFromSensors(sensors: SensorData[]) {
  const scored = sensors.map((s) => ({ s, sc: sensorAnomalyScore(s) }));
  scored.sort((a, b) => b.sc - a.sc);
  const top = scored[0];
  if (!top || top.sc === 0) return { cause: "General instability", evidence: [] as string[] };

  const s = top.s;
  let cause = "";
  if (s.type === "pore_pressure") cause = "Elevated pore/ground pressure";
  else if (s.type === "displacement") cause = "Increased ground/rock vibration";
  else if (s.type === "humidity") cause = "High soil moisture";
  else cause = "Temperature-driven effects";

  const evidence = scored.slice(0, 4).map((x) => `${x.s.type}=${x.s.value}${x.s.unit} (${x.s.status})`);
  return { cause, evidence };
}

function severityFromRisk(riskLevel: number): Severity {
  if (riskLevel > 90) return "Immediate";
  if (riskLevel > 60) return "Urgent";
  if (riskLevel > 30) return "Advisory";
  return "Info";
}

function severityColorHex(s: Severity) {
  if (s === "Immediate") return "#DC2626";
  if (s === "Urgent") return "#EF4444";
  if (s === "Advisory") return "#F59E0B";
  return "#10B981";
}

function generateRecommendation(zone: ZoneData): Recommendation {
  const sensors = zone.sensors || [];
  const zoneRisk = zone.riskLevel ?? 0;
  const severity = severityFromRisk(zoneRisk);
  const { cause, evidence } = primaryCauseFromSensors(sensors);

  const riskScore = zoneRisk; // 0..100
  const sensorScores = sensors.reduce((acc, s) => acc + sensorAnomalyScore(s), 0);
  const sensorScoreNormalized = sensors.length
    ? Math.min(100, Math.round((sensorScores / (sensors.length * 100)) * 100))
    : 0;

  const baseConfidence = Math.min(
    100,
    Math.round(riskScore * 0.55 + sensorScoreNormalized * 0.35 + (severity === "Immediate" ? 10 : 0))
  );

  const channels: Channel[] =
    severity === "Immediate" ? ["SMS", "Push", "Siren", "Onsite"] : severity === "Urgent" ? ["SMS", "Push", "Email"] : ["Push", "Email"];

  const precautions: string[] = [];
  const recommendedActions: string[] = [];

  if (severity === "Immediate") {
    precautions.push("Evacuate to nearest assembly area immediately.");
    precautions.push("Avoid slope-facing areas and do not travel on affected roads.");
    recommendedActions.push("Trigger mass-alert (SMS, Push, Siren).");
    recommendedActions.push("Close roads & dispatch inspection teams.");
  } else if (severity === "Urgent") {
    precautions.push("Prepare for possible evacuation if conditions worsen.");
    precautions.push("Avoid standing below cliff edges and loose rock areas.");
    recommendedActions.push("Alert emergency teams & schedule urgent inspection.");
    recommendedActions.push("Halt heavy machinery near the zone.");
  } else if (severity === "Advisory") {
    precautions.push("Avoid hiking or unnecessary activities on slopes after rain.");
    recommendedActions.push("Increase monitoring frequency; validate sensors on-site.");
  } else {
    precautions.push("Continue standard monitoring and observe signage.");
    recommendedActions.push("No immediate action required.");
  }

  // cause-specific additions
  if (cause.includes("pressure")) {
    precautions.push("Avoid low-lying areas near the slope toe.");
    recommendedActions.push("Inspect drainage & relieve pore pressure where possible.");
  } else if (cause.includes("vibration")) {
    precautions.push("Do not stand under overhangs or cliff edges.");
    recommendedActions.push("Halt heavy equipment until inspected.");
  } else if (cause.includes("gas")) {
    precautions.push("Avoid ignition sources near the zone.");
    recommendedActions.push("Test for combustible gases & ventilate.");
  } else if (cause.includes("moisture") || cause.includes("humidity")) {
    recommendedActions.push("Clear surface drains & inspect for saturation.");
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
    confidence: baseConfidence,
    channels,
    timestamp: new Date().toISOString(),
  };
}

/** ----------------- The main component ----------------- **/
interface Props {
  zone: ZoneData;
  onIssue?: (zoneId: string, rec: Recommendation) => void;
  onAcknowledge?: (zoneId: string, rec: Recommendation) => void;
  onClose?: () => void;
  className?: string;
}

/**
 * ZoneRecommendationCard
 * Self-contained refined component that generates a recommendation for a zone
 * and displays it in a compact, accessible UI.
 */
export default function ZoneRecommendationCard({
  zone,
  onIssue,
  onAcknowledge,
  onClose,
  className = "",
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const rec = useMemo(() => generateRecommendation(zone), [zone]);

  const handleCopy = async () => {
    const text = [
      rec.title,
      `Confidence: ${rec.confidence}%`,
      "",
      "Precautions:",
      ...rec.precautions.map((p) => `- ${p}`),
      "",
      "Recommended actions:",
      ...rec.recommendedActions.map((a) => `- ${a}`),
      "",
      "Why:",
      ...rec.technicalReasons.map((t) => `- ${t}`),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      // simple feedback — replace with toast if you have one
      // eslint-disable-next-line no-alert
      alert("Copied recommendation to clipboard");
    } catch {
      // eslint-disable-next-line no-alert
      alert("Copy failed — check clipboard permissions");
    }
  };

  const handleDownloadJSON = () => {
    const payload = {
      zone,
      recommendation: rec,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${zone.id}_recommendation.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleIssue = () => {
    if (onIssue) onIssue(zone.id, rec);
    else {
      // eslint-disable-next-line no-alert
      alert(`Issue alert for ${zone.id} (severity: ${rec.severity})`);
    }
  };

  const handleAcknowledge = () => {
    if (onAcknowledge) onAcknowledge(zone.id, rec);
    else {
      // eslint-disable-next-line no-alert
      alert(`Acknowledged ${zone.id}`);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 p-4 space-y-4 rounded-sm">
  {/* Header */}
  <div className="flex items-start gap-3">
    <div
      className="w-3 h-12 rounded-sm flex-shrink-0"
      style={{ background: severityColorHex(rec.severity) }}
      aria-hidden
    />
    <div className="min-w-0">
      <div className="text-sm font-bold text-white truncate" title={rec.title}>
        {rec.title}
      </div>
      <div className="text-xs text-gray-400 mt-1 flex items-center gap-2 flex-wrap">
        <span>
          Confidence: <span className="font-semibold text-gray-200">{rec.confidence}%</span>
        </span>
        <span className="text-gray-500">•</span>
        <span className="text-gray-300 truncate" style={{ maxWidth: 180 }}>
          Channels: {rec.channels.join(", ")}
        </span>
      </div>
    </div>
  </div>

  {/* Action row (compact) */}
  <div className="flex items-center gap-2">
    {/* <button
      className="text-xs px-2 py-1 border border-gray-600 bg-gray-700 text-white rounded-sm flex-0"
      onClick={handleIssue}
      aria-label="Issue alert"
      title="Issue alert"
    >
      Issue
    </button>
    <button
      className="text-xs px-2 py-1 border border-gray-600 bg-gray-700 text-white rounded-sm"
      onClick={handleAcknowledge}
      aria-label="Acknowledge"
      title="Acknowledge"
    >
      Ack
    </button> */}
    <button
      className="text-xs px-2 py-1 border border-gray-600 bg-gray-700 text-white rounded-sm"
      onClick={handleCopy}
      aria-label="Copy recommendation"
      title="Copy"
    >
      Copy
    </button>
    <button
      className="text-xs px-2 py-1 border border-gray-600 bg-gray-700 text-white rounded-sm"
      onClick={handleDownloadJSON}
      aria-label="Download JSON"
      title="Download"
    >
      Download
    </button>
    <div className="ml-auto text-xs text-gray-500">{new Date(rec.timestamp).toLocaleString()}</div>
  </div>

  <div className="border-t border-gray-800" />

  {/* Precautions */}
  <div>
    <div className="text-xs text-gray-400 mb-1 font-medium">Precautions</div>
    <div className="text-sm text-gray-200 max-h-28 overflow-auto pr-2" style={{ scrollbarWidth: "thin" }}>
      <ul className="list-disc pl-5 space-y-1">
        {rec.precautions.map((p, i) => (
          <li key={i} className="text-xs leading-tight">
            {p}
          </li>
        ))}
      </ul>
    </div>
  </div>

  {/* Recommended actions */}
  <div>
    <div className="text-xs text-gray-400 mb-1 font-medium">Recommended actions</div>
    <div className="flex flex-col gap-2">
      {rec.recommendedActions.map((a, i) => (
        <div
          key={i}
          className="text-xs bg-gray-800 border border-gray-700 px-2 py-1 rounded-sm text-gray-200"
          title={a}
        >
          {a}
        </div>
      ))}
    </div>
  </div>

  <div className="border-t border-gray-800" />

  {/* Why / technical reasons */}
  <div>
    <div className="flex items-center justify-between">
      <div className="text-xs text-gray-400 font-medium">Why (summary)</div>
      <button
        className="text-xs text-blue-300 underline"
        onClick={() => setExpanded((s) => !s)}
        aria-expanded={expanded}
      >
        {expanded ? "Hide details" : "Show details"}
      </button>
    </div>

    <div className="text-sm text-gray-200 mt-2" style={expanded ? {} : { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
      {rec.technicalReasons.join("  •  ")}
    </div>

    {expanded && (
      <div className="mt-3 bg-gray-800 border border-gray-700 p-2 text-xs text-gray-300 rounded-sm">
        <div className="mb-2 font-semibold text-gray-200">Technical reasons & sensor snapshot</div>

        {/* Technical reasons list */}
        <div className="space-y-2 mb-3">
          {rec.technicalReasons.map((t, idx) => (
            <div key={idx} className="flex gap-2">
              <div className="text-gray-400">•</div>
              <div>{t}</div>
            </div>
          ))}
        </div>

        {/* Compact per-sensor snapshot (2-column grid) */}
        <div className="grid grid-cols-2 gap-2">
          {zone.sensors.map((s) => (
            <div key={s.id} className="text-xs bg-gray-900 border border-gray-700 p-2 rounded-sm">
              <div className="flex justify-between items-center">
                <div className="capitalize">{s.type}</div>
                <div className="font-semibold">
                  {s.value}
                  {s.unit}
                </div>
              </div>
              <div className="text-gray-400 text-xs mt-1">{s.status} • {s.lastUpdate}</div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
</div>
    
  );
}
// <div className={`bg-gray-900 border border-gray-700 p-3 space-y-3 rounded-sm ${className}`}>
    //   {/* Header */}
    //   <div className="flex items-start justify-between gap-3">
    //     <div className="flex items-center gap-3 min-w-0">
    //       <div
    //         className="w-3 h-12 rounded-sm shrink-0"
    //         style={{ background: severityColorHex(rec.severity) }}
    //         aria-hidden
    //       />
    //       <div className="min-w-0">
    //         <div className="text-sm font-semibold text-white leading-tight truncate" title={rec.title}>
    //           {rec.title}
    //         </div>

    //         <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2 flex-wrap">
    //           <span>
    //             Confidence: <span className="font-semibold text-gray-200">{rec.confidence}%</span>
    //           </span>
    //           <span className="text-gray-500">•</span>
    //           <span className="text-gray-300 truncate" style={{ maxWidth: 240 }}>
    //             Channels: {rec.channels.join(", ")}
    //           </span>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="flex items-start gap-2">
    //       <button
    //         className="text-xs px-2 py-1 border border-gray-600 bg-gray-700 text-white rounded-sm"
    //         onClick={handleIssue}
    //         aria-label="Issue alert"
    //         title="Issue alert"
    //       >
    //         Issue
    //       </button>

    //       <button
    //         className="text-xs px-2 py-1 border border-gray-600 bg-gray-700 text-white rounded-sm"
    //         onClick={handleAcknowledge}
    //         aria-label="Acknowledge"
    //         title="Acknowledge"
    //       >
    //         Ack
    //       </button>

    //       <button
    //         className="text-xs px-2 py-1 border border-gray-600 bg-gray-700 text-white rounded-sm"
    //         onClick={handleCopy}
    //         aria-label="Copy recommendation"
    //         title="Copy recommendation"
    //       >
    //         Copy
    //       </button>

    //       <button
    //         className="text-xs px-2 py-1 border border-gray-600 bg-gray-700 text-white rounded-sm"
    //         onClick={handleDownloadJSON}
    //         aria-label="Download recommendation JSON"
    //         title="Download JSON"
    //       >
    //         Download
    //       </button>

    //       <button
    //         className="text-xs text-gray-300 hover:text-white px-2"
    //         onClick={() => (onClose ? onClose() : null)}
    //         aria-label="Close panel"
    //         title="Close"
    //       >
    //         ✕
    //       </button>
    //     </div>
    //   </div>

    //   {/* Precautions */}
    //   <div>
    //     <div className="text-xs text-gray-400 mb-1">Precautions</div>
    //     <div className="text-sm text-gray-200 max-h-20 overflow-auto pr-2" style={{ scrollbarWidth: "thin" }}>
    //       <ul className="list-disc pl-4 space-y-1">
    //         {rec.precautions.map((p, i) => (
    //           <li key={i} className="text-xs">
    //             {p}
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //   </div>

    //   {/* Recommended actions */}
    //   <div>
    //     <div className="text-xs text-gray-400 mb-1">Recommended actions</div>
    //     <div className="flex gap-2 flex-wrap">
    //       {rec.recommendedActions.map((a, i) => (
    //         <div
    //           key={i}
    //           className="text-xs bg-gray-800 border border-gray-700 px-2 py-1 rounded-sm text-gray-200"
    //           title={a}
    //         >
    //           {a.length > 40 ? a.slice(0, 38) + "…" : a}
    //         </div>
    //       ))}
    //     </div>
    //   </div>

    //   {/* Why / technical reasons (collapsed by default) */}
    //   <div>
    //     <div className="text-xs text-gray-400 mb-1">Why</div>
    //     <div className="text-sm text-gray-200 mb-2 line-clamp-2" style={expanded ? {} : { display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
    //       {rec.technicalReasons.join("  •  ")}
    //     </div>

    //     <div className="flex items-center gap-3">
    //       <button
    //         className="text-xs text-blue-300 underline"
    //         onClick={() => setExpanded((s) => !s)}
    //         aria-expanded={expanded}
    //       >
    //         {expanded ? "Hide details" : "Show details"}
    //       </button>
    //       <div className="text-xs text-gray-500">Generated: {new Date(rec.timestamp).toLocaleString()}</div>
    //     </div>

    //     {expanded && (
    //       <div className="mt-2 bg-gray-800 border border-gray-700 p-2 text-xs text-gray-300 rounded-sm">
    //         <div className="mb-2 font-medium text-gray-200">Technical reasons & evidence</div>
    //         <div className="space-y-2">
    //           {rec.technicalReasons.map((t, i) => (
    //             <div key={i} className="flex gap-2">
    //               <div className="text-gray-400">•</div>
    //               <div>{t}</div>
    //             </div>
    //           ))}
    //         </div>

    //         {/* Per-sensor snapshot for audit (compact) */}
    //         {zone.sensors && zone.sensors.length > 0 && (
    //           <>
    //             <div className="mt-3 font-medium text-gray-200">Sensor snapshot</div>
    //             <div className="grid grid-cols-2 gap-2 mt-2">
    //               {zone.sensors.map((s) => (
    //                 <div key={s.id} className="text-xs bg-gray-900 border border-gray-700 p-2 rounded-sm">
    //                   <div className="flex justify-between">
    //                     <div className="capitalize">{s.type}</div>
    //                     <div className="font-semibold">
    //                       {s.value}
    //                       {s.unit}
    //                     </div>
    //                   </div>
    //                   <div className="text-gray-400 text-xs mt-1">{s.status} • {s.lastUpdate}</div>
    //                 </div>
    //               ))}
    //             </div>
    //           </>
    //         )}
    //       </div>
    //     )}
    //   </div>
    // </div>