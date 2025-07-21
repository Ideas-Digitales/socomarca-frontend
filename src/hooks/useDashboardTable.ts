import { useMemo } from 'react';
import { formatCurrency } from '@/utils/formatCurrency';
import {
  ExtendedDashboardTableConfig,
  ChartConfig,
  MetricCard,
  TableColumn,
} from '@/interfaces/dashboard.interface';

export interface UseDashboardTableOptions<T = any> {
  title: string;
  tableTitle: string;
  showDatePicker?: boolean;
  dataTransformer?: (data: any[]) => T[];
  columnsConfig?: TableColumn<T>[];
  metricsCalculator?: (data: T[]) => MetricCard[];
  enableCharts?: boolean;
  chartReportsData?: any;
}

export interface UseDashboardTableReturn<T = any> {
  // Configuración
  config: ExtendedDashboardTableConfig;
  chartConfig: ChartConfig;
  
  // Datos transformados
  tableData: T[];
  tableColumns: TableColumn<T>[];
  metrics: MetricCard[];
}

/**
 * Hook personalizado para manejar la configuración de tablas en dashboards
 * Sigue el principio de responsabilidad única (SRP)
 */
export const useDashboardTable = <T = any>(
  rawData: any[],
  options: UseDashboardTableOptions<T>
): UseDashboardTableReturn<T> => {
  const {
    title,
    tableTitle,
    showDatePicker = true,
    dataTransformer,
    columnsConfig,
    metricsCalculator,
    enableCharts = true,
    chartReportsData,
  } = options;

  // Transformar datos usando el transformer personalizado o el default
  const tableData = useMemo(() => {
    if (dataTransformer) {
      return dataTransformer(rawData);
    }
    return rawData;
  }, [rawData, dataTransformer]);

  // Configuración del dashboard
  const config: ExtendedDashboardTableConfig = useMemo(() => ({
    title,
    showTable: true,
    tableTitle,
    showDatePicker,
  }), [title, tableTitle, showDatePicker]);

  // Calcular métricas usando el calculator personalizado o el default
  const metrics = useMemo(() => {
    if (metricsCalculator) {
      return metricsCalculator(tableData);
    }
    
    // Métricas por defecto
    return [
      {
        label: 'Total de registros',
        value: tableData.length,
        color: 'lime' as const,
      },
    ];
  }, [tableData, metricsCalculator]);

  // Configuración de gráficos
  const chartConfig: ChartConfig = useMemo(() => ({
    showMetricsChart: enableCharts && chartReportsData !== null,
    showBottomChart: false,
    metrics,
  }), [enableCharts, chartReportsData, metrics]);

  return {
    config,
    chartConfig,
    tableData,
    tableColumns: columnsConfig || [],
    metrics,
  };
};

/**
 * Hook especializado para tablas de transacciones
 */
export const useTransactionsTable = (
  transactionsList: any[],
  options: {
    title: string;
    tableTitle: string;
    showDatePicker?: boolean;
    enableCharts?: boolean;
    chartReportsData?: any;
    includeActions?: boolean;
  }
) => {
  const {
    title,
    tableTitle,
    showDatePicker = true,
    enableCharts = true,
    chartReportsData,
    includeActions = false,
  } = options;

  // Transformar datos de transacciones
  const dataTransformer = (data: any[]) => {
    return data.map((transaction) => {
      const transformed = {
        id: String(transaction.id),
        cliente: transaction.customer,
        monto: transaction.amount,
        fecha: transaction.date,
        estado: transaction.status === 'completed' ? 'Completado' : 'Fallido',
        originalData: transaction,
      };
      
      if (includeActions) {
        return { ...transformed, acciones: 'Ver detalles' };
      }
      
      return transformed;
    });
  };

  // Configurar columnas para transacciones
  const columnsConfig: TableColumn<any>[] = [
    { key: 'id', label: 'ID' },
    { key: 'cliente', label: 'Cliente' },
    {
      key: 'monto',
      label: 'Monto',
      render: (value: number) => formatCurrency(value),
    },
    { key: 'fecha', label: 'Fecha' },
    { key: 'estado', label: 'Estado' },
  ];

  if (includeActions) {
    columnsConfig.push({
      key: 'acciones',
      label: 'Acciones',
    });
  }

  // Calcular métricas para transacciones
  const metricsCalculator = (data: any[]): MetricCard[] => {
    const totalAmount = data.reduce((sum, item) => sum + item.monto, 0);
    
    return [
      {
        label: 'Total de transacciones',
        value: data.length,
        color: 'lime' as const,
      },
      {
        label: 'Valor total',
        value: formatCurrency(totalAmount),
        color: 'gray' as const,
      },
    ];
  };

  return useDashboardTable(transactionsList, {
    title,
    tableTitle,
    showDatePicker,
    dataTransformer,
    columnsConfig,
    metricsCalculator,
    enableCharts,
    chartReportsData,
  });
};

/**
 * Hook especializado para tablas de municipalidades
 */
export const useMunicipalitiesTable = (
  chartReportsData: any,
  options: {
    title: string;
    tableTitle: string;
    showDatePicker?: boolean;
    enableCharts?: boolean;
  }
) => {
  const {
    title,
    tableTitle,
    showDatePicker = true,
    enableCharts = true,
  } = options;

  // Transformar datos de municipalidades
  const dataTransformer = (data: any) => {
    if (!data?.top_municipalities) return [];
    
    // Agrupar por municipalidad y sumar totales
    const municipalitySummary = data.top_municipalities.reduce((acc: any, item: any) => {
      if (!acc[item.municipality]) {
        acc[item.municipality] = {
          total_purchases: 0,
          total_quantity: 0,
          months: []
        };
      }
      acc[item.municipality].total_purchases += item.total_purchases;
      acc[item.municipality].total_quantity += item.quantity;
      acc[item.municipality].months.push(item.month);
      return acc;
    }, {} as Record<string, any>);
    
    // Convertir a array y ordenar por total de compras
    const sortedMunicipalities = Object.entries(municipalitySummary)
      .map(([municipality, data]: [string, any]) => ({ 
        municipality, 
        total_purchases: data.total_purchases,
        total_quantity: data.total_quantity,
        months: data.months
      }))
      .sort((a, b) => b.total_purchases - a.total_purchases);
    
    // Agregar ranking y formatear
    return sortedMunicipalities.map((mun, idx) => ({
      id: String(idx + 1),
      ranking: idx + 1,
      municipality: mun.municipality,
      total_purchases: mun.total_purchases,
      total_quantity: mun.total_quantity,
      months_count: mun.months.length,
    }));
  };

  // Configurar columnas para municipalidades
  const columnsConfig: TableColumn<any>[] = [
    {
      key: 'ranking',
      label: 'Ranking',
      render: (value: number) => `${value}`,
    },
    { key: 'municipality', label: 'Municipalidad' },
    {
      key: 'total_purchases',
      label: 'Total Compras',
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'total_quantity',
      label: 'Cantidad Total',
      render: (value: number) => value.toString(),
    },
    {
      key: 'months_count',
      label: 'Meses Activos',
      render: (value: number) => value.toString(),
    },
  ];

  // Calcular métricas para municipalidades
  const metricsCalculator = (data: any[]): MetricCard[] => {
    const totalPurchases = data.reduce((sum, item) => sum + item.total_purchases, 0);
    const totalQuantity = data.reduce((sum, item) => sum + item.total_quantity, 0);
    const averagePurchases = data.length > 0 ? totalPurchases / data.length : 0;
    
    return [
      {
        label: 'Municipalidades con más ventas',
        value: data.length,
        color: 'lime' as const,
      },
      {
        label: 'Total compras',
        value: formatCurrency(totalPurchases),
        color: 'gray' as const,
      },
      {
        label: 'Promedio por municipalidad',
        value: formatCurrency(averagePurchases),
        color: 'lime' as const,
      },
    ];
  };

  return useDashboardTable(chartReportsData, {
    title,
    tableTitle,
    showDatePicker,
    dataTransformer,
    columnsConfig,
    metricsCalculator,
    enableCharts,
    chartReportsData,
  });
};

/**
 * Hook especializado para tablas de productos
 */
export const useProductsTable = (
  chartReportsData: any,
  options: {
    title: string;
    tableTitle: string;
    showDatePicker?: boolean;
    enableCharts?: boolean;
  }
) => {
  const {
    title,
    tableTitle,
    showDatePicker = true,
    enableCharts = true,
  } = options;

  // Transformar datos de productos
  const dataTransformer = (data: any) => {
    return data?.top_products?.map((item: any, index: number) => ({
      id: String(index + 1),
      product: item.product,
      month: item.month,
      total: item.total,
    })) || [];
  };

  // Configurar columnas para productos
  const columnsConfig: TableColumn<any>[] = [
    { key: 'product', label: 'Producto' },
    { key: 'month', label: 'Mes' },
    {
      key: 'total',
      label: 'Total',
      render: (value: number) => formatCurrency(value),
    },
  ];

  // Calcular métricas para productos
  const metricsCalculator = (data: any[]): MetricCard[] => {
    const totalSales = data.reduce((sum, item) => sum + item.total, 0);
    
    return [
      {
        label: 'Productos con más ventas',
        value: data.length,
        color: 'lime' as const,
      },
      {
        label: 'Total en ventas',
        value: formatCurrency(totalSales),
        color: 'gray' as const,
      },
    ];
  };

  return useDashboardTable(chartReportsData, {
    title,
    tableTitle,
    showDatePicker,
    dataTransformer,
    columnsConfig,
    metricsCalculator,
    enableCharts,
    chartReportsData,
  });
}; 

/**
 * Hook especializado para tablas de categorías
 */
export const useCategoriesTable = (
  chartReportsData: any,
  options: {
    title: string;
    tableTitle: string;
    showDatePicker?: boolean;
    enableCharts?: boolean;
  }
) => {
  const {
    title,
    tableTitle,
    showDatePicker = true,
    enableCharts = true,
  } = options;

  // Transformar datos de categorías
  const dataTransformer = (data: any) => {
    if (!data?.top_categories) return [];
    
    // Agrupar por categoría y sumar totales
    const categorySummary = data.top_categories.reduce((acc: any, item: any) => {
      if (!acc[item.category]) {
        acc[item.category] = 0;
      }
      acc[item.category] += item.total;
      return acc;
    }, {} as Record<string, number>);
    
    // Convertir a array y ordenar por total
    const sortedCategories = Object.entries(categorySummary)
      .map(([categoria, venta]) => ({ categoria, venta }))
      .sort((a, b) => Number(b.venta) - Number(a.venta));
    
    // Agregar ranking
    return sortedCategories.map((cat, idx) => ({
      id: String(idx + 1),
      ranking: idx + 1,
      categoria: cat.categoria,
      venta: cat.venta,
    }));
  };

  // Configurar columnas para categorías
  const columnsConfig: TableColumn<any>[] = [
    {
      key: 'ranking',
      label: 'Ranking',
      render: (value: number) => `${value}`,
    },
    {
      key: 'categoria',
      label: 'Categoría',
    },
    {
      key: 'venta',
      label: 'Ventas',
      render: (value: number) => formatCurrency(value),
    },
  ];

  // Calcular métricas para categorías
  const metricsCalculator = (data: any[]): MetricCard[] => {
    const totalVentas = data.reduce((sum, item) => sum + item.venta, 0);
    const promedioVentas = data.length > 0 ? totalVentas / data.length : 0;
    
    return [
      {
        label: 'Categorías con más ventas',
        value: data.length,
        color: 'lime' as const,
      },
      {
        label: 'Promedio de ventas',
        value: formatCurrency(promedioVentas),
        color: 'gray' as const,
      },
      {
        label: 'Total de ventas',
        value: formatCurrency(totalVentas),
        color: 'lime' as const,
      },
    ];
  };

  return useDashboardTable(chartReportsData, {
    title,
    tableTitle,
    showDatePicker,
    dataTransformer,
    columnsConfig,
    metricsCalculator,
    enableCharts,
    chartReportsData,
  });
}; 

/**
 * Hook especializado para tablas de transacciones fallidas
 */
export const useFailedTransactionsTable = (
  transactionsList: any[],
  options: {
    title: string;
    tableTitle: string;
    showDatePicker?: boolean;
    enableCharts?: boolean;
    chartReportsData?: any;
    includeActions?: boolean;
  }
) => {
  const {
    title,
    tableTitle,
    showDatePicker = true,
    enableCharts = true,
    chartReportsData,
    includeActions = false,
  } = options;

  // Transformar datos de transacciones fallidas
  const dataTransformer = (data: any[]) => {
    return data.map((transaction) => {
      const transformed = {
        id: String(transaction.id),
        cliente: transaction.client,
        monto1: transaction.amount,
        monto2: transaction.amount,
        monto3: transaction.amount,
        fecha: transaction.date,
        originalData: transaction,
      };
      
      if (includeActions) {
        return { ...transformed, acciones: 'Ver detalles' };
      }
      
      return transformed;
    });
  };

  // Configurar columnas para transacciones fallidas
  const columnsConfig: TableColumn<any>[] = [
    { key: 'id', label: 'ID' },
    { key: 'cliente', label: 'Cliente' },
    {
      key: 'monto1',
      label: 'Monto',
      render: (value: number) => formatCurrency(value),
    },
    {
      key: 'fecha',
      label: 'Fecha',
      render: (value: string) => value,
    },
  ];

  if (includeActions) {
    columnsConfig.push({
      key: 'acciones',
      label: 'Acciones',
    });
  }

  // Calcular métricas para transacciones fallidas
  const metricsCalculator = (data: any[]): MetricCard[] => {
    const totalAmount = data.reduce((sum, item) => sum + item.monto1, 0);
    
    return [
      {
        label: 'Transacciones fallidas',
        value: data.length,
        color: 'lime' as const,
      },
      {
        label: 'Valor total procesado',
        value: formatCurrency(totalAmount),
        color: 'gray' as const,
      },
    ];
  };

  return useDashboardTable(transactionsList, {
    title,
    tableTitle,
    showDatePicker,
    dataTransformer,
    columnsConfig,
    metricsCalculator,
    enableCharts,
    chartReportsData,
  });
}; 