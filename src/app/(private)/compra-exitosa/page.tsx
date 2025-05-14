"use client";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function CompraExitosaPage() {
  const router = useRouter();

  // Simulación de datos
  const numeroOrden = "95491147";
  const totalCompra = 36250;
  const direccion = "Los alamos #444 Providencia, Región Metropolitana";

  return (
    <div className="bg-[#f5faf5] min-h-[60vh] flex justify-center py-6 md:py-10 px-4">
      <div className="bg-white max-w-2xl h-fit md:mt-10 p-8 rounded-lg text-center shadow">
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
          ¡Gracias por tu compra!
        </h1>
        <h2 className="text-2xl font-bold text-lime-500 mb-6">Resumen</h2>

        <p className="mb-2 text-lg">
          Número de orden: <span className="text-red-500">{numeroOrden}</span>
        </p>
        <p className="mb-2 text-lg">
          Total de la compra: ${totalCompra.toLocaleString("es-CL")}
        </p>
        <p className="mb-6 text-lg">{`Dirección de envío: ${direccion}`}</p>

        <button
          onClick={() => router.push("/")}
          className="bg-lime-500 hover:bg-lime-600 text-white py-2 px-6 rounded text-lg"
        >
          Volver al Home
        </button>

        <p className="mt-6 text-sm text-gray-700 flex items-center justify-center gap-2">
          <InformationCircleIcon className="w-5 h-5 text-gray-500" />
          Te enviaremos un mensaje a tu correo con el detalle de tu compra
        </p>
      </div>
    </div>
  );
}
