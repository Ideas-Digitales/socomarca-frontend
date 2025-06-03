'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

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

  const [lowerValue, setLowerValue] = useState(initialLower ?? validMin);
  const [upperValue, setUpperValue] = useState(initialUpper ?? validMax);
  const [isDragging, setIsDragging] = useState<'lower' | 'upper' | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);

  // Normalize values to ensure they're within bounds and properly stepped
  const normalizeValue = useCallback(
    (value: number) => {
      const bounded = Math.max(validMin, Math.min(value, validMax));
      if (step > 0) {
        return Math.round(bounded / step) * step;
      }
      return bounded;
    },
    [validMin, validMax, step]
  );

  // Convert value to percentage
  const valueToPercent = useCallback(
    (value: number) => {
      return ((value - validMin) / (validMax - validMin)) * 100;
    },
    [validMin, validMax]
  );

  // Convert position to value (works for both mouse and touch)
  const getValueFromPosition = useCallback(
    (clientX: number) => {
      if (!sliderRef.current) return validMin;

      const rect = sliderRef.current.getBoundingClientRect();
      const percent = Math.max(
        0,
        Math.min(100, ((clientX - rect.left) / rect.width) * 100)
      );
      const value = validMin + (percent / 100) * (validMax - validMin);
      return normalizeValue(value);
    },
    [validMin, validMax, normalizeValue]
  );

  // Handle start of interaction (mouse down or touch start)
  const handleInteractionStart = useCallback(
    (thumb: 'lower' | 'upper') => (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      setIsDragging(thumb);
    },
    []
  );

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const newValue = getValueFromPosition(e.clientX);

      if (isDragging === 'lower') {
        const finalValue = Math.min(newValue, upperValue - step);
        if (finalValue !== lowerValue) {
          setLowerValue(finalValue);
          onChange(finalValue, upperValue);
        }
      } else if (isDragging === 'upper') {
        const finalValue = Math.max(newValue, lowerValue + step);
        if (finalValue !== upperValue) {
          setUpperValue(finalValue);
          onChange(lowerValue, finalValue);
        }
      }
    },
    [isDragging, getValueFromPosition, lowerValue, upperValue, step, onChange]
  );

  // Handle touch move
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || e.touches.length === 0) return;

      // Only prevent default if we're actually dragging
      if (isDragging) {
        e.preventDefault(); // Prevent scrolling
      }

      const touch = e.touches[0];
      const newValue = getValueFromPosition(touch.clientX);

      if (isDragging === 'lower') {
        const finalValue = Math.min(newValue, upperValue - step);
        if (finalValue !== lowerValue) {
          setLowerValue(finalValue);
          onChange(finalValue, upperValue);
        }
      } else if (isDragging === 'upper') {
        const finalValue = Math.max(newValue, lowerValue + step);
        if (finalValue !== upperValue) {
          setUpperValue(finalValue);
          onChange(lowerValue, finalValue);
        }
      }
    },
    [isDragging, getValueFromPosition, lowerValue, upperValue, step, onChange]
  );

  // Handle end of interaction
  const handleInteractionEnd = useCallback(() => {
    setIsDragging(null);
  }, []);

  // Handle track click/tap
  const handleTrackClick = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (isDragging) return;

      let clientX: number;
      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
      } else if ('clientX' in e) {
        clientX = e.clientX;
      } else {
        return;
      }

      const newValue = getValueFromPosition(clientX);

      // Determine which thumb is closer
      const lowerDistance = Math.abs(newValue - lowerValue);
      const upperDistance = Math.abs(newValue - upperValue);

      if (lowerDistance <= upperDistance) {
        const finalValue = Math.min(newValue, upperValue - step);
        setLowerValue(finalValue);
        onChange(finalValue, upperValue);
      } else {
        const finalValue = Math.max(newValue, lowerValue + step);
        setUpperValue(finalValue);
        onChange(lowerValue, finalValue);
      }
    },
    [isDragging, getValueFromPosition, lowerValue, upperValue, step, onChange]
  );

  // Set up global events for both mouse and touch
  useEffect(() => {
    if (isDragging) {
      // Mouse events
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleInteractionEnd);

      // Touch events - use passive: false only when necessary
      const touchMoveOptions = { passive: false };
      document.addEventListener('touchmove', handleTouchMove, touchMoveOptions);
      document.addEventListener('touchend', handleInteractionEnd);
      document.addEventListener('touchcancel', handleInteractionEnd);

      // Prevent text selection while dragging
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.body.style.touchAction = 'none';

      return () => {
        // Clean up mouse events
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleInteractionEnd);

        // Clean up touch events
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleInteractionEnd);
        document.removeEventListener('touchcancel', handleInteractionEnd);

        // Restore user selection and touch action
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        document.body.style.touchAction = '';
      };
    }
  }, [isDragging, handleMouseMove, handleTouchMove, handleInteractionEnd]);

  // Update values when props change
  useEffect(() => {
    const newLower = normalizeValue(initialLower ?? validMin);
    const newUpper = normalizeValue(initialUpper ?? validMax);

    setLowerValue(Math.min(newLower, newUpper - step));
    setUpperValue(Math.max(newUpper, newLower + step));
  }, [initialLower, initialUpper, validMin, validMax, normalizeValue, step]);

  const lowerPercent = valueToPercent(lowerValue);
  const upperPercent = valueToPercent(upperValue);

  return (
    <div className="w-full mb-6 mt-4">
      {/* Display current values */}
      <div className="flex justify-between mb-2 text-sm">
        <span>${formatValue(lowerValue)}</span>
        <span>${formatValue(upperValue)}</span>
      </div>

      {/* Slider container */}
      <div
        ref={sliderRef}
        className="relative h-6 mb-6 cursor-pointer touch-none"
        onClick={handleTrackClick}
        onTouchStart={handleTrackClick}
      >
        {/* Background track */}
        <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-2 bg-gray-200 rounded-full"></div>

        {/* Active range */}
        <div
          className="absolute top-1/2 transform -translate-y-1/2 h-2 bg-lime-500 rounded-full pointer-events-none"
          style={{
            left: `${lowerPercent}%`,
            width: `${upperPercent - lowerPercent}%`,
          }}
        />

        {/* Lower thumb */}
        <div
          className={`absolute top-1/2 w-6 h-6 bg-white border-2 border-lime-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-md cursor-grab z-30 touch-none select-none ${
            isDragging === 'lower'
              ? 'cursor-grabbing scale-110'
              : 'hover:scale-105 active:scale-110'
          } transition-transform`}
          style={{ left: `${lowerPercent}%` }}
          onMouseDown={handleInteractionStart('lower')}
          onTouchStart={handleInteractionStart('lower')}
        />

        {/* Upper thumb */}
        <div
          className={`absolute top-1/2 w-6 h-6 bg-white border-2 border-lime-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-md cursor-grab z-40 touch-none select-none ${
            isDragging === 'upper'
              ? 'cursor-grabbing scale-110'
              : 'hover:scale-105 active:scale-110'
          } transition-transform`}
          style={{ left: `${upperPercent}%` }}
          onMouseDown={handleInteractionStart('upper')}
          onTouchStart={handleInteractionStart('upper')}
        />
      </div>

      {/* Min/Max labels */}
    </div>
  );
};

export default DualRangeSlider;
