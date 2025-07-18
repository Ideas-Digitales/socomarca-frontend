'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import FacebookIcon from '../icons/FacebookIcon';
import TwitterIcon from '../icons/TwitterIcon';
import InstagramIcon from '../icons/InstagramIcon';
import YoutubeIcon from '../icons/YoutubeIcon';
import PinterestIcon from '../icons/PinterestIcon';
import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import Logo from './Logo';
import useStore from '@/stores/base';
import useAuthStore from '@/stores/useAuthStore';

const masterCardImageUrl = '/assets/footer/mastercard.png';
const americanExpressImageUrl = '/assets/footer/american-express.png';
const paypalImageUrl = '/assets/footer/paypal.png';
const visaImageUrl = '/assets/footer/visa.png';

// Icon RRSS

export default function Footer() {
  const {
    siteInformation,
    fetchSiteInformation
  } = useStore();

  const { user } = useAuthStore();

  // Cargar información del sitio al montar el componente
  useEffect(() => {
    fetchSiteInformation();
  }, [fetchSiteInformation]);

  // Función para verificar si el usuario es admin o superadmin
  const isAdminUser = () => {
    const userRoles = user?.roles || [];
    return userRoles.includes('admin') || userRoles.includes('superadmin');
  };

  // Función para renderizar el icono de red social según el label
  const renderSocialIcon = (label: string) => {
    if (!label || typeof label !== 'string') {
      return <FacebookIcon width={16} height={16} />; // Icono por defecto
    }
    
    const normalizedLabel = label.toLowerCase();
    
    switch (normalizedLabel) {
      case 'facebook':
        return <FacebookIcon width={16} height={16} />;
      case 'twitter':
        return <TwitterIcon width={16} height={13} />;
      case 'instagram':
        return <InstagramIcon width={13} height={13} />;
      case 'youtube':
        return <YoutubeIcon width={16} height={12} />;
      case 'pinterest':
        return <PinterestIcon width={16} height={16} />;
      default:
        return <FacebookIcon width={16} height={16} />; // Icono por defecto
    }
  };
  return (
    <footer className="bg-white text-sm text-gray-600">
      {/* Línea verde superior */}
      <div className="h-1 bg-lime-500" />

      <div className="w-full max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12 justify-between">
        {/* Logo y descripción */}
        <div className="gap-[10px] text-start">
          <h1 className="text-lime-600 text-xl font-bold w-full flex justify-center md:justify-start">
            <Logo />
          </h1>
          <p className="text-gray-500">
            En Socomarca ofrecemos precios mayoristas, productos seleccionados y
            despacho confiable. Para que tu energía esté donde importa: en tus
            clientes.
          </p>
        </div>
        {/* Atención al cliente */}
        <div className="space-y-1">
          <h3 className="text-gray-500 font-bold">Atención al cliente</h3>
          <ul className="space-y-1">
            <li>
              {isAdminUser() ? (
                <span className="text-gray-400 cursor-not-allowed">
                  Preguntas frecuentes
                </span>
              ) : (
                <Link href="/preguntas-frecuentes" className="">
                  Preguntas frecuentes
                </Link>
              )}
            </li>
            <li>
              {isAdminUser() ? (
                <span className="text-gray-400 cursor-not-allowed">
                  Términos y condiciones
                </span>
              ) : (
                <Link href="/terminos-y-condiciones" className="">
                  Términos y condiciones
                </Link>
              )}
            </li>
            <li>
              {isAdminUser() ? (
                <span className="text-gray-400 cursor-not-allowed">
                  Política de privacidad
                </span>
              ) : (
                <Link href="/politica-de-privacidad" className="">
                  Política de privacidad
                </Link>
              )}
            </li>
          </ul>
        </div>
        {/* Contacto y Redes sociales */}
        <div className="flex flex-col items-start gap-[10px]">
          <h3 className="text-gray-500 font-bold">Contacto</h3>
          {siteInformation?.footer?.contact_phone && siteInformation.footer.contact_phone.trim() !== '' && (
            <div className="flex gap-1">
              <span className="text-lime-600">
                <PhoneIcon width={25} height={24} />
              </span>
              <div>
                <p className="flex flex-col gap-1">
                  <span className="text-lime-600 text-[16px]">
                    <strong>Teléfono:</strong>
                  </span>
                  <span className="text-slate-400">{siteInformation.footer.contact_phone}</span>
                </p>
              </div>
            </div>
          )}
          {siteInformation?.footer?.contact_email && siteInformation.footer.contact_email.trim() !== '' && (
            <div className="flex gap-1">
              <span className="text-lime-600">
                <EnvelopeIcon width={25} height={24} />
              </span>
              <div>
                <p className="flex flex-col gap-1">
                  <span className="text-lime-600 text-[16px]">
                    <strong>Email:</strong>
                  </span>
                  <span className="text-slate-400">{siteInformation.footer.contact_email}</span>
                </p>
              </div>
            </div>
          )}
          
          {/* Redes sociales */}
          {siteInformation?.social_media && Array.isArray(siteInformation.social_media) && siteInformation.social_media.length > 0 && (
            <div className="flex items-center justify-start gap-1 mt-4">
                          {siteInformation.social_media
              .filter((social: any) => social && social.label && social.link && typeof social.label === 'string')
              .map((social: any, index: number) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-[38px] h-[38px] flex justify-center items-center hover:bg-slate-100 rounded transition-colors"
                  title={social.label && typeof social.label === 'string' ? social.label.charAt(0).toUpperCase() + social.label.slice(1) : 'Red social'}
                >
                  {renderSocialIcon(social.label)}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Línea inferior */}
      <div className="bg-slate-100 py-4 px-6 flex flex-col md:flex-row items-center justify-between text-xs pb-22 md:pb-4 text-center md:text-left">
        <p>
          © 2025 – Todos los derechos reservados.{' '}
          <span className="text-black font-semibold">socomarca.cl</span>
        </p>
        <div className="flex-col md:flex-row items-center gap-2 mt-2 md:mt-0 opacity-50 hidden md:flex">
          <img
            src={masterCardImageUrl}
            alt="MasterCard"
            style={{ width: '37.8px', height: '23px' }}
          />
          <img
            src={paypalImageUrl}
            alt="PayPal"
            style={{ width: '65.64px', height: '16px' }}
          />
          <img
            src={visaImageUrl}
            alt="Visa"
            style={{ width: '38.47px', height: '12px' }}
          />
          <img
            src={americanExpressImageUrl}
            alt="American Express"
            style={{ width: '39.59px', height: '12px' }}
          />
        </div>
      </div>
    </footer>
  );
}
