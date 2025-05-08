import Link from 'next/link';

const links = [
  {
    name: 'Inicio',
    href: '/',
  },
  {
    name: 'Carro de compra',
    href: '/carro-de-compra',
  },
  {
    name: 'Finalizar compra',
    href: '/finalizar-compra',
  },
  {
    name: 'Gracias',
    href: '/gracias',
  },
  {
    name: 'Datos Personales',
    href: '/datos-personales',
  },
  {
    name: 'Direcciones',
    href: '/direcciones',
  },
  {
    name: 'Favoritos',
    href: '/favoritos',
  },
  { name: 'Mis Compras', href: '/mis-compras' },
  { name: 'Revisar Pedido', href: '/revisar-pedido' },
  { name: 'Repetir Compra', href: '/repetir-compra' },
  { name: 'Medios de Pago', href: '/medios-de-pago' },
  { name: 'Términos y Condiciones', href: '/terminos-y-condiciones' },
  { name: 'Política de Privacidad', href: '/politica-de-privacidad' },
  { name: 'Preguntas Frecuentes', href: '/preguntas-frecuentes' },
];

export default function Navbar() {
  return (
    <nav className=" py-4 text-center">
      <ul>
        {links.map((link) => (
          <li key={link.name} className="inline-block mx-4">
            <Link
              href={link.href}
              className="text-blue-500 hover:text-blue-700"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
