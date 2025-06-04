'use client';
import { useState } from 'react';
import Sidebar from '@/app/components/mi-cuenta/Sidebar';
import { useRouter } from 'next/navigation';
import DatosPersonalesForm from '@/app/components/mi-cuenta/DatosPersonalesForm';
import DireccionesSection from '@/app/components/mi-cuenta/DireccionesSection';
import FavoritosSection from '@/app/components/mi-cuenta/FavoritosSection';
import ComprasSection from '@/app/components/mi-cuenta/ComprasSection';
import DetalleCompra from '@/app/components/mi-cuenta/DetalleCompra';
import ModalLogout from '@/app/components/mi-cuenta/ModalLogout';
import ModalVerLista from '@/app/components/mi-cuenta/ModalVerLista';
import ModalCrearLista from '@/app/components/mi-cuenta/ModalCrearLista';
import ModalEditarDireccion from '@/app/components/mi-cuenta/ModalEditarDireccion';
import DetalleListaSection from '@/app/components/mi-cuenta/DetalleListaSection';
import { Suspense } from 'react';
import SectionSync from '@/app/components/mi-cuenta/SectionSync';

export interface MockAddressProps {
  id: number;
  nombre: string;
  direccion: string;
  region: string;
  comuna: string;
  telefono: string;
  esFavorita: boolean;
}

const mockAddress: MockAddressProps = {
  id: 1,
  nombre: 'Casa',
  direccion: 'Av. Siempre Viva 123',
  region: 'Región Metropolitana',
  comuna: 'Santiago',
  telefono: '987654321',
  esFavorita: true,
};

const SECCIONES_VALIDAS = [
  'datos',
  'direcciones',
  'favoritos',
  'compras',
  'detalle-compra',
  'detalle-lista',
];
export default function MiCuentaPage() {
  const [selected, setSelected] = useState('datos');
  const [address, setAddress] = useState<MockAddressProps | null>(null);
  const [modalListaVisible, setModalListaVisible] = useState(false);
  const [listaSeleccionada, setListaSeleccionada] = useState<any | null>(null);
  const [modalCrearListaVisible, setModalCrearListaVisible] = useState(false);
  const [nombreNuevaLista, setNombreNuevaLista] = useState('');
  const [errorNombreLista, setErrorNombreLista] = useState('');
  const [modalLogoutVisible, setModalLogoutVisible] = useState(false);
  const [regionSeleccionada, setRegionSeleccionada] = useState('');
  const [comunaSeleccionada, setComunaSeleccionada] = useState('');
  const [favoritaIndex, setFavoritaIndex] = useState<number | null>(null);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<any | null>(
    null
  );
  const [modalAbierto, setModalAbierto] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    email: '',
    telefono: '',
    rut: '',
  });

  const [formErrors, setFormErrors] = useState({
    nombre: '',
    primerApellido: '',
    segundoApellido: '',
    email: '',
    telefono: '',
    rut: '',
  });
  const listasFavoritas = [
    {
      nombre: 'Pizzas',
      productos: [
        { nombre: 'Arroz granel', imagen: '/img/arroz.png', cantidad: 1 },
        { nombre: 'Fideos', imagen: '/img/arroz.png', cantidad: 1 },
        { nombre: 'Aceite', imagen: '/img/arroz.png', cantidad: 1 },
      ],
    },
    {
      nombre: 'Canasta mensual',
      productos: [
        { nombre: 'Café', imagen: '/img/arroz.png', cantidad: 1 },
        { nombre: 'Pan', imagen: '/img/arroz.png', cantidad: 1 },
      ],
    },
  ];
  const [busqueda, setBusqueda] = useState('');

  const [compras] = useState([
    {
      fecha: '2 de diciembre',
      numero: '123456789',
      hora: '15:56',
      total: 999999,
      productos: [
        {
          nombre: 'Arroz Gl laminado 1 kg.',
          marca: 'Miraflores',
          imagen: '/img/arroz.png',
          precio: 99999,
          cantidad: 33,
        },
        {
          nombre: 'Arroz Gl laminado 1 kg.',
          marca: 'Miraflores',
          imagen: '/img/arroz.png',
          precio: 99999,
          cantidad: 33,
        },
      ],
    },
    {
      fecha: '2 de diciembre',
      numero: '456789123',
      hora: '15:56',
      total: 999999,
      productos: [
        {
          nombre: 'Fideos 500g',
          marca: 'Carozzi',
          imagen: '/img/fideos.png',
          precio: 1890,
          cantidad: 2,
        },
      ],
    },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' })); // limpiar error al escribir
  };
  const router = useRouter();

  const handleSectionChange = (newSection: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set('section', newSection);
    router.replace(`?${currentParams.toString()}`, { scroll: false });
    setSelected(newSection);
  };

  const validateForm = () => {
    const errors: any = {};
    if (!formData.nombre) errors.nombre = 'El nombre es requerido';
    if (!formData.primerApellido)
      errors.primerApellido = 'El primer apellido es requerido';
    if (!formData.segundoApellido)
      errors.segundoApellido = 'El segundo apellido es requerido';
    if (!formData.email) {
      errors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Correo no válido';
    }
    if (!formData.telefono) {
      errors.telefono = 'El teléfono es requerido';
    } else if (!/^\d{9}$/.test(formData.telefono)) {
      errors.telefono = 'Teléfono no válido (9 dígitos)';
    }
    if (!formData.rut) errors.rut = 'El RUT es requerido';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      alert('Datos guardados correctamente');
    }
  };

  // FIXME: Este es un ejemplo de cómo manejar la lógica de selección de dirección favorita, se debe terminar.
  const handleSetFavorite = (addressId: number) => {
    setAddress((prev) => {
      if (!prev) return null;

      // Si es la misma dirección, toggle el estado de favorita
      if (prev.id === addressId) {
        return {
          ...prev,
          esFavorita: !prev.esFavorita,
        };
      }

      // Si es diferente dirección, crear nueva instancia como favorita
      return {
        ...mockAddress,
        id: addressId,
        esFavorita: true,
      };
    });
  };

  return (
    <div className="bg-[#f1f5f9] min-h-screen px-4">
      <div className="max-w-7xl mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Hola, Damary</h1>
        <div className="flex flex-col md:flex-row gap-6">
          <Sidebar
            selectedKey={selected}
            onSelect={handleSectionChange}
            onLogoutClick={() => setModalLogoutVisible(true)}
          />
          <Suspense>
            <SectionSync
              setSelected={setSelected}
              validSections={SECCIONES_VALIDAS}
            />
          </Suspense>

          <div className="flex-1 h-fit bg-white rounded-lg shadow p-6">
            {selected === 'datos' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Datos personales</h2>
                <DatosPersonalesForm
                  formData={formData}
                  formErrors={formErrors}
                  onChange={handleInputChange}
                  onSubmit={handleSubmit}
                  setFormData={setFormData}
                />
              </div>
            )}

            {/* Resto de secciones (direcciones, favoritos, compras...) igual que antes */}
            {selected === 'direcciones' && (
              <DireccionesSection
                favoritaIndex={favoritaIndex}
                setFavoritaIndex={setFavoritaIndex}
                setModalAbierto={setModalAbierto}
              />
            )}
            {selected === 'favoritos' && (
              <FavoritosSection
                listasFavoritas={listasFavoritas}
                setListaSeleccionada={setListaSeleccionada}
                setModalListaVisible={setModalListaVisible}
                setNombreNuevaLista={setNombreNuevaLista}
                setErrorNombreLista={setErrorNombreLista}
                setModalCrearListaVisible={setModalCrearListaVisible}
                setSelected={setSelected}
              />
            )}

            {selected === 'detalle-lista' && listaSeleccionada && (
              <DetalleListaSection
                lista={listaSeleccionada}
                onVolver={() => {
                  setSelected('favoritos');
                  const params = new URLSearchParams(window.location.search);
                  params.set('section', 'favoritos');
                  router.replace(`?${params.toString()}`, { scroll: false });
                }}
              />
            )}

            {selected === 'compras' && (
              <ComprasSection
                compras={compras}
                busqueda={busqueda}
                setBusqueda={setBusqueda}
                setPedidoSeleccionado={setPedidoSeleccionado}
                setSelected={setSelected}
                router={router}
              />
            )}
            {selected === 'detalle-compra' && pedidoSeleccionado && (
              <DetalleCompra pedido={pedidoSeleccionado} />
            )}
          </div>
        </div>
        {modalLogoutVisible && (
          <ModalLogout onClose={() => setModalLogoutVisible(false)} />
        )}
        {modalListaVisible && listaSeleccionada && (
          <ModalVerLista
            lista={listaSeleccionada}
            onClose={() => setModalListaVisible(false)}
          />
        )}
        {modalCrearListaVisible && (
          <ModalCrearLista
            nombre={nombreNuevaLista}
            setNombre={setNombreNuevaLista}
            error={errorNombreLista}
            setError={setErrorNombreLista}
            onClose={() => setModalCrearListaVisible(false)}
          />
        )}

        {modalAbierto && (
          <ModalEditarDireccion
            address={address}
            region={regionSeleccionada}
            setRegion={setRegionSeleccionada}
            comuna={comunaSeleccionada}
            setComuna={setComunaSeleccionada}
            onClose={() => setModalAbierto(false)}
            handleSetFavorite={handleSetFavorite}
          />
        )}
      </div>
    </div>
  );
}
