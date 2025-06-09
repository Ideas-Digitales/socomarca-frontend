import {
  Product,
  CartItem,
  CartResponse,
} from '@/interfaces/product.interface';
import { generateProducts } from './products';
import { TransaccionExitosa } from './transaccionesExitosas';
import {
  randomChoice,
  randomBetween,
  getRandomNumber,
} from '@/stores/base/utils/generators';

// Funciones auxiliares que necesitas importar o definir aquí

// Constantes que necesitas importar de tu archivo original o definir aquí
const tiposNegocio = [
  'Restaurant',
  'Cafetería',
  'Minimarket',
  'Supermercado',
  'Panadería',
  'Pizzería',
  'Hamburguesería',
  'Sushi Bar',
  'Taquería',
  'Barbacoa',
  'Heladería',
  'Pastelería',
  'Comida Rápida',
  'Bistro',
  'Deli',
];

const nombresBase = [
  'El Rincón',
  'La Esquina',
  'Don José',
  'Doña María',
  'Los Hermanos',
  'El Buen Sabor',
  'La Tradición',
  'El Fogón',
  'Casa',
  'Villa',
  'El Paraíso',
  'La Perla',
  'Golden',
  'Royal',
  'Premium',
  'Super',
  'Mega',
  'Ultra',
  'Master',
  'Elite',
];

const complementos = [
  'del Rey',
  'de Oro',
  'Dorado',
  'Imperial',
  'Real',
  'Express',
  'Plus',
  'SPA',
  'Ltda',
  '& Cía',
  'Gourmet',
  'Deluxe',
  'VIP',
  'Premium',
  'Classic',
  'Modern',
  'Fresh',
  'Natural',
];

const categoriasProducto = [
  'Bebidas',
  'Snacks',
  'Lácteos',
  'Carnes',
  'Panadería',
  'Congelados',
  'Frutas y Verduras',
  'Aseo',
  'Mascotas',
  'Licores',
];

const acciones = ['Ver detalles'];

// Funciones auxiliares originales
function generarNombreCliente(): string {
  const tipo = randomChoice(tiposNegocio);
  const nombre = randomChoice(nombresBase);
  const complemento =
    Math.random() > 0.6 ? ` ${randomChoice(complementos)}` : '';

  return `${tipo} ${nombre}${complemento}`;
}

function generarFechaAleatoria(diasAtras: number = 30): string {
  const hoy = new Date();
  const fechaAleatoria = new Date(
    hoy.getTime() - Math.random() * diasAtras * 24 * 60 * 60 * 1000
  );

  const dia = fechaAleatoria.getDate().toString().padStart(2, '0');
  const mes = (fechaAleatoria.getMonth() + 1).toString().padStart(2, '0');
  const año = fechaAleatoria.getFullYear();

  return `${dia}/${mes}/${año}`;
}

function generarMontoAleatorio(): number {
  const base = Math.random();
  let monto: number;

  if (base < 0.7) {
    monto = randomBetween(100000, 800000);
  } else if (base < 0.9) {
    monto = randomBetween(50000, 100000);
  } else {
    monto = randomBetween(800000, 2000000);
  }

  return Math.round(monto / 1000) * 1000;
}

// Tus funciones del carrito
export const generatePurchasedCartItem = (product: Product): CartItem => {
  const quantity = getRandomNumber(1, 8);
  const subtotal = product.price * quantity;

  return {
    ...product,
    quantity,
    subtotal,
  };
};

export const generatePurchasedCart = (
  productPool?: Product[],
  itemCount?: number
): CartItem[] => {
  const availableProducts = productPool || generateProducts(100);
  const count = itemCount || getRandomNumber(2, 8);

  const selectedProducts = availableProducts
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .filter((product) => product.status && product.stock > 0);

  return selectedProducts.map(generatePurchasedCartItem);
};

export const generateCompletedCart = (
  productPool?: Product[],
  itemCount?: number
): CartResponse => {
  const items = generatePurchasedCart(productPool, itemCount);
  const total = items.reduce((sum, item) => sum + item.subtotal, 0);

  return {
    items,
    total,
  };
};

export const generatePurchaseHistory = (
  transactionCount: number = 10,
  productPool?: Product[]
): CartResponse[] => {
  const products = productPool || generateProducts(150);

  return Array.from({ length: transactionCount }, () =>
    generateCompletedCart(products)
  );
};

export const generateTransactionProducts = (
  productPool?: Product[]
): CartItem[] => {
  return generatePurchasedCart(productPool, getRandomNumber(2, 6));
};

export function generarTransaccionesAleatorias(
  cantidad: number = 100,
  idInicial: number = 18900000,
  productPool?: Product[]
): TransaccionExitosa[] {
  const transacciones: TransaccionExitosa[] = [];
  const products = productPool || generateProducts(200);

  for (let i = 0; i < cantidad; i++) {
    const transaccion: TransaccionExitosa = {
      id: idInicial + i,
      cliente: generarNombreCliente(),
      monto: generarMontoAleatorio(),
      fecha: generarFechaAleatoria(),
      acciones: randomChoice(acciones),
      categoria: randomChoice(categoriasProducto),
      productos: generateTransactionProducts(products),
    };

    transacciones.push(transaccion);
  }

  return transacciones.sort((a, b) => {
    const fechaA = new Date(a.fecha.split('/').reverse().join('-'));
    const fechaB = new Date(b.fecha.split('/').reverse().join('-'));
    return fechaB.getTime() - fechaA.getTime();
  });
}

export function generarTransaccionesPersonalizadas(config: {
  cantidad?: number;
  idInicial?: number;
  montoMin?: number;
  montoMax?: number;
  diasAtras?: number;
  productPool?: Product[];
}): TransaccionExitosa[] {
  const {
    cantidad = 100,
    idInicial = 18900000,
    montoMin = 50000,
    montoMax = 2000000,
    diasAtras = 30,
    productPool,
  } = config;

  const transacciones: TransaccionExitosa[] = [];
  const products = productPool || generateProducts(200);

  for (let i = 0; i < cantidad; i++) {
    const transaccion: TransaccionExitosa = {
      id: idInicial + i,
      cliente: generarNombreCliente(),
      monto: Math.round(randomBetween(montoMin, montoMax) / 1000) * 1000,
      fecha: generarFechaAleatoria(diasAtras),
      acciones: randomChoice(acciones),
      categoria: randomChoice(categoriasProducto),
      productos: generateTransactionProducts(products),
    };

    transacciones.push(transaccion);
  }

  return transacciones.sort((a, b) => {
    const fechaA = new Date(a.fecha.split('/').reverse().join('-'));
    const fechaB = new Date(b.fecha.split('/').reverse().join('-'));
    return fechaB.getTime() - fechaA.getTime();
  });
}
