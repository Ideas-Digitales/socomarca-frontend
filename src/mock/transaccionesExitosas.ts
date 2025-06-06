export interface TransaccionExitosa {
  id: number;
  cliente: string;
  monto: number;
  fecha: string;
  acciones: string;
  categoria: string; // ← NUEVO
}

export interface CategoriaVenta {
  categoria: string;
  subtotal: number;
  margen: number;
  venta: number;
}

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

// Datos base para generar nombres de clientes aleatorios
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

const acciones = ['Ver detalles'];

// Función para generar un número aleatorio entre min y max
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para seleccionar elemento aleatorio de un array
function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Función para generar nombre de cliente aleatorio
function generarNombreCliente(): string {
  const tipo = randomChoice(tiposNegocio);
  const nombre = randomChoice(nombresBase);
  const complemento =
    Math.random() > 0.6 ? ` ${randomChoice(complementos)}` : '';

  return `${tipo} ${nombre}${complemento}`;
}

// Función para generar fecha aleatoria en un rango
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

// Función para generar monto aleatorio
function generarMontoAleatorio(): number {
  // Generar montos entre 50,000 y 2,000,000 con tendencia hacia valores medios
  const base = Math.random();
  let monto: number;

  if (base < 0.7) {
    // 70% de probabilidad: montos entre 100k y 800k
    monto = randomBetween(100000, 800000);
  } else if (base < 0.9) {
    // 20% de probabilidad: montos entre 50k y 100k
    monto = randomBetween(50000, 100000);
  } else {
    // 10% de probabilidad: montos altos entre 800k y 2M
    monto = randomBetween(800000, 2000000);
  }

  // Redondear a miles
  return Math.round(monto / 1000) * 1000;
}

// Función principal para generar transacciones aleatorias
export function generarTransaccionesAleatorias(
  cantidad: number = 100,
  idInicial: number = 18900000
): TransaccionExitosa[] {
  const transacciones: TransaccionExitosa[] = [];

  for (let i = 0; i < cantidad; i++) {
    const transaccion: TransaccionExitosa = {
      id: idInicial + i,
      cliente: generarNombreCliente(),
      monto: generarMontoAleatorio(),
      fecha: generarFechaAleatoria(),
      acciones: randomChoice(acciones),
      categoria: randomChoice(categoriasProducto),
    };

    transacciones.push(transaccion);
  }

  // Ordenar por fecha (más recientes primero)
  return transacciones.sort((a, b) => {
    const fechaA = new Date(a.fecha.split('/').reverse().join('-'));
    const fechaB = new Date(b.fecha.split('/').reverse().join('-'));
    return fechaB.getTime() - fechaA.getTime();
  });
}

// Función para generar datos con configuración personalizada
export function generarTransaccionesPersonalizadas(config: {
  cantidad?: number;
  idInicial?: number;
  montoMin?: number;
  montoMax?: number;
  diasAtras?: number;
}): TransaccionExitosa[] {
  const {
    cantidad = 100,
    idInicial = 18900000,
    montoMin = 50000,
    montoMax = 2000000,
    diasAtras = 30,
  } = config;

  const transacciones: TransaccionExitosa[] = [];

  for (let i = 0; i < cantidad; i++) {
    const transaccion: TransaccionExitosa = {
      id: idInicial + i,
      cliente: generarNombreCliente(),
      monto: Math.round(randomBetween(montoMin, montoMax) / 1000) * 1000,
      fecha: generarFechaAleatoria(diasAtras),
      acciones: randomChoice(acciones),
      categoria: randomChoice(categoriasProducto),
    };

    transacciones.push(transaccion);
  }

  return transacciones.sort((a, b) => {
    const fechaA = new Date(a.fecha.split('/').reverse().join('-'));
    const fechaB = new Date(b.fecha.split('/').reverse().join('-'));
    return fechaB.getTime() - fechaA.getTime();
  });
}

export function agruparVentasPorCategoria(
  transacciones: TransaccionExitosa[]
): CategoriaVenta[] {
  const resumen: Record<string, CategoriaVenta> = {};

  transacciones.forEach((t) => {
    const cat = t.categoria;

    if (!resumen[cat]) {
      resumen[cat] = {
        categoria: cat,
        subtotal: 0,
        margen: 0,
        venta: 0,
      };
    }

    resumen[cat].subtotal += t.monto;
    resumen[cat].margen += t.monto * 0.3; // margen simulado 30%
    resumen[cat].venta += t.monto * 1.3;
  });

  return Object.values(resumen).sort((a, b) => b.venta - a.venta);
}
