// "use client";
// import AlertsPanel from "@/components/AlertsPanel";
// import MineMap from "@/components/MineMap";
// import RiskChart from "@/components/TimeSeriesChart";
// import { useState } from "react";

// export default function Dashboard() {
//   const [selectedZone, setSelectedZone] = useState<string | null>("");

//   return (
//     <div
//       className="
//         h-[calc(100vh-56px)] border border-gray-700
//         grid
//         grid-cols-1 grid-rows-[auto_auto_auto]   /* mobile: stacked */
//         md:grid-cols-4 md:grid-rows-[2fr_1fr]    /* tablet/desktop: split */
//       "
//     >
//       {/* AlertsPanel → on desktop left side, on mobile bottom */}
//       <div className="order-3 md:order-none col-span-1 row-span-2 border-t md:border-t-0 md:border-r border-gray-700">
//         <AlertsPanel onHighlight={setSelectedZone} />
//       </div>

//       {/* MineMap → top on mobile, left-top on desktop */}
//       <div className="order-1 md:order-none col-span-3 row-span-1 border-b border-gray-700">
//         <MineMap selectedZone={selectedZone} setSelectedZone={setSelectedZone} />
//       </div>

//       {/* RiskChart → middle on mobile, bottom-right on desktop */}
//       <div className="order-2 md:order-none col-span-3 row-span-1 overflow-hidden">
//         <RiskChart />
//       </div>
//     </div>
//   );
// }

"use client";

import AlertsPanel from "@/components/AlertsPanel";
import RiskChart from "@/components/TimeSeriesChart";
import { useState } from "react";
import dynamic from "next/dynamic";

// prevent SSR for MineMap (Leaflet-only)
const MineMap = dynamic(() => import("@/components/MineMap"), {
  ssr: false,
});

export default function Dashboard() {
  const [selectedZone, setSelectedZone] = useState<string | null>("");

  return (
    <div
      className="
        h-[calc(100vh-56px)] border border-gray-700
        grid
        grid-cols-1 grid-rows-[auto_auto_auto]   /* mobile: stacked */
        md:grid-cols-4 md:grid-rows-[2fr_1fr]    /* tablet/desktop: split */
      "
    >
      {/* AlertsPanel → on desktop left side, on mobile bottom */}
      <div className="order-3 md:order-none col-span-1 row-span-2 border-t md:border-t-0 md:border-r border-gray-700">
        <AlertsPanel onHighlight={setSelectedZone} />
      </div>

      {/* MineMap → top on mobile, left-top on desktop */}
      <div className="order-1 md:order-none col-span-3 row-span-1 border-b border-gray-700">
        <MineMap selectedZone={selectedZone} setSelectedZone={setSelectedZone} />
      </div>

      {/* RiskChart → middle on mobile, bottom-right on desktop */}
      <div className="order-2 md:order-none col-span-3 row-span-1 overflow-hidden">
        <RiskChart />
      </div>
    </div>
  );
}

