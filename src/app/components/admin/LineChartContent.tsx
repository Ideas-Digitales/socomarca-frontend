'use client';

import useStore from '@/stores/base';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { forwardRef, useImperativeHandle } from 'react';

interface CustomLineChartProps {
  color?: string;
  loading?: boolean;
}

const defaultData = [
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

// Hook para manejar actualizaciones manuales del gráfico
function useManualChartUpdate() {
  const { reportsFilters } = useStore();
  const { fetchChartRawData } = useStore();

  // Función que se puede llamar manualmente para actualizar el gráfico con todos los filtros
  const updateChartWithFilters = () => {
    fetchChartRawData(
      reportsFilters.start,
      reportsFilters.end,
      reportsFilters.selectedClient || null
    );
  };

  return { updateChartWithFilters };
}

// Agrupa y suma los valores por mes (YYYY-MM)
function groupAndSumByMonth(data: { date: string; amount: number }[]) {
  const monthMap: Record<string, number> = {};
  data.forEach(({ date, amount }) => {
    const month = date.slice(0, 7); // 'YYYY-MM'
    monthMap[month] = (monthMap[month] || 0) + amount;
  });
  return Object.entries(monthMap).map(([month, value]) => ({ month, value }));
}

const CustomLineChart = forwardRef<{ updateChartWithFilters: () => void }, CustomLineChartProps>(({
  color = '#7CB342',
  loading = false,
}, ref) => {
  const { updateChartWithFilters } = useManualChartUpdate();
  const chartRawData = useStore((state: any) => state.chartRawData);
  
  // Exponer la función de actualización manual
  useImperativeHandle(ref, () => ({
    updateChartWithFilters
  }));
  
  // Agrupa y suma por mes si hay datos, si no usa defaultData (solo si no está cargando)
  const groupedData = loading ? [] : (chartRawData && chartRawData.length > 0 ? groupAndSumByMonth(chartRawData) : defaultData);
  // Calcula el máximo dinámico
  const maxValue = groupedData.length > 0 ? Math.max(...groupedData.map(d => d.value), 10) : 10;

  const generateYTicks = (max: number) => {
    const step = max / 4;
    return Array.from({ length: 5 }, (_, i) => Math.round(i * step));
  };

  if (loading) {
    return (
      <div className="w-full h-80 flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-500"></div>
        <div className="text-gray-500 text-sm">Cargando datos del gráfico...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={groupedData}
          margin={{
            top: 10,
            right: 50,
            left: 10,
            bottom: 30,
          }}
        >
          <CartesianGrid
            stroke="#cccccc"
            strokeDasharray="3 3"
            strokeWidth={1}
            horizontal={true}
            vertical={true}
          />
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
          <YAxis
            domain={[0, maxValue]}
            ticks={generateYTicks(maxValue)}
            axisLine={{ stroke: '#666', strokeWidth: 1 }}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: '#666',
              textAnchor: 'start',
              dx: 8,
            }}
            orientation="right"
            width={40}
          />
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
});

CustomLineChart.displayName = 'CustomLineChart';

export default CustomLineChart;