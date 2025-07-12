"use client";

import { useEffect, useState } from "react";
import type { Address } from "@/services/actions/addressees.actions";
import {
  getRegions,
  getMunicipalities,
  Region,
  Municipality,
} from "@/services/actions/location.client";

export default function ModalEditarDireccion({
  region,
  setRegion,
  comuna,
  setComuna,
  onClose,
  direccion,
  onSave,
}: {
  region: string;
  setRegion: (v: string) => void;
  comuna: string | number;
  setComuna: (v: string | number) => void;
  onClose: () => void;
  direccion?: Address;
  onSave: (data: Partial<Address> & { municipality_id: number }) => void;
}) {
  const [direccionLinea1, setDireccionLinea1] = useState("");
  const [direccionLinea2, setDireccionLinea2] = useState("");
  const [alias, setAlias] = useState("");
  const [telefono, setTelefono] = useState("");
  const [contacto, setContacto] = useState("");
  const [regiones, setRegiones] = useState<Region[]>([]);
  const [comunas, setComunas] = useState<Municipality[]>([]);
  const [regionId, setRegionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Obtener regiones al cargar
  useEffect(() => {
    getRegions().then(setRegiones);
  }, []);

  // Cargar comunas al seleccionar región
  useEffect(() => {
    if (regionId !== null) {
      getMunicipalities(regionId).then(setComunas);
    }
  }, [regionId]);

  // Cargar datos al editar
  useEffect(() => {
    async function cargarDatosDesdeDireccion() {
      const regiones = await getRegions();
      setRegiones(regiones);

      if (direccion) {
        const regionEncontrada = regiones.find(
          (r) => r.name === direccion.region_name
        );
        if (regionEncontrada) {
          setRegion(regionEncontrada.name);
          setRegionId(regionEncontrada.id);

          const comunas = await getMunicipalities(regionEncontrada.id);
          setComunas(comunas);

          const comunaEncontrada = comunas.find(
            (c) => c.name === direccion.municipality_name
          );
          if (comunaEncontrada) {
            setComuna(comunaEncontrada.id);
          }
        }

        setDireccionLinea1(direccion.address_line1 || "");
        setDireccionLinea2(direccion.address_line2 || "");
        setAlias(direccion.alias || "");
        setTelefono(direccion.phone || "");
        setContacto(direccion.contact_name || "");
      }

      setIsLoading(false);
    }

    cargarDatosDesdeDireccion();
  }, [direccion, setRegion, setComuna, regiones]);

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    const selectedRegion = regiones.find((r) => r.id === id);
    if (selectedRegion) {
      setRegion(selectedRegion.name);
      setRegionId(id);
      setComuna("");
      setComunas([]);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validar región
    if (!regionId) {
      newErrors.region = "La región es requerida";
    }

    // Validar comuna
    if (!comuna) {
      newErrors.comuna = "La comuna es requerida";
    }

    // Validar dirección
    if (!direccionLinea1.trim()) {
      newErrors.direccion = "La dirección es requerida";
    }

    // Validar alias
    if (!alias.trim()) {
      newErrors.alias = "El alias es requerido";
    }

    // Validar teléfono
    if (!telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
    } else if (!/^\d{9}$/.test(telefono.replace(/\s/g, ''))) {
      newErrors.telefono = "El teléfono debe tener 9 dígitos (ej: 945454545)";
    }

    // Validar contacto
    if (!contacto.trim()) {
      newErrors.contacto = "El nombre del contacto es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSave({
      address_line1: direccionLinea1,
      address_line2: direccionLinea2,
      phone: telefono,
      contact_name: contacto,
      municipality_id: Number(comuna),
      alias,
      region_name: region,
    });

    onClose();
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex justify-center items-center z-50 px-4 sm:px-0">
        <div className="bg-white p-6 rounded-lg shadow text-center text-gray-600 flex flex-col items-center">
          <p className="mb-2 text-lg">Cargando...</p>
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-lime-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex justify-center items-center z-50 px-4 sm:px-0">
      <div className="bg-white p-6 rounded-lg shadow max-w-2xl w-full relative">
        <h2 className="text-xl font-bold mb-4">
          {direccion ? "Editar dirección" : "Agregar nueva dirección"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Región */}
          <div>
            <label className="block font-medium">
              Región<span className="text-red-500">*</span>
            </label>
            <select
              value={regionId ?? ""}
              onChange={handleRegionChange}
              className={`w-full mt-1 p-2 bg-[#edf2f7] rounded ${errors.region ? 'border-red-500 border' : ''}`}
            >
              <option value="">Selecciona una región</option>
              {regiones.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            {errors.region && (
              <p className="text-red-500 text-sm mt-1">{errors.region}</p>
            )}
          </div>

          {/* Comuna */}
          <div>
            <label className="block font-medium">
              Comuna<span className="text-red-500">*</span>
            </label>
            <select
              value={comuna}
              onChange={(e) => setComuna(Number(e.target.value))}
              disabled={!regionId}
              className={`w-full mt-1 p-2 bg-[#edf2f7] rounded ${errors.comuna ? 'border-red-500 border' : ''}`}
            >
              <option value="">Selecciona una comuna</option>
              {comunas.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.comuna && (
              <p className="text-red-500 text-sm mt-1">{errors.comuna}</p>
            )}
          </div>

          {/* Dirección 1 */}
          <div className="md:col-span-1">
            <label className="block font-medium">Dirección<span className="text-red-500">*</span></label>
            <input
              type="text"
              value={direccionLinea1}
              onChange={(e) => setDireccionLinea1(e.target.value)}
              className={`w-full mt-1 p-2 bg-[#edf2f7] rounded ${errors.direccion ? 'border-red-500 border' : ''}`}
              placeholder="Ej: Av. Providencia 1234"
            />
            {errors.direccion && (
              <p className="text-red-500 text-sm mt-1">{errors.direccion}</p>
            )}
          </div>

          {/* Dirección 2 */}
          <div className="md:col-span-1">
            <label className="block font-medium">Detalle de la dirección</label>
            <input
              type="text"
              value={direccionLinea2}
              onChange={(e) => setDireccionLinea2(e.target.value)}
              className="w-full mt-1 p-2 bg-[#edf2f7] rounded"
              placeholder="Ej: Depto 45, Oficina 2"
            />
          </div>

          {/* Alias */}
          <div className="md:col-span-1">
            <label className="block font-medium">Alias<span className="text-red-500">*</span></label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              className={`w-full mt-1 p-2 bg-[#edf2f7] rounded ${errors.alias ? 'border-red-500 border' : ''}`}
              placeholder="Ej: Casa, Trabajo, Universidad"
            />
            {errors.alias && (
              <p className="text-red-500 text-sm mt-1">{errors.alias}</p>
            )}
          </div>

          {/* Teléfono */}
          <div className="md:col-span-1">
            <label className="block font-medium">Teléfono<span className="text-red-500">*</span></label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className={`w-full mt-1 p-2 bg-[#edf2f7] rounded ${errors.telefono ? 'border-red-500 border' : ''}`}
              placeholder="945454545"
            />
            {errors.telefono && (
              <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
            )}
          </div>

          {/* Contacto */}
          <div className="md:col-span-2">
            <label className="block font-medium">Nombre del contacto<span className="text-red-500">*</span></label>
            <input
              type="text"
              value={contacto}
              onChange={(e) => setContacto(e.target.value)}
              className={`w-full mt-1 p-2 bg-[#edf2f7] rounded ${errors.contacto ? 'border-red-500 border' : ''}`}
              placeholder="Ej: Juan Pérez"
            />
            {errors.contacto && (
              <p className="text-red-500 text-sm mt-1">{errors.contacto}</p>
            )}
          </div>

          {/* Botones */}
          <div className="col-span-1 md:col-span-2 flex gap-2 mt-4">
            <button
              type="submit"
              className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
