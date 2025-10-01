"use client";

import React, { useEffect, useState } from "react";

interface LoaderProps {
  duration?: number; // in seconds
  onComplete: () => void;
}

const messages = [
  "Initializing setup...",
  "Fetching DEM files from Bhoonidhi.com...",
  "Parsing DEM files...",
  "Processing terrain data...",
  "Preparing data for rockfall prediction...",
  "Finalizing setup..."
];

const Loader: React.FC<LoaderProps> = ({ duration = 15, onComplete }) => {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalSteps = messages.length;
    const intervalTime = (duration * 1000) / totalSteps;
    let step = 0;

    const interval = setInterval(() => {
      step += 1;
      if (step < totalSteps) {
        setCurrentMessage(messages[step]);
        setProgress(((step) / (totalSteps - 1)) * 100);
      } else {
        setProgress(100);
        clearInterval(interval);
        // Trigger callback after loader completes
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 top-0 left-0 bg-gray-900 flex flex-col items-center justify-center z-1000 text-white px-4">
      <h1 className="text-2xl font-bold mb-6">Setting up your Dashboard</h1>
      <p className="mb-4 text-center">{currentMessage}</p>
      
      {/* Progress Bar */}
      <div className="w-full max-w-md h-4 bg-gray-700 rounded overflow-hidden">
        <div
          className="h-4 bg-blue-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p className="mt-2 text-sm text-gray-300">
        {Math.round(progress)}% completed
      </p>
    </div>
  );
};

export default Loader;
