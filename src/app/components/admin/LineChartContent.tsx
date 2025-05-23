'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

interface ChartData {
  month: string;
  value: number;
}

interface CustomLineChartProps {
  data?: ChartData[];
  color?: string;
  maxValue?: number;
}

const defaultData: ChartData[] = [
  { month: 'ene', value: 5 },
  { month: 'feb', value: 15 },
  { month: 'mar', value: 22 },
  { month: 'abr', value: 12 },
  { month: 'may', value: 35 },
  { month: 'jun', value: 45 },
  { month: 'jul', value: 58 },
  { month: 'ago', value: 45 },
  { month: 'sep', value: 25 },
  { month: 'oct', value: 0 },
  { month: 'nov', value: 0 },
  { month: 'dec', value: 0 },
];

export default function CustomLineChart({
  data = defaultData,
  color = '#7CB342',
  maxValue = 80,
}: CustomLineChartProps) {
  // Generar ticks dinámicamente
  const generateYTicks = (max: number) => {
    const step = max / 4;
    return Array.from({ length: 5 }, (_, i) => i * step);
  };

  return (
    // Removemos el padding y border, ajustamos altura fija
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 50, // Reducido para adaptarse al contenedor
            left: 10,
            bottom: 30,
          }}
        >
          {/* Grilla personalizada */}
          <CartesianGrid
            stroke="#cccccc"
            strokeDasharray="3 3"
            strokeWidth={1}
            horizontal={true}
            vertical={true}
          />

          {/* Eje X customizado */}
          <XAxis
            dataKey="month"
            axisLine={{ stroke: '#666', strokeWidth: 1 }}
            tickLine={{ stroke: '#666', strokeWidth: 1 }}
            tick={{
              fontSize: 12,
              fill: '#666',
              textAnchor: 'middle',
            }}
            height={30}
          />

          {/* Eje Y customizado con separación */}
          <YAxis
            domain={[0, maxValue]}
            ticks={generateYTicks(maxValue)}
            axisLine={{ stroke: '#666', strokeWidth: 1 }}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: '#666',
              textAnchor: 'start',
              dx: 8, // Menos desplazamiento
            }}
            orientation="right"
            width={40}
          />

          {/* Línea principal */}
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{
              fill: color,
              stroke: color,
              strokeWidth: 2,
              r: 3,
              fillOpacity: 1,
            }}
            activeDot={{
              r: 5,
              fill: color,
              stroke: '#ffffff',
              strokeWidth: 2,
              fillOpacity: 1,
            }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}