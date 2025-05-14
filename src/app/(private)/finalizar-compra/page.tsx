"use client";
import { useState } from "react";
import RegionComunaSelector from "@/app/components/RegionComunaSelector";
import { useRouter } from "next/navigation";

export default function FinalizarCompraPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    nombre: "",
    rut: "",
    correo: "",
    telefono: "",
    region: "",
    comuna: "",
    direccion: "",
    detallesDireccion: "",
  });
  const validarEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validarTelefono = (telefono: string) =>
  /^(\+?56)?(\s?)(0?9)(\s?)[98765432]\d{7}$/.test(telefono);

const validarRUT = (rut: string) => {
  rut = rut.replace(/\./g, "").replace("-", "").toUpperCase();
  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1);
  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperado = 11 - (suma % 11);
  const dvFinal =
    dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();

  return dv === dvFinal;
};


  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));

  // Validaciones en tiempo real
  setErrors((prev) => {
    const newErrors = { ...prev };

    if (name === "correo") {
      if (!validarEmail(value)) {
        newErrors.correo = "Correo inválido";
      } else {
        delete newErrors.correo;
      }
    }

    if (name === "telefono") {
      if (!validarTelefono(value)) {
        newErrors.telefono = "Teléfono chileno inválido";
      } else {
        delete newErrors.telefono;
      }
    }

    if (name === "rut") {
      if (!validarRUT(value)) {
        newErrors.rut = "RUT inválido";
      } else {
        delete newErrors.rut;
      }
    }

    return newErrors;
  });
};

const goNext= () => {
  router.push('/compra-exitosa')
}
  return (
    <div className="bg-[#f1f5f9] min-h-screen p-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Formulario de facturación */}
        <div className="w-full lg:w-2/3 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">Datos de facturación</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">
                Nombre completo<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full p-2 mt-1 rounded bg-[#EBEFF7]"
              />
            </div>
            <div>
              <label className="block font-medium">
                Rut<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="rut"
                value={formData.rut}
                onChange={handleChange}
                className="w-full p-2 mt-1 rounded bg-[#EBEFF7]"
              />
              {errors.rut && <p className="text-red-500 text-sm mt-1">{errors.rut}</p>}

            </div>
            <div>
              <label className="block font-medium">
                Correo electrónico<span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className="w-full p-2 mt-1 rounded bg-[#EBEFF7]"
              />
              {errors.correo && <p className="text-red-500 text-sm mt-1">{errors.correo}</p>}

            </div>
            <div>
              <label className="block font-medium">
                Teléfono<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full p-2 mt-1 rounded bg-[#EBEFF7]"
              />
              {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>}

            </div>
            <RegionComunaSelector
              region={formData.region}
              comuna={formData.comuna}
              onChange={(field, value) =>
                setFormData({ ...formData, [field]: value })
              }
            />
            <div>
              <label className="block font-medium">
                Dirección<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="w-full p-2 mt-1 rounded bg-[#EBEFF7]"
              />
            </div>
            <div>
              <label className="block font-medium">
                Detalles de la dirección
              </label>
              <input
                type="text"
                name="detallesDireccion"
                value={formData.detallesDireccion}
                onChange={handleChange}
                className="w-full p-2 mt-1 rounded bg-[#EBEFF7]"
              />
            </div>
          </div>
        </div>

        {/* Resumen de la orden */}
        <aside className="w-full lg:w-1/3 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Tu Orden</h3>

          <div className="flex justify-between text-green-600 mb-2 border-t-slate-200 border-t pt-3">
            <a href="#" className="underline">
              Productos (19)
            </a>
            <span className="text-black">$29.583</span>
          </div>
          <div className="flex justify-between mb-1 border-t-slate-200 border-t pt-3 ">
            <span className="font-bold">Subtotal</span>
            <span className="font-bold">$29.583</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Costos de envío</span>
            <span>$3.000</span>
          </div>
          <div className="flex justify-between font-bold text-lg my-3  border-t-slate-200 border-t pt-4 pb-2">
            <span>Total a pagar</span>
            <span>$32.583</span>
          </div>

          <div className="mb-4  border-t-slate-200 border-t pt-3 pb-2">
            <p className="font-bold">
              Pagar con Webpay (Tarjeta de Crédito y Débito)
            </p>
            <img
              src="/assets/global/webpay.png"
              alt="Webpay"
              className="my-2 w-[70%] max-w-xs"
            />
            <p className="text-sm text-gray-600">
              Pagar con Redcompra
              <br />
              Serás redirigido al portal de WebPay
            </p>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <input type="radio" name="acepta" id="acepta" className="mr-2" />
            Todos los derechos reservados tankandtrailco.cl
            <br />
            Al comprar aceptas los{" "}
            <a href="#" className="text-green-600 underline">
              términos y condiciones
            </a>{" "}
            de tankandtrailco.cl
          </div>

          <button onClick={goNext} className="w-full bg-lime-500 hover:bg-lime-600 text-white py-2 rounded">
            Finalizar compra
          </button>
        </aside>
      </div>
    </div>
  );
}
