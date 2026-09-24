import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Guía de compra rápida | Socomarca',
  description: 'Guía de compra rápida. Tu compra lista, paso a paso.',
};

const ASSETS = '/assets/guia-de-compra';

interface Feature {
  icon: string;
  text: React.ReactNode;
}

function StepLabel({ step }: { step: string }) {
  return (
    <span className="inline-flex items-center min-h-[26px] mb-4 px-3 py-1 rounded-full bg-[#EFF7E0] text-[#267E00] text-[11px] tracking-[.08em]">
      PASO {step}
    </span>
  );
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-[32px] md:text-[40px] font-bold leading-[.98] tracking-[-.045em] text-[#111511]">
      {children}
    </h2>
  );
}

function StepDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-[570px] mb-8 text-sm leading-relaxed text-[#565d56]">
      {children}
    </p>
  );
}

function FeatureList({
  features,
  large = false,
}: {
  features: Feature[];
  large?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-5 mb-7">
      {features.map((feature) => (
        <article
          key={feature.icon}
          className="flex flex-col items-center text-center min-w-0"
        >
          <img
            src={`${ASSETS}/${feature.icon}`}
            alt=""
            className={`${large ? 'w-[66px] h-[66px]' : 'w-[52px] h-[52px]'} mb-3 rounded-[13px]`}
          />
          <p className="m-0 text-[11px] leading-[1.45] text-[#666d66]">
            {feature.text}
          </p>
        </article>
      ))}
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <p className="relative mt-6 pl-4 text-[11px] leading-[1.55] text-[#666d66] before:content-[''] before:absolute before:top-[.45em] before:left-0 before:w-[5px] before:h-[5px] before:rounded-full before:bg-[#76b82a]">
      <strong className="text-[#173c25]">Consejo:</strong> {children}
    </p>
  );
}

function ImportantBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4 px-[18px] py-4 border-l-4 border-[#76b82a] bg-[#eff5ea]">
      <strong className="block mb-1 text-xs text-[#173c25]">{title}</strong>
      <p className="m-0 text-[11px] text-[#666d66]">{children}</p>
    </div>
  );
}

function StepSection({
  variant,
  mediaFirst = false,
  content,
  media,
}: {
  variant: 'light' | 'white';
  mediaFirst?: boolean;
  content: React.ReactNode;
  media: React.ReactNode;
}) {
  return (
    <section
      className={`py-14 sm:py-[72px] lg:py-[100px] ${
        variant === 'light' ? 'bg-[#f7f9f5]' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-12 lg:gap-[90px]">
        <div
          className={`max-w-[580px] order-1 ${mediaFirst ? 'md:order-2' : ''}`}
        >
          {content}
        </div>
        <div
          className={`flex flex-col items-center justify-center w-full order-2 ${
            mediaFirst ? 'md:order-1' : ''
          }`}
        >
          {media}
        </div>
      </div>
    </section>
  );
}

function StepImage({
  src,
  width,
  height,
  alt,
  caption,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
}) {
  return (
    <>
      <Image
        src={`${ASSETS}/${src}`}
        width={width}
        height={height}
        alt={alt}
        sizes="(max-width: 768px) 100vw, 610px"
        className={`w-full ${caption ? 'max-w-[610px]' : ''} h-auto rounded-[15px] object-cover`}
      />
      {caption && (
        <p className="w-full max-w-[610px] mt-3 text-xs leading-[1.4] text-center text-[#666d66]">
          {caption}
        </p>
      )}
    </>
  );
}

const quickItems = [
  { number: '01', line: 'Tu lista de precios', strong: 'personalizada' },
  { number: '02', line: 'Stock y productos', strong: 'actualizados' },
  { number: '03', line: 'Transbank o', strong: 'Línea de crédito' },
];

const filters = [
  { icon: 'categorias.svg', label: 'Categorías' },
  { icon: 'favoritos.svg', label: 'Favoritos' },
  { icon: 'marcas.svg', label: 'Marcas' },
  { icon: 'precios.svg', label: 'Precio' },
];

const checkoutRows = [
  {
    title: 'Facturación',
    text: 'Revisa los datos asociados a tu cuenta.',
  },
  {
    title: 'Dirección de envío',
    text: 'Selecciona el lugar donde recibirás el pedido.',
  },
  { title: 'Documento', text: 'Elige boleta o factura.' },
  {
    title: 'Notas del pedido',
    text: 'Agrega instrucciones si es necesario. Selecciona una dirección registrada o agrega una nueva previamente.',
  },
];

export default function GuiaDeCompraPage() {
  return (
    <div className="w-full overflow-hidden text-[#111511]">
      {/* HERO */}
      <section className="relative lg:min-h-[660px] bg-[radial-gradient(circle_at_78%_50%,rgba(139,197,63,.16),transparent_30%),linear-gradient(110deg,#ffffff_0%,#ffffff_42%,#edf4e8_100%)] after:content-[''] after:absolute after:-right-[10%] after:-bottom-[32%] after:w-[58%] after:h-[85%] after:bg-[#e5f0dc] after:rounded-full after:opacity-70 after:z-0">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-[minmax(0,.92fr)_minmax(480px,1.08fr)] items-center gap-6 lg:gap-[60px] py-11 lg:py-0 lg:min-h-[660px]">
          <div className="text-center lg:text-left lg:py-[70px]">
            <span className="inline-block mb-3 text-xs font-bold leading-tight tracking-[.13em] uppercase text-[#173c25]">
              Guía de compra rápida
            </span>
            <h1 className="mb-[18px] text-[clamp(43px,13vw,65px)] sm:text-[clamp(48px,5.5vw,62px)] font-bold leading-[.96] tracking-[-.045em]">
              Tu compra lista,
              <br />
              <strong className="text-[#76b82a]">paso a paso.</strong>
            </h1>
            <p className="max-w-[570px] mx-auto lg:mx-0 mb-8 text-[15px] leading-[1.55] text-[#3f463f]">
              Encuentra tus productos, arma el pedido y elige cómo pagar. Todo
              en una experiencia pensada para tu negocio.
            </p>
            <div className="inline-flex flex-col">
              <strong className="text-lg leading-none text-[#173c25]">
                6 pasos
              </strong>
              <span className="text-[13px] text-[#687064]">Fácil y rápido</span>
            </div>
          </div>

          <div className="relative z-20 flex items-center justify-center max-w-[750px] mx-auto lg:max-w-none">
            <Image
              src={`${ASSETS}/hero-01.png`}
              width={900}
              height={840}
              alt="Pantallas de la aplicación Socomarca"
              priority
              sizes="(max-width: 1024px) 100vw, 700px"
              className="w-full max-w-[700px] h-auto rounded-[10px] sm:rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* BARRA DE BENEFICIOS */}
      <section
        className="relative z-10 bg-[#267E00] text-white"
        aria-label="Resumen de beneficios"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-3 md:min-h-[92px]">
          {quickItems.map((item) => (
            <div
              key={item.number}
              className="flex items-center justify-start md:justify-center gap-2 min-h-[72px] px-4 sm:px-[22px] md:px-[25px] py-[18px] text-xs leading-tight border-b md:border-b-0 md:border-r last:border-0 border-white/20"
            >
              <span className="text-[33px] font-bold text-[#F1F7E2]">
                {item.number}
              </span>
              <span>
                {item.line}
                <br />
                <strong className="font-bold">{item.strong}</strong>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* PASO 01 */}
      <StepSection
        variant="light"
        content={
          <>
            <StepLabel step="01" />
            <StepTitle>Ingresa a tu cuenta</StepTitle>
            <StepDescription>
              Accede con tus credenciales de cliente. Al iniciar sesión, la APP
              reconoce tu empresa y muestra las condiciones comerciales que
              tienes asignadas.
            </StepDescription>
            <FeatureList
              features={[
                {
                  icon: 'paso-01-a.svg',
                  text: (
                    <>
                      Precios correspondientes
                      <br />a tu lista.
                    </>
                  ),
                },
                {
                  icon: 'paso-01-b.svg',
                  text: (
                    <>
                      Datos de
                      <br />
                      facturación asociados.
                    </>
                  ),
                },
                {
                  icon: 'paso-01-c.svg',
                  text: (
                    <>
                      Línea de crédito,
                      <br />
                      si está habilitada.
                    </>
                  ),
                },
              ]}
            />
            <ImportantBox title="Importante">
              Si necesitas actualizar tus datos personales, comunícate con
              soporte.
            </ImportantBox>
          </>
        }
        media={
          <StepImage
            src="ingresa-a-tu-cuenta.png"
            width={698}
            height={419}
            alt="Pantalla de inicio de sesión"
          />
        }
      />

      {/* PASO 02 */}
      <StepSection
        variant="white"
        mediaFirst
        content={
          <>
            <StepLabel step="02" />
            <StepTitle>Encuentra tus productos</StepTitle>
            <StepDescription>
              Usa el buscador o aplica filtros para llegar rápidamente a lo que
              necesitas. Puedes filtrar por categoría, marca, favoritos o rango
              de precio.
            </StepDescription>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-2.5">
              {filters.map((filter) => (
                <div
                  key={filter.label}
                  className="flex flex-col items-center gap-2 px-1.5 py-3 border border-[#e1e8dc] rounded-xl bg-[#fbfcfa] text-center"
                >
                  <img
                    src={`${ASSETS}/${filter.icon}`}
                    alt=""
                    className="w-[42px] h-[42px] rounded-[10px]"
                  />
                  <span className="text-[10px] font-bold text-[#173c25]">
                    {filter.label}
                  </span>
                </div>
              ))}
            </div>
            <Tip>
              guarda los productos recurrentes en lista de favoritos para
              encontrarlos en segundos.
            </Tip>
          </>
        }
        media={
          <StepImage
            src="paso-02.png"
            width={1000}
            height={1014}
            alt="Catálogo de productos y filtros"
          />
        }
      />

      {/* PASO 03 */}
      <StepSection
        variant="light"
        content={
          <>
            <StepLabel step="03" />
            <StepTitle>Define la cantidad y agrega</StepTitle>
            <StepDescription>
              En cada tarjeta de productos, selecciona la cantidad y presiona
              Agregar al carro. No necesitas abrir cada producto: puedes
              continuar agregando distintos SKU desde la misma vista.
            </StepDescription>
            <FeatureList
              large
              features={[
                {
                  icon: 'paso-03-a.svg',
                  text: (
                    <>
                      Confirma que sea
                      <br />
                      el producto correcto.
                    </>
                  ),
                },
                {
                  icon: 'paso-03-b.svg',
                  text: (
                    <>
                      Indica cuántas
                      <br />
                      unidades necesitas.
                    </>
                  ),
                },
                {
                  icon: 'paso-03-c.svg',
                  text: (
                    <>
                      Presiona
                      <br />
                      Agregar al carro.
                    </>
                  ),
                },
              ]}
            />
          </>
        }
        media={
          <StepImage
            src="paso-03.png"
            width={1040}
            height={1576}
            alt="Carrito lateral con productos agregados"
            caption="El carrito lateral se actualiza mientras sigues comprando."
          />
        }
      />

      {/* PASO 04 */}
      <StepSection
        variant="white"
        mediaFirst
        content={
          <>
            <StepLabel step="04" />
            <StepTitle>Revisa tu carro</StepTitle>
            <StepDescription>
              Antes de continuar, comprueba tus productos, cantidades y
              subtotal. Todavía puedes hacer cambios con total libertad.
            </StepDescription>
            <FeatureList
              features={[
                {
                  icon: 'paso-04-a.svg',
                  text: (
                    <>
                      Aumentar o<br />
                      disminuir cantidades.
                    </>
                  ),
                },
                {
                  icon: 'paso-04-b.svg',
                  text: (
                    <>
                      Eliminar un producto
                      <br />o vaciar el carro.
                    </>
                  ),
                },
                {
                  icon: 'paso-04-c.svg',
                  text: (
                    <>
                      Volver al catálogo
                      <br />
                      para seguir comprando.
                    </>
                  ),
                },
              ]}
            />
            <Tip>
              guarda los productos recurrentes en lista de favoritos para
              encontrarlos en tu próxima compra.
            </Tip>
          </>
        }
        media={
          <StepImage
            src="paso-04.png"
            width={1312}
            height={976}
            alt="Revisión del carro de compra"
            caption="El resumen mantiene visible el monto antes de avanzar."
          />
        }
      />

      {/* PASO 05 */}
      <StepSection
        variant="light"
        content={
          <>
            <StepLabel step="05" />
            <StepTitle>Completa el checkout</StepTitle>
            <StepDescription>
              Confirma los datos necesarios para que tu pedido sea procesado
              correctamente.
            </StepDescription>
            <div className="grid gap-[9px]">
              {checkoutRows.map((row) => (
                <div
                  key={row.title}
                  className="grid grid-cols-[28px_1fr] gap-[13px] items-start px-[14px] py-3 border border-[#dfe6da] rounded-lg bg-white"
                >
                  <span className="grid place-items-center w-[27px] h-[27px] rounded-full bg-[#e4efd9] text-xs font-black text-[#173c25]">
                    ✓
                  </span>
                  <div>
                    <strong className="block text-xs text-[#173c25]">
                      {row.title}
                    </strong>
                    <p className="mt-0.5 text-[10px] leading-[1.4] text-[#666d66]">
                      {row.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        }
        media={
          <StepImage
            src="paso-05.png"
            width={1400}
            height={940}
            alt="Pantalla de finalizar compra"
          />
        }
      />

      {/* PASO 06 */}
      <StepSection
        variant="white"
        mediaFirst
        content={
          <>
            <StepLabel step="06" />
            <StepTitle>
              Confirma tu compra con
              <br className="hidden sm:block" /> línea de crédito
            </StepTitle>
            <StepDescription>
              Tu compra se realizará utilizando la línea de crédito habilitada
              para tu empresa. Revisa que tengas cupo disponible, acepta los
              Términos y condiciones y confirma tu pedido.
            </StepDescription>
            <div className="flex items-center gap-[15px] mt-[26px] p-[15px] border border-[#dfe7d9] rounded-[10px] bg-[#fbfcfa]">
              <img
                src={`${ASSETS}/paso-06-precio.svg`}
                alt=""
                className="w-[50px] h-[50px] flex-none rounded-[10px]"
              />
              <div>
                <strong className="text-[13px] text-[#173c25]">
                  Línea de crédito
                </strong>
                <p className="mt-0.5 text-[11px] text-[#666d66]">
                  Compra según tu cupo disponible.
                </p>
              </div>
            </div>
            <ImportantBox title="Antes de confirmar">
              Revisa productos, cantidades, dirección, documento y medio de
              pago.
            </ImportantBox>
          </>
        }
        media={
          <div className="flex flex-col items-center justify-center w-full max-w-[570px] min-h-[280px] sm:min-h-[310px] px-5 py-[30px] sm:p-[45px] rounded-xl bg-[#173c25] text-white text-center">
            <img
              src={`${ASSETS}/paso-06.svg`}
              alt=""
              className="w-[72px] h-[72px] mb-5 rounded-full"
            />
            <span className="mb-1 text-[11px] font-semibold text-[#b9d999]">
              Pedido confirmado
            </span>
            <strong className="text-2xl sm:text-[29px] font-extrabold tracking-[-.03em]">
              ¡Tu compra está lista!
            </strong>
            <small className="mt-2 text-[11px] text-white/75">
              Podrás consultar el pedido y su estado en{' '}
              <Link
                href="/mi-cuenta?section=compras"
                className="underline hover:text-white"
              >
                Mis compras
              </Link>
              .
            </small>
            <a
              href="#para-la-proxima"
              className="inline-block mt-[15px] text-xs text-[#b9d999] underline"
            >
              Ver opciones para tu próxima compra ➔
            </a>
          </div>
        }
      />

      {/* PARA LA PRÓXIMA */}
      <section
        id="para-la-proxima"
        className="scroll-mt-28 pt-[65px] pb-[75px] sm:pt-[90px] sm:pb-[110px] bg-[#173c25] text-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-[700px] mx-auto mb-[50px] text-center">
            <span className="inline-block mb-3 text-xs font-bold leading-tight tracking-[.13em] uppercase text-[#a6d36c]">
              Para la próxima
            </span>
            <h2 className="mb-3 text-[32px] md:text-[40px] font-bold leading-[.98] tracking-[-.045em]">
              Compra aún más rápido.
            </h2>
            <p className="text-sm text-white/75">
              La APP recuerda tu actividad para simplificar los pedidos
              recurrentes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-[35px] max-w-[1000px] mx-auto">
            <Link
              href="/mi-cuenta?section=favoritos"
              className="block overflow-hidden rounded-xl"
            >
              <Image
                src={`${ASSETS}/mis-favoritos.png`}
                width={712}
                height={936}
                alt="Mis favoritos: accede a tus productos guardados"
                sizes="(max-width: 640px) 100vw, 500px"
                className="w-full h-auto rounded-xl object-cover"
              />
            </Link>
            <Link
              href="/mi-cuenta?section=compras"
              className="block overflow-hidden rounded-xl"
            >
              <Image
                src={`${ASSETS}/repetir-pedido.png`}
                width={712}
                height={936}
                alt="Repetir pedido: vuelve a comprar desde tu historial"
                sizes="(max-width: 640px) 100vw, 500px"
                className="w-full h-auto rounded-xl object-cover"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
