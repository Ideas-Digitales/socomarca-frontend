export interface ClientDetail {
  id: number;
  cliente?: string;
  customer?: string;
  monto?: number;
  amount?: number;
  fecha?: string;
  date?: string;
  estado?: string;
  status?: string;
}

export interface ClientPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ClientsListResponse {
  detalle_tabla?: ClientDetail[];
  table_detail?: ClientDetail[];
  pagination: ClientPaginationMeta;
}

export interface ClientsFilters {
  start?: string;
  end?: string;
  total_min?: number;
  total_max?: number;
}