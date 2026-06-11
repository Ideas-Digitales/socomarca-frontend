interface OrderStatusConfig {
  label: string;
  className: string;
}

// Mapa de estados posibles de una orden a su etiqueta y estilo visual
const ORDER_STATUS_MAP: Record<string, OrderStatusConfig> = {
  pending: { label: "Pendiente", className: "bg-amber-100 text-amber-700" },
  processing: { label: "Procesando", className: "bg-blue-100 text-blue-700" },
  on_hold: { label: "En espera", className: "bg-orange-100 text-orange-700" },
  completed: { label: "Completada", className: "bg-lime-100 text-lime-700" },
  canceled: { label: "Cancelada", className: "bg-red-100 text-red-700" },
  refunded: { label: "Reembolsada", className: "bg-purple-100 text-purple-700" },
  failed: { label: "Fallida", className: "bg-red-100 text-red-700" },
};

const DEFAULT_STATUS: OrderStatusConfig = {
  label: "Desconocido",
  className: "bg-slate-100 text-slate-600",
};

export default function OrderStatusBadge({ status }: { status: string }) {
  const config = ORDER_STATUS_MAP[status] ?? DEFAULT_STATUS;

  return (
    <span
      data-cy="order-status"
      data-status={status}
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${config.className}`}
    >
      {config.label}
    </span>
  );
}
