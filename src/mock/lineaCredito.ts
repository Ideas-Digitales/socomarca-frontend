export interface MovimientoCredito {
  id: number;
  fecha: string;
  descripcion: string;
  monto: number; // negativo = cargo, positivo = abono
  tipo: 'compra' | 'pago' | 'ajuste';
}

export interface LineaCredito {
  limite: number;
  utilizado: number;
  disponible: number;
  vencimiento: string;
  estado: 'activa' | 'bloqueada' | 'suspendida';
  movimientos: MovimientoCredito[];
}

export const mockLineaCredito: LineaCredito = {
  limite: 300_000,
  utilizado: 230_000,
  disponible: 70_000,
  vencimiento: '2026-12-31',
  estado: 'activa',
  movimientos: [
    {
      id: 1,
      fecha: '2026-03-28',
      descripcion: 'Compra #4521',
      monto: -450_000,
      tipo: 'compra',
    },
    {
      id: 2,
      fecha: '2026-02-25',
      descripcion: 'Compra #4398',
      monto: -750_000,
      tipo: 'compra',
    },
    {
      id: 3,
      fecha: '2026-01-20',
      descripcion: 'Compra #4201',
      monto: -500_000,
      tipo: 'compra',
    },
  ],
};
