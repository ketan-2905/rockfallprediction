// "use client";

// import React, { JSX, useEffect, useMemo, useState } from "react";
// import {
//   MapContainer,
//   ImageOverlay,
//   Rectangle,
//   CircleMarker,
//   Tooltip as LeafletTooltip,
//   LayersControl,
//   LayerGroup,
// } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import {
//   LineChart,
//   Line,
//   AreaChart,
//   Area,
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
//   Tooltip as RechartsTooltip,
//   CartesianGrid,
//   BarChart,
//   Bar,
// } from "recharts";
// import { generateRecommendation } from "@/lib/recommendation";
// import ZoneRecommendationCard from "./ZoneRecommendationCard";

// export type Severity = "Info" | "Advisory" | "Urgent" | "Immediate";

// /** ---------- Types ---------- **/
// interface SensorData {
//   id: string;
//   type: "temperature" | "humidity" | "gas" | "pressure" | "vibration";
//   value: number;
//   unit: string;
//   status: "online" | "offline" | "warning";
//   lastUpdate: string;
//   coordinates: { lat: number; lng: number };
// }

// interface ZoneData {
//   id: string;
//   coordinateId: string;
//   risk: "Low" | "Medium" | "High" | "Critical";
//   riskLevel: number; // 0-100
//   riskColor: string;
//   status: "Active" | "Restricted" | "Monitoring" | "Maintenance";
//   lastUpdated: string;
//   sensors: SensorData[];
//   coordinates: { lat: number; lng: number; coordinateId?: string };
//   bounds: [[number, number], [number, number]];
//   trend24h: { t: string; v: number }[]; // for charts
// }

// /** ---------- Config ---------- **/
// const BASE_COORDINATES = { lat: 23.7644, lng: 86.4131 };
// const GRID_SIZE = { rows: 15, columns: 20 };
// const INITIAL_LAT_SPAN = 0.018; // vertical geographic span
// const DRONE_IMAGE_URL = "/images/map.svg";
// const DEM_IMAGE_URL = "/images/dem.svg"; // if missing, fallback to map.svg

// /** ---------- Helpers ---------- **/
// const RISK_COLORS = {
//   Low: "#10B981",
//   Medium: "#F59E0B",
//   High: "#EF4444",
//   Critical: "#DC2626",
// };

// const SENSOR_COLORS = {
//   online: "#10B981",
//   offline: "#6B7280",
//   warning: "#F59E0B",
// };

// const SENSOR_ICON = (type: SensorData["type"]) => {
//   switch (type) {
//     case "pressure":
//       return "💧";
//     case "vibration":
//       return "🛰️";
//     case "temperature":
//       return "🌡️";
//     case "humidity":
//       return "💦";
//     case "gas":
//       return "🧪";
//     default:
//       return "📟";
//   }
// };

// function riskToBand(value: number): ZoneData["risk"] {
//   if (value <= 30) return "Low";
//   if (value <= 60) return "Medium";
//   if (value <= 90) return "High";
//   return "Critical";
// }

// function lerp(a: number, b: number, t: number) {
//   return a + (b - a) * t;
// }

// /** ---------- Component ---------- **/
// export default function RiskMap(): JSX.Element {
//   /** Image bounds + alignment (same approach as your dashboard) **/
//   const [imageBounds, setImageBounds] = useState<
//     [[number, number], [number, number]] | null
//   >(null);
//   const [imageLoaded, setImageLoaded] = useState(false);

//   // UI selections + controls
//   const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
//   const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);
//   const [panelOpen, setPanelOpen] = useState(true);
//   const [showHeatmap, setShowHeatmap] = useState(true);
//   const [showZones, setShowZones] = useState(false);
//   const [showSensors, setShowSensors] = useState(false);
//   const [showGrid, setShowGrid] = useState(false);
//   const [activeBase, setActiveBase] = useState<"drone" | "dem">("drone");

//   // Filters
//   const [riskThreshold, setRiskThreshold] = useState(10); // min %
//   const [sensorFilter, setSensorFilter] = useState<Array<SensorData["type"]>>([
//     "temperature",
//     "humidity",
//     "gas",
//     "pressure",
//     "vibration",
//   ]);

//   // Time slider (0-23 hours)
//   const [hourIndex, setHourIndex] = useState(12);

//   // Load image & compute bounds with aspect + cosine correction
//   useEffect(() => {
//     const img = new Image();
//     img.src = DRONE_IMAGE_URL;

//     const onLoad = () => {
//       const w = img.naturalWidth || img.width || 1;
//       const h = img.naturalHeight || img.height || 1;
//       const aspect = w / h;
//       const meanLatRad = (BASE_COORDINATES.lat * Math.PI) / 180;
//       const lngSpan = (INITIAL_LAT_SPAN * aspect) / Math.cos(meanLatRad);

//       const b: [[number, number], [number, number]] = [
//         [
//           BASE_COORDINATES.lat - INITIAL_LAT_SPAN / 2,
//           BASE_COORDINATES.lng - lngSpan / 2,
//         ],
//         [
//           BASE_COORDINATES.lat + INITIAL_LAT_SPAN / 2,
//           BASE_COORDINATES.lng + lngSpan / 2,
//         ],
//       ];
//       setImageBounds(b);
//       setImageLoaded(true);
//     };

//     const onError = () => {
//       const fallbackLngSpan = 0.024;
//       const b: [[number, number], [number, number]] = [
//         [
//           BASE_COORDINATES.lat - INITIAL_LAT_SPAN / 2,
//           BASE_COORDINATES.lng - fallbackLngSpan / 2,
//         ],
//         [
//           BASE_COORDINATES.lat + INITIAL_LAT_SPAN / 2,
//           BASE_COORDINATES.lng + fallbackLngSpan / 2,
//         ],
//       ];
//       setImageBounds(b);
//       setImageLoaded(true);
//     };

//     img.onload = onLoad;
//     img.onerror = onError;
//     return () => {
//       img.onload = null;
//       img.onerror = null;
//     };
//   }, []);

//   /** Dataset (memoized). Same pattern as dashboard, but time-indexed **/
//   const dataset: Record<string, ZoneData> = useMemo(() => {
//     if (!imageBounds) return {};

//     const latSpan = imageBounds[1][0] - imageBounds[0][0];
//     const lngSpan = imageBounds[1][1] - imageBounds[0][1];
//     const cellLat = latSpan / GRID_SIZE.rows;
//     const cellLng = lngSpan / GRID_SIZE.columns;

//     const coordFor = (row: number, col: number) => {
//       const lat = imageBounds[0][0] + row * cellLat + cellLat / 2;
//       const lng = imageBounds[0][1] + col * cellLng + cellLng / 2;
//       const slat = lat.toFixed(6);
//       const slng = lng.toFixed(6);
//       return {
//         lat: parseFloat(slat),
//         lng: parseFloat(slng),
//         coordinateId: `${slat}, ${slng}`,
//       };
//     };
//     const boundsFor = (
//       row: number,
//       col: number
//     ): [[number, number], [number, number]] => {
//       const slat = imageBounds[0][0] + row * cellLat;
//       const slng = imageBounds[0][1] + col * cellLng;
//       return [
//         [slat, slng],
//         [slat + cellLat, slng + cellLng],
//       ];
//     };

//     // Same active cells as your dashboard
//     const activeCells = [
//       { row: 2, col: 4, base: 15 },
//       { row: 6, col: 8, base: 85 },
//       { row: 4, col: 12, base: 60 },
//       { row: 8, col: 15, base: 95 },
//       { row: 1, col: 18, base: 25 },
//       { row: 10, col: 3, base: 45 },
//       { row: 5, col: 16, base: 78 },
//       { row: 12, col: 9, base: 18 },
//       { row: 3, col: 6, base: 55 },
//       { row: 7, col: 11, base: 82 },
//       { row: 9, col: 5, base: 65 },
//       { row: 0, col: 14, base: 30 },
//       { row: 11, col: 1, base: 92 },
//       { row: 13, col: 17, base: 50 },
//       { row: 14, col: 7, base: 22 },
//       { row: 6, col: 2, base: 75 },
//     ];

//     // Hourly modulation: gentle day/night sine + small random noise by cell
//     const hourT = hourIndex / 24;
//     const zones: Record<string, ZoneData> = {};

//     for (const cell of activeCells) {
//       const zoneId = `ZONE_${cell.row.toString().padStart(2, "0")}_${cell.col
//         .toString()
//         .padStart(2, "0")}`;
//       const coord = coordFor(cell.row, cell.col);
//       const b = boundsFor(cell.row, cell.col);

//       // deterministic pseudo-random per zone
//       const seed = (cell.row * 100 + cell.col) % 17;
//       const noise = (seed * 13) % 7; // 0..6
//       const diurnal = Math.sin((hourT + seed * 0.01) * Math.PI * 2) * 8; // -8..+8
//       const riskLevel = Math.max(
//         0,
//         Math.min(100, Math.round(cell.base + diurnal + noise - 3))
//       );

//       const riskBand = riskToBand(riskLevel);
//       const riskColor = RISK_COLORS[riskBand];

//       // sensors (2-4) around the cell center
//       const sensorTypes: SensorData["type"][] = [
//         "temperature",
//         "humidity",
//         "gas",
//         "pressure",
//         "vibration",
//       ];
//       const count = 2 + (seed % 3); // 2..4
//       const sensors: SensorData[] = Array.from({ length: count }).map(
//         (_, i) => {
//           const t = sensorTypes[i % sensorTypes.length];
//           // jitter within cell
//           const sLat = coord.lat + (Math.random() - 0.5) * (cellLat * 0.6);
//           const sLng = coord.lng + (Math.random() - 0.5) * (cellLng * 0.6);

//           const valueBase =
//             t === "temperature"
//               ? 20 + (seed % 6) * 2
//               : t === "humidity"
//               ? 50 + (seed % 20)
//               : t === "gas"
//               ? 120 + (seed % 80)
//               : t === "pressure"
//               ? 990 + (seed % 25)
//               : 8 + (seed % 10);
//           const value = Math.round(
//             lerp(
//               valueBase - 3,
//               valueBase + 3,
//               (Math.sin(hourT * Math.PI * 2 + i) + 1) / 2
//             )
//           );

//           const unit =
//             t === "temperature"
//               ? "°C"
//               : t === "humidity"
//               ? "%"
//               : t === "gas"
//               ? "ppm"
//               : t === "pressure"
//               ? "hPa"
//               : "Hz";

//           const status: SensorData["status"] =
//             Math.random() > 0.9
//               ? "offline"
//               : value > (t === "pressure" ? 1015 : 80)
//               ? "warning"
//               : "online";

//           return {
//             id: `${zoneId}_${t.toUpperCase()}_${i + 1}`,
//             type: t,
//             value,
//             unit,
//             status,
//             lastUpdate: `${(seed % 5) + 1}m ago`,
//             coordinates: { lat: sLat, lng: sLng },
//           };
//         }
//       );

//       // 24h trend (simple generated series)
//       const trend24h = Array.from({ length: 24 }).map((_, h) => {
//         const ht = h / 24;
//         const v = Math.max(
//           0,
//           Math.min(
//             100,
//             Math.round(
//               cell.base +
//                 Math.sin((ht + seed * 0.01) * Math.PI * 2) * 10 +
//                 ((seed * h) % 5) -
//                 2
//             )
//           )
//         );
//         return { t: `${h}:00`, v };
//       });

//       zones[zoneId] = {
//         id: zoneId,
//         coordinateId: coord.coordinateId,
//         risk: riskBand,
//         riskLevel,
//         riskColor,
//         status: (
//           [
//             "Active",
//             "Restricted",
//             "Monitoring",
//             "Maintenance",
//           ] as ZoneData["status"][]
//         )[seed % 4],
//         lastUpdated: `${(seed % 5) + 1}m ago`,
//         sensors,
//         coordinates: coord,
//         bounds: b,
//         trend24h,
//       };
//     }

//     return zones;
//   }, [imageBounds, hourIndex]);

//   // Derived helpers for rendering
//   const latSpan = imageBounds ? imageBounds[1][0] - imageBounds[0][0] : 0;
//   const lngSpan = imageBounds ? imageBounds[1][1] - imageBounds[0][1] : 0;
//   const cellLat = imageBounds ? latSpan / GRID_SIZE.rows : 0;
//   const cellLng = imageBounds ? lngSpan / GRID_SIZE.columns : 0;

//   const zonesArray = useMemo(
//     () => Object.values(dataset).sort((a, b) => b.riskLevel - a.riskLevel),
//     [dataset]
//   );

//   const filteredZones = useMemo(
//     () => zonesArray.filter((z) => z.riskLevel >= riskThreshold),
//     [zonesArray, riskThreshold]
//   );

//   const allSensors = useMemo(
//     () =>
//       Object.values(dataset).flatMap((z) =>
//         z.sensors.filter((s) => sensorFilter.includes(s.type))
//       ),
//     [dataset, sensorFilter]
//   );

//   const selectedZone = selectedZoneId ? dataset[selectedZoneId] : null;
//   const selectedSensor = selectedSensorId
//     ? allSensors.find((s) => s.id === selectedSensorId) || null
//     : null;

//   const zoneRecommendation = useMemo(() => {
//     console.log("zoneRecommendation", selectedZone);

//     if (!selectedZone) return null;
//     console.log("zoneRecommendation2", generateRecommendation(selectedZone));
//     return generateRecommendation(selectedZone);
//   }, [selectedZone]);

//   const [recExpanded, setRecExpanded] = useState(false);

//   /** ---------- UI ---------- **/
//   if (!imageLoaded || !imageBounds) {
//     return (
//       <div className="h-screen w-screen grid place-items-center bg-gray-900 text-gray-200">
//         Loading Risk Map…
//       </div>
//     );
//   }

//   function severityColor(s: Severity) {
//     if (s === "Immediate") return "#DC2626";
//     if (s === "Urgent") return "#EF4444";
//     if (s === "Advisory") return "#F59E0B";
//     return "#10B981";
//   }

//   return (
//     <div className="h-[calc(100vh-56px)] w-screen relative bg-gray-900 text-gray-200 overflow-hidden">
//       {/* Top Bar */}
//       <div className="absolute top-0 left-0 right-0 bg-gray-800/95 border-b border-gray-700 z-[1002]">
//         <div className="flex items-center justify-between px-3 py-2">
//           <div className="flex items-center gap-3">
//             <button
//               className="px-2 py-1 bg-gray-700 text-gray-200 border border-gray-600"
//               onClick={() => history.back()}
//             >
//               ← Back
//             </button>
//             {/* <div className="px-2 py-1 bg-red-700 text-white font-semibold">
//               LIVE
//             </div> */}
//             <span className="text-sm font-medium">Risk Map — Detailed</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <div className="px-2 py-1 text-xs bg-gray-700 text-gray-300 border border-gray-600">
//               Last Update: {new Date().toLocaleTimeString()}
//             </div>
//             <div className="w-2 h-2 bg-green-500 animate-pulse" />
//           </div>
//         </div>
//       </div>

//       {/* Left Panel (Collapsible) */}
//       <div
//         className={`absolute top-10 bottom-12 left-0 z-[1001] transition-all duration-200
//         ${panelOpen ? "w-80" : "w-10"} bg-gray-800/95 border-r border-gray-700`}
//       >
//         <div className="h-full flex flex-col">
//           <div className="flex items-center justify-between px-2 py-2 border-b border-gray-700 mt-2">
//             <span
//               className={`font-semibold ${
//                 panelOpen ? "opacity-100" : "opacity-0"
//               }`}
//             >
//               Zones & Filters
//             </span>
//             <button
//               className="text-gray-300 hover:text-white px-2"
//               onClick={() => setPanelOpen(!panelOpen)}
//               title={panelOpen ? "Collapse" : "Expand"}
//             >
//               {panelOpen ? "⟨" : "⟩"}
//             </button>
//           </div>

//           <div className={`p-2 space-y-3 ${panelOpen ? "block" : "hidden"}`}>
//             <div className="bg-gray-900 border border-gray-700 p-2">
//               <div className="text-xs text-gray-400 mb-1">
//                 Risk threshold (min %)
//               </div>

//               <input
//                 type="range"
//                 min={0}
//                 max={100}
//                 value={riskThreshold}
//                 onChange={(e) => setRiskThreshold(parseInt(e.target.value))}
//                 className="w-full h-2 bg-gray-700 appearance-none cursor-pointer"
//                 style={{ borderRadius: "0px" }}
//               />

//               <div className="text-sm">
//                 ≥{" "}
//                 <span className="text-white font-semibold">
//                   {riskThreshold}%
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Map Canvas */}
//       <div className="absolute top-10 bottom-12 left-0 right-0">
//         <MapContainer
//           center={[BASE_COORDINATES.lat, BASE_COORDINATES.lng]}
//           zoom={14}
//           minZoom={13}
//           maxZoom={17}
//           style={{ height: "100%", width: "100%", backgroundColor: "#111827" }}
//           zoomControl={false}
//         >
//           <LayersControl position="topright">
//             {/* Base images (toggle) */}
//             <LayersControl.BaseLayer
//               checked={activeBase === "drone"}
//               name="Drone imagery"
//             >
//               <LayerGroup>
//                 <ImageOverlay
//                   url={DRONE_IMAGE_URL}
//                   bounds={imageBounds}
//                   opacity={0.85}
//                 />
//               </LayerGroup>
//             </LayersControl.BaseLayer>
//             <LayersControl.BaseLayer
//               checked={activeBase === "dem"}
//               name="DEM (simulated)"
//             >
//               <LayerGroup>
//                 <ImageOverlay
//                   url={DEM_IMAGE_URL}
//                   bounds={imageBounds}
//                   opacity={0.8}
//                 />
//               </LayerGroup>
//             </LayersControl.BaseLayer>

//             {/* Grid overlay */}
//             {showGrid && (
//               <LayersControl.Overlay checked name="Grid">
//                 <LayerGroup>
//                   {Array.from({ length: GRID_SIZE.rows }).map((_, r) =>
//                     Array.from({ length: GRID_SIZE.columns }).map((_, c) => {
//                       const slat = imageBounds[0][0] + r * cellLat;
//                       const slng = imageBounds[0][1] + c * cellLng;
//                       const b: [[number, number], [number, number]] = [
//                         [slat, slng],
//                         [slat + cellLat, slng + cellLng],
//                       ];
//                       const id = `g_${r}_${c}`;
//                       return (
//                         <Rectangle
//                           key={id}
//                           bounds={b}
//                           pathOptions={{
//                             color: "#4B5563",
//                             weight: 1,
//                             fillOpacity: 0,
//                           }}
//                         />
//                       );
//                     })
//                   )}
//                 </LayerGroup>
//               </LayersControl.Overlay>
//             )}

//             {/* Heatmap via colored cells (simulated) */}
//             {showHeatmap && (
//               <LayersControl.Overlay checked name="Risk heatmap">
//                 <LayerGroup>
//                   {filteredZones.map((z) => (
//                     <Rectangle
//                       key={`hm_${z.id}`}
//                       bounds={z.bounds}
//                       pathOptions={{
//                         color: z.riskColor,
//                         weight: 0,
//                         fillColor: z.riskColor,
//                         fillOpacity: Math.min(
//                           0.7,
//                           0.25 + (z.riskLevel / 100) * 0.6
//                         ),
//                       }}
//                       eventHandlers={{
//                         click: () => {
//                           setSelectedZoneId(z.id);
//                           setSelectedSensorId(null);
//                         },
//                       }}
//                     >
//                       <LeafletTooltip
//                         sticky
//                         direction="top"
//                         offset={[0, -8]}
//                         className="zone-tooltip"
//                       >
//                         <div className="bg-gray-900 text-white p-2 text-sm border border-gray-600">
//                           <div className="font-semibold">{z.id}</div>
//                           <div className="flex items-center gap-2 mt-1">
//                             <div
//                               className="w-3 h-3"
//                               style={{ backgroundColor: z.riskColor }}
//                             />
//                             <span>
//                               {z.risk} ({z.riskLevel}%)
//                             </span>
//                           </div>
//                           <div className="text-gray-300 text-sm mt-1">
//                             {z.sensors.length} sensors • {z.status}
//                           </div>
//                         </div>
//                       </LeafletTooltip>
//                     </Rectangle>
//                   ))}
//                 </LayerGroup>
//               </LayersControl.Overlay>
//             )}

//             {/* Zones (thin outlines) */}
//             {showZones && (
//               <LayersControl.Overlay checked name="Zone boundaries">
//                 <LayerGroup>
//                   {filteredZones.map((z) => (
//                     <Rectangle
//                       key={`zb_${z.id}`}
//                       bounds={z.bounds}
//                       pathOptions={{
//                         color: z.riskColor,
//                         weight: selectedZoneId === z.id ? 3 : 1.5,
//                         dashArray: "4,4",
//                         fillOpacity: 0,
//                       }}
//                       eventHandlers={{
//                         click: () => {
//                           setSelectedZoneId(z.id);
//                           setSelectedSensorId(null);
//                         },
//                       }}
//                     />
//                   ))}
//                 </LayerGroup>
//               </LayersControl.Overlay>
//             )}

//             {/* Sensors */}
//             {showSensors && (
//               <LayersControl.Overlay checked name="Sensors">
//                 <LayerGroup>
//                   {allSensors.map((s) => (
//                     <CircleMarker
//                       key={s.id}
//                       center={[s.coordinates.lat, s.coordinates.lng]}
//                       radius={selectedSensorId === s.id ? 6 : 4}
//                       pathOptions={{
//                         color: SENSOR_COLORS[s.status],
//                         fillColor: SENSOR_COLORS[s.status],
//                         fillOpacity: 0.9,
//                         weight: 2,
//                       }}
//                       eventHandlers={{
//                         click: (e) => {
//                           e.originalEvent.stopPropagation();
//                           setSelectedSensorId(s.id);
//                           setSelectedZoneId(null);
//                         },
//                       }}
//                     >
//                       <LeafletTooltip
//                         sticky
//                         direction="top"
//                         offset={[0, -10]}
//                         className="sensor-tooltip"
//                       >
//                         <div className="bg-gray-800 text-white p-2 text-sm border border-gray-500">
//                           <div className="text-lg font-bold">
//                             {s.value}
//                             {s.unit}
//                           </div>
//                           <div className="text-gray-300 capitalize">
//                             {s.status}
//                           </div>
//                           <div className="text-xs text-gray-400 mt-1">
//                             {s.lastUpdate}
//                           </div>
//                         </div>
//                       </LeafletTooltip>
//                     </CircleMarker>
//                   ))}
//                 </LayerGroup>
//               </LayersControl.Overlay>
//             )}
//           </LayersControl>
//         </MapContainer>
//       </div>

//       {/* Right Details Panel */}
//       <div className="absolute top-10 bottom-12 right-0 w-96 bg-gray-800/95 border-l border-gray-700 z-[1001] overflow-auto">
//         {selectedZone ? (
//           <div className="h-full flex flex-col">
//             <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
//               <div className="font-bold text-white mt-2">
//                 Zone {selectedZone.id}
//               </div>
//               <button
//                 className="text-gray-300 hover:text-white"
//                 onClick={() => setSelectedZoneId(null)}
//               >
//                 ×
//               </button>
//             </div>

//             <div className="p-3 space-y-3">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <div
//                     className="w-4 h-4"
//                     style={{ backgroundColor: selectedZone.riskColor }}
//                   />
//                   <span className="text-gray-300">
//                     {selectedZone.risk} risk
//                   </span>
//                 </div>
//                 <span className="text-white font-bold text-lg">
//                   {selectedZone.riskLevel}%
//                 </span>
//               </div>

//               <div className="text-xs text-gray-400">
//                 {selectedZone.status} • Last updated {selectedZone.lastUpdated}
//               </div>

//               {/* Top sensors */}
//               <div className="bg-gray-900 border border-gray-700 p-2">
//                 <div className="text-sm mb-2">Sensor Readings</div>
//                 <div className="grid grid-cols-1 gap-2 max-h-36 overflow-auto">
//                   {selectedZone.sensors.map((s) => (
//                     <div
//                       key={s.id}
//                       className="flex items-center justify-between p-2 bg-gray-700/40"
//                     >
//                       <div className="flex items-center gap-2">
//                         <span className="text-sm capitalize">{s.type}</span>
//                       </div>
//                       <div className="text-white font-semibold">
//                         {s.value}
//                         {s.unit}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="bg-gray-900 border border-gray-700 p-2">
//                 <div className="text-sm mb-2">Sensor mix</div>
//                 <div className="h-36 w-85">
//                   {" "}
//                   {/* ✅ Increased height (was h-24) */}
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart
//                       data={Object.entries(
//                         selectedZone.sensors.reduce<Record<string, number>>(
//                           (acc, s) => {
//                             acc[s.type] = (acc[s.type] || 0) + 1;
//                             return acc;
//                           },
//                           {}
//                         )
//                       ).map(([k, v]) => ({ type: k, count: v }))}
//                       margin={{ top: 10, left: 10, right: 10, bottom: 10 }} // ✅ more padding
//                     >
//                       <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

//                       <XAxis
//                         dataKey="type"
//                         interval="preserveStartEnd"
//                         tick={{ fill: "#9ca3af", fontSize: 12 }}
//                       />

//                       <YAxis allowDecimals={false} />

//                       <RechartsTooltip
//                         contentStyle={{
//                           background: "#111827",
//                           border: "1px solid #374151",
//                         }}
//                       />

//                       <Bar
//                         dataKey="count"
//                         fill={selectedZone.riskColor}
//                         barSize={30}
//                       />
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//               <ZoneRecommendationCard
//                 zone={selectedZone}
//                 onIssue={(zoneId, rec) => {
//                   // TODO: POST to backend or emit via socket
//                   console.log("Issue", zoneId, rec);
//                 }}
//                 onAcknowledge={(zoneId, rec) => {
//                   console.log("Ack", zoneId, rec);
//                 }}
//                 onClose={() => setSelectedZoneId(null)}
//               />
//             </div>
//           </div>
//         ) : selectedSensor ? (
//           <div className="h-full flex flex-col">
//             <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
//               <div className="font-bold text-white capitalize">
//                 {selectedSensor.type} sensor
//               </div>
//               <button
//                 className="text-gray-300 hover:text-white"
//                 onClick={() => setSelectedSensorId(null)}
//               >
//                 ×
//               </button>
//             </div>
//             <div className="p-3 space-y-3">
//               <div className="text-center p-4 bg-gray-700/50">
//                 <div className="text-2xl font-bold text-white">
//                   {selectedSensor.value}
//                   {selectedSensor.unit}
//                 </div>
//                 <div className="text-gray-300 capitalize mt-1">
//                   {selectedSensor.status}
//                 </div>
//               </div>
//               <div className="bg-gray-900 border border-gray-700 p-2">
//                 <div className="text-sm mb-1">Last 24h</div>
//                 <div className="h-28">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart
//                       data={Array.from({ length: 24 }).map((_, h) => ({
//                         t: `${h}:00`,
//                         v: Math.max(
//                           0,
//                           Math.round(
//                             selectedSensor.value +
//                               Math.sin((h / 24) * Math.PI * 2) * 5 -
//                               2
//                           )
//                         ),
//                       }))}
//                     >
//                       <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//                       <XAxis dataKey="t" hide />
//                       <YAxis hide />
//                       <RechartsTooltip
//                         contentStyle={{
//                           background: "#111827",
//                           border: "1px solid #374151",
//                         }}
//                       />
//                       <Area
//                         type="monotone"
//                         dataKey="v"
//                         stroke="#93C5FD"
//                         fill="#93C5FD"
//                         fillOpacity={0.2}
//                       />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//               <div className="text-xs text-gray-400">
//                 Sensor ID: {selectedSensor.id}
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="h-full grid place-items-center text-sm text-gray-400">
//             Select a zone or sensor
//           </div>
//         )}
//       </div>

//       <div className="absolute bottom-0 left-0 right-0 bg-gray-800/95 border-t border-gray-700 z-[1002]">
//         <div className="flex items-center gap-3 px-3 py-2">
//           <button
//             className="px-2 py-1 bg-gray-700 border border-gray-600 text-white"
//             onClick={() => setHourIndex((h) => (h - 1 + 24) % 24)}
//             title="Prev hour"
//           >
//             ◀
//           </button>

//           <input
//             type="range"
//             min={0}
//             max={23}
//             value={hourIndex}
//             onChange={(e) => setHourIndex(parseInt(e.target.value))}
//             className="flex-1 h-2 bg-gray-700 appearance-none cursor-pointer"
//             style={{ borderRadius: "0px" }}
//           />

//           <button
//             className="px-2 py-1 bg-gray-700 border border-gray-600 text-white"
//             onClick={() => setHourIndex((h) => (h + 1) % 24)}
//             title="Next hour"
//           >
//             ▶
//           </button>
//           <div className="text-sm w-24 text-right">Hour: {hourIndex}:00</div>

//           <div className="ml-auto flex items-center gap-2">
//             <span className="text-xs text-gray-300">Risk</span>
//             <div className="h-3 w-40 bg-gradient-to-r from-[#10B981] via-[#F59E0B] to-[#EF4444]" />
//             <div className="text-xs">0</div>
//             <div className="text-xs">30</div>
//             <div className="text-xs">60</div>
//             <div className="text-xs">100</div>
//           </div>
//         </div>
//       </div>

//       {/* Global Styles (match dashboard sharp corners) */}
//       <style jsx global>{`
//         .zone-tooltip,
//         .sensor-tooltip {
//           background: transparent !important;
//           border: none !important;
//           box-shadow: none !important;
//         }
//         .leaflet-tooltip-top:before,
//         .leaflet-tooltip-bottom:before {
//           display: none !important;
//         }
//         .leaflet-container {
//           background: #111827 !important;
//         }
//         .leaflet-control-zoom {
//           display: none !important;
//         }
//         * {
//           border-radius: 0 !important;
//         }
//       `}</style>
//     </div>
//   );
// }



"use client";

import React, { JSX, useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  ImageOverlay,
  Rectangle,
  CircleMarker,
  Tooltip as LeafletTooltip,
  LayersControl,
  LayerGroup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import { generateRecommendation } from "@/lib/recommendation";
import ZoneRecommendationCard from "./ZoneRecommendationCard";

export type Severity = "Info" | "Advisory" | "Urgent" | "Immediate";

/** ---------- Types ---------- **/
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

/** ---------- Config ---------- **/
const BASE_COORDINATES = { lat: 23.7644, lng: 86.4131 };
const GRID_SIZE = { rows: 15, columns: 20 };
const INITIAL_LAT_SPAN = 0.018; // vertical geographic span
const DRONE_IMAGE_URL = "/images/map.svg";
const DEM_IMAGE_URL = "/images/dem.svg"; // if missing, fallback to map.svg

/** ---------- Helpers ---------- **/
const RISK_COLORS = {
  Low: "#10B981",
  Medium: "#F59E0B",
  High: "#EF4444",
  Critical: "#DC2626",
};

const SENSOR_COLORS = {
  online: "#10B981",
  offline: "#6B7280",
  warning: "#F59E0B",
};

const SENSOR_ICON = (type: SensorData["type"]) => {
  switch (type) {
    case "pore_pressure":
      return "💧";
    case "displacement":
      return "📏";
    case "temperature":
      return "🌡️";
    case "humidity":
      return "💦";
    case "rainfall":
      return "🌧️";
    case "wind":
      return "💨";
    default:
      return "📟";
  }
};

function riskToBand(value: number): ZoneData["risk"] {
  if (value <= 30) return "Low";
  if (value <= 60) return "Medium";
  if (value <= 90) return "High";
  return "Critical";
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** ---------- Component ---------- **/
export default function RiskMap(): JSX.Element {
  /** Image bounds + alignment (same approach as your dashboard) **/
  const [imageBounds, setImageBounds] = useState<
    [[number, number], [number, number]] | null
  >(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // UI selections + controls
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showZones, setShowZones] = useState(false);
  const [showSensors, setShowSensors] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [activeBase, setActiveBase] = useState<"drone" | "dem">("drone");

  // Filters
  const [riskThreshold, setRiskThreshold] = useState(10); // min %
  const [sensorFilter, setSensorFilter] = useState<Array<SensorData["type"]>>([
    "temperature",
    "humidity",
    "rainfall",
    "wind",
    "pore_pressure",
    "displacement",
  ]);

  // Time slider (0-23 hours)
  const [hourIndex, setHourIndex] = useState(12);

  // Load image & compute bounds with aspect + cosine correction
  useEffect(() => {
    const img = new Image();
    img.src = DRONE_IMAGE_URL;

    const onLoad = () => {
      const w = img.naturalWidth || img.width || 1;
      const h = img.naturalHeight || img.height || 1;
      const aspect = w / h;
      const meanLatRad = (BASE_COORDINATES.lat * Math.PI) / 180;
      const lngSpan = (INITIAL_LAT_SPAN * aspect) / Math.cos(meanLatRad);

      const b: [[number, number], [number, number]] = [
        [
          BASE_COORDINATES.lat - INITIAL_LAT_SPAN / 2,
          BASE_COORDINATES.lng - lngSpan / 2,
        ],
        [
          BASE_COORDINATES.lat + INITIAL_LAT_SPAN / 2,
          BASE_COORDINATES.lng + lngSpan / 2,
        ],
      ];
      setImageBounds(b);
      setImageLoaded(true);
    };

    const onError = () => {
      const fallbackLngSpan = 0.024;
      const b: [[number, number], [number, number]] = [
        [
          BASE_COORDINATES.lat - INITIAL_LAT_SPAN / 2,
          BASE_COORDINATES.lng - fallbackLngSpan / 2,
        ],
        [
          BASE_COORDINATES.lat + INITIAL_LAT_SPAN / 2,
          BASE_COORDINATES.lng + fallbackLngSpan / 2,
        ],
      ];
      setImageBounds(b);
      setImageLoaded(true);
    };

    img.onload = onLoad;
    img.onerror = onError;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, []);

  /** Dataset (memoized). Same pattern as dashboard, but time-indexed **/
  const dataset: Record<string, ZoneData> = useMemo(() => {
    if (!imageBounds) return {};

    const latSpan = imageBounds[1][0] - imageBounds[0][0];
    const lngSpan = imageBounds[1][1] - imageBounds[0][1];
    const cellLat = latSpan / GRID_SIZE.rows;
    const cellLng = lngSpan / GRID_SIZE.columns;

    const coordFor = (row: number, col: number) => {
      const lat = imageBounds[0][0] + row * cellLat + cellLat / 2;
      const lng = imageBounds[0][1] + col * cellLng + cellLng / 2;
      const slat = lat.toFixed(6);
      const slng = lng.toFixed(6);
      return {
        lat: parseFloat(slat),
        lng: parseFloat(slng),
        coordinateId: `${slat}, ${slng}`,
      };
    };
    const boundsFor = (
      row: number,
      col: number
    ): [[number, number], [number, number]] => {
      const slat = imageBounds[0][0] + row * cellLat;
      const slng = imageBounds[0][1] + col * cellLng;
      return [
        [slat, slng],
        [slat + cellLat, slng + cellLng],
      ];
    };

    // Same active cells as your dashboard
    const activeCells = [
      { row: 2, col: 4, base: 15 },
      { row: 6, col: 8, base: 85 },
      { row: 4, col: 12, base: 60 },
      { row: 8, col: 15, base: 95 },
      { row: 1, col: 18, base: 25 },
      { row: 10, col: 3, base: 45 },
      { row: 5, col: 16, base: 78 },
      { row: 12, col: 9, base: 18 },
      { row: 3, col: 6, base: 55 },
      { row: 7, col: 11, base: 82 },
      { row: 9, col: 5, base: 65 },
      { row: 0, col: 14, base: 30 },
      { row: 11, col: 1, base: 92 },
      { row: 13, col: 17, base: 50 },
      { row: 14, col: 7, base: 22 },
      { row: 6, col: 2, base: 75 },
    ];

    // Hourly modulation: gentle day/night sine + small random noise by cell
    const hourT = hourIndex / 24;
    const zones: Record<string, ZoneData> = {};

    for (const cell of activeCells) {
      const zoneId = `ZONE_${cell.row.toString().padStart(2, "0")}_${cell.col
        .toString()
        .padStart(2, "0")}`;
      const coord = coordFor(cell.row, cell.col);
      const b = boundsFor(cell.row, cell.col);

      // deterministic pseudo-random per zone
      const seed = (cell.row * 100 + cell.col) % 17;
      const noise = (seed * 13) % 7; // 0..6
      const diurnal = Math.sin((hourT + seed * 0.01) * Math.PI * 2) * 8; // -8..+8
      const riskLevel = Math.max(
        0,
        Math.min(100, Math.round(cell.base + diurnal + noise - 3))
      );

      const riskBand = riskToBand(riskLevel);
      const riskColor = RISK_COLORS[riskBand];

      // sensors (2-4) around the cell center
      const sensorTypes: SensorData["type"][] = [
        "temperature",
        "humidity",
        "rainfall",
        "wind",
        "pore_pressure",
        "displacement",
      ];
      const count = 2 + (seed % 3); // 2..4
      const sensors: SensorData[] = Array.from({ length: count }).map(
        (_, i) => {
          const t = sensorTypes[i % sensorTypes.length];
          // jitter within cell
          const sLat = coord.lat + (Math.random() - 0.5) * (cellLat * 0.6);
          const sLng = coord.lng + (Math.random() - 0.5) * (cellLng * 0.6);

          // Generate appropriate values for each sensor type
          let valueBase, warningThreshold;
          switch (t) {
            case "temperature":
              valueBase = 20 + (seed % 6) * 2;
              warningThreshold = 35;
              break;
            case "humidity":
              valueBase = 50 + (seed % 20);
              warningThreshold = 85;
              break;
            case "rainfall":
              valueBase = 2 + (seed % 10);
              warningThreshold = 15;
              break;
            case "wind":
              valueBase = 5 + (seed % 15);
              warningThreshold = 25;
              break;
            case "pore_pressure":
              valueBase = 50 + (seed % 40);
              warningThreshold = 80;
              break;
            case "displacement":
              valueBase = 2 + (seed % 8);
              warningThreshold = 10;
              break;
          }

          const value = Math.round(
            lerp(
              valueBase - 3,
              valueBase + 3,
              (Math.sin(hourT * Math.PI * 2 + i) + 1) / 2
            )
          );

          const unit =
            t === "temperature"
              ? "°C"
              : t === "humidity"
              ? "%"
              : t === "rainfall"
              ? "mm"
              : t === "wind"
              ? "m/s"
              : t === "pore_pressure"
              ? "kPa"
              : "mm";

          const status: SensorData["status"] =
            Math.random() > 0.9
              ? "offline"
              : value > warningThreshold
              ? "warning"
              : "online";

          return {
            id: `${zoneId}_${t.toUpperCase()}_${i + 1}`,
            type: t,
            value,
            unit,
            status,
            lastUpdate: `${(seed % 5) + 1}m ago`,
            coordinates: { lat: sLat, lng: sLng },
          };
        }
      );

      // 24h trend (simple generated series)
      const trend24h = Array.from({ length: 24 }).map((_, h) => {
        const ht = h / 24;
        const v = Math.max(
          0,
          Math.min(
            100,
            Math.round(
              cell.base +
                Math.sin((ht + seed * 0.01) * Math.PI * 2) * 10 +
                ((seed * h) % 5) -
                2
            )
          )
        );
        return { t: `${h}:00`, v };
      });

      zones[zoneId] = {
        id: zoneId,
        coordinateId: coord.coordinateId,
        risk: riskBand,
        riskLevel,
        riskColor,
        status: (
          [
            "Active",
            "Restricted",
            "Monitoring",
            "Maintenance",
          ] as ZoneData["status"][]
        )[seed % 4],
        lastUpdated: `${(seed % 5) + 1}m ago`,
        sensors,
        coordinates: coord,
        bounds: b,
        trend24h,
      };
    }

    return zones;
  }, [imageBounds, hourIndex]);

  // Derived helpers for rendering
  const latSpan = imageBounds ? imageBounds[1][0] - imageBounds[0][0] : 0;
  const lngSpan = imageBounds ? imageBounds[1][1] - imageBounds[0][1] : 0;
  const cellLat = imageBounds ? latSpan / GRID_SIZE.rows : 0;
  const cellLng = imageBounds ? lngSpan / GRID_SIZE.columns : 0;

  const zonesArray = useMemo(
    () => Object.values(dataset).sort((a, b) => b.riskLevel - a.riskLevel),
    [dataset]
  );

  const filteredZones = useMemo(
    () => zonesArray.filter((z) => z.riskLevel >= riskThreshold),
    [zonesArray, riskThreshold]
  );

  const allSensors = useMemo(
    () =>
      Object.values(dataset).flatMap((z) =>
        z.sensors.filter((s) => sensorFilter.includes(s.type))
      ),
    [dataset, sensorFilter]
  );

  const selectedZone = selectedZoneId ? dataset[selectedZoneId] : null;
  const selectedSensor = selectedSensorId
    ? allSensors.find((s) => s.id === selectedSensorId) || null
    : null;

  const zoneRecommendation = useMemo(() => {
    if (!selectedZone) return null;
    return generateRecommendation(selectedZone);
  }, [selectedZone]);

  const [recExpanded, setRecExpanded] = useState(false);

  /** ---------- UI ---------- **/
  if (!imageLoaded || !imageBounds) {
    return (
      <div className="h-screen w-screen grid place-items-center bg-gray-900 text-gray-200">
        Loading Risk Map…
      </div>
    );
  }

  function severityColor(s: Severity) {
    if (s === "Immediate") return "#DC2626";
    if (s === "Urgent") return "#EF4444";
    if (s === "Advisory") return "#F59E0B";
    return "#10B981";
  }

  return (
    <div className="h-[calc(100vh-56px)] w-screen relative bg-gray-900 text-gray-200 overflow-hidden">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 bg-gray-800/95 border-b border-gray-700 z-[1002]">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-3">
            <button
              className="px-2 py-1 bg-gray-700 text-gray-200 border border-gray-600"
              onClick={() => history.back()}
            >
              ← Back
            </button>
            <span className="text-sm font-medium">Risk Map — Detailed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 text-xs bg-gray-700 text-gray-300 border border-gray-600">
              Last Update: {new Date().toLocaleTimeString()}
            </div>
            <div className="w-2 h-2 bg-green-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Left Panel (Collapsible) */}
      <div
        className={`absolute top-10 bottom-12 left-0 z-[1001] transition-all duration-200
        ${panelOpen ? "w-80" : "w-10"} bg-gray-800/95 border-r border-gray-700`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-2 py-2 border-b border-gray-700 mt-2">
            <span
              className={`font-semibold ${
                panelOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              Zones & Filters
            </span>
            <button
              className="text-gray-300 hover:text-white px-2"
              onClick={() => setPanelOpen(!panelOpen)}
              title={panelOpen ? "Collapse" : "Expand"}
            >
              {panelOpen ? "⟨" : "⟩"}
            </button>
          </div>

          <div className={`p-2 space-y-3 ${panelOpen ? "block" : "hidden"}`}>
            <div className="bg-gray-900 border border-gray-700 p-2">
              <div className="text-xs text-gray-400 mb-1">
                Risk threshold (min %)
              </div>

              <input
                type="range"
                min={0}
                max={100}
                value={riskThreshold}
                onChange={(e) => setRiskThreshold(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 appearance-none cursor-pointer"
                style={{ borderRadius: "0px" }}
              />

              <div className="text-sm">
                ≥{" "}
                <span className="text-white font-semibold">
                  {riskThreshold}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="absolute top-10 bottom-12 left-0 right-0">
        <MapContainer
          center={[BASE_COORDINATES.lat, BASE_COORDINATES.lng]}
          zoom={14}
          minZoom={13}
          maxZoom={17}
          style={{ height: "100%", width: "100%", backgroundColor: "#111827" }}
          zoomControl={false}
        >
          <LayersControl position="topright">
            {/* Base images (toggle) */}
            <LayersControl.BaseLayer
              checked={activeBase === "drone"}
              name="Drone imagery"
            >
              <LayerGroup>
                <ImageOverlay
                  url={DRONE_IMAGE_URL}
                  bounds={imageBounds}
                  opacity={0.85}
                />
              </LayerGroup>
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer
              checked={activeBase === "dem"}
              name="DEM (simulated)"
            >
              <LayerGroup>
                <ImageOverlay
                  url={DEM_IMAGE_URL}
                  bounds={imageBounds}
                  opacity={0.8}
                />
              </LayerGroup>
            </LayersControl.BaseLayer>

            {/* Grid overlay */}
            {showGrid && (
              <LayersControl.Overlay checked name="Grid">
                <LayerGroup>
                  {Array.from({ length: GRID_SIZE.rows }).map((_, r) =>
                    Array.from({ length: GRID_SIZE.columns }).map((_, c) => {
                      const slat = imageBounds[0][0] + r * cellLat;
                      const slng = imageBounds[0][1] + c * cellLng;
                      const b: [[number, number], [number, number]] = [
                        [slat, slng],
                        [slat + cellLat, slng + cellLng],
                      ];
                      const id = `g_${r}_${c}`;
                      return (
                        <Rectangle
                          key={id}
                          bounds={b}
                          pathOptions={{
                            color: "#4B5563",
                            weight: 1,
                            fillOpacity: 0,
                          }}
                        />
                      );
                    })
                  )}
                </LayerGroup>
              </LayersControl.Overlay>
            )}

            {/* Heatmap via colored cells (simulated) */}
            {showHeatmap && (
              <LayersControl.Overlay checked name="Risk heatmap">
                <LayerGroup>
                  {filteredZones.map((z) => (
                    <Rectangle
                      key={`hm_${z.id}`}
                      bounds={z.bounds}
                      pathOptions={{
                        color: z.riskColor,
                        weight: 0,
                        fillColor: z.riskColor,
                        fillOpacity: Math.min(
                          0.7,
                          0.25 + (z.riskLevel / 100) * 0.6
                        ),
                      }}
                      eventHandlers={{
                        click: () => {
                          setSelectedZoneId(z.id);
                          setSelectedSensorId(null);
                        },
                      }}
                    >
                      <LeafletTooltip
                        sticky
                        direction="top"
                        offset={[0, -8]}
                        className="zone-tooltip"
                      >
                        <div className="bg-gray-900 text-white p-2 text-sm border border-gray-600">
                          <div className="font-semibold">{z.id}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <div
                              className="w-3 h-3"
                              style={{ backgroundColor: z.riskColor }}
                            />
                            <span>
                              {z.risk} ({z.riskLevel}%)
                            </span>
                          </div>
                          <div className="text-gray-300 text-sm mt-1">
                            {z.sensors.length} sensors • {z.status}
                          </div>
                        </div>
                      </LeafletTooltip>
                    </Rectangle>
                  ))}
                </LayerGroup>
              </LayersControl.Overlay>
            )}

            {/* Zones (thin outlines) */}
            {showZones && (
              <LayersControl.Overlay checked name="Zone boundaries">
                <LayerGroup>
                  {filteredZones.map((z) => (
                    <Rectangle
                      key={`zb_${z.id}`}
                      bounds={z.bounds}
                      pathOptions={{
                        color: z.riskColor,
                        weight: selectedZoneId === z.id ? 3 : 1.5,
                        dashArray: "4,4",
                        fillOpacity: 0,
                      }}
                      eventHandlers={{
                        click: () => {
                          setSelectedZoneId(z.id);
                          setSelectedSensorId(null);
                        },
                      }}
                    />
                  ))}
                </LayerGroup>
              </LayersControl.Overlay>
            )}

            {/* Sensors */}
            {showSensors && (
              <LayersControl.Overlay checked name="Sensors">
                <LayerGroup>
                  {allSensors.map((s) => (
                    <CircleMarker
                      key={s.id}
                      center={[s.coordinates.lat, s.coordinates.lng]}
                      radius={selectedSensorId === s.id ? 6 : 4}
                      pathOptions={{
                        color: SENSOR_COLORS[s.status],
                        fillColor: SENSOR_COLORS[s.status],
                        fillOpacity: 0.9,
                        weight: 2,
                      }}
                      eventHandlers={{
                        click: (e) => {
                          e.originalEvent.stopPropagation();
                          setSelectedSensorId(s.id);
                          setSelectedZoneId(null);
                        },
                      }}
                    >
                      <LeafletTooltip
                        sticky
                        direction="top"
                        offset={[0, -10]}
                        className="sensor-tooltip"
                      >
                        <div className="bg-gray-800 text-white p-2 text-sm border border-gray-500">
                          <div className="text-lg font-bold">
                            {s.value}
                            {s.unit}
                          </div>
                          <div className="text-gray-300 capitalize">
                            {s.type.replace('_', ' ')}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {s.lastUpdate}
                          </div>
                        </div>
                      </LeafletTooltip>
                    </CircleMarker>
                  ))}
                </LayerGroup>
              </LayersControl.Overlay>
            )}
          </LayersControl>
        </MapContainer>
      </div>

      {/* Right Details Panel */}
      <div className="absolute top-10 bottom-12 right-0 w-96 bg-gray-800/95 border-l border-gray-700 z-[1001] overflow-auto">
        {selectedZone ? (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
              <div className="font-bold text-white mt-2">
                Zone {selectedZone.id}
              </div>
              <button
                className="text-gray-300 hover:text-white"
                onClick={() => setSelectedZoneId(null)}
              >
                ×
              </button>
            </div>

            <div className="p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4"
                    style={{ backgroundColor: selectedZone.riskColor }}
                  />
                  <span className="text-gray-300">
                    {selectedZone.risk} risk
                  </span>
                </div>
                <span className="text-white font-bold text-lg">
                  {selectedZone.riskLevel}%
                </span>
              </div>

              <div className="text-xs text-gray-400">
                {selectedZone.status} • Last updated {selectedZone.lastUpdated}
              </div>

              {/* Top sensors */}
              <div className="bg-gray-900 border border-gray-700 p-2">
                <div className="text-sm mb-2">Sensor Readings</div>
                <div className="grid grid-cols-1 gap-2 max-h-36 overflow-auto">
                  {selectedZone.sensors.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-2 bg-gray-700/40"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm capitalize">
                          {s.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-white font-semibold">
                        {s.value}
                        {s.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-700 p-2">
                <div className="text-sm mb-2">Sensor mix</div>
                <div className="h-36 w-85">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={Object.entries(
                        selectedZone.sensors.reduce<Record<string, number>>(
                          (acc, s) => {
                            acc[s.type] = (acc[s.type] || 0) + 1;
                            return acc;
                          },
                          {}
                        )
                      ).map(([k, v]) => ({ type: k, count: v }))}
                      margin={{ top: 10, left: 10, right: 10, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

                      <XAxis
                        dataKey="type"
                        interval="preserveStartEnd"
                        tick={{ fill: "#9ca3af", fontSize: 12 }}
                        tickFormatter={(value) => value.replace('_', ' ')}
                      />

                      <YAxis allowDecimals={false} />

                      <RechartsTooltip
                        contentStyle={{
                          background: "#111827",
                          border: "1px solid #374151",
                        }}
                        formatter={(value, name) => [
                          value,
                          typeof name === 'string' ? name.replace('_', ' ') : String(name)
                        ]}
                      />

                      <Bar
                        dataKey="count"
                        fill={selectedZone.riskColor}
                        barSize={30}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <ZoneRecommendationCard
                zone={selectedZone}
                onIssue={(zoneId, rec) => {
                  // TODO: POST to backend or emit via socket
                }}
                onAcknowledge={(zoneId, rec) => {
                }}
                onClose={() => setSelectedZoneId(null)}
              />
            </div>
          </div>
        ) : selectedSensor ? (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
              <div className="font-bold text-white capitalize">
                {selectedSensor.type.replace('_', ' ')} sensor
              </div>
              <button
                className="text-gray-300 hover:text-white"
                onClick={() => setSelectedSensorId(null)}
              >
                ×
              </button>
            </div>
            <div className="p-3 space-y-3">
              <div className="text-center p-4 bg-gray-700/50">
                <div className="text-2xl font-bold text-white">
                  {selectedSensor.value}
                  {selectedSensor.unit}
                </div>
                <div className="text-gray-300 capitalize mt-1">
                  {selectedSensor.status}
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-700 p-2">
                <div className="text-sm mb-1">Last 24h</div>
                <div className="h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={Array.from({ length: 24 }).map((_, h) => ({
                        t: `${h}:00`,
                        v: Math.max(
                          0,
                          Math.round(
                            selectedSensor.value +
                              Math.sin((h / 24) * Math.PI * 2) * 5 -
                              2
                          )
                        ),
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="t" hide />
                      <YAxis hide />
                      <RechartsTooltip
                        contentStyle={{
                          background: "#111827",
                          border: "1px solid #374151",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke="#93C5FD"
                        fill="#93C5FD"
                        fillOpacity={0.2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                Sensor ID: {selectedSensor.id}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full grid place-items-center text-sm text-gray-400">
            Select a zone or sensor
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gray-800/95 border-t border-gray-700 z-[1002]">
        <div className="flex items-center gap-3 px-3 py-2">
          <button
            className="px-2 py-1 bg-gray-700 border border-gray-600 text-white"
            onClick={() => setHourIndex((h) => (h - 1 + 24) % 24)}
            title="Prev hour"
          >
            ◀
          </button>

          <input
            type="range"
            min={0}
            max={23}
            value={hourIndex}
            onChange={(e) => setHourIndex(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-700 appearance-none cursor-pointer"
            style={{ borderRadius: "0px" }}
          />

          <button
            className="px-2 py-1 bg-gray-700 border border-gray-600 text-white"
            onClick={() => setHourIndex((h) => (h + 1) % 24)}
            title="Next hour"
          >
            ▶
          </button>
          <div className="text-sm w-24 text-right">Hour: {hourIndex}:00</div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-300">Risk</span>
            <div className="h-3 w-40 bg-gradient-to-r from-[#10B981] via-[#F59E0B] to-[#EF4444]" />
            <div className="text-xs">0</div>
            <div className="text-xs">30</div>
            <div className="text-xs">60</div>
            <div className="text-xs">100</div>
          </div>
        </div>
      </div>

      {/* Global Styles (match dashboard sharp corners) */}
      <style jsx global>{`
        .zone-tooltip,
        .sensor-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .leaflet-tooltip-top:before,
        .leaflet-tooltip-bottom:before {
          display: none !important;
        }
        .leaflet-container {
          background: #111827 !important;
        }
        .leaflet-control-zoom {
          display: none !important;
        }
        * {
          border-radius: 0 !important;
        }
      `}</style>
    </div>
  );
}