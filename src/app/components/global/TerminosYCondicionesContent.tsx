import React from 'react';

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

export default TerminosYCondicionesContent;
