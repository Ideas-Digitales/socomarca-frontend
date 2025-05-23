export interface MetricCard {
  label: string;
  value: string | number;
  color: 'lime' | 'gray';
}

export interface DashboardConfig {
  title?: string;
  metrics: MetricCard[];
  showTable?: boolean;
  showBottomChart?: boolean;
  tableTitle?: string;
}
