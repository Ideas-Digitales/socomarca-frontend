'use client';

import Link from 'next/link';
import { useState } from 'react';

const links = [
  { name: 'Inicio', href: '/' },
  { name: 'Carro de compra', href: '/carro-de-compra' },
  { name: 'Finalizar compra', href: '/finalizar-compra' },
  { name: 'Compra exitosa', href: '/compra-exitosa' },
  { name: 'Compra fallida', href: '/compra-fallida' },
  { name: 'Mi cuenta', href: '/mi-cuenta' },
  //{ name: 'Términos y Condiciones', href: '/terminos-y-condiciones' },
  //{ name: 'Política de Privacidad', href: '/politica-de-privacidad' },
 // { name: 'Preguntas Frecuentes', href: '/preguntas-frecuentes' },
  { name: 'Inicio de sesión', href: '/login' },
  { name: 'Recuperar contraseña', href: '/recuperar' },
  { name: 'Check email', href: '/check-email' },
  { name: 'Administración', href: '/admin/total-de-ventas' },
];

export default function NavbarTest() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="py-4 fixed bottom-1 right-1 z-50">
      {isMenuOpen && (
        <div className="absolute right-0 bottom-16 w-64 bg-white shadow-lg rounded-lg py-2 z-50 max-h-96 overflow-y-auto">
          <ul>
            {links.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="container mx-auto px-4 flex justify-end">
        <button
          onClick={toggleMenu}
          className="flex items-center bg-lime-600 text-white px-4 py-2 rounded hover:bg-lime-700 transition-colors"
          aria-expanded={isMenuOpen}
          aria-label="Navegación principal"
        >
          <span className="mr-2">Navegación</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform ${
              isMenuOpen ? 'rotate-0' : 'rotate-180'
            }`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
