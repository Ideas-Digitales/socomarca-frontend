// TODO: Preguntar si el color green es el correcto, o si debe ser lime.!!!!

export default function PoliticaPrivacidadPage() {
  return (
    <div className="bg-[#f1f5f9] min-h-screen p-6 md:p-12">
          <div className="w-full flex px-2 shado">
          <div className="h-2 w-1/3 bg-[#267E00]"></div>
          <div className="h-2 w-2/3 bg-[#6CB409]"></div>
        </div>
      <div className="max-w-4xl mx-auto bg-white p-8 shadow">
        <h1 className="text-3xl font-bold mb-8">Política y privacidad</h1>

        <section className="mb-6">
          <h2 className="text-lime-500 font-semibold mb-2">Información que es recogida.</h2>
          <p>
            Nuestro sitio web podrá recoger información personal por ejemplo: Nombre, información de contacto como su dirección de correo 
            electrónico e información demográfica. Así mismo cuando sea necesario podrá ser requerida información específica para procesar 
            algún pedido o realizar una entrega o facturación.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lime-500 font-semibold mb-2">Uso de la información recogida</h2>
          <p>
            Nuestro sitio web emplea la información con el fin de proporcionar el mejor servicio posible, particularmente para mantener un 
            registro de usuarios, de pedidos en caso que aplique, y mejorar nuestros productos y servicios. Es posible que sean enviados 
            correos electrónicos periódicamente a través de nuestro sitio con ofertas especiales, nuevos productos y otra información 
            publicitaria que consideremos relevante para usted o que pueda brindarle algún beneficio, estos correos electrónicos serán 
            enviados a la dirección que usted proporcione y podrán ser cancelados en cualquier momento.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-lime-500 font-semibold mb-2">Cookies</h2>
          <p>
            Una cookie se refiere a un fichero que es enviado con la finalidad de solicitar permiso para almacenarse en su ordenador, al 
            aceptar dicho fichero se crea y la cookie sirve entonces para tener información respecto al tráfico web, y también facilita las 
            futuras visitas a una web recurrente. Otra función que tienen las cookies es que con ellas las web pueden reconocerte 
            individualmente y por tanto brindarte el mejor servicio personalizado de su web.
          </p>
        </section>

        <section>
          <h2 className="text-lime-500 font-semibold mb-2">Enlaces a Terceros</h2>
          <p>
            Este sitio web pudiera contener enlaces a otros sitios que pudieran ser de su interés. Una vez que usted dé clic en estos enlaces 
            y abandone nuestra página, ya no tenemos control sobre el sitio al que es redirigido y por lo tanto no somos responsables de los 
            términos o privacidad ni de la protección de sus datos en esos otros sitios terceros. Dichos sitios están sujetos a sus propias 
            políticas de privacidad por lo cual es recomendable que los consulte para confirmar que usted está de acuerdo con estas.
          </p>
        </section>
      </div>
    </div>
  );
}
