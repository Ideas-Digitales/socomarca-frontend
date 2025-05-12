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
const logoImageUrl = '/assets/global/logo.png';

interface Props {
  carro: Product[];
}

export default function Header({ carro }: Props) {
  const [abierto, setAbierto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setAbierto(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white text-black py-4 border-t-10 border-[#6CB409] border-b-0 border-l-0 border-r-0 text-xs">
      <div className="max-w-7xl flex justify-between items-center mx-auto">
        <div className="flex flex-row gap-4">
          <div>
            <PhoneIcon width={24} height={24} />
          </div>
          <div>
            <p className="font-bold">Teléfono </p>
            <p>+56 2 0000 0000</p>
          </div>
        </div>
        <div>
          <Image
            src={logoImageUrl}
            alt="Logo de Socomarca"
            width={216}
            height={39}
            className="h-10 w-auto"
          />
        </div>
        <div className="flex flex-row gap-6 items-center">
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

          <span>
            <HearthIcon width={24} height={24} />
          </span>
          <div className="relative" ref={menuRef}>
            <span
              onClick={() => router.push('/datos-personales')}
              className="cursor-pointer"
            >
              <UserIcon width={24} height={24} />
            </span>

            {abierto && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg border-gray-200 border-2 border-t-[#6cb409] z-50">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 cursor-pointer"
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
      </div>
    </div>
  );
}
