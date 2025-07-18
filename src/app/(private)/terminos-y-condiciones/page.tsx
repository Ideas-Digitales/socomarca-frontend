import useAuthStore from '@/stores/useAuthStore';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';

export default function TerminoCondicionesPage() {
  const { getUserRole } = useAuthStore();
  const userRole = getUserRole();
  return (
    <div className="bg-[#f1f5f9] min-h-screen p-6 md:p-12">
      {(userRole === 'admin' || userRole === 'superadmin') && (
        <a
          href={userRole === 'admin' ? '/admin/total-de-ventas' : '/super-admin/users'}
          className="fixed z-50 bottom-6 right-6 flex items-center gap-2 bg-[#007f00] hover:bg-[#003200] text-white px-6 py-3 rounded-full shadow-lg font-semibold text-lg transition-colors duration-200"
          style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
        >
          <ArrowUturnLeftIcon className="w-6 h-6" />
          Volver al panel de administración
        </a>
      )}
      <div className="max-w-4xl mx-auto bg-white pt-0 shadow">
        <div className="w-full flex">
          <div className="h-2 w-1/3 bg-[#267E00]"></div>
          <div className="h-2 w-2/3 bg-[#6CB409]"></div>
        </div>
        <h1 className="text-3xl font-bold mb-8 pt-8 px-8">Términos y condiciones</h1>

        <section className="mb-6 px-8">
          <h2 className="text-lime-600 font-semibold mb-2">1. Introducción</h2>
          <p>
            Bienvenido a SOCOMARCA. Estos Términos y Condiciones regulan el uso de nuestro sitio web y los
            servicios ofrecidos para la compra de productos. Al acceder y utilizar nuestro sitio, aceptas estar sujeto a estos términos. 
            Si no estás de acuerdo con ellos, por favor, no utilices nuestro sitio.
          </p>
        </section>

        <section className="mb-6  px-8">
          <h2 className="text-lime-600 font-semibold mb-2">2. Uso del Sitio</h2>
          <h3 className="font-medium">2.1. Elegibilidad</h3>
          <p>
            El sitio está destinado exclusivamente para empresas y/o profesionales que realicen compras mayoristas. 
            Al utilizar este sitio, declaras que:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>Eres mayor de edad y tienes la capacidad legal para celebrar contratos vinculantes.</li>
            <li>Representas a una empresa o entidad comercial válida.</li>
          </ul>
          <h3 className="font-medium mt-4">2.2. Registro</h3>
          <p>
            Para realizar compras, deberás crear una cuenta. Es tu responsabilidad proporcionar información veraz, completa y actualizada. 
            Nos reservamos el derecho de suspender o eliminar cuentas en caso de incumplimiento de estos términos.
          </p>
        </section>

        <section className="mb-6  px-8">
          <h2 className="text-lime-600 font-semibold mb-2">3. Pedidos y Pagos</h2>
          <h3 className="font-medium">3.1. Procesamiento de Pedidos</h3>
          <ul className="list-disc ml-6 mt-2">
            <li>Todos los pedidos están sujetos a disponibilidad de inventario y confirmación de pago.</li>
            <li>
              Nos reservamos el derecho de cancelar pedidos en caso de errores en precios, disponibilidad o cualquier otra circunstancia que lo justifique.
            </li>
          </ul>
          <h3 className="font-medium mt-4">3.2. Métodos de Pago</h3>
          <p>
            Aceptamos pagos mediante [especificar métodos de pago, por ejemplo, transferencia bancaria, tarjetas de crédito/débito, etc.]. 
            Los pagos deben realizarse en su totalidad antes del despacho de los productos.
          </p>
          <h3 className="font-medium mt-4">3.3. Facturación</h3>
          <p>
            Proporcionaremos facturas válidas conforme a las leyes aplicables. 
            Asegúrate de ingresar correctamente los datos fiscales necesarios.
          </p>
        </section>

        <section className="mb-6  px-8 pb-8">
          <h2 className="text-lime-600 font-semibold mb-2">4. Precios y Promociones</h2>
          <ul className="list-disc ml-6 mt-2">
            <li>Los precios publicados en nuestro sitio están en [moneda aplicable] e incluyen/excluyen impuestos según se indique.</li>
            <li>Las promociones y descuentos son válidos únicamente durante el período especificado y están sujetos a disponibilidad.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
