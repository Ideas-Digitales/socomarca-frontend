"use client";

import { useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import ModalConfirmacion from "../global/ModalConfirmacion";
import ModalEditarDireccion from "./ModalEditarDireccion";
import type { Address } from "@/services/actions/addressees.actions";
import {
  updateUserAddress,
  createUserAddress,
  replaceUserAddress,
  deleteUserAddress,
  getUserAddresses, 
} from "@/services/actions/addressees.actions";

export default function DireccionesSection({
  direcciones,
}: {
  direcciones: Address[];
}) {
  const [direccionesState, setDireccionesState] =
    useState<Address[]>(direcciones);
  const [modalVisible, setModalVisible] = useState(false);
  const [direccionAEliminar, setDireccionAEliminar] = useState<Address | null>(
    null
  );
  const [direccionAEditar, setDireccionAEditar] = useState<Address | null>(
    null
  );
  const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false);
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState<string | number>("");

  const marcarComoPrincipal = async (direccion: Address) => {
    if (direccion.is_default) return;

    // 1. Guardar el estado anterior para poder revertirlo si falla
    const prevDirecciones = [...direccionesState];

    // 2. Optimistic update: marcar como principal en el estado local
    setDireccionesState((prev) =>
      prev.map((d) =>
        d.id === direccion.id
          ? { ...d, is_default: true }
          : { ...d, is_default: false }
      )
    );

    // 3. Hacer la petición real
    const actualizada = await updateUserAddress(direccion.id, {
      is_default: true,
    });

    // 4. Si falla, revertir el estado
    if (!actualizada) {
      setDireccionesState(prevDirecciones);
      // Aquí podrías mostrar un mensaje de error
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Direcciones</h2>

      <div className="space-y-2 mb-4">
        {direccionesState.map((direccion, idx) => (
          <div
            key={direccion.id ?? `direccion-${idx}`}
            className="flex items-center justify-between bg-[#edf2f7] px-4 py-2 rounded"
          >
            <div className="space-y-1 w-full">
              <div className="flex items-center justify-between text-gray-700">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => marcarComoPrincipal(direccion)}
                    title="Marcar como principal"
                  >
                    {direccion.is_default ? (
                      <StarSolid className="w-5 h-5 text-lime-500" />
                    ) : (
                      <StarOutline className="w-5 h-5 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                  <span className="font-semibold text-base">
                    {direccion.alias || "Sin alias"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    title="Editar"
                    onClick={() => {
                      setDireccionAEditar(direccion);
                      setRegion(direccion.region_name || "");
                      setComuna(direccion.municipality_name || "");
                    }}
                  >
                    <PencilSquareIcon className="w-5 h-5 text-gray-800 hover:text-gray-600" />
                  </button>

                  <button
                    title="Eliminar"
                    onClick={() => {
                      setDireccionAEliminar(direccion);
                      setModalVisible(true);
                    }}
                  >
                    <TrashIcon className="w-5 h-5 text-gray-800 hover:text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-600 pl-7">
                <p>
                  <strong>Dirección:</strong> {direccion.address_line1},{" "}
                  {direccion.address_line2}
                </p>
                <p className="text-xs text-gray-500">
                  Comuna: {direccion.municipality_name}, {direccion.region_name}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setMostrarModalAgregar(true)}
        className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded"
      >
        Agregar nueva dirección
      </button>

      {modalVisible && direccionAEliminar && (
        <ModalConfirmacion
          isOpen={modalVisible}
          titulo={`¿Eliminar dirección "${
            direccionAEliminar.alias || "Sin alias"
          }"?`}
          descripcion="Esta acción eliminará la dirección seleccionada."
          onCancel={() => {
            setModalVisible(false);
            setDireccionAEliminar(null);
          }}
          onConfirm={async () => {
            // Optimistic update: eliminar de inmediato
            const prevDirecciones = [...direccionesState];
            if (direccionAEliminar) {
              setDireccionesState((prev) =>
                prev.filter((d) => d.id !== direccionAEliminar.id)
              );
              setModalVisible(false);
              setDireccionAEliminar(null);
              // Llamar a la server action
              const ok = await deleteUserAddress(direccionAEliminar.id);
              if (!ok) {
                // Revertir si falla
                setDireccionesState(prevDirecciones);
                // Aquí podrías mostrar un mensaje de error
              }
            }
          }}
        />
      )}

      {direccionAEditar && (
        <ModalEditarDireccion
          direccion={direccionAEditar}
          region={region}
          setRegion={setRegion}
          comuna={comuna}
          setComuna={setComuna}
          onClose={() => setDireccionAEditar(null)}
          onSave={async (data) => {
            const payload = {
              address_line1: data.address_line1 ?? "",
              address_line2: data.address_line2 ?? "",
              postal_code: "1234567",
              is_default: false,
              type: "shipping" as const,
              phone: data.phone ?? "",
              contact_name: data.contact_name ?? "",
              municipality_id: data.municipality_id ?? 0,
              alias: data.alias ?? "",
              region_name: data.region_name ?? region,
              municipality_name: data.municipality_name ?? "",
            };

            if (direccionAEditar) {
              await replaceUserAddress(direccionAEditar.id, payload);
              const updated = await getUserAddresses();
              if (updated) setDireccionesState(updated);
              setDireccionAEditar(null);
            }
            setRegion("");
            setComuna("");
          }}
        />
      )}

      {mostrarModalAgregar && (
        <ModalEditarDireccion
          direccion={undefined}
          region={region}
          setRegion={setRegion}
          comuna={comuna}
          setComuna={setComuna}
          onClose={() => setMostrarModalAgregar(false)}
          onSave={async (data) => {
            const payload = {
              address_line1: data.address_line1 ?? "",
              address_line2: data.address_line2 ?? "",
              postal_code: "1234567",
              is_default: false,
              type: "shipping" as const,
              phone: data.phone ?? "",
              contact_name: data.contact_name ?? "",
              municipality_id: data.municipality_id ?? 0,
              alias: data.alias ?? "",
              region_name: data.region_name ?? region,
              municipality_name: data.municipality_name ?? "",
            };

            await createUserAddress(payload);
            // Refrescar lista desde backend
            const updated = await getUserAddresses();
            if (updated) setDireccionesState(updated);
            setMostrarModalAgregar(false);
            // Limpiar estados
            setRegion("");
            setComuna("");
          }}
        />
      )}
    </div>
  );
}
