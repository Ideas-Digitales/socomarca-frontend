'use client';

import { useState, useEffect, useCallback } from 'react';

// Interface for the component props
interface DualRangeSliderProps {
  min: number;
  max: number;
  onChange: (lowerValue: number, upperValue: number) => void;
  initialLower?: number;
  initialUpper?: number;
  step?: number;
  formatValue?: (value: number) => string;
}

const DualRangeSlider = ({
  min,
  max,
  onChange,
  initialLower,
  initialUpper,
  step = 1,
  formatValue = (value) => value.toString(),
}: DualRangeSliderProps) => {
  const validMin = !isNaN(min) && min >= 0 ? min : 0;
  const validMax = !isNaN(max) && max > validMin ? max : validMin + 1;

  const [initialized, setInitialized] = useState(false);
  const [lowerPercent, setLowerPercent] = useState(0);
  const [upperPercent, setUpperPercent] = useState(100);
  const [lowerValue, setLowerValue] = useState(validMin);
  const [upperValue, setUpperValue] = useState(validMax);

  // Define calculation functions using useCallback to avoid dependency issues
  const calculateLowerPercent = useCallback(
    (value: number) => {
      return (
        ((Math.max(validMin, Math.min(value, validMax)) - validMin) /
          Math.max(1, validMax - validMin)) *
        100
      );
    },
    [validMin, validMax]
  );

  const calculateUpperPercent = useCallback(
    (value: number) => {
      return (
        ((Math.max(validMin, Math.min(value, validMax)) - validMin) /
          Math.max(1, validMax - validMin)) *
        100
      );
    },
    [validMin, validMax]
  );

  // Convert percent to actual values - use useCallback for these functions
  const getLowerValue = useCallback(
    (percent: number) => {
      // Apply step to floor the value correctly
      const rawValue =
        validMin + (percent / 100) * Math.max(1, validMax - validMin);
      if (step && step > 0) {
        return Math.floor(rawValue / step) * step;
      }
      return Math.floor(rawValue);
    },
    [validMin, validMax, step]
  );

  const getUpperValue = useCallback(
    (percent: number) => {
      // Apply step to ceiling the value correctly
      const rawValue =
        validMin + (percent / 100) * Math.max(1, validMax - validMin);
      if (step && step > 0) {
        return Math.ceil(rawValue / step) * step;
      }
      return Math.ceil(rawValue);
    },
    [validMin, validMax, step]
  );

  // Initialize component with correct values
  useEffect(() => {
    if (!initialized) {
      // Get valid initial values
      const validInitialLower =
        initialLower !== undefined && !isNaN(initialLower)
          ? Math.max(validMin, Math.min(initialLower, validMax))
          : validMin;

      const validInitialUpper =
        initialUpper !== undefined && !isNaN(initialUpper)
          ? Math.min(validMax, Math.max(initialUpper, validMin))
          : validMax;

      // Calculate initial percentages
      const initialLowerPercent = calculateLowerPercent(validInitialLower);
      const initialUpperPercent = calculateUpperPercent(validInitialUpper);

      // Set initial states
      setLowerPercent(initialLowerPercent);
      setUpperPercent(initialUpperPercent);
      setLowerValue(validInitialLower);
      setUpperValue(validInitialUpper);
      setInitialized(true);
    }
  }, [
    initialized,
    initialLower,
    initialUpper,
    validMin,
    validMax,
    calculateLowerPercent,
    calculateUpperPercent,
  ]);

  // Update when props change
  useEffect(() => {
    if (initialized) {
      // Only update if the values have actually changed
      const newLowerValue =
        initialLower !== undefined
          ? Math.max(validMin, Math.min(initialLower, validMax))
          : lowerValue;

      const newUpperValue =
        initialUpper !== undefined
          ? Math.min(validMax, Math.max(initialUpper, validMin))
          : upperValue;

      // Only update if values changed significantly
      if (Math.abs(newLowerValue - lowerValue) > 0) {
        setLowerValue(newLowerValue);
        setLowerPercent(calculateLowerPercent(newLowerValue));
      }

      if (Math.abs(newUpperValue - upperValue) > 0) {
        setUpperValue(newUpperValue);
        setUpperPercent(calculateUpperPercent(newUpperValue));
      }
    }
  }, [
    initialized,
    initialLower,
    initialUpper,
    validMin,
    validMax,
    lowerValue,
    upperValue,
    calculateLowerPercent,
    calculateUpperPercent,
  ]);

  // Handle lower thumb movement
  const handleLowerChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPercent = parseFloat(e.target.value);
      // Prevent thumbs from crossing (leave at least 0.5% gap)
      if (newPercent < upperPercent - 0.5) {
        setLowerPercent(newPercent);
        const newValue = getLowerValue(newPercent);
        setLowerValue(newValue);
        onChange(newValue, upperValue);
      }
    },
    [upperPercent, getLowerValue, onChange, upperValue]
  );

  // Handle upper thumb movement
  const handleUpperChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPercent = parseFloat(e.target.value);
      // Prevent thumbs from crossing (leave at least 0.5% gap)
      if (newPercent > lowerPercent + 0.5) {
        setUpperPercent(newPercent);
        const newValue = getUpperValue(newPercent);
        setUpperValue(newValue);
        onChange(lowerValue, newValue);
      }
    },
    [lowerPercent, getUpperValue, onChange, lowerValue]
  );

  // Calculate the step percentage relative to the range
  const stepPercent = useCallback(() => {
    if (!step || step <= 0) return 0.1; // Default step percent
    return (step / Math.max(1, validMax - validMin)) * 100;
  }, [validMin, validMax, step]);

  return (
    <div className="w-full mb-6 mt-4">
      {/* Display current values */}
      <div className="flex justify-between mb-2 text-sm">
        <span>${formatValue(lowerValue)}</span>
        <span>${formatValue(upperValue)}</span>
      </div>

      {/* Slider track */}
      <div className="relative h-2 mb-6">
        {/* Background track */}
        <div className="absolute w-full h-2 bg-gray-200 rounded-full"></div>

        {/* Colored range between thumbs */}
        <div
          className="absolute h-2 bg-lime-500 rounded-full"
          style={{
            left: `${lowerPercent}%`,
            width: `${upperPercent - lowerPercent}%`,
          }}
        ></div>

        {/* Thumbs */}
        <div
          className="absolute w-4 h-4 bg-white border-2 border-lime-500 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/4 z-20"
          style={{ left: `${lowerPercent}%` }}
        ></div>

        <div
          className="absolute w-4 h-4 bg-white border-2 border-lime-500 rounded-full cursor-pointer transform -translate-x-1/2 -translate-y-1/4 z-20"
          style={{ left: `${upperPercent}%` }}
        ></div>

        {/* Range inputs (invisible but handle the interactions) */}
        <input
          type="range"
          min="0"
          max="100"
          step={stepPercent()}
          value={lowerPercent}
          onChange={handleLowerChange}
          className="absolute w-full h-2 opacity-0 cursor-pointer z-10"
        />

        <input
          type="range"
          min="0"
          max="100"
          step={stepPercent()}
          value={upperPercent}
          onChange={handleUpperChange}
          className="absolute w-full h-2 opacity-0 cursor-pointer z-10"
        />
      </div>
    </div>
  );
};

export default DualRangeSlider;
