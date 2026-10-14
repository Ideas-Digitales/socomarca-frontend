"use client";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import type { Address } from "@/services/actions/addressees.actions";

export default function DireccionesSection({
  direcciones,
}: {
  direcciones: Address[];
}) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Direcciones</h2>

      <div className="flex items-start gap-2 mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-md px-3 py-2">
        <InformationCircleIcon width={16} height={16} className="shrink-0 mt-0.5" />
        <p>
          Las direcciones se sincronizan desde Random ERP. Si necesitas actualizarlas,
          comunícate con soporte.
        </p>
      </div>

      {direcciones.length === 0 ? (
        <p className="text-sm text-gray-500">No tienes direcciones registradas.</p>
      ) : (
        <div className="space-y-2">
          {direcciones.map((direccion) => (
            <div
              key={direccion.id}
              className="bg-[#edf2f7] px-4 py-2 rounded space-y-1"
            >
              <div className="flex items-center gap-2 text-gray-700">
                <span className="font-semibold text-base">
                  {direccion.alias || "Sin alias"}
                </span>
                {direccion.is_synced && (
                  <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                    Sincronizada desde Random ERP
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Dirección:</strong>{" "}
                  {[direccion.address_line1, direccion.address_line2]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <p className="text-xs text-gray-500">
                  Comuna: {direccion.municipality_name}, {direccion.region_name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
