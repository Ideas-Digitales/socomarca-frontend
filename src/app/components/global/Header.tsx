"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Product } from "@/interfaces/product.interface";
import Link from "next/link";
import useStore, { useInitMobileDetection } from "@/stores/base";
import {
  Bars3Icon,
  HeartIcon,
  ListBulletIcon,
  PhoneIcon,
  ShoppingCartIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const imagoLogoUrl = "/assets/global/imagotipo.png";
const logoUrl = "/assets/global/logo-header.png";

interface Props {
  carro: Product[];
}

export default function Header({ carro }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [menuMobileOpen, setMenuMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  useInitMobileDetection();

  const { isTablet } = useStore();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setAbierto(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        (event.target as HTMLElement).id !== "menu-toggle-btn"
      ) {
        setMenuMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [abierto]);

  useEffect(() => {
    if (!isTablet && menuMobileOpen) {
      setMenuMobileOpen(false);
    }
  }, [isTablet, menuMobileOpen]);

  const toggleMobileMenu = () => {
    setMenuMobileOpen(!menuMobileOpen);
  };

  const router = useRouter();

  const menuItems = [
    { name: "Inicio", href: "/" },
    { name: "Datos personales", href: "/mi-cuenta?section=datos" },
    { name: "Historial de compra", href: "/mis-compras" },
    { name: "Favoritos", href: "/mi-cuenta?section=favoritos" },
    { name: "Direcciones", href: "/mi-cuenta?section=direcciones" },
    { name: "Mis Compras", href: "/mi-cuenta?section=compras" },
    { name: "Carrito", href: "/carro-de-compra" },
    { name: "Cerrar sesión", href: "/carro-de-compra" },
  ];

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full bg-white text-black py-4 border-t-10 border-[#6CB409] border-b-0 border-l-0 border-r-0 text-xs z-30 transition-shadow duration-300 ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        <div className="max-w-7xl px-4 flex justify-between items-center mx-auto">
          <div className="flex gap-3 items-center">
            {isTablet ? (
              <button
                id="menu-toggle-btn"
                onClick={toggleMobileMenu}
                className="cursor-pointer"
                aria-label="Toggle menu"
              >
                <Bars3Icon width={24} height={24} />
              </button>
            ) : (
              <div className="hidden sm:flex flex-row gap-2 sm:gap-4">
                <div>
                  <PhoneIcon width={24} height={24} />
                </div>
                <div>
                  <p className="font-bold">Teléfono </p>
                  <p>
                    <a href="tel:+56200000000" className="">
                      +56 2 0000 0000
                    </a>
                  </p>
                </div>
              </div>
            )}
            {isTablet && (
              <Image
                src={imagoLogoUrl}
                width={28}
                height={34}
                alt="Imagologo"
                onClick={() => router.push("/")}
                className="cursor-pointer"
                unoptimized
              />
            )}
          </div>
          {!isTablet && (
            <Link href="/">
              <img
                src={logoUrl}
                width={368}
                height={66}
                style={{ width: "368px", height: "66px" }}
                className="hidden sm:block py-[4px] cursor-pointer"
              />
            </Link>
          )}
          <div className="flex items-end gap-4">
            <div className="flex flex-row gap-2 sm:gap-4">
              <Link
                href="/mi-cuenta?section=compras"
                className="flex items-center gap-2"
              >
                <ListBulletIcon width={24} height={24} />
                <span className="font-bold hidden sm:block">
                  Historial de compra
                </span>
              </Link>
              <Link href="/mi-cuenta?section=favoritos">
                <HeartIcon width={24} height={24} />
              </Link>
              <Link href="/mi-cuenta">
                <UserIcon width={24} height={24} />
              </Link>
              <Link href="/carro-de-compra">
                <div className="relative">
                  <ShoppingCartIcon width={24} height={24} />
                  {carro?.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {carro.length}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="h-16 sm:h-20"></div>

      {menuMobileOpen && (
        <div
          className="fixed inset-0 z-40 transition-opacity duration-300"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
          aria-hidden="true"
        />
      )}

      {/* Menú móvil lateral */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-lg ${
          menuMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <Image
            src={imagoLogoUrl}
            width={28}
            height={34}
            alt="Imagologo"
            onClick={() => router.push("/")}
            className="cursor-pointer"
            unoptimized
          />
          <button
            onClick={toggleMobileMenu}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close menu"
          >
            <XMarkIcon width={24} height={24} />
          </button>
        </div>
        <nav className="mt-4">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.href}
                  className="block px-4 py-3 text-gray-800 hover:bg-gray-100 border-b border-gray-100"
                  onClick={() => setMenuMobileOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
