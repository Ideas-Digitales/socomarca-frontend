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

    const actualizada = await updateUserAddress(direccion.id, {
      is_default: true,
    });
    if (actualizada) {
      setDireccionesState((prev) =>
        prev.map((d) =>
          d.id === direccion.id
            ? { ...d, is_default: true }
            : { ...d, is_default: false }
        )
      );
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Direcciones</h2>

      <div className="space-y-2 mb-4">
        {direccionesState.map((direccion) => (
          <div
            key={direccion.id}
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
          onConfirm={() => {
            console.log("Eliminar dirección:", direccionAEliminar.id);
            // Aquí iría la lógica real para eliminar
            setModalVisible(false);
            setDireccionAEliminar(null);
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
  };

  if (direccionAEditar) {
    const actualizada = await replaceUserAddress(direccionAEditar.id, payload);
    if (actualizada) {
      setDireccionesState((prev) =>
        prev.map((d) => (d.id === direccionAEditar.id ? actualizada : d))
      );
    }
    setDireccionAEditar(null);
  } else {
    const nueva = await createUserAddress(payload);
    if (nueva) {
      setDireccionesState((prev) => [...prev, nueva]);
      setMostrarModalAgregar(false);
    }
  }
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
            // Ensure all required fields are present and not undefined
            const payload = {
              address_line1: data.address_line1 ?? "",
              address_line2: data.address_line2 ?? "",
              postal_code: "1234567",
              is_default: false,
              type: "shipping" as "shipping",
              phone: data.phone ?? "",
              contact_name: data.contact_name ?? "",
              municipality_id: data.municipality_id ?? 0,
              alias: data.alias ?? "",
              //region_name: data.region_name ?? "",
            };

            if (direccionAEditar) {
              await replaceUserAddress(direccionAEditar.id, payload); // 👈 ahora PUT
              setDireccionAEditar(null);
            } else {
              const nueva = await createUserAddress(payload);
              if (nueva) {
                setDireccionesState((prev) => [...prev, nueva]);
              }
              setMostrarModalAgregar(false);
            }
          }}
        />
      )}
    </div>
  );
}
