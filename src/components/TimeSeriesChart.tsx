// "use client";

// import { useState, useMemo } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip as RechartsTooltip,
//   ResponsiveContainer,
// } from "recharts";

// type RiskPoint = { t: string; v: number };

// export default function RiskChart() {
//   // 🔹 Threshold (user can later expose as slider/UI)
//   const [threshold] = useState<number>(60);

//   // 🔹 Interval in minutes (5, 10, 20, 30)
//   const [interval, setInterval] = useState<number>(10);

//   // 🔹 Generate random risk data for one day
//   const generateDayData = (step: number): RiskPoint[] => {
//     const points: RiskPoint[] = [];
//     for (let h = 0; h < 24; h++) {
//       for (let m = 0; m < 60; m += step) {
//         const label = `${h.toString().padStart(2, "0")}:${m
//           .toString()
//           .padStart(2, "0")}`;
//         const value = Math.floor(Math.random() * 101); // 0–100%
//         points.push({ t: label, v: value });
//       }
//     }
//     return points;
//   };

//   // 🔹 Generate monthly data (average per day from 1-day dataset)
//   const generateMonthData = (step: number): RiskPoint[] => {
//     const daysInMonth = 30;
//     const monthPoints: RiskPoint[] = [];

//     for (let d = 1; d <= daysInMonth; d++) {
//       let sum = 0;
//       const samples = (24 * 60) / step;
//       for (let i = 0; i < samples; i++) {
//         sum += Math.floor(Math.random() * 101);
//       }
//       const avg = Math.round(sum / samples);
//       monthPoints.push({ t: `Day ${d}`, v: avg });
//     }
//     return monthPoints;
//   };

//   // 🔹 Generate overall average for "all"
//   const generateAllData = (day: RiskPoint[], month: RiskPoint[]): RiskPoint[] => {
//     const avgDay =
//       day.reduce((acc, p) => acc + p.v, 0) / (day.length || 1);
//     const avgMonth =
//       month.reduce((acc, p) => acc + p.v, 0) / (month.length || 1);

//     return [
//       { t: "Day Avg", v: Math.round(avgDay) },
//       { t: "Month Avg", v: Math.round(avgMonth) },
//     ];
//   };

//   // 🔹 Memoized datasets
//   const dayData = useMemo(() => generateDayData(interval), [interval]);
//   const monthData = useMemo(() => generateMonthData(interval), [interval]);
//   const allData = useMemo(() => generateAllData(dayData, monthData), [dayData, monthData]);

//   // 🔹 View toggle
//   const [view, setView] = useState<"day" | "month" | "all">("day");

//   const getData = () => {
//     switch (view) {
//       case "day":
//         return dayData;
//       case "month":
//         return monthData;
//       case "all":
//         return allData;
//       default:
//         return [];
//     }
//   };

//   return (
//         <div className="bg-gray-900 border border-gray-700 rounded-lg h-full flex flex-col p-1">
//       {/* Header + toggle */}
//       <div className="flex items-center justify-between mb-2 flex-shrink-0">
//         <div className="text-sm font-medium text-gray-300">
//           Risk (
//           {view === "day"
//             ? `Last 24h (interval ${interval}m)`
//             : view === "month"
//             ? "This Month (daily avg)"
//             : "Overall Avg"}
//           )
//         </div>

//         <div className="flex gap-1 text-xs">
//           {["day", "month", "all"].map((opt) => (
//             <button
//               key={opt}
//               onClick={() => setView(opt as typeof view)}
//               className={`px-2 py-1 rounded ${
//                 view === opt
//                   ? "bg-gray-700 text-white"
//                   : "bg-gray-800 text-gray-400 hover:text-white"
//               }`}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Interval selector (only for day view) */}
//       {view === "day" && (
//          <div className="flex gap-2 mb-2 text-xs flex-shrink-0">
//           {[5, 10, 20, 30].map((i) => (
//             <button
//               key={i}
//               onClick={() => setInterval(i)}
//               className={`px-2 py-1 rounded ${
//                 interval === i
//                   ? "bg-gray-600 text-white"
//                   : "bg-gray-800 text-gray-400 hover:text-white"
//               }`}
//             >
//               {i}m
//             </button>
//           ))}
//         </div>
//       )}

//       {/* Chart */}
//       <div className="flex-grow h-[400px]">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={getData()}>
//             <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//             <XAxis dataKey="t" tick={{ fill: "#9ca3af", fontSize: 10 }} />
//             <YAxis domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 10 }} />
//             <RechartsTooltip
//               contentStyle={{
//                 background: "#111827",
//                 border: "1px solid #374151",
//               }}
//               formatter={(value: any) => [
//                 `${value}%`,
//                 "Risk",
//               ]}
//               // 🔹 Red tooltip if above threshold
//               labelStyle={{ color: "#f87171" }}
//               itemStyle={{ color: "#f87171" }}
//             />
//             <Line
//               type="linear"
//               dataKey="v"
//               dot={false}
//               strokeWidth={2}
//               isAnimationActive={false}
//               stroke="#22c55e"
//               // 🔹 Make line red if point > threshold
//               strokeDasharray={getData().some((p) => p.v > threshold) ? "0" : undefined}
//               strokeOpacity={1}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Threshold note */}
//        <div className="text-xs text-gray-500 mt-2 flex-shrink-0">
//         Threshold = {threshold}% (values above threshold show alert color)
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState, useMemo } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip as RechartsTooltip,
//   ResponsiveContainer,
// } from "recharts";

// type DataPoint = { t: string; v: number };

// // 🔹 Helper to generate forecast data
// const generateData = (type: "wind" | "rain", step = 3): DataPoint[] => {
//   const points: DataPoint[] = [];
//   for (let h = 0; h < 24; h += step) {
//     const label = `${h.toString().padStart(2, "0")}:00`;
//     let value = 0;
//     if (type === "wind") {
//       value = Math.floor(Math.random() * 61); // 0–60 km/h
//     } else {
//       value = Math.floor(Math.random() * 101); // 0–100 mm
//     }
//     points.push({ t: label, v: value });
//   }
//   return points;
// };

// // 🔹 Merge two datasets for "all" view
// const mergeData = (wind: DataPoint[], rain: DataPoint[]) => {
//   return wind.map((w, i) => ({
//     t: w.t,
//     wind: w.v,
//     rain: rain[i]?.v ?? 0,
//   }));
// };

// export default function ForecastChart() {
//   // View toggle
//   const [view, setView] = useState<"wind" | "rain" | "all">("wind");

//   // Forecast datasets
//   const windData = useMemo(() => generateData("wind"), []);
//   const rainData = useMemo(() => generateData("rain"), []);
//   const allData = useMemo(
//     () => mergeData(windData, rainData),
//     [windData, rainData]
//   );

//   // Get proper dataset for current view
//   const getData = () => {
//     if (view === "wind") return windData.map((d) => ({ ...d, wind: d.v }));
//     if (view === "rain") return rainData.map((d) => ({ ...d, rain: d.v }));
//     if (view === "all") return allData;
//     return [];
//   };

//   // Header text
//   const getHeader = () => {
//     if (view === "wind") return "Wind Forecast (km/h)";
//     if (view === "rain") return "Rainfall Forecast (mm)";
//     return "Wind + Rainfall Forecast";
//   };

//   return (
//     <div className="bg-gray-900 border border-gray-700 rounded-lg h-full flex flex-col p-1">
//       {/* Header + toggle */}
//       <div className="flex items-center justify-between mb-2 flex-shrink-0">
//         <div className="text-sm font-medium text-gray-300">{getHeader()}</div>

//         <div className="flex gap-1 text-xs">
//           {["wind", "rain", "all"].map((opt) => (
//             <button
//               key={opt}
//               onClick={() => setView(opt as typeof view)}
//               className={`px-2 py-1 rounded ${
//                 view === opt
//                   ? "bg-gray-700 text-white"
//                   : "bg-gray-800 text-gray-400 hover:text-white"
//               }`}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Chart */}
//       <div className="flex-grow h-[400px]">
//         <ResponsiveContainer width="100%" height="100%">
//           <LineChart data={getData()}>
//             <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//             <XAxis dataKey="t" tick={{ fill: "#9ca3af", fontSize: 10 }} />
//             <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
//             <RechartsTooltip
//               contentStyle={{
//                 background: "#111827",
//                 border: "1px solid #374151",
//               }}
//               formatter={(value: string | number, name: string) => {
//                 if (name === "wind") return [`${value} km/h`, "Wind"];
//                 if (name === "rain") return [`${value} mm`, "Rainfall"];
//                 return value;
//               }}
//             />

//             {/* Wind only */}
//             {view === "wind" && (
//               <Line
//                 type="linear"
//                 dataKey="wind"
//                 stroke="#3A86FF"
//                 strokeWidth={2}
//                 dot={false}
//               />
//             )}

//             {/* Rain only */}
//             {view === "rain" && (
//               <Line
//                 type="linear"
//                 dataKey="rain"
//                 stroke="#14b8a6"
//                 strokeWidth={2}
//                 dot={false}
//               />
//             )}

//             {/* Both together */}
//             {view === "all" && (
//               <>
//                 <Line
//                   type="linear"
//                   dataKey="wind"
//                   stroke="#3A86FF"
//                   strokeWidth={2}
//                   dot={false}
//                   name="wind"
//                 />
//                 <Line
//                   type="linear"
//                   dataKey="rain"
//                   stroke="#14b8a6"
//                   strokeWidth={2}
//                   dot={false}
//                   name="rain"
//                 />
//               </>
//             )}
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Note */}
//       <div className="text-xs text-gray-500 mt-2 flex-shrink-0">
//         Forecast values are simulated at IMD-like 3-hour intervals.
//       </div>
//     </div>
//   );
// }


// "use client";

// import React, { useState, useMemo } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip as RechartsTooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
// } from "recharts";

// type DataPoint = { t: string; v: number };
// type LineDataPoint = { featureValue: number; risk: number };
// type BarDataPoint = { feature: string; contribution: number };

// // Forecast generator
// const generateForecastData = (type: "wind" | "rain", step = 3): DataPoint[] => {
//   const points: DataPoint[] = [];
//   for (let h = 0; h < 24; h += step) {
//     const label = `${h.toString().padStart(2, "0")}:00`;
//     const value = type === "wind" ? Math.floor(Math.random() * 61) : Math.floor(Math.random() * 101);
//     points.push({ t: label, v: value });
//   }
//   return points;
// };
// const mergeForecast = (wind: DataPoint[], rain: DataPoint[]) =>
//   wind.map((w, i) => ({ t: w.t, wind: w.v, rain: rain[i]?.v ?? 0 }));

// // XAI generators
// const generateLineData = (): LineDataPoint[] =>
//   Array.from({ length: 11 }, (_, i) => ({ featureValue: i * 5, risk: Math.random() * 100 }));

// const generateBarData = (features: string[]): BarDataPoint[] => {
//   const data: BarDataPoint[] = [];
//   let remaining = 100;
//   for (let i = 0; i < features.length; i++) {
//     const value = i === features.length - 1 ? remaining : Math.floor(Math.random() * remaining);
//     data.push({ feature: features[i], contribution: value });
//     remaining -= value;
//   }
//   return data;
// };

// export default function DashboardCharts() {
//   const [view, setView] = useState<
//     | "wind"
//     | "rain"
//     | "all"
//     | "lineSlope"
//     | "lineRoughness"
//     | "barSHAP"
//     | "barHorizontal"
//   >("wind");

//   // Forecast
//   const windData = useMemo(() => generateForecastData("wind"), []);
//   const rainData = useMemo(() => generateForecastData("rain"), []);
//   const allData = useMemo(() => mergeForecast(windData, rainData), [windData, rainData]);

//   // XAI
//   const lineSlopeData = useMemo(() => generateLineData(), []);
//   const lineRoughnessData = useMemo(() => generateLineData(), []);
//   const shapData = useMemo(
//     () => generateBarData(["rainfall", "slope angle", "pore pressure", "roughness"]),
//     []
//   );
//   const horizontalData = useMemo(
//     () => generateBarData(["slope angle", "roughness", "seeder height"]),
//     []
//   );

//   const getHeader = () => {
//     switch (view) {
//       case "wind":
//         return "Wind Forecast (km/h)";
//       case "rain":
//         return "Rainfall Forecast (mm)";
//       case "all":
//         return "Wind + Rainfall Forecast";
//       case "lineSlope":
//         return "Slope Angle vs Risk";
//       case "lineRoughness":
//         return "Roughness vs Risk";
//       case "barSHAP":
//         return "Feature Contribution (SHAP)";
//       case "barHorizontal":
//         return "Feature Contribution (Horizontal)";
//       default:
//         return "";
//     }
//   };

//   const getForecastData = () => {
//     if (view === "wind") return windData.map((d) => ({ ...d, wind: d.v }));
//     if (view === "rain") return rainData.map((d) => ({ ...d, rain: d.v }));
//     if (view === "all") return allData;
//     return [];
//   };

//   // --- IMPORTANT: chartNode must be a ReactElement that accepts width/height props ---
//   // Use an empty LineChart as a safe default (LineChart accepts width/height injected by ResponsiveContainer)
//   let chartNode: React.ReactElement = <LineChart data={[]} />;

//   // Forecast charts (LineChart is the direct child when in forecast views)
//   if (view === "wind" || view === "rain" || view === "all") {
//     const data = getForecastData();
//     chartNode = (
//       <LineChart data={data}>
//         <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//         <XAxis dataKey="t" tick={{ fill: "#9ca3af", fontSize: 10 }} />
//         <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
//         <RechartsTooltip
//           contentStyle={{ background: "#111827", border: "1px solid #374151" }}
//           formatter={(value: number, name: string) => {
//             if (name === "wind") return [`${value} km/h`, "Wind"];
//             if (name === "rain") return [`${value} mm`, "Rainfall"];
//             return value;
//           }}
//         />
//         {view === "wind" && <Line type="linear" dataKey="wind" stroke="#3A86FF" strokeWidth={2} dot={false} />}
//         {view === "rain" && <Line type="linear" dataKey="rain" stroke="#14b8a6" strokeWidth={2} dot={false} />}
//         {view === "all" && (
//           <>
//             <Line type="linear" dataKey="wind" stroke="#3A86FF" strokeWidth={2} dot={false} name="Wind" />
//             <Line type="linear" dataKey="rain" stroke="#14b8a6" strokeWidth={2} dot={false} name="Rainfall" />
//           </>
//         )}
//       </LineChart>
//     );
//   }

//   // XAI line charts
//   else if (view === "lineSlope" || view === "lineRoughness") {
//     const data = view === "lineSlope" ? lineSlopeData : lineRoughnessData;
//     chartNode = (
//       <LineChart data={data}>
//         <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//         <XAxis dataKey="featureValue" tick={{ fill: "#9ca3af", fontSize: 10 }} />
//         <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
//         <RechartsTooltip
//           contentStyle={{ background: "#111827", border: "1px solid #374151" }}
//           formatter={(value: number) => [`${value.toFixed(1)}%`, "Risk"]}
//         />
//         <Line
//           type="monotone"
//           dataKey="risk"
//           stroke={view === "lineSlope" ? "#3A86FF" : "#14b8a6"}
//           strokeWidth={2}
//           dot={false}
//         />
//       </LineChart>
//     );
//   }

//   // XAI vertical bar
//   else if (view === "barSHAP") {
//     chartNode = (
//       <BarChart data={shapData}>
//         <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//         <XAxis dataKey="feature" tick={{ fill: "#9ca3af", fontSize: 10 }} />
//         <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
//         <RechartsTooltip
//           contentStyle={{ background: "#111827", border: "1px solid #374151" }}
//           formatter={(value: number) => [`${value}%`, "Contribution"]}
//         />
//         <Bar dataKey="contribution" fill="#f97316" />
//       </BarChart>
//     );
//   }

//   // XAI horizontal bar
//   else if (view === "barHorizontal") {
//     chartNode = (
//       <BarChart layout="vertical" data={horizontalData}>
//         <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//         <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 10 }} />
//         <YAxis type="category" dataKey="feature" tick={{ fill: "#9ca3af", fontSize: 10 }} />
//         <RechartsTooltip
//           contentStyle={{ background: "#111827", border: "1px solid #374151" }}
//           formatter={(value: number) => [`${value}%`, "Contribution"]}
//         />
//         <Bar dataKey="contribution" fill="#3A86FF" />
//       </BarChart>
//     );
//   }

//   return (
//     <div className="bg-gray-900 border border-gray-700 rounded-lg h-full flex flex-col p-2">
//       <div className="flex items-center justify-between mb-2 flex-shrink-0">
//         <div className="text-sm font-medium text-gray-300">{getHeader()}</div>
//         <div className="flex gap-1 text-xs flex-wrap">
//           {[
//             { key: "wind", label: "Wind" },
//             { key: "rain", label: "Rain" },
//             { key: "all", label: "Wind+Rain" },
//             { key: "lineSlope", label: "Slope Risk" },
//             { key: "lineRoughness", label: "Roughness Risk" },
//             { key: "barSHAP", label: "SHAP" },
//           ].map((opt) => (
//             <button
//               key={opt.key}
//               onClick={() => setView(opt.key as typeof view)}
//               className={`px-2 py-1 rounded ${
//                 view === opt.key ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
//               }`}
//             >
//               {opt.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="flex-grow h-[400px]">
//         <ResponsiveContainer width="100%" height="100%">
//           {chartNode}
//         </ResponsiveContainer>
//       </div>

//       <div className="text-xs text-gray-500 mt-2">Values are randomly generated for demo purposes.</div>
//     </div>
//   );
// }


// "use client";

// import React, { useMemo } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip as RechartsTooltip,
//   BarChart,
//   Bar,
// } from "recharts";

// // Types
// type DataPoint = { t: string; v: number };
// type LineDataPoint = { featureValue: number; risk: number };
// type BarDataPoint = { feature: string; contribution: number };

// // Forecast generator
// const generateForecastData = (type: "wind" | "rain", step = 3): DataPoint[] => {
//   const points: DataPoint[] = [];
//   for (let h = 0; h < 24; h += step) {
//     const label = `${h.toString().padStart(2, "0")}:00`;
//     const value =
//       type === "wind" ? Math.floor(Math.random() * 61) : Math.floor(Math.random() * 101);
//     points.push({ t: label, v: value });
//   }
//   return points;
// };
// const mergeForecast = (wind: DataPoint[], rain: DataPoint[]) =>
//   wind.map((w, i) => ({ t: w.t, wind: w.v, rain: rain[i]?.v ?? 0 }));

// // Data
// const slopeData: LineDataPoint[] = Array.from({ length: 11 }, (_, i) => ({
//   featureValue: i * 10,
//   risk: Math.random() * 100,
// }));
// const roughnessData: LineDataPoint[] = Array.from({ length: 11 }, (_, i) => ({
//   featureValue: i * 10,
//   risk: Math.random() * 100,
// }));

// const shapData: BarDataPoint[] = [
//   { feature: "rainfall", contribution: 40 },
//   { feature: "slope angle", contribution: 25 },
//   { feature: "pore pressure", contribution: 20 },
//   { feature: "roughness", contribution: 15 },
// ];

// export default function RiskChartsColumn() {
//   // Forecast
//   const windData = useMemo(() => generateForecastData("wind"), []);
//   const rainData = useMemo(() => generateForecastData("rain"), []);
//   const allData = useMemo(() => mergeForecast(windData, rainData), [windData, rainData]);

//   return (
//     <div className="bg-gray-900 border border-gray-700 rounded-lg h-full flex flex-col p-2">
//       <div className="text-sm font-medium text-gray-300 mb-2">
//         Risk Analysis Charts
//       </div>

//       <div className="flex-grow overflow-y-auto overflow-x-hidden space-y-6 pr-2">
//         {/* Wind */}
//         <div className="h-[300px] w-full">
//           <div className="text-xs text-gray-400 mb-1">Wind Forecast (km/h)</div>
//           <LineChart data={windData} width={1000} height={280}>
//             <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//             <XAxis dataKey="t" tick={{ fill: "#9ca3af", fontSize: 10 }} />
//             <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
//             <RechartsTooltip contentStyle={{ background: "#111827", border: "1px solid #374151" }} />
//             <Line type="linear" dataKey="v" stroke="#3A86FF" strokeWidth={2} dot={false} />
//           </LineChart>
//         </div>

//         {/* Rain */}
//         <div className="h-[300px] w-full">
//           <div className="text-xs text-gray-400 mb-1">Rainfall Forecast (mm)</div>
//           <LineChart data={rainData} width={1000} height={280}>
//             <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//             <XAxis dataKey="t" tick={{ fill: "#9ca3af", fontSize: 10 }} />
//             <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
//             <RechartsTooltip contentStyle={{ background: "#111827", border: "1px solid #374151" }} />
//             <Line type="linear" dataKey="v" stroke="#14b8a6" strokeWidth={2} dot={false} />
//           </LineChart>
//         </div>

//         {/* Wind + Rain */}
//         <div className="h-[300px] w-full">
//           <div className="text-xs text-gray-400 mb-1">Wind + Rain Forecast</div>
//           <LineChart data={allData} width={1000} height={280}>
//             <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//             <XAxis dataKey="t" tick={{ fill: "#9ca3af", fontSize: 10 }} />
//             <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
//             <RechartsTooltip contentStyle={{ background: "#111827", border: "1px solid #374151" }} />
//             <Line type="linear" dataKey="wind" stroke="#3A86FF" strokeWidth={2} dot={false} />
//             <Line type="linear" dataKey="rain" stroke="#14b8a6" strokeWidth={2} dot={false} />
//           </LineChart>
//         </div>

//         {/* Slope Risk */}
//         <div className="h-[300px] w-full">
//           <div className="text-xs text-gray-400 mb-1">Slope Angle vs Risk</div>
//           <LineChart data={slopeData} width={1000} height={280}>
//             <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//             <XAxis dataKey="featureValue" tick={{ fill: "#9ca3af", fontSize: 10 }} />
//             <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
//             <RechartsTooltip
//               contentStyle={{ background: "#111827", border: "1px solid #374151" }}
//               formatter={(value: number) => [`${value.toFixed(1)}%`, "Risk"]}
//             />
//             <Line type="monotone" dataKey="risk" stroke="#3A86FF" strokeWidth={2} dot={false} />
//           </LineChart>
//         </div>

//         {/* Roughness Risk */}
//         <div className="h-[300px] w-full">
//           <div className="text-xs text-gray-400 mb-1">Roughness vs Risk</div>
//           <LineChart data={roughnessData} width={1000} height={280}>
//             <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//             <XAxis dataKey="featureValue" tick={{ fill: "#9ca3af", fontSize: 10 }} />
//             <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
//             <RechartsTooltip
//               contentStyle={{ background: "#111827", border: "1px solid #374151" }}
//               formatter={(value: number) => [`${value.toFixed(1)}%`, "Risk"]}
//             />
//             <Line type="monotone" dataKey="risk" stroke="#14b8a6" strokeWidth={2} dot={false} />
//           </LineChart>
//         </div>

//         {/* SHAP */}
//         <div className="h-[300px] w-full">
//           <div className="text-xs text-gray-400 mb-1">Feature Contribution (SHAP)</div>
//           <BarChart layout="vertical" data={shapData} width={1000} height={280}>
//             <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//             <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 10 }} />
//             <YAxis type="category" dataKey="feature" tick={{ fill: "#9ca3af", fontSize: 10 }} />
//             <RechartsTooltip
//               contentStyle={{ background: "#111827", border: "1px solid #374151" }}
//               formatter={(value: number) => [`${value}%`, "Contribution"]}
//             />
//             <Bar dataKey="contribution" fill="#3A86FF" />
//           </BarChart>
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import React, { useRef, useLayoutEffect, useState, useMemo } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip as RechartsTooltip,
//   BarChart,
//   Bar,
// } from "recharts";

// /* ---------- types (small) ---------- */
// type DataPoint = { t: string; v: number };
// type LineDataPoint = { featureValue: number; risk: number };
// type BarDataPoint = { feature: string; contribution: number };

// /* ---------- AutoSizer: measure container with ResizeObserver ---------- */
// function AutoSizer({
//   children,
//   className,
//   minHeight = 120,
// }: {
//   children: (size: { width: number; height: number }) => React.ReactNode;
//   className?: string;
//   minHeight?: number;
// }) {
//   const ref = useRef<HTMLDivElement | null>(null);
//   const [size, setSize] = useState({ width: 0, height: minHeight });

//   useLayoutEffect(() => {
//     if (!ref.current) return;

//     // initial measurement
//     const el = ref.current;
//     const setRect = () =>
//       setSize({
//         width: Math.max(0, Math.floor(el.clientWidth)),
//         height: Math.max(minHeight, Math.floor(el.clientHeight)),
//       });

//     // set initial
//     setRect();

//     // Create observer
//     const ro = new ResizeObserver(() => {
//       // Use rAF to avoid jank on rapid resize
//       window.requestAnimationFrame(setRect);
//     });
//     ro.observe(el);

//     return () => {
//       ro.disconnect();
//     };
//   }, [minHeight]);

//   return (
//     <div ref={ref} className={className ?? "w-full"}>
//       {children(size)}
//     </div>
//   );
// }

// /* ---------- helpers: sample/generator data ---------- */
// const generateForecastData = (type: "wind" | "rain", step = 3): DataPoint[] => {
//   const points: DataPoint[] = [];
//   for (let h = 0; h < 24; h += step) {
//     const label = `${h.toString().padStart(2, "0")}:00`;
//     const value = type === "wind" ? Math.floor(Math.random() * 61) : Math.floor(Math.random() * 101);
//     points.push({ t: label, v: value });
//   }
//   return points;
// };
// const mergeForecast = (wind: DataPoint[], rain: DataPoint[]) =>
//   wind.map((w, i) => ({ t: w.t, wind: w.v, rain: rain[i]?.v ?? 0 }));

// const slopeData: LineDataPoint[] = Array.from({ length: 11 }, (_, i) => ({
//   featureValue: i * 10,
//   risk: Math.random() * 100,
// }));
// const roughnessData: LineDataPoint[] = Array.from({ length: 11 }, (_, i) => ({
//   featureValue: i * 10,
//   risk: Math.random() * 100,
// }));

// const shapData: BarDataPoint[] = [
//   { feature: "rainfall", contribution: 40 },
//   { feature: "slope angle", contribution: 25 },
//   { feature: "pore pressure", contribution: 20 },
//   { feature: "roughness", contribution: 15 },
// ];

// /* ---------- ChartBlock: title + autosized chart area ---------- */
// function ChartBlock({
//   title,
//   height = 300,
//   children,
// }: {
//   title: string;
//   height?: number;
//   children: (size: { width: number; height: number }) => React.ReactNode;
// }) {
//   return (
//     <div className="w-full">
//       <div className="text-xs text-gray-400 mb-1">{title}</div>

//       {/* AutoSizer measures the exact width/height available for the chart */}
//       <AutoSizer className={`w-full h-[${height}px]`} minHeight={120}>
//         {(size) => <div style={{ width: "100%", height: size.height }}>{children(size)}</div>}
//       </AutoSizer>
//     </div>
//   );
// }

// /* ---------- The final stacked column component (no horizontal scroll) ---------- */
// export default function RiskChartsAuto() {
//   const windData = useMemo(() => generateForecastData("wind"), []);
//   const rainData = useMemo(() => generateForecastData("rain"), []);
//   const allData = useMemo(() => mergeForecast(windData, rainData), [windData, rainData]);

//   return (
//     <div className="bg-gray-900 border border-gray-700 rounded-lg h-full flex flex-col p-2">
//       <div className="text-sm font-medium text-gray-300 mb-2">Risk Analysis Charts</div>

//       {/* Column container: vertical scroll only, no horizontal scroll */}
//       <div className="flex-grow overflow-y-auto overflow-x-hidden space-y-6 pr-2">
//         {/* Wind */}
//         <div className="w-full">
//           <ChartBlock title="Wind Forecast (km/h)" height={300}>
//             {({ width, height }) => (
//               <LineChart data={windData} width={width} height={height}>
//                 <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//                 <XAxis dataKey="t" tick={{ fill: "#9ca3af", fontSize: 10 }} />
//                 <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
//                 <RechartsTooltip contentStyle={{ background: "#111827", border: "1px solid #374151" }} />
//                 <Line type="linear" dataKey="v" stroke="#3A86FF" strokeWidth={2} dot={false} />
//               </LineChart>
//             )}
//           </ChartBlock>
//         </div>

//         {/* Rain */}
//         <div className="w-full">
//           <ChartBlock title="Rainfall Forecast (mm)" height={300}>
//             {({ width, height }) => (
//               <LineChart data={rainData} width={width} height={height}>
//                 <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//                 <XAxis dataKey="t" tick={{ fill: "#9ca3af", fontSize: 10 }} />
//                 <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
//                 <RechartsTooltip contentStyle={{ background: "#111827", border: "1px solid #374151" }} />
//                 <Line type="linear" dataKey="v" stroke="#14b8a6" strokeWidth={2} dot={false} />
//               </LineChart>
//             )}
//           </ChartBlock>
//         </div>

//         {/* Wind + Rain */}
//         <div className="w-full">
//           <ChartBlock title="Wind + Rain Forecast" height={320}>
//             {({ width, height }) => (
//               <LineChart data={allData} width={width} height={height}>
//                 <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//                 <XAxis dataKey="t" tick={{ fill: "#9ca3af", fontSize: 10 }} />
//                 <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
//                 <RechartsTooltip contentStyle={{ background: "#111827", border: "1px solid #374151" }} />
//                 <Line type="linear" dataKey="wind" stroke="#3A86FF" strokeWidth={2} dot={false} />
//                 <Line type="linear" dataKey="rain" stroke="#14b8a6" strokeWidth={2} dot={false} />
//               </LineChart>
//             )}
//           </ChartBlock>
//         </div>

//         {/* Slope risk (X axis 0..100) */}
//         <div className="w-full">
//           <ChartBlock title="Slope Angle vs Risk" height={300}>
//             {({ width, height }) => (
//               <LineChart data={slopeData} width={width} height={height}>
//                 <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//                 <XAxis
//                   dataKey="featureValue"
//                   tick={{ fill: "#9ca3af", fontSize: 10 }}
//                   domain={[0, 100]}
//                   type="number"
//                 />
//                 <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
//                 <RechartsTooltip
//                   contentStyle={{ background: "#111827", border: "1px solid #374151" }}
//                   formatter={(value: number) => [`${value.toFixed(1)}%`, "Risk"]}
//                 />
//                 <Line type="monotone" dataKey="risk" stroke="#3A86FF" strokeWidth={2} dot={false} />
//               </LineChart>
//             )}
//           </ChartBlock>
//         </div>

//         {/* Roughness risk (X axis 0..100) */}
//         <div className="w-full">
//           <ChartBlock title="Roughness vs Risk" height={300}>
//             {({ width, height }) => (
//               <LineChart data={roughnessData} width={width} height={height}>
//                 <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//                 <XAxis
//                   dataKey="featureValue"
//                   tick={{ fill: "#9ca3af", fontSize: 10 }}
//                   domain={[0, 100]}
//                   type="number"
//                 />
//                 <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
//                 <RechartsTooltip
//                   contentStyle={{ background: "#111827", border: "1px solid #374151" }}
//                   formatter={(value: number) => [`${value.toFixed(1)}%`, "Risk"]}
//                 />
//                 <Line type="monotone" dataKey="risk" stroke="#14b8a6" strokeWidth={2} dot={false} />
//               </LineChart>
//             )}
//           </ChartBlock>
//         </div>

//         {/* SHAP horizontal */}
//         <div className="w-full">
//           <ChartBlock title="Feature Contribution (SHAP)" height={260}>
//             {({ width, height }) => (
//               <BarChart data={shapData} layout="vertical" width={width} height={height}>
//                 <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
//                 <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 10 }} />
//                 <YAxis type="category" dataKey="feature" tick={{ fill: "#9ca3af", fontSize: 10 }} />
//                 <RechartsTooltip
//                   contentStyle={{ background: "#111827", border: "1px solid #374151" }}
//                   formatter={(value: number) => [`${value}%`, "Contribution"]}
//                 />
//                 <Bar dataKey="contribution" fill="#3A86FF" />
//               </BarChart>
//             )}
//           </ChartBlock>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useRef, useLayoutEffect, useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
} from "recharts";

/* ---------- small types ---------- */
type DataPoint = { t: string; v: number };
type LineDataPoint = { featureValue: number; risk: number };
type BarDataPoint = { feature: string; contribution: number };

/* ---------- AutoSizer (ResizeObserver) ---------- */
function AutoSizer({
  children,
  style,
  minHeight = 120,
}: {
  children: (size: { width: number; height: number }) => React.ReactNode;
  style?: React.CSSProperties;
  minHeight?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: minHeight });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const setRect = () =>
      setSize({
        width: Math.max(0, Math.floor(el.clientWidth)),
        height: Math.max(minHeight, Math.floor(el.clientHeight)),
      });

    setRect();
    const ro = new ResizeObserver(() => {
      window.requestAnimationFrame(setRect);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [minHeight]);

  return (
    <div ref={ref} style={{ width: "100%", boxSizing: "border-box", ...(style ?? {}) }}>
      {children(size)}
    </div>
  );
}

/* ---------- sample data ---------- */
const generateForecastData = (type: "wind" | "rain", step = 3): DataPoint[] => {
  const points: DataPoint[] = [];
  for (let h = 0; h < 24; h += step) {
    const label = `${h.toString().padStart(2, "0")}:00`;
    const value = type === "wind" ? Math.floor(Math.random() * 61) : Math.floor(Math.random() * 101);
    points.push({ t: label, v: value });
  }
  return points;
};
const mergeForecast = (wind: DataPoint[], rain: DataPoint[]) =>
  wind.map((w, i) => ({ t: w.t, wind: w.v, rain: rain[i]?.v ?? 0 }));

const slopeData: LineDataPoint[] = Array.from({ length: 11 }, (_, i) => ({
  featureValue: i * 10,
  risk: +(Math.random() * 100).toFixed(2),
}));
const roughnessData: LineDataPoint[] = Array.from({ length: 11 }, (_, i) => ({
  featureValue: i * 10,
  risk: +(Math.random() * 100).toFixed(2),
}));

const shapData: BarDataPoint[] = [
  { feature: "rainfall", contribution: 40 },
  { feature: "slope angle", contribution: 25 },
  { feature: "pore pressure", contribution: 20 },
  { feature: "roughness", contribution: 15 },
];

/* ---------- ChartBlock: title + autosized chart area ---------- */
function ChartBlock({
  title,
  height = 260,
  children,
}: {
  title: string;
  height?: number;
  children: (size: { width: number; height: number }) => React.ReactNode;
}) {
  return (
    <div className="w-full box-border">
      <div className="text-xs text-gray-300 mb-2">{title}</div>
      {/* AutoSizer must have explicit height so it can measure */}
      <AutoSizer style={{ height, boxSizing: "border-box" }}>
        {(size) => <div style={{ width: "100%", height: size.height }}>{children(size)}</div>}
      </AutoSizer>
    </div>
  );
}

/* ---------- final component ---------- */
export default function RiskChartsFixedWidth() {
  const windData = useMemo(() => generateForecastData("wind"), []);
  const rainData = useMemo(() => generateForecastData("rain"), []);
  const allData = useMemo(() => mergeForecast(windData, rainData), [windData, rainData]);

  // Shared small margins so plot fills width
  const chartMargin = { left: 12, right: 12, top: 8, bottom: 28 };

  return (
   <div className="bg-gray-900 border border-gray-700 rounded-lg h-full flex flex-col-reverse p-3">
  <div className="text-sm font-medium text-gray-300 mb-3">Risk Analysis Charts</div>

  <div className="flex-grow overflow-y-auto overflow-x-hidden space-y-6 pr-2 w-full">

    {/* SHAP horizontal */}
    <ChartBlock title="Feature Contribution (SHAP)" height={260}>
      {({ width, height }) => (
        <BarChart
          layout="vertical"
          data={shapData}
          width={width}
          height={height}
          margin={{ left: 4, right: 4, top: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
          <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 10 }} />
          <YAxis
            type="category"
            dataKey="feature"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
            width={100} // keep tight to allow bars full width
          />
          <RechartsTooltip
            contentStyle={{ background: "#111827", border: "1px solid #374151" }}
            formatter={(value: number) => [`${value}%`, "Contribution"]}
          />
          <Bar dataKey="contribution" fill="#3A86FF" />
        </BarChart>
      )}
    </ChartBlock>

        {/* Slope */}
    <ChartBlock title="Slope Angle vs Risk" height={160}>
      {({ width, height }) => (
        <LineChart
          data={slopeData}
          width={width}
          height={height}
          margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
          <XAxis
            dataKey="featureValue"
            type="number"
            domain={[0, 100]}
            tick={{ fill: "#9ca3af", fontSize: 10 }}
          />
          <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
          <RechartsTooltip
            contentStyle={{ background: "#111827", border: "1px solid #374151" }}
            formatter={(value: number) => [`${value.toFixed(1)}%`, "Risk"]}
          />
          <Line type="monotone" dataKey="risk" stroke="#3A86FF" strokeWidth={2} dot={false} />
        </LineChart>
      )}
    </ChartBlock>

    {/* Roughness */}
    <ChartBlock title="Roughness vs Risk" height={160}>
      {({ width, height }) => (
        <LineChart
          data={roughnessData}
          width={width}
          height={height}
          margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
          <XAxis
            dataKey="featureValue"
            type="number"
            domain={[0, 100]}
            tick={{ fill: "#9ca3af", fontSize: 10 }}
          />
          <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
          <RechartsTooltip
            contentStyle={{ background: "#111827", border: "1px solid #374151" }}
            formatter={(value: number) => [`${value.toFixed(1)}%`, "Risk"]}
          />
          <Line type="monotone" dataKey="risk" stroke="#14b8a6" strokeWidth={2} dot={false} />
        </LineChart>
      )}
    </ChartBlock>

    {/* Wind */}
    <ChartBlock title="Wind Forecast (km/h)" height={180}>
      {({ width, height }) => (
        <LineChart data={windData} width={width} height={height} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
          <XAxis dataKey="t" tick={{ fill: "#9ca3af", fontSize: 10 }} />
          <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
          <RechartsTooltip contentStyle={{ background: "#111827", border: "1px solid #374151" }} />
          <Line type="linear" dataKey="v" stroke="#3A86FF" strokeWidth={2} dot={false} />
        </LineChart>
      )}
    </ChartBlock>

    {/* Rain */}
    <ChartBlock title="Rainfall Forecast (mm)" height={180}>
      {({ width, height }) => (
        <LineChart data={rainData} width={width} height={height} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
          <XAxis dataKey="t" tick={{ fill: "#9ca3af", fontSize: 10 }} />
          <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
          <RechartsTooltip contentStyle={{ background: "#111827", border: "1px solid #374151" }} />
          <Line type="linear" dataKey="v" stroke="#14b8a6" strokeWidth={2} dot={false} />
        </LineChart>
      )}
    </ChartBlock>

    {/* Wind + Rain — larger */}
    <ChartBlock title="Wind + Rain Forecast" height={260}>
      {({ width, height }) => (
        <LineChart data={allData} width={width} height={height} margin={{ left: 18, right: 8, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
          <XAxis dataKey="t" tick={{ fill: "#9ca3af", fontSize: 10 }} />
          <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
          <RechartsTooltip contentStyle={{ background: "#111827", border: "1px solid #374151" }} />
          <Line type="linear" dataKey="wind" stroke="#3A86FF" strokeWidth={2} dot={false} />
          <Line type="linear" dataKey="rain" stroke="#14b8a6" strokeWidth={2} dot={false} />
        </LineChart>
      )}
    </ChartBlock>



  </div>
</div>
  );
}
//  <div className="bg-gray-900 border border-gray-700 rounded-lg h-full flex flex-col-reverse p-3">
//       <div className="text-sm font-medium text-gray-300 mb-3">Risk Analysis Charts</div>

//       <div className="flex-grow overflow-y-auto overflow-x-hidden space-y-6 pr-2 ">

//         {/* SHAP horizontal — use YAxis.width to reserve label space (not margin.left) */}
//         <ChartBlock title="Feature Contribution (SHAP)" height={260}>
//           {({ width, height }) => (
//             <BarChart
//               data={shapData}
//               layout="vertical"
//               width={width}
//               height={height}
//               margin={{ left: 4, right: 4, top: 8, bottom: 8 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
//               <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 10 }} />
//               <YAxis
//                 type="category"
//                 dataKey="feature"
//                 tick={{ fill: "#9ca3af", fontSize: 12 }}
//                 width={100}   // keep tight so bars can use more space
//               />
//               <RechartsTooltip
//                 contentStyle={{ background: "#111827", border: "1px solid #374151" }}
//                 formatter={(value: number) => [`${value}%`, "Contribution"]}
//               />
//               <Bar dataKey="contribution" fill="#3A86FF" />
//             </BarChart>
//           )}
//         </ChartBlock>
//         {/* Wind */}
//         <ChartBlock title="Wind Forecast (km/h)" height={220}>
//           {({ width, height }) => (
//             <LineChart data={windData} width={width} height={height} margin={chartMargin}>
//               <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
//               <XAxis dataKey="t" tick={{ fill: "#9ca3af", fontSize: 10 }} />
//               <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
//               <RechartsTooltip contentStyle={{ background: "#111827", border: "1px solid #374151" }} />
//               <Line type="linear" dataKey="v" stroke="#3A86FF" strokeWidth={2} dot={false} />
//             </LineChart>
//           )}
//         </ChartBlock>

//         {/* Rain */}
//         <ChartBlock title="Rainfall Forecast (mm)" height={220}>
//           {({ width, height }) => (
//             <LineChart data={rainData} width={width} height={height} margin={chartMargin}>
//               <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
//               <XAxis dataKey="t" tick={{ fill: "#9ca3af", fontSize: 10 }} />
//               <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
//               <RechartsTooltip contentStyle={{ background: "#111827", border: "1px solid #374151" }} />
//               <Line type="linear" dataKey="v" stroke="#14b8a6" strokeWidth={2} dot={false} />
//             </LineChart>
//           )}
//         </ChartBlock>

//         {/* Wind + Rain (kept larger) */}
//         <ChartBlock title="Wind + Rain Forecast" height={320}>
//           {({ width, height }) => (
//             <LineChart data={allData} width={width} height={height} margin={{ ...chartMargin, left: 18 }}>
//               <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
//               <XAxis dataKey="t" tick={{ fill: "#9ca3af", fontSize: 10 }} />
//               <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
//               <RechartsTooltip contentStyle={{ background: "#111827", border: "1px solid #374151" }} />
//               <Line type="linear" dataKey="wind" stroke="#3A86FF" strokeWidth={2} dot={false} />
//               <Line type="linear" dataKey="rain" stroke="#14b8a6" strokeWidth={2} dot={false} />
//             </LineChart>
//           )}
//         </ChartBlock>

//         {/* Slope */}
//         <ChartBlock title="Slope Angle vs Risk" height={200}>
//           {({ width, height }) => (
//             <LineChart
//               data={slopeData}
//               width={width}
//               height={height}
//               margin={chartMargin}
//             >
//               <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
//               <XAxis
//                 dataKey="featureValue"
//                 type="number"
//                 domain={[0, 100]}
//                 tick={{ fill: "#9ca3af", fontSize: 10 }}
//               />
//               <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
//               <RechartsTooltip
//                 contentStyle={{ background: "#111827", border: "1px solid #374151" }}
//                 formatter={(value: number) => [`${value.toFixed(1)}%`, "Risk"]}
//               />
//               <Line type="monotone" dataKey="risk" stroke="#3A86FF" strokeWidth={2} dot={false} />
//             </LineChart>
//           )}
//         </ChartBlock>

//         {/* Roughness */}
//         <ChartBlock title="Roughness vs Risk" height={200}>
//           {({ width, height }) => (
//             <LineChart
//               data={roughnessData}
//               width={width}
//               height={height}
//               margin={chartMargin}
//             >
//               <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
//               <XAxis
//                 dataKey="featureValue"
//                 type="number"
//                 domain={[0, 100]}
//                 tick={{ fill: "#9ca3af", fontSize: 10 }}
//               />
//               <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
//               <RechartsTooltip
//                 contentStyle={{ background: "#111827", border: "1px solid #374151" }}
//                 formatter={(value: number) => [`${value.toFixed(1)}%`, "Risk"]}
//               />
//               <Line type="monotone" dataKey="risk" stroke="#14b8a6" strokeWidth={2} dot={false} />
//             </LineChart>
//           )}
//         </ChartBlock>


//       </div>
//     </div>




// <div className="bg-gray-900 border border-gray-700 rounded-lg h-full flex flex-col-reverse p-3">
//   <div className="text-sm font-medium text-gray-300 mb-3">Risk Analysis Charts</div>

//   <div className="flex-grow overflow-y-auto overflow-x-hidden space-y-6 pr-2 w-full">

//     {/* SHAP horizontal */}
//     <ChartBlock title="Feature Contribution (SHAP)" height={260}>
//       {({ width, height }) => (
//         <BarChart
//           layout="vertical"
//           data={shapData}
//           width={width}
//           height={height}
//           margin={{ left: 4, right: 4, top: 8, bottom: 8 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
//           <XAxis type="number" tick={{ fill: "#9ca3af", fontSize: 10 }}>
//             <Label value="Contribution (%)" position="bottom" fill="#9ca3af" fontSize={12} />
//           </XAxis>
//           <YAxis
//             type="category"
//             dataKey="feature"
//             tick={{ fill: "#9ca3af", fontSize: 12 }}
//             width={100} // tight to allow bars full width
//           >
//             <Label value="Feature" angle={-90} position="insideLeft" fill="#9ca3af" fontSize={12} />
//           </YAxis>
//           <RechartsTooltip
//             contentStyle={{ background: "#111827", border: "1px solid #374151" }}
//             formatter={(value: number) => [`${value}%`, "Contribution"]}
//           />
//           <Bar dataKey="contribution" fill="#3A86FF" />
//         </BarChart>
//       )}
//     </ChartBlock>

//     {/* Wind */}
//     <ChartBlock title="Wind Forecast (km/h)" height={180}>
//       {({ width, height }) => (
//         <LineChart data={windData} width={width} height={height} margin={{ left: 8, right: 8, top: 8, bottom: 24 }}>
//           <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
//           <XAxis dataKey="t" tick={{ fill: "#9ca3af", fontSize: 10 }}>
//             <Label value="Time (hh:mm)" position="bottom" fill="#9ca3af" fontSize={12} />
//           </XAxis>
//           <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }}>
//             <Label value="Wind Speed (km/h)" angle={-90} position="insideLeft" fill="#9ca3af" fontSize={12} />
//           </YAxis>
//           <RechartsTooltip contentStyle={{ background: "#111827", border: "1px solid #374151" }} />
//           <Line type="linear" dataKey="v" stroke="#3A86FF" strokeWidth={2} dot={false} />
//         </LineChart>
//       )}
//     </ChartBlock>

//     {/* Rain */}
//     <ChartBlock title="Rainfall Forecast (mm)" height={180}>
//       {({ width, height }) => (
//         <LineChart data={rainData} width={width} height={height} margin={{ left: 8, right: 8, top: 8, bottom: 24 }}>
//           <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
//           <XAxis dataKey="t" tick={{ fill: "#9ca3af", fontSize: 10 }}>
//             <Label value="Time (hh:mm)" position="bottom" fill="#9ca3af" fontSize={12} />
//           </XAxis>
//           <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }}>
//             <Label value="Rainfall (mm)" angle={-90} position="insideLeft" fill="#9ca3af" fontSize={12} />
//           </YAxis>
//           <RechartsTooltip contentStyle={{ background: "#111827", border: "1px solid #374151" }} />
//           <Line type="linear" dataKey="v" stroke="#14b8a6" strokeWidth={2} dot={false} />
//         </LineChart>
//       )}
//     </ChartBlock>

//     {/* Wind + Rain — larger */}
//     <ChartBlock title="Wind + Rain Forecast" height={260}>
//       {({ width, height }) => (
//         <LineChart data={allData} width={width} height={height} margin={{ left: 18, right: 8, top: 8, bottom: 24 }}>
//           <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
//           <XAxis dataKey="t" tick={{ fill: "#9ca3af", fontSize: 10 }}>
//             <Label value="Time (hh:mm)" position="bottom" fill="#9ca3af" fontSize={12} />
//           </XAxis>
//           <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }}>
//             <Label value="Value" angle={-90} position="insideLeft" fill="#9ca3af" fontSize={12} />
//           </YAxis>
//           <RechartsTooltip contentStyle={{ background: "#111827", border: "1px solid #374151" }} />
//           <Line type="linear" dataKey="wind" stroke="#3A86FF" strokeWidth={2} dot={false} />
//           <Line type="linear" dataKey="rain" stroke="#14b8a6" strokeWidth={2} dot={false} />
//         </LineChart>
//       )}
//     </ChartBlock>

//     {/* Slope */}
//     <ChartBlock title="Slope Angle vs Risk" height={160}>
//       {({ width, height }) => (
//         <LineChart data={slopeData} width={width} height={height} margin={{ left: 8, right: 8, top: 8, bottom: 24 }}>
//           <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
//           <XAxis dataKey="featureValue" type="number" domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 10 }}>
//             <Label value="Feature Value" position="bottom" fill="#9ca3af" fontSize={12} />
//           </XAxis>
//           <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }}>
//             <Label value="Risk (%)" angle={-90} position="insideLeft" fill="#9ca3af" fontSize={12} />
//           </YAxis>
//           <RechartsTooltip
//             contentStyle={{ background: "#111827", border: "1px solid #374151" }}
//             formatter={(value: number) => [`${value.toFixed(1)}%`, "Risk"]}
//           />
//           <Line type="monotone" dataKey="risk" stroke="#3A86FF" strokeWidth={2} dot={false} />
//         </LineChart>
//       )}
//     </ChartBlock>

//     {/* Roughness */}
//     <ChartBlock title="Roughness vs Risk" height={160}>
//       {({ width, height }) => (
//         <LineChart data={roughnessData} width={width} height={height} margin={{ left: 8, right: 8, top: 8, bottom: 24 }}>
//           <CartesianGrid strokeDasharray="3 3" opacity={0.12} />
//           <XAxis dataKey="featureValue" type="number" domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 10 }}>
//             <Label value="Feature Value" position="bottom" fill="#9ca3af" fontSize={12} />
//           </XAxis>
//           <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }}>
//             <Label value="Risk (%)" angle={-90} position="insideLeft" fill="#9ca3af" fontSize={12} />
//           </YAxis>
//           <RechartsTooltip
//             contentStyle={{ background: "#111827", border: "1px solid #374151" }}
//             formatter={(value: number) => [`${value.toFixed(1)}%`, "Risk"]}
//           />
//           <Line type="monotone" dataKey="risk" stroke="#14b8a6" strokeWidth={2} dot={false} />
//         </LineChart>
//       )}
//     </ChartBlock>

//   </div>
// </div>




