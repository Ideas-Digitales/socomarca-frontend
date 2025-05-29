export interface Comuna {
  comuna: string;
  region: string;
}

export interface ComunaVenta {
  id: string;
  comuna: string;
  region: string;
  venta: number;
}

// Datos de comunas y regiones de Chile
export const comunasRegiones = [
  // Región Metropolitana
  { comuna: 'Santiago', region: 'Región Metropolitana' },
  { comuna: 'Las Condes', region: 'Región Metropolitana' },
  { comuna: 'Providencia', region: 'Región Metropolitana' },
  { comuna: 'Ñuñoa', region: 'Región Metropolitana' },
  { comuna: 'La Reina', region: 'Región Metropolitana' },
  { comuna: 'Vitacura', region: 'Región Metropolitana' },
  { comuna: 'Lo Barnechea', region: 'Región Metropolitana' },
  { comuna: 'Maipú', region: 'Región Metropolitana' },
  { comuna: 'Puente Alto', region: 'Región Metropolitana' },
  { comuna: 'La Florida', region: 'Región Metropolitana' },
  { comuna: 'Peñalolén', region: 'Región Metropolitana' },
  { comuna: 'Lampa', region: 'Región Metropolitana' },
  { comuna: 'Colina', region: 'Región Metropolitana' },
  { comuna: 'Pudahuel', region: 'Región Metropolitana' },
  { comuna: 'Quilicura', region: 'Región Metropolitana' },

  // V Región de Valparaíso
  { comuna: 'Valparaíso', region: 'V Región' },
  { comuna: 'Viña del Mar', region: 'V Región' },
  { comuna: 'Quilpué', region: 'V Región' },
  { comuna: 'Villa Alemana', region: 'V Región' },
  { comuna: 'Concón', region: 'V Región' },
  { comuna: 'Casablanca', region: 'V Región' },
  { comuna: 'San Antonio', region: 'V Región' },
  { comuna: 'Quillota', region: 'V Región' },
  { comuna: 'La Ligua', region: 'V Región' },
  { comuna: 'Los Andes', region: 'V Región' },
  { comuna: 'San Felipe', region: 'V Región' },
  { comuna: 'Curauma', region: 'V Región' },

  // VIII Región del Biobío
  { comuna: 'Concepción', region: 'VIII Región' },
  { comuna: 'Talcahuano', region: 'VIII Región' },
  { comuna: 'Chillán', region: 'VIII Región' },
  { comuna: 'Los Ángeles', region: 'VIII Región' },
  { comuna: 'Coronel', region: 'VIII Región' },
  { comuna: 'San Pedro de la Paz', region: 'VIII Región' },
  { comuna: 'Hualpén', region: 'VIII Región' },

  // IV Región de Coquimbo
  { comuna: 'La Serena', region: 'IV Región' },
  { comuna: 'Coquimbo', region: 'IV Región' },
  { comuna: 'Ovalle', region: 'IV Región' },
  { comuna: 'Illapel', region: 'IV Región' },

  // VII Región del Maule
  { comuna: 'Talca', region: 'VII Región' },
  { comuna: 'Curicó', region: 'VII Región' },
  { comuna: 'Linares', region: 'VII Región' },
  { comuna: 'Molina', region: 'VII Región' },

  // VI Región del Libertador General Bernardo O'Higgins
  { comuna: 'Rancagua', region: 'VI Región' },
  { comuna: 'San Fernando', region: 'VI Región' },
  { comuna: 'Pichilemu', region: 'VI Región' },

  // IX Región de La Araucanía
  { comuna: 'Temuco', region: 'IX Región' },
  { comuna: 'Villarrica', region: 'IX Región' },
  { comuna: 'Pucón', region: 'IX Región' },

  // X Región de Los Lagos
  { comuna: 'Puerto Montt', region: 'X Región' },
  { comuna: 'Osorno', region: 'X Región' },
  { comuna: 'Castro', region: 'X Región' },

  // II Región de Antofagasta
  { comuna: 'Antofagasta', region: 'II Región' },
  { comuna: 'Calama', region: 'II Región' },
  { comuna: 'Tocopilla', region: 'II Región' },

  // III Región de Atacama
  { comuna: 'Copiapó', region: 'III Región' },
  { comuna: 'Vallenar', region: 'III Región' },

  // I Región de Tarapacá
  { comuna: 'Iquique', region: 'I Región' },
  { comuna: 'Alto Hospicio', region: 'I Región' },

  // XI Región Aysén
  { comuna: 'Coyhaique', region: 'XI Región' },

  // XII Región de Magallanes
  { comuna: 'Punta Arenas', region: 'XII Región' },

  // XV Región de Arica y Parinacota
  { comuna: 'Arica', region: 'XV Región' },
];

// Función para generar un número aleatorio entre min y max
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para seleccionar elemento aleatorio de un array
function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Función para generar ID único
function generarId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Función para generar monto de venta aleatorio
function generarVentaAleatoria(): number {
  const base = Math.random();
  let venta: number;

  if (base < 0.6) {
    // 60% de probabilidad: ventas entre 100k y 600k
    venta = randomBetween(100000, 600000);
  } else if (base < 0.8) {
    // 20% de probabilidad: ventas entre 600k y 1M
    venta = randomBetween(600000, 1000000);
  } else if (base < 0.95) {
    // 15% de probabilidad: ventas altas entre 1M y 2M
    venta = randomBetween(1000000, 2000000);
  } else {
    // 5% de probabilidad: ventas muy altas entre 2M y 5M
    venta = randomBetween(2000000, 5000000);
  }

  // Redondear a miles
  return Math.round(venta / 1000) * 1000;
}

// Función principal para generar datos de comunas y ventas
export function generarComunasVentas(cantidad: number = 20): ComunaVenta[] {
  const comunasVentas: ComunaVenta[] = [];
  const comunasUsadas = new Set<string>();

  // Asegurar que no se repitan comunas
  while (
    comunasVentas.length < cantidad &&
    comunasUsadas.size < comunasRegiones.length
  ) {
    const comunaData = randomChoice(comunasRegiones);

    if (!comunasUsadas.has(comunaData.comuna)) {
      const comunaVenta: ComunaVenta = {
        id: generarId(),
        comuna: comunaData.comuna,
        region: comunaData.region,
        venta: generarVentaAleatoria(),
      };

      comunasVentas.push(comunaVenta);
      comunasUsadas.add(comunaData.comuna);
    }
  }

  // Ordenar por venta descendente
  return comunasVentas.sort((a, b) => b.venta - a.venta);
}

// Función para generar datos con configuración personalizada
export function generarComunasVentasPersonalizadas(config: {
  cantidad?: number;
  ventaMin?: number;
  ventaMax?: number;
  regionesFiltro?: string[];
  incluirTodasLasComunas?: boolean;
}): ComunaVenta[] {
  const {
    cantidad = 20,
    ventaMin = 100000,
    ventaMax = 2000000,
    regionesFiltro = [],
    incluirTodasLasComunas = false,
  } = config;

  let comunasDisponibles = comunasRegiones;

  // Filtrar por regiones si se especifica
  if (regionesFiltro.length > 0) {
    comunasDisponibles = comunasRegiones.filter((item) =>
      regionesFiltro.includes(item.region)
    );
  }

  const comunasVentas: ComunaVenta[] = [];
  const comunasUsadas = new Set<string>();

  // Si incluirTodasLasComunas es true, generar para todas las comunas disponibles
  const cantidadFinal = incluirTodasLasComunas
    ? comunasDisponibles.length
    : Math.min(cantidad, comunasDisponibles.length);

  while (comunasVentas.length < cantidadFinal) {
    let comunaData: (typeof comunasDisponibles)[0];

    if (incluirTodasLasComunas) {
      // Tomar comunas en orden
      comunaData = comunasDisponibles[comunasVentas.length];
    } else {
      // Seleccionar aleatoriamente
      comunaData = randomChoice(comunasDisponibles);

      if (comunasUsadas.has(comunaData.comuna)) {
        continue;
      }
    }

    const comunaVenta: ComunaVenta = {
      id: generarId(),
      comuna: comunaData.comuna,
      region: comunaData.region,
      venta: Math.round(randomBetween(ventaMin, ventaMax) / 1000) * 1000,
    };

    comunasVentas.push(comunaVenta);
    comunasUsadas.add(comunaData.comuna);
  }

  return comunasVentas.sort((a, b) => b.venta - a.venta);
}

// Función para generar datos específicos de la V Región
export function generarVentasVRegion(): ComunaVenta[] {
  return generarComunasVentasPersonalizadas({
    regionesFiltro: ['V Región'],
    incluirTodasLasComunas: true,
    ventaMin: 200000,
    ventaMax: 1000000,
  });
}

// Función para generar datos específicos de la Región Metropolitana
export function generarVentasRegionMetropolitana(): ComunaVenta[] {
  return generarComunasVentasPersonalizadas({
    regionesFiltro: ['Región Metropolitana'],
    incluirTodasLasComunas: true,
    ventaMin: 300000,
    ventaMax: 2000000,
  });
}
