import Image from 'next/image';
import Link from 'next/link';
import FacebookIcon from '../../../../public/assets/logos/FacebookIcon';
import TwitterIcon from '../../../../public/assets/logos/TwitterIcon';
import InstagramIcon from '../../../../public/assets/logos/InstagramIcon';
import PinterestIcon from '../../../../public/assets/logos/PinterestIcon';
import YoutubeIcon from '../../../../public/assets/logos/YoutubeIcon';
import TelefonoIcon from '../../../../public/assets/logos/TelefonoIcon';
import EmailIcon from '../../../../public/assets/logos/EmailIcon';
const masterCardImageUrl = '/assets/footer/mastercard.png';
const americanExpressImageUrl = '/assets/footer/american-express.png';
const paypalImageUrl = '/assets/footer/paypal.png';
const visaImageUrl = '/assets/footer/visa.png';
const logoImageUrl = '/assets/footer/logo.png';

// Icon RRSS

export default function Footer() {
  return (
    <footer className="bg-white text-sm text-gray-600">
      {/* Línea verde superior */}
      <div className="h-1 bg-lime-500" />

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo y descripción */}
        <div className="flex flex-col items-start gap-[10px]">
          <h1 className="text-lime-600 text-xl font-bold">
            <Image
              src={logoImageUrl}
              alt="Logo de Socomarca"
              width={216}
              height={39}
              className="h-10 w-auto"
            />
          </h1>
          <p className="text-gray-500">
            Vivamus tristique odio sit amet velit semper, eu posuere turpis
            interdum. <br />
            Cras egestas purus
          </p>
          {/* Redes sociales */}
          <div className="flex items-start gap-1">
            <div className="w-[38px] h-[38px] flex justify-center items-center">
              <FacebookIcon width={16} height={16} />
            </div>
            <div className="w-[38px] h-[38px] flex justify-center items-center">
              <TwitterIcon width={16} height={13} />
            </div>
            <div className="w-[38px] h-[38px] flex justify-center items-center">
              <InstagramIcon width={13} height={13} />
            </div>
            <div className="w-[38px] h-[38px] flex justify-center items-center">
              <PinterestIcon width={16} height={16} />
            </div>
            <div className="w-[38px] h-[38px] flex justify-center items-center">
              <YoutubeIcon width={16} height={12} />
            </div>
          </div>
        </div>

        {/* Categoría */}
        <div>
          <h3 className="text-gray-500 font-bold mb-3">Categoría</h3>
          <ul className="space-y-1">
            <li>Despensa</li>
            <li>Hogar y limpieza</li>
            <li>Lácteos y fiambre</li>
            <li>Cuidado personal</li>
            <li>Bebestibles</li>
            <li>Confites</li>
          </ul>
        </div>

        {/* Atención al cliente */}
        <div>
          <h3 className="text-gray-500 font-bold mb-3">Atención al cliente</h3>
          <ul className="space-y-1">
            <li>
              <Link href="/preguntas-frecuentes" className="">
                Preguntas frecuentes
              </Link>
            </li>
            <li>
              <Link href="/terminos-y-condiciones" className="">
                Términos y condiciones
              </Link>
            </li>
            <li>
              <Link href="/politica-de-privacidad" className="">
                Política de privacidad
              </Link>
            </li>
          </ul>
        </div>

        {/* Contacto */}
        <div className="flex flex-col items-start gap-[10px]">
          <h3 className="text-gray-500 font-bold">Contacto</h3>
          <div className="flex gap-1">
            <TelefonoIcon width={25} height={24} />
            <div>
              <p className="flex flex-col gap-1">
                <span className="text-lime-600 text-[16px]">
                  <strong>Teléfono:</strong>
                </span>
                <span className="text-slate-400">+56 9 9999 9999</span>
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <EmailIcon width={25} height={24} />
            <div>
              <p className="flex flex-col gap-1">
                <span className="text-lime-600 text-[16px]">
                  <strong>Email:</strong>
                </span>
                <span className="text-slate-400">contacto@socomarca.cl</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="bg-slate-200 py-4 px-6 flex flex-col md:flex-row items-center justify-between text-xs">
        <p>
          © 2025 – Todos los derechos reservados.{' '}
          <span className="text-black font-semibold">socomarca.cl</span>
        </p>
        <div className="flex items-center gap-2 mt-2 md:mt-0 opacity-50">
          <Image
            width={37.8}
            height={23}
            src={masterCardImageUrl}
            alt="MasterCard"
            style={{ width: 'auto', height: 'auto' }}
          />
          <Image
            width={65.64}
            height={16}
            src={paypalImageUrl}
            alt="PayPal"
            style={{ width: 'auto', height: 'auto' }}
          />
          <Image
            width={38.47}
            height={12}
            src={visaImageUrl}
            alt="Visa"
            style={{ width: 'auto', height: 'auto' }}
          />
          <Image
            width={39.59}
            height={12}
            src={americanExpressImageUrl}
            alt="American Express"
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>
      </div>
    </footer>
  );
}
