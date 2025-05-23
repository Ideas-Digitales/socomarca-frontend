'use client';

import DashboardLayout from '@/app/components/dashboard/DashboardLayout';
import { DashboardConfig } from '@/interfaces/dashboard.interface';

export default function TotalDeVentas() {
  const config: DashboardConfig = {
    metrics: [
      {
        label: 'Total de compradores',
        value: '850',
        color: 'lime',
      },
      {
        label: 'Total de compradores',
        value: '850',
        color: 'gray',
      },
    ],
    showBottomChart: true,
  };

  return (
    <DashboardLayout
      config={config}
      onDownload={() => console.log('Descargando datos...')}
      onAmountFilter={() => console.log('Filtrar por montos...')}
      onClientFilter={() => console.log('Filtrar por cliente...')}
      onFilter={() => console.log('Aplicar filtros...')}
    />
  );
}
