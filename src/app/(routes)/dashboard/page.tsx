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
import { use, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useUser } from "@/context/UserProvider";
import Loader from "@/components/Loader";

// prevent SSR for MineMap (Leaflet-only)
const MineMap = dynamic(() => import("@/components/MineMap"), {
  ssr: false,
});

export default function Dashboard() {
  const [selectedZone, setSelectedZone] = useState<string | null>("");
 const {hasSeenLoader,setHasSeenLoader , hasPageInitialized, setHasPageInitialized} = useUser()

    // Simulate page initialization (localStorage read, context hydration, etc)
   useEffect(() => { const init = async () => {
      // Example: delay for 1-2s to simulate context/localStorage setup
      await new Promise((res) => setTimeout(res, 2000));
    };

    init().then(() => {
      setHasPageInitialized(true); // done, show page content
    });
  }, []);

  if (!hasPageInitialized) {
    return <div
      className="
        h-[calc(100vh-69px)] w-full flex items-center justify-center bg-gray-900">
          Loading....
        </div>;
  }

  return hasSeenLoader ? (<div
  className="
    h-[calc(100vh-69px)] border border-gray-700
    grid
    grid-cols-1 grid-rows-[auto_auto_auto]   /* Mobile stacked layout */
    md:grid-cols-4 md:grid-rows-1            /* Desktop split into 4 columns */
  "
>
  {/* AlertsPanel → Left on desktop, top on mobile */}
  <div className="order-1 md:order-none col-span-1 border-b md:border-b-0 md:border-r border-gray-700">
    <AlertsPanel onHighlight={setSelectedZone} />
  </div>

  {/* MineMap → Middle two columns on desktop, second on mobile */}
  <div className="order-2 md:order-none col-span-1 md:col-span-2 border-b md:border-b-0 border-gray-700">
    <MineMap selectedZone={selectedZone} setSelectedZone={setSelectedZone} />
  </div>

  {/* RiskChart → Right on desktop, bottom on mobile */}
  <div className="order-3 md:order-none col-span-1 overflow-hidden">
    <RiskChart />
  </div>
</div>
):(<>
      <Loader duration={15} onComplete={() => setHasSeenLoader(true)}/>
    </>)
}

// <div
//       className="
//         h-[calc(100vh-69px)] border border-gray-700
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
