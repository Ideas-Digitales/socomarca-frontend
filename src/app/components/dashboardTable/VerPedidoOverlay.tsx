import { TransaccionExitosa } from '@/mock/transaccionesExitosas';
import { CartItem } from '@/interfaces/product.interface';
import { XMarkIcon } from '@heroicons/react/24/outline';
import VerPedidoItemCard from './VerPedidoItemCard';
import Pagination from '../global/Pagination';
import { usePagination } from '@/hooks/usePagination';

interface Props {
  isOpen: boolean;
  detailSelected: TransaccionExitosa | null;
  onClose: () => void;
}

export default function VerPedidoOverlay({
  isOpen,
  detailSelected,
  onClose,
}: Props) {
  const { paginatedItems, productPaginationMeta, changePage } = usePagination(
    detailSelected?.productos || []
  );

  // El componente siempre se renderiza para que las animaciones funcionen
  // Solo ocultamos el contenido cuando no hay data

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Overlay panel - siempre renderizado para animaciones */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Solo mostrar contenido cuando hay data */}
        {detailSelected && (
          <>
            {/* Header del overlay */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Detalle del Pedido #{detailSelected.id}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {detailSelected.cliente} • {detailSelected.fecha}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Contenido scrolleable */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {/* Información de la transacción */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Monto Total
                      </h3>
                      <p className="text-2xl font-bold text-lime-600">
                        ${detailSelected.monto.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Categoría
                      </h3>
                      <p className="text-lg font-semibold text-gray-900">
                        {detailSelected.categoria}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Header de productos */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    Productos ({detailSelected.productos.length})
                  </h3>
                </div>

                {/* Lista de productos */}
                <ul className="space-y-4 mb-6 max-h-[45dvh] md:max-h-[85dvh] overflow-y-auto">
                  {(paginatedItems as CartItem[])?.map((item: CartItem) => (
                    <VerPedidoItemCard key={item.id} cartItem={item} />
                  ))}
                </ul>

                {/* Paginación */}
                {productPaginationMeta && changePage && (
                  <div className="flex justify-center w-full">
                    <Pagination
                      meta={productPaginationMeta}
                      onPageChange={changePage}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
