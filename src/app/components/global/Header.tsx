'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Product } from '@/interfaces/product.interface';
import PhoneIcon from '../icons/PhoneIcon';
import HearthIcon from '../icons/HearthIcon';
import OrderIcon from '../icons/OrderIcon';
import UserIcon from '../icons/UserIcon';
import CartIcon from '../icons/CartIcon';
import { Menu } from 'lucide-react';
import Link from 'next/link';
const logoImageUrl = '/assets/global/logo.png';

interface Props {
  carro: Product[];
}

export default function Header({ carro }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setAbierto(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMenuMobileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setMenuMobileOpen(!menuMobileOpen);
  };

  return (
    <div className="bg-white text-black py-4 border-t-10 border-[#6CB409] border-b-0 border-l-0 border-r-0 text-xs">
      <div className="max-w-7xl flex justify-between items-center mx-auto px-4">
        {/* Teléfono (solo visible en desktop) */}
        <div className="hidden sm:flex flex-row gap-2 sm:gap-4">
          <div>
            <PhoneIcon width={24} height={24} />
          </div>
          <div>
            <p className="font-bold">Teléfono </p>
            <p>+56 2 0000 0000</p>
          </div>
        </div>

        {/* Botón de menú móvil usando Lucide React */}
        <div className="block sm:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-1 focus:outline-none"
            aria-label="Menú"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Logo (centrado en móvil) */}
        <div className="flex justify-center">
          <Image
            src={logoImageUrl}
            alt="Logo de Socomarca"
            width={180}
            height={32}
            className="h-8 sm:h-10 w-auto"
          />
        </div>

        {/* Íconos para desktop */}
        <div className="hidden sm:flex flex-row gap-3 sm:gap-6 items-center">
          <Link href="/mis-compras">
            <div className="flex flex-row gap-2 items-center">
              <div>
                <OrderIcon width={24} height={24} />
              </div>
              <div>
                <p className="font-bold">
                  Historial <br />
                  de compra
                </p>
              </div>
            </div>
          </Link>

          <span>
            <HearthIcon width={24} height={24} />
          </span>
          <div className="relative" ref={menuRef}>
            <span
              onClick={() => setAbierto(!abierto)}
              className="cursor-pointer"
            >
              <UserIcon width={24} height={24} />
            </span>

            {abierto && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg border-gray-200 border-2 border-t-[#6cb409] z-50">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setAbierto(false);
                    router.push('/datos-personales');
                  }}
                >
                  Mi cuenta
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setAbierto(false);
                    router.push('/login');
                  }}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
          <div className="relative">
            <CartIcon width={24} height={24} />
            {carro?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#6cb409] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {carro.length}
              </span>
            )}
          </div>
        </div>

        {/* Solo ícono de carrito visible en móvil */}
        <div className="block sm:hidden relative">
          <CartIcon width={24} height={24} />
          {carro?.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#6cb409] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {carro.length}
            </span>
          )}
        </div>
      </div>

      {/* Menú móvil */}
      {menuMobileOpen && (
        <div
          ref={mobileMenuRef}
          className="fixed top-[4.5rem] left-0 right-0 bg-white shadow-lg z-50 border-t border-[#6CB409]"
        >
          <div className="flex flex-col divide-y divide-gray-100">
            <div className="flex items-center gap-3 p-4">
              <PhoneIcon width={20} height={20} />
              <div>
                <p className="font-bold">Teléfono </p>
                <p>+56 2 0000 0000</p>
              </div>
            </div>

            <div
              className="flex items-center gap-3 p-4"
              onClick={() => {
                setMenuMobileOpen(false);
              }}
            >
              <OrderIcon width={20} height={20} />
              <p className="font-bold">Historial de compra</p>
            </div>

            <div
              className="flex items-center gap-3 p-4"
              onClick={() => {
                setMenuMobileOpen(false);
              }}
            >
              <HearthIcon width={20} height={20} />
              <p>Favoritos</p>
            </div>

            <div
              className="flex items-center gap-3 p-4"
              onClick={() => {
                setMenuMobileOpen(false);
                router.push('/datos-personales');
              }}
            >
              <UserIcon width={20} height={20} />
              <p>Mi cuenta</p>
            </div>

            <button
              className="flex items-center gap-3 p-4 w-full text-left"
              onClick={() => {
                setMenuMobileOpen(false);
                router.push('/login');
              }}
            >
              <UserIcon width={20} height={20} />
              <p>Cerrar sesión</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
