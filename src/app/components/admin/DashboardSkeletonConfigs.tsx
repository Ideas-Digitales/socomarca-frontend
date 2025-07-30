import React from 'react';
import DashboardSkeleton from './DashboardSkeleton';

// Configuraciones específicas para cada vista de administrador

export const TransaccionesExitosasSkeleton = () => (
  <DashboardSkeleton
    showSearch={false}
    showFilters={true}
    showDatePicker={true}
    showMetricsChart={true}
    showBottomChart={false}
    showTable={true}
    tableColumns={8}
    tableRows={10}
    showAmountFilter={true}
    showClientFilter={true}
    showCategoryFilter={false}
    showCommuneFilter={false}
    showSortFilter={false}
  />
);

export const TotalDeVentasSkeleton = () => (
  <DashboardSkeleton
    showSearch={false}
    showFilters={true}
    showDatePicker={true}
    showMetricsChart={true}
    showBottomChart={false}
    showTable={true}
    tableColumns={6}
    tableRows={10}
    showAmountFilter={true}
    showClientFilter={true}
    showCategoryFilter={false}
    showCommuneFilter={false}
    showSortFilter={false}
  />
);

export const TransaccionesFallidasSkeleton = () => (
  <DashboardSkeleton
    showSearch={false}
    showFilters={true}
    showDatePicker={true}
    showMetricsChart={true}
    showBottomChart={false}
    showTable={true}
    tableColumns={7}
    tableRows={10}
    showAmountFilter={true}
    showClientFilter={true}
    showCategoryFilter={false}
    showCommuneFilter={false}
    showSortFilter={false}
  />
);

export const ProductosMasVentasSkeleton = () => (
  <DashboardSkeleton
    showSearch={false}
    showFilters={true}
    showDatePicker={true}
    showMetricsChart={true}
    showBottomChart={false}
    showTable={true}
    tableColumns={5}
    tableRows={10}
    showAmountFilter={false}
    showClientFilter={false}
    showCategoryFilter={false}
    showCommuneFilter={false}
    showSortFilter={false}
  />
);

export const ComunasMasVentasSkeleton = () => (
  <DashboardSkeleton
    showSearch={false}
    showFilters={true}
    showDatePicker={true}
    showMetricsChart={true}
    showBottomChart={false}
    showTable={true}
    tableColumns={4}
    tableRows={10}
    showAmountFilter={false}
    showClientFilter={false}
    showCategoryFilter={false}
    showCommuneFilter={false}
    showSortFilter={false}
  />
);

export const ClientesMasComprasSkeleton = () => (
  <DashboardSkeleton
    showSearch={false}
    showFilters={true}
    showDatePicker={true}
    showMetricsChart={true}
    showBottomChart={false}
    showTable={true}
    tableColumns={6}
    tableRows={10}
    showAmountFilter={false}
    showClientFilter={false}
    showCategoryFilter={false}
    showCommuneFilter={false}
    showSortFilter={false}
  />
);

export const CategoriasMasVentasSkeleton = () => (
  <DashboardSkeleton
    showSearch={false}
    showFilters={true}
    showDatePicker={true}
    showMetricsChart={true}
    showBottomChart={false}
    showTable={true}
    tableColumns={4}
    tableRows={10}
    showAmountFilter={false}
    showClientFilter={false}
    showCategoryFilter={false}
    showCommuneFilter={false}
    showSortFilter={false}
  />
);

// Skeleton genérico para otras vistas de admin
export const GenericAdminSkeleton = (props?: {
  tableColumns?: number;
  tableRows?: number;
  showMetricsChart?: boolean;
  showBottomChart?: boolean;
  showAmountFilter?: boolean;
  showClientFilter?: boolean;
  showCategoryFilter?: boolean;
  showCommuneFilter?: boolean;
  showSortFilter?: boolean;
}) => (
  <DashboardSkeleton
    showSearch={false}
    showFilters={true}
    showDatePicker={true}
    showMetricsChart={props?.showMetricsChart ?? true}
    showBottomChart={props?.showBottomChart ?? false}
    showTable={true}
    tableColumns={props?.tableColumns ?? 5}
    tableRows={props?.tableRows ?? 10}
    showAmountFilter={props?.showAmountFilter ?? false}
    showClientFilter={props?.showClientFilter ?? false}
    showCategoryFilter={props?.showCategoryFilter ?? false}
    showCommuneFilter={props?.showCommuneFilter ?? false}
    showSortFilter={props?.showSortFilter ?? false}
  />
);