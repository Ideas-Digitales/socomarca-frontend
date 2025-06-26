'use client';

import { useState, useEffect } from 'react';

interface DualRangeSliderProps {
  min: number;
  max: number;
  selectedMin: number;
  selectedMax: number;
  onChange: (lowerValue: number, upperValue: number) => void;
  step?: number;
}

const DualRangeSlider = ({
  min,
  max,
  selectedMin,
  selectedMax,
  onChange,
  step = 1,
}: DualRangeSliderProps) => {
  const [minVal, setMinVal] = useState(selectedMin || min);
  const [maxVal, setMaxVal] = useState(selectedMax || max);

  // Convertir valores a porcentajes basado en el rango disponible (min-max del backend)
  const getPercent = (value: number) => {
    if (max === min) return 0;
    return Math.round(((value - min) / (max - min)) * 100);
  };

  // Actualizar valores cuando cambien las props de selección del usuario
  useEffect(() => {
    if (selectedMin !== undefined) setMinVal(selectedMin);
    if (selectedMax !== undefined) setMaxVal(selectedMax);
  }, [selectedMin, selectedMax, min, max]); // Incluir min y max en las dependencias
  // Manejar cambio del valor mínimo
  const handleMinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(event.target.value), maxVal - step);
    const boundedValue = Math.max(min, Math.min(value, max));

    setMinVal(boundedValue);
    onChange(boundedValue, maxVal);
  };

  // Manejar cambio del valor máximo
  const handleMaxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(event.target.value), minVal + step);
    const boundedValue = Math.max(min, Math.min(value, max));

    setMaxVal(boundedValue);
    onChange(minVal, boundedValue);
  };
  const minPercent = getPercent(minVal);
  const maxPercent = getPercent(maxVal);

  return (
    <div className="dual-range-slider">
      <div className="slider-track">
        <div
          className="slider-range"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minVal}
        onChange={handleMinChange}
        className="thumb thumb--left"
      />

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onChange={handleMaxChange}
        className="thumb thumb--right"
      />

      <style jsx>{`
        .dual-range-slider {
          position: relative;
          height: 24px;
          margin: 16px 0;
        }

        .slider-track {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          transform: translateY(-50%);
        }

        .slider-range {
          position: absolute;
          height: 100%;
          background: #84cc16;
          border-radius: 4px;
        }

        .thumb {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 24px;
          background: none;
          pointer-events: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }

        .thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: white;
          border: 2px solid #84cc16;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          pointer-events: all;
        }

        .thumb::-webkit-slider-thumb:hover {
          transform: scale(1.1);
        }

        .thumb::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: white;
          border: 2px solid #84cc16;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          pointer-events: all;
          border: none;
        }

        .thumb::-moz-range-track {
          background: transparent;
        }

        .thumb--left {
          z-index: 1;
        }

        .thumb--right {
          z-index: 2;
        }
      `}</style>
    </div>
  );
};

export default DualRangeSlider;
