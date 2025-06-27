'use client';
import { useState } from 'react';
import Sidebar from '@/app/components/mi-cuenta/Sidebar';
import { useRouter } from 'next/navigation';
import FavoritosSection from '@/app/components/mi-cuenta/FavoritosSection';
import DetalleListaSection from '@/app/components/mi-cuenta/DetalleListaSection';
import ModalLogout from '@/app/components/mi-cuenta/ModalLogout';
import ModalCrearLista from '@/app/components/mi-cuenta/ModalCrearLista';
import { Suspense } from 'react';
import SectionSync from '@/app/components/mi-cuenta/SectionSync';
import { useFavorites } from '@/hooks/useFavorites';
import DatosPersonalesForm from '@/app/components/mi-cuenta/DatosPersonalesForm';

const SECCIONES_VALIDAS = [
  'datos',
  'direcciones',
  'favoritos',
  'detalle-lista',
  'compras',
  'detalle-compra',
];
export default function MiCuentaPage() {
  const [selected, setSelected] = useState('datos');
  const [modalCrearListaVisible, setModalCrearListaVisible] = useState(false);
  const [nombreNuevaLista, setNombreNuevaLista] = useState('');
  const [errorNombreLista, setErrorNombreLista] = useState('');
  const [modalLogoutVisible, setModalLogoutVisible] = useState(false);

  const router = useRouter();
  const { handleViewListDetail, clearSelectedList } = useFavorites();

  const handleSectionChange = (newSection: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set('section', newSection);
    router.replace(`?${currentParams.toString()}`, { scroll: false });
    setSelected(newSection);
  };

  const handleViewList = async (lista: any) => {
    // Cargar el detalle de la lista
    const result = await handleViewListDetail(lista.id);
    if (result.ok) {
      setSelected('detalle-lista');
      handleSectionChange('detalle-lista');
    } else {
      console.error('Error al cargar detalle de lista:', result.error);
    }
  };
  const handleBackToFavorites = () => {
    clearSelectedList();
    setSelected('favoritos');
    handleSectionChange('favoritos');
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
          </Suspense>{' '}
          <div className="flex-1 h-fit rounded-lg sm:px-6">
            {' '}
            {selected === 'favoritos' && (
              <FavoritosSection
                setNombreNuevaLista={setNombreNuevaLista}
                setErrorNombreLista={setErrorNombreLista}
                setModalCrearListaVisible={setModalCrearListaVisible}
                onViewListDetail={handleViewList}
              />
            )}
            {selected === 'detalle-lista' && (
              
              <DetalleListaSection onVolver={handleBackToFavorites} />
            )}
            {selected === 'datos' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <DatosPersonalesForm />
              </div>
            )}
            {selected === 'direcciones' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Direcciones</h2>
                <p>Sección temporalmente deshabilitada</p>
              </div>
            )}
            {selected === 'compras' && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Compras</h2>
                <p>Sección temporalmente deshabilitada</p>
              </div>
            )}
          </div>
        </div>{' '}
        {modalLogoutVisible && (
          <ModalLogout onClose={() => setModalLogoutVisible(false)} />
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
      </div>
    </div>
  );
}
