import { useMemo } from 'react';

export interface UseDashboardLoadingOptions {
  initialMessage?: string;
  overlayMessage?: string;
  showOverlay?: boolean;
}

export interface UseDashboardLoadingReturn {
  // Estados de loading
  showInitialLoading: boolean;
  showOverlayLoading: boolean;
  loadingMessage: string;
  
  // Función para obtener mensaje dinámico
  getLoadingMessage: (isLoadingReports: boolean, isLoadingChart: boolean) => string;
}

/**
 * Hook personalizado para manejar estados de loading en dashboards
 * Sigue el principio de responsabilidad única (SRP)
 */
export const useDashboardLoading = (
  isLoadingReports: boolean,
  isLoadingChart: boolean,
  isInitialLoad: boolean,
  options: UseDashboardLoadingOptions = {}
): UseDashboardLoadingReturn => {
  const {
    initialMessage = 'Cargando datos...',
    overlayMessage = 'Actualizando datos...',
    showOverlay = true,
  } = options;

  // Función para obtener mensaje dinámico según qué está cargando
  const getLoadingMessage = (isLoadingReports: boolean, isLoadingChart: boolean): string => {
    if (isLoadingReports && isLoadingChart) {
      return 'Actualizando datos y gráficos...';
    } else if (isLoadingReports) {
      return 'Actualizando datos...';
    } else if (isLoadingChart) {
      return 'Actualizando gráficos...';
    }
    return overlayMessage;
  };

  // Calcular estados de loading
  const showInitialLoading = (isLoadingReports || isLoadingChart) && isInitialLoad;
  const showOverlayLoading = showOverlay && (isLoadingReports || isLoadingChart) && !isInitialLoad;
  const loadingMessage = getLoadingMessage(isLoadingReports, isLoadingChart);

  return {
    showInitialLoading,
    showOverlayLoading,
    loadingMessage,
    getLoadingMessage,
  };
};

/**
 * Hook especializado para dashboards con transacciones
 */
export const useTransactionsLoading = (
  isLoadingReports: boolean,
  isLoadingChart: boolean,
  isInitialLoad: boolean,
  options: UseDashboardLoadingOptions = {}
) => {
  const {
    initialMessage = 'Cargando transacciones y gráficos...',
    overlayMessage = 'Actualizando transacciones...',
    ...restOptions
  } = options;

  return useDashboardLoading(
    isLoadingReports,
    isLoadingChart,
    isInitialLoad,
    {
      initialMessage,
      overlayMessage,
      ...restOptions,
    }
  );
}; 