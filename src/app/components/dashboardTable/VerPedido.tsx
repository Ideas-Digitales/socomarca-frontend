import { TransaccionExitosa } from '@/mock/transaccionesExitosas';
import { ListBulletIcon, ViewColumnsIcon } from '@heroicons/react/24/outline';

interface Props {
  changeView: (view: 'table' | 'details') => void;
  detailSelected: TransaccionExitosa | null;
}

export default function VerPedido({ changeView, detailSelected }: Props) {
  return (
    <div className="flex p-[28px] flex-start">
      {/* Content container */}
      <div className="flex items-start justify-start gap-[28px] flex-1-0-0 flex-wrap">
        {/* Order container */}
        <div className="flex min-w-[250px] flex-col items-start gap-2">
          {/* Header */}
          <div className="flex py-[10px] items-center gap-2">
            <div className="flex w-[536px] items-start gap-6">
              <h3 className="semibold">Arroz y legumbres (180 productos)</h3>
            </div>
            <ListBulletIcon width={24} height={24} />
            <ViewColumnsIcon width={24} height={24} />
          </div>
          {/* Body */}
          <div className="flex flex-col items-start gap-[2px]">
            {/* Header :p */}
            <div className="flex w-[600] p-3 flex-col items-start gap-[2px] border-slate-300 border-b border-solid bg-white">
              <div className="flex items-start gap-[10x]">
                <div className="flex w-[600px] p-3 flex-col items-start gap-[2px]">
                  <p className="text-xs font-medium">
                    Pedido entregado el {detailSelected?.fecha}
                  </p>
                  <p className="font-medium text-lime-500">
                    {detailSelected?.monto} Productos
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="">b</div>
      </div>

      {/* Actions container */}
      <div className="flex flex-col items-start gap-4">
        <button
          onClick={() => changeView('table')}
          className="bg-lime-500 text-white px-4 py-2 rounded"
        >
          Volver a la tabla
        </button>
      </div>
    </div>
  );
}
