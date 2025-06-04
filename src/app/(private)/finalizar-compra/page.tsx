'use client';
import { useState } from 'react';
import RegionComunaSelector from '@/app/components/RegionComunaSelector';
import { useRouter } from 'next/navigation';
import RutInput from '@/app/components/global/RutInputVisualIndicators';
import Image from 'next/image';
import TelefonoInput from '@/app/components/global/TelefonoInput';
import useStore from '@/stores/base';

export default function FinalizarCompraPage() {
  const router = useRouter();
  const { openModal } = useStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    correo: '',
    telefono: '',
    region: '',
    comuna: '',
    direccion: '',
    detallesDireccion: '',
  });
  const [aceptaTerminos, setAceptaTerminos] = useState(true);
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAceptaTerminos(e.target.checked);
  };
  const validarEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validarTelefono = (telefono: string) =>
    /^(\+?56)?(\s?)(0?9)(\s?)[98765432]\d{7}$/.test(telefono);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validaciones en tiempo real
    setErrors((prev) => {
      const newErrors = { ...prev };

      if (name === 'correo') {
        if (!validarEmail(value)) {
          newErrors.correo = 'Correo inválido';
        } else {
          delete newErrors.correo;
        }
      }

      if (name === 'telefono') {
        if (!validarTelefono(value)) {
          newErrors.telefono = 'Teléfono chileno inválido';
        } else {
          delete newErrors.telefono;
        }
      }

      return newErrors;
    });
  };

  // Manejador específico para el cambio del RUT
  const handleRutChange = (value: string) => {
    setFormData((prev) => ({ ...prev, rut: value }));
  };

  // Manejador para la validación del RUT
  const handleRutValidation = (isValid: boolean) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (!isValid && formData.rut) {
        newErrors.rut = 'RUT inválido';
      } else {
        delete newErrors.rut;
      }
      return newErrors;
    });
  };

  const handleOpenModal = () => {
    openModal('', {
      content: <TerminosYCondicionesContent />,
      showCloseButton: true,
      size: 'xl',
    });
  };

  const goNext = () => {
    router.push('/compra-exitosa');
  };

  const TerminosYCondicionesContent = () => {
    return (
      <div className="flex flex-col gap-[30px]">
        <h3 className="text-2xl font-bold">Términos y condiciones</h3>
        <div className="flex items-start justify-start gap-[14px] flex-1-0-0 flex-wrap max-h-[60dvh] overflow-y-auto">
          <h4 className="text-lime-500 font-bold">1. Introducción</h4>
          <p>
            Bienvenido a SOCOMARCA. Estos Términos y Condiciones regulan el uso
            de nuestro sitio web y los servicios ofrecidos para la compra de
            productos. Al acceder y utilizar nuestro sitio, aceptas estar sujeto
            a estos términos. Si no estás de acuerdo con ellos, por favor, no
            utilices nuestro sitio.
          </p>
          <h4 className="text-lime-500 font-bold">2. Uso del Sitio</h4>
          <p>
            2.1. Elegibilidad El sitio está destinado exclusivamente para
            empresas y/o profesionales que realicen compras mayoristas. Al
            utilizar este sitio, declaras que: Eres mayor de edad y tienes la
            capacidad legal para celebrar contratos vinculantes. Representas a
            una empresa o entidad comercial válida. 2.2. Registro Para realizar
            compras, deberás crear una cuenta. Es tu responsabilidad
            proporcionar información veraz, completa y actualizada. Nos
            reservamos el derecho de suspender o eliminar cuentas en caso de
            incumplimiento de estos términos.
          </p>
          <h4 className="text-lime-500 font-bold">3. Pedidos y Pagos</h4>
          <p>
            3.1. Procesamiento de Pedidos Todos los pedidos están sujetos a
            disponibilidad de inventario y confirmación de pago. Nos reservamos
            el derecho de cancelar pedidos en caso de errores en precios,
            disponibilidad o cualquier otra circunstancia que lo justifique.
            3.2. Métodos de Pago Aceptamos pagos mediante [especificar métodos
            de pago, por ejemplo, transferencia bancaria, tarjetas de
            crédito/débito, etc.]. Los pagos deben realizarse en su totalidad
            antes del despacho de los productos. 3.3. Facturación
            Proporcionaremos facturas válidas conforme a las leyes aplicables.
            Asegúrate de ingresar correctamente los datos fiscales necesarios.
          </p>
          <h4 className="text-lime-500 font-bold">4. Precios y Promociones</h4>
          <p>
            Los precios publicados en nuestro sitio están en [moneda aplicable]
            e incluyen/excluyen impuestos según se indique.
            <br />
            Las promociones y descuentos son válidos únicamente durante el
            período especificado y están sujetos a disponibilidad.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#f1f5f9] min-h-screen p-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Formulario de facturación */}
        <div className="w-full lg:w-2/3 bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-2xl font-bold mb-6">Datos de facturación</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <RutInput
                className="w-full p-2 mt-1 rounded bg-[#EBEFF7]"
                name="rut"
                value={formData.rut}
                onChange={handleRutChange}
                onValidationChange={handleRutValidation}
                errorMessage="RUT inválido"
              />
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
              {errors.correo && (
                <p className="text-red-500 text-sm mt-1">{errors.correo}</p>
              )}
            </div>
            <div>
              <TelefonoInput
                name="telefono"
                value={formData.telefono}
                onChange={(e, prefijo) =>
                  setFormData((prev) => ({
                    ...prev,
                    telefono: e.target.value,
                    telefonoCompleto: `${prefijo}${e.target.value}`,
                  }))
                }
                error={errors.telefono}
              />

              {errors.telefono && (
                <p className="text-red-500 text-sm mt-1">{errors.telefono}</p>
              )}
            </div>
            <RegionComunaSelector
              region={formData.region}
              comuna={formData.comuna}
              onChange={(field, value) =>
                setFormData((prev) => ({ ...prev, [field]: value }))
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

          <div className="flex justify-between border-t-slate-200 border-t py-5">
            <span>Productos (19)</span>
            <span className="text-black">$29.583</span>
          </div>
          <div className="flex justify-between border-t-slate-200 border-t py-5 ">
            <span className="font-bold">Subtotal</span>
            <span className="font-bold">$29.583</span>
          </div>
          <div className="flex justify-between mb-5">
            <span>Costos de envío</span>
            <span>$3.000</span>
          </div>
          <div className="flex justify-between font-bold text-lg  border-t-slate-200 border-t py-5">
            <span>Total a pagar</span>
            <span>$32.583</span>
          </div>

          <div className="mb-4 border-t-slate-200 border-t py-5">
            <p className="font-bold">
              Pagar con Webpay (Tarjeta de Crédito y Débito)
            </p>
            <Image
              width={104}
              height={27}
              style={{ width: 'auto', height: 'auto' }}
              src="/assets/global/logo_webpay.png"
              alt="Webpay"
              className="my-2 w-[40%] max-w-xs"
              unoptimized
            />
            <p className="text-sm text-neutral-950">
              Pagar con Redcompra
              <br />
              Serás redirigido al portal de WebPay
            </p>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <input
              type="checkbox"
              name="acepta"
              id="acepta"
              className="mr-2"
              checked={aceptaTerminos}
              onChange={handleCheckboxChange}
            />
            Todos los derechos reservados tankandtrailco.cl
            <br />
            Al comprar aceptas los{' '}
            <span
              onClick={handleOpenModal}
              className="text-lime-500 cursor-pointer"
            >
              términos y condiciones
            </span>{' '}
            de tankandtrailco.cl
          </div>

          <button
            onClick={goNext}
            className="w-full bg-lime-500 hover:bg-lime-600 text-white py-2 rounded cursor-pointer"
          >
            Finalizar compra
          </button>
        </aside>
      </div>
    </div>
  );
}
