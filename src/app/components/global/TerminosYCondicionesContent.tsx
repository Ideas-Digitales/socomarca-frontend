import React from 'react';
import useStore from '@/stores/base';

interface TerminosYCondicionesContentProps {
  onClose?: () => void;
}

const TerminosYCondicionesContent = ({ onClose }: TerminosYCondicionesContentProps) => {
  const { closeModal } = useStore();
  
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      closeModal();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex flex-col gap-[30px] max-h-[80vh] overflow-y-auto">
      <h3 className="text-2xl font-bold">Términos y condiciones</h3>
      <div className="flex flex-col gap-[14px]">
        <div>
          <h4 className="text-lime-500 font-bold mb-2">1. Introducción</h4>
          <p className="text-gray-700 leading-relaxed">
            Bienvenido a SOCOMARCA. Estos Términos y Condiciones regulan el uso
            de nuestro sitio web y los servicios ofrecidos para la compra de
            productos. Al acceder y utilizar nuestro sitio, aceptas estar sujeto
            a estos términos. Si no estás de acuerdo con ellos, por favor, no
            utilices nuestro sitio.
          </p>
        </div>
        
        <div>
          <h4 className="text-lime-500 font-bold mb-2">2. Uso del Sitio</h4>
          <p className="text-gray-700 leading-relaxed">
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
        </div>
        
        <div>
          <h4 className="text-lime-500 font-bold mb-2">3. Pedidos y Pagos</h4>
          <p className="text-gray-700 leading-relaxed">
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
        </div>
        
        <div>
          <h4 className="text-lime-500 font-bold mb-2">4. Precios y Promociones</h4>
          <p className="text-gray-700 leading-relaxed">
            Los precios publicados en nuestro sitio están en [moneda aplicable]
            e incluyen/excluyen impuestos según se indique.
            <br />
            Las promociones y descuentos son válidos únicamente durante el
            período especificado y están sujetos a disponibilidad.
          </p>
        </div>
      </div>
      
             {/* Botón de cerrar */}
       <div className="flex justify-center pt-4 border-t border-gray-200">
         <button
           onClick={handleClose}
           className="bg-lime-500 text-white hover:bg-lime-600 transition-colors ease-in-out duration-300 px-8 py-3 cursor-pointer rounded font-medium"
         >
           Entiendo
         </button>
       </div>
       </div>
     </div>
   );
 };

export default TerminosYCondicionesContent;
