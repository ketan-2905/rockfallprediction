// "use client";

// import React, { JSX, useState } from "react";

// interface ZoneAlert {
//   id: string;              // zoneId
//   coordinateId: string;
//   risk: string;
//   riskLevel: number;
//   riskColor: string;
//   status: string;
//   lastUpdated: string;
// }

// const riskColors: Record<string, string> = {
//   Low: "#34D399",      // mint green
//   Medium: "#FCD34D",   // soft amber
//   High: "#FB923C",     // warm orange
//   Critical: "#7C3AED", // deep indigo/purple
// };

// const badgeClass = (s: string) => {
//   switch (s.toLowerCase()) {
//     case "low":
//       return "bg-green-800";
//     case "medium":
//       return "bg-yellow-800";
//     case "high":
//       return "bg-orange-800";
//     case "critical":
//       return "bg-red-600";
//     default:
//       return "bg-gray-400"; // fallback
//   }
// };

// interface AlertsPanelLiteProps {
//   onHighlight: (id: string) => void; // 🔹 highlight callback
// }

// export default function AlertsPanelLite({
//   onHighlight,
// }: AlertsPanelLiteProps): JSX.Element {

  // const data = [
  //    {
  //     id: "ZONE_02_04",
  //     coordinateId: "23.758400, 86.405925",
  //     risk: "Low",
  //     riskLevel: 15,
  //     riskColor: "#34D399",
  //     status: "Maintenance",
  //     lastUpdated: "5m ago",
  //   },
  //   {
  //     id: "ZONE_06_08",
  //     coordinateId: "23.763200, 86.411143",
  //     risk: "High",
  //     riskLevel: 85,
  //     riskColor: "#FB923C",
  //     status: "Active",
  //     lastUpdated: "4m ago",
  //   },
  //   {
  //     id: "ZONE_04_12",
  //     coordinateId: "23.760800, 86.416362",
  //     risk: "Medium",
  //     riskLevel: 60,
  //     riskColor: "#FCD34D",
  //     status: "Active",
  //     lastUpdated: "5m ago",
  //   },
  //   {
  //     id: "ZONE_08_15",
  //     coordinateId: "23.765600, 86.420275",
  //     risk: "High",
  //     riskLevel: 95,
  //     riskColor: "#FB923C",
  //     status: "Maintenance",
  //     lastUpdated: "4m ago",
  //   },
  //   {
  //     id: "ZONE_01_18",
  //     coordinateId: "23.757200, 86.424189",
  //     risk: "Low",
  //     riskLevel: 25,
  //     riskColor: "#34D399",
  //     status: "Active",
  //     lastUpdated: "1m ago",
  //   },
  //   {
  //     id: "ZONE_10_03",
  //     coordinateId: "23.768000, 86.404620",
  //     risk: "Medium",
  //     riskLevel: 45,
  //     riskColor: "#FCD34D",
  //     status: "Maintenance",
  //     lastUpdated: "1m ago",
  //   },
  //   {
  //     id: "ZONE_05_16",
  //     coordinateId: "23.762000, 86.421580",
  //     risk: "High",
  //     riskLevel: 78,
  //     riskColor: "#FB923C",
  //     status: "Restricted",
  //     lastUpdated: "2m ago",
  //   },
  //   {
  //     id: "ZONE_12_09",
  //     coordinateId: "23.770400, 86.412448",
  //     risk: "Low",
  //     riskLevel: 18,
  //     riskColor: "#34D399",
  //     status: "Maintenance",
  //     lastUpdated: "5m ago",
  //   },
  //   {
  //     id: "ZONE_03_06",
  //     coordinateId: "23.759600, 86.408534",
  //     risk: "Medium",
  //     riskLevel: 55,
  //     riskColor: "#FCD34D",
  //     status: "Restricted",
  //     lastUpdated: "1m ago",
  //   },
  //   {
  //     id: "ZONE_07_11",
  //     coordinateId: "23.764400, 86.415057",
  //     risk: "High",
  //     riskLevel: 82,
  //     riskColor: "#FB923C",
  //     status: "Restricted",
  //     lastUpdated: "5m ago",
  //   },
  //   {
  //     id: "ZONE_09_05",
  //     coordinateId: "23.766800, 86.407229",
  //     risk: "Medium",
  //     riskLevel: 65,
  //     riskColor: "#FCD34D",
  //     status: "Restricted",
  //     lastUpdated: "5m ago",
  //   },
  //   {
  //     id: "ZONE_00_14",
  //     coordinateId: "23.756000, 86.418971",
  //     risk: "Low",
  //     riskLevel: 30,
  //     riskColor: "#34D399",
  //     status: "Monitoring",
  //     lastUpdated: "5m ago",
  //   },
  //   {
  //     id: "ZONE_11_01",
  //     coordinateId: "23.769200, 86.402011",
  //     risk: "High",
  //     riskLevel: 92,
  //     riskColor: "#FB923C",
  //     status: "Active",
  //     lastUpdated: "4m ago",
  //   },
  //   {
  //     id: "ZONE_13_17",
  //     coordinateId: "23.771600, 86.422885",
  //     risk: "Medium",
  //     riskLevel: 50,
  //     riskColor: "#FCD34D",
  //     status: "Monitoring",
  //     lastUpdated: "3m ago",
  //   },
  //   {
  //     id: "ZONE_14_07",
  //     coordinateId: "23.772800, 86.409838",
  //     risk: "Low",
  //     riskLevel: 22,
  //     riskColor: "#34D399",
  //     status: "Restricted",
  //     lastUpdated: "3m ago",
  //   },
  //   {
  //     id: "ZONE_06_02",
  //     coordinateId: "23.763200, 86.403315",
  //     risk: "High",
  //     riskLevel: 75,
  //     riskColor: "#FB923C",
  //     status: "Monitoring",
  //     lastUpdated: "5m ago",
  //   },
  // ]

//   const [alerts, setAlerts] = useState<ZoneAlert[]>(data);
//   const [history, setHistory] = useState<ZoneAlert[]>([]);

//   const acknowledge = (id: string) => {
//     setAlerts((prev) => {
//       const found = prev.find((a) => a.id === id);
//       if (found) {
//         setHistory((h) => {
//           const key = `${found.id}-${found.lastUpdated}`;
//           if (h.some((x) => `${x.id}-${x.lastUpdated}` === key)) return h;
//           return [found, ...h].slice(0, 10);
//         });
//       }
//       return prev.filter((a) => a.id !== id);
//     });
//   };

  

//   return (
//     <div className="h-full flex flex-col bg-gray-900 border-r border-gray-700">
//       {/* Header */}
//       <div className="bg-gray-800/95 px-4 py-3 flex items-center justify-between border-b border-gray-700">
//         <div className="text-sm font-semibold text-gray-200">Alerts</div>
//         <div className="text-xs text-gray-400">{alerts.length} active</div>
//       </div>

//       {/* Alerts list */}
//       <div className="p-4 space-y-3 overflow-auto flex-1">
//         {alerts.length === 0 ? (
//           <div className="text-sm text-gray-500">No active alerts</div>
//         ) : (
//           alerts.map((a) => (
//             <div
//               key={a.id}
//               className="bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-sm"
//             >
//               <div className="flex items-center justify-between">
//                 <span className="text-xs text-gray-400">{a.lastUpdated}</span>
//                 <span
//                   className={`text-xs font-semibold px-2 py-0.5 rounded-md ${badgeClass(
//                     a.risk
//                   )}`}
//                 >
//                   {a.risk} • {a.riskLevel}%
//                 </span>
//               </div>

//               <div className="mt-2 text-sm text-white font-medium">
//                 {a.id}
//               </div>
//               <div className="text-xs text-gray-400">
//                 {a.status} • {a.coordinateId}
//               </div>

//               {/* Actions */}
//               <div className="flex gap-2 mt-3">
//                 <button
//                   onClick={() => acknowledge(a.id)}
//                   className="text-xs px-2 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
//                 >
//                   Acknowledge
//                 </button>
//                 <button
//                   onClick={() => onHighlight(a.id)} // 🔹 highlight callback
//                   className="text-xs px-2 py-1 bg-blue-700 text-white rounded hover:bg-blue-600"
//                 >
//                   Highlight
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* History */}
//       <div className="p-3 border-t border-gray-800">
//         <div className="flex items-center justify-between mb-2">
//           <div className="text-xs text-gray-300 font-medium">History</div>
//           <div className="text-xs text-gray-400">{history.length}</div>
//         </div>

//         <div className="max-h-32 overflow-auto space-y-1">
//           {history.length === 0 ? (
//             <div className="text-xs text-gray-500">
//               No acknowledged alerts yet
//             </div>
//           ) : (
//             history.map((h) => (
//               <div
//                 key={h.id}
//                 className="text-xs text-gray-300 flex justify-between"
//               >
//                 <div>{h.id}</div>
//                 <div className="text-gray-500">{h.lastUpdated}</div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useState } from "react";
import axiosClient from "@/lib/axiosClient";
import { useUser } from "@/context/UserProvider";

interface ZoneAlert {
  id: string;
  coordinateId: string;
  risk: string;
  riskLevel: number;
  riskColor: string;
  status: string;
  lastUpdated: string;
}

const badgeClass = (s: string) => {
  switch (s.toLowerCase()) {
    case "low":
      return "bg-green-800";
    case "medium":
      return "bg-yellow-800";
    case "high":
      return "bg-orange-800";
    case "critical":
      return "bg-red-600";
    default:
      return "bg-gray-400";
  }
};

interface AlertsPanelLiteProps {
  onHighlight: (id: string) => void;
}

export default function AlertsPanelLite({ onHighlight }: AlertsPanelLiteProps) {
  const { user } = useUser();
    const data = [
     {
      id: "ZONE_02_04",
      coordinateId: "23.758400, 86.405925",
      risk: "Low",
      riskLevel: 15,
      riskColor: "#34D399",
      status: "Maintenance",
      lastUpdated: "5m ago",
    },
    {
      id: "ZONE_06_08",
      coordinateId: "23.763200, 86.411143",
      risk: "High",
      riskLevel: 85,
      riskColor: "#FB923C",
      status: "Active",
      lastUpdated: "4m ago",
    },
    {
      id: "ZONE_04_12",
      coordinateId: "23.760800, 86.416362",
      risk: "Medium",
      riskLevel: 60,
      riskColor: "#FCD34D",
      status: "Active",
      lastUpdated: "5m ago",
    },
    {
      id: "ZONE_08_15",
      coordinateId: "23.765600, 86.420275",
      risk: "High",
      riskLevel: 95,
      riskColor: "#FB923C",
      status: "Maintenance",
      lastUpdated: "4m ago",
    },
    {
      id: "ZONE_01_18",
      coordinateId: "23.757200, 86.424189",
      risk: "Low",
      riskLevel: 25,
      riskColor: "#34D399",
      status: "Active",
      lastUpdated: "1m ago",
    },
    {
      id: "ZONE_10_03",
      coordinateId: "23.768000, 86.404620",
      risk: "Medium",
      riskLevel: 45,
      riskColor: "#FCD34D",
      status: "Maintenance",
      lastUpdated: "1m ago",
    },
    {
      id: "ZONE_05_16",
      coordinateId: "23.762000, 86.421580",
      risk: "High",
      riskLevel: 78,
      riskColor: "#FB923C",
      status: "Restricted",
      lastUpdated: "2m ago",
    },
    {
      id: "ZONE_12_09",
      coordinateId: "23.770400, 86.412448",
      risk: "Low",
      riskLevel: 18,
      riskColor: "#34D399",
      status: "Maintenance",
      lastUpdated: "5m ago",
    },
    {
      id: "ZONE_03_06",
      coordinateId: "23.759600, 86.408534",
      risk: "Medium",
      riskLevel: 55,
      riskColor: "#FCD34D",
      status: "Restricted",
      lastUpdated: "1m ago",
    },
    {
      id: "ZONE_07_11",
      coordinateId: "23.764400, 86.415057",
      risk: "High",
      riskLevel: 82,
      riskColor: "#FB923C",
      status: "Restricted",
      lastUpdated: "5m ago",
    },
    {
      id: "ZONE_09_05",
      coordinateId: "23.766800, 86.407229",
      risk: "Medium",
      riskLevel: 65,
      riskColor: "#FCD34D",
      status: "Restricted",
      lastUpdated: "5m ago",
    },
    {
      id: "ZONE_00_14",
      coordinateId: "23.756000, 86.418971",
      risk: "Low",
      riskLevel: 30,
      riskColor: "#34D399",
      status: "Monitoring",
      lastUpdated: "5m ago",
    },
    {
      id: "ZONE_11_01",
      coordinateId: "23.769200, 86.402011",
      risk: "High",
      riskLevel: 92,
      riskColor: "#FB923C",
      status: "Active",
      lastUpdated: "4m ago",
    },
    {
      id: "ZONE_13_17",
      coordinateId: "23.771600, 86.422885",
      risk: "Medium",
      riskLevel: 50,
      riskColor: "#FCD34D",
      status: "Monitoring",
      lastUpdated: "3m ago",
    },
    {
      id: "ZONE_14_07",
      coordinateId: "23.772800, 86.409838",
      risk: "Low",
      riskLevel: 22,
      riskColor: "#34D399",
      status: "Restricted",
      lastUpdated: "3m ago",
    },
    {
      id: "ZONE_06_02",
      coordinateId: "23.763200, 86.403315",
      risk: "High",
      riskLevel: 75,
      riskColor: "#FB923C",
      status: "Monitoring",
      lastUpdated: "5m ago",
    },
  ]

  const [alerts, setAlerts] = useState<ZoneAlert[]>(data);
  const [history, setHistory] = useState<ZoneAlert[]>([]);
  const [isAlertsSending, setIsAlertsSending] = useState<{id: string, status: boolean}[]>([]);

  // Send Rockfall alert to all miners in admin's mine
  const sendRockfallAlert = async (zone: ZoneAlert, id: string) => {
    if (!user) return alert("You must be logged in as admin to send alerts");


    const sone = {
        adminId: user.id,
        zoneId: zone.id,
        risk: zone.risk,
        riskLevel: zone.riskLevel,
        coordinateId: zone.coordinateId,
      }

      console.log("sone:", sone);
      

    try {
      setIsAlertsSending((prev) => [...prev, {id, status: true}]);
      await axiosClient.post("/alerts/send-rockfall", {
        adminId: user.id,
        zoneId: zone.id,
        risk: zone.risk,
        riskLevel: zone.riskLevel,
        coordinateId: zone.coordinateId,
      });
      console.log("Alert sent via SMS & WhatsApp");

      setHistory((h) => {
        const key = `${zone.id}-${zone.lastUpdated}`;
        if (h.some((x) => `${x.id}-${x.lastUpdated}` === key)) return h;
        return [zone, ...h].slice(0, 10);
      });
      setAlerts((prev) => prev.filter((a) => a.id !== id));

      setIsAlertsSending((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to send alert");
    }
  };

  // Acknowledge alert
  const acknowledge = (id: string) => {
    const found = alerts.find((a) => a.id === id);
    if (found) {
      // Send message automatically
      sendRockfallAlert(found,id);

      // setHistory((h) => {
      //   const key = `${found.id}-${found.lastUpdated}`;
      //   if (h.some((x) => `${x.id}-${x.lastUpdated}` === key)) return h;
      //   return [found, ...h].slice(0, 10);
      // });
      // setAlerts((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 border-r border-gray-700">
      {/* Header */}
      <div className="bg-gray-800/95 px-4 py-3 flex items-center justify-between border-b border-gray-700">
        <div className="text-sm font-semibold text-gray-200">Alerts</div>
        <div className="text-xs text-gray-400">{alerts.length} active</div>
      </div>

      {/* Alerts List */}
      <div className="p-4 space-y-3 overflow-auto flex-1">
        {alerts.length === 0 ? (
          <div className="text-sm text-gray-500">No active alerts</div>
        ) : (
          alerts.map((a) => (
            <div key={a.id} className="bg-gray-800 p-3 rounded-lg border border-gray-700 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{a.lastUpdated}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${badgeClass(a.risk)}`}>
                  {a.risk} • {a.riskLevel}%
                </span>
              </div>

              <div className="mt-2 text-sm text-white font-medium">{a.id}</div>
              <div className="text-xs text-gray-400">{a.status} • {a.coordinateId}</div>

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => acknowledge(a.id)}
                  className="text-xs px-2 py-1 bg-gray-700 text-gray-200 rounded hover:bg-gray-600"
                  disabled={isAlertsSending.some((x) => x.id === a.id)}
                >
                  {isAlertsSending.some((x) => x.id === a.id) ? "Acknowledge & Sending Alert..." : "Acknowledge & Send Alert"}
                </button>
                <button
                  onClick={() => onHighlight(a.id)}
                  className="text-xs px-2 py-1 bg-blue-700 text-white rounded hover:bg-blue-600"
                >
                  Highlight
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* History */}
      <div className="p-3 border-t border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-gray-300 font-medium">History</div>
          <div className="text-xs text-gray-400">{history.length}</div>
        </div>

        <div className="max-h-32 overflow-auto space-y-1">
          {history.length === 0 ? (
            <div className="text-xs text-gray-500">No acknowledged alerts yet</div>
          ) : (
            history.map((h) => (
              <div key={h.id} className="text-xs text-gray-300 flex justify-between">
                <div>{h.id}</div>
                <div className="text-gray-500">{h.lastUpdated}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
