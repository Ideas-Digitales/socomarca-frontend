'use client';

export interface ProductoFavorito {
  nombre: string;
  imagen: string;
}

export interface ListaFavorita {
  nombre: string;
  productos: ProductoFavorito[];
}

export default function FavoritosSection({
  listasFavoritas,
  setListaSeleccionada,
  setNombreNuevaLista,
  setErrorNombreLista,
  setModalCrearListaVisible,
  setSelected
}: {
  listasFavoritas: ListaFavorita[];
  setListaSeleccionada: (lista: ListaFavorita) => void;
  setModalListaVisible: (visible: boolean) => void;
  setNombreNuevaLista: (v: string) => void;
  setErrorNombreLista: (v: string) => void;
  setModalCrearListaVisible: (v: boolean) => void;
   setSelected: (v: string) => void;
}) {
  return (
    <div className="bg-[#f1f5f9] p-4 rounded">
      <h2 className="text-xl font-bold mb-6">Mis favoritos</h2>

      <div className="space-y-4 mb-6">
        {listasFavoritas.map((lista, i) => (
          <div
            key={i}
            className="bg-white rounded p-4 shadow-sm border border-[#e4eaf1]"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{lista.nombre}</h3>
                <p className="text-sm text-gray-500">
                  {lista.productos.length} Productos
                </p>
              </div>
              <button
                onClick={() => {
                  setListaSeleccionada(lista);
                  setSelected("detalle-lista")                  //
                }}
                className="text-sm text-blue-500 flex items-center gap-1 hover:underline"
              >
                Revisar lista <span className="text-lg">›</span>
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto mt-2">
              {lista.productos.map((prod, j) => (
                <img
                  key={j}
                  src={prod.imagen}
                  alt={prod.nombre}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      '/assets/global/logo_plant.png';
                  }}
                  className="w-12 h-16 object-contain bg-gray-100 rounded"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          setNombreNuevaLista('');
          setErrorNombreLista('');
          setModalCrearListaVisible(true);
        }}
        className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded text-sm"
      >
        Crear nueva lista
      </button>
    </div>
  );
}
