"use client";
import dynamic from "next/dynamic";

const RiskMap = dynamic(() => import("@/components/RiskMap"), {
  ssr: false, // only render in browser
});

export default function Map() {
  return (
    <div>
      <RiskMap />
    </div>
  );
}
