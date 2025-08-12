"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/app/components/mi-cuenta/Sidebar";
import { useRouter } from "next/navigation";
import FavoritosSection from "@/app/components/mi-cuenta/FavoritosSection";
import DetalleListaSection from "@/app/components/mi-cuenta/DetalleListaSection";
import ModalLogout from "@/app/components/mi-cuenta/ModalLogout";
import ModalCrearLista from "@/app/components/mi-cuenta/ModalCrearLista";
import { Suspense } from "react";
import SectionSync from "@/app/components/mi-cuenta/SectionSync";
import { useFavorites } from "@/hooks/useFavorites";
import DatosPersonalesForm from "@/app/components/mi-cuenta/DatosPersonalesForm";
import useStore from "@/stores/base";
import { getUserOrders } from "@/services/actions/order.actions";
import { mapOrderToCompra } from "@/utils/mapOrderToCompra";
import ComprasSection, {
  Compra,
} from "@/app/components/mi-cuenta/ComprasSection";
import DetalleCompra from "@/app/components/mi-cuenta/DetalleCompra";
import {
  getUserAddresses,
  type Address,
} from "@/services/actions/addressees.actions";
import LoadingSpinner from "@/app/components/global/LoadingSpinner";
import DireccionesSection from "@/app/components/mi-cuenta/DireccionesSection";
import CambiarContraseñaSection from "@/app/components/mi-cuenta/CambiarContraseñaSection";

const SECCIONES_VALIDAS = [
  "datos",
  "direcciones",
  "favoritos",
  "detalle-lista",
  "compras",
  "detalle-compra",
  "cambiar-contraseña",
];
export default function MiCuentaPage() {
  const [selected, setSelected] = useState("datos");
  const [modalCrearListaVisible, setModalCrearListaVisible] = useState(false);
  const [nombreNuevaLista, setNombreNuevaLista] = useState("");
  const [errorNombreLista, setErrorNombreLista] = useState("");
  const [modalLogoutVisible, setModalLogoutVisible] = useState(false);

  /* Estados para seccion de ordenes del uFsuario */
  const [compras, setCompras] = useState<Compra[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Compra>(
    compras[0]
  );
  const [loadingOrders, setLoadingOrders] = useState(true);

  /* Estados para seccion de direcciones del usuario */
  const [direcciones, setDirecciones] = useState<Address[]>([]);
  const [loadingDirecciones, setLoadinDirecciones] = useState(true);

  const router = useRouter();
  const { handleViewListDetail, clearSelectedList } = useFavorites();

  const handleSectionChange = (newSection: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set("section", newSection);
    router.replace(`?${currentParams.toString()}`, { scroll: false });
    setSelected(newSection);
  };

  const handleViewList = async (lista: any) => {
    // Cargar el detalle de la lista
    const result = await handleViewListDetail(lista.id);
    if (result.ok) {
      setSelected("detalle-lista");
      // Agregar el ID de la lista a la URL
      const currentParams = new URLSearchParams(window.location.search);
      currentParams.set("section", "detalle-lista");
      currentParams.set("listaId", lista.id.toString());
      router.replace(`?${currentParams.toString()}`, { scroll: false });
    } else {
      console.error("Error al cargar detalle de lista:", result.error);
    }
  };
  const handleBackToFavorites = () => {
    clearSelectedList();
    setSelected("favoritos");
    // Limpiar el parámetro listaId de la URL
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set("section", "favoritos");
    currentParams.delete("listaId");
    router.replace(`?${currentParams.toString()}`, { scroll: false });
  };

  // Función para manejar cuando se elimina una lista
  const handleListDeleted = () => {
    clearSelectedList();
    setSelected("favoritos");
    // Limpiar el parámetro listaId de la URL
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set("section", "favoritos");
    currentParams.delete("listaId");
    router.replace(`?${currentParams.toString()}`, { scroll: false });
  };

  /* Trae las ordenes del usuario  */
  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);

      try {
        const res = await getUserOrders();
        if (res?.data) {
          const mapped: Compra[] = res.data.map(mapOrderToCompra);
          setCompras(mapped);
        }
      } catch (error) {
        console.error("Error al cargar las órdenes:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);

  //Trae las direcciones del usuario
  useEffect(() => {
    const fetchDirecciones = async () => {
      const data = await getUserAddresses();
      if (data) setDirecciones(data);
      setLoadinDirecciones(false);
    };

    fetchDirecciones();
  }, []);

    // Restaurar lista seleccionada desde la URL al recargar la página
  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search);
    const section = currentParams.get("section");
    const listaId = currentParams.get("listaId");

    if (section === "detalle-lista" && listaId) {
      // Esperar a que las listas se carguen antes de buscar
      const checkAndRestoreList = () => {
        const { favoriteLists, setSelectedFavoriteList, isLoadingFavorites } = useStore.getState();
        
        if (isLoadingFavorites) {
          // Si aún está cargando, esperar un poco más
          setTimeout(checkAndRestoreList, 100);
          return;
        }

        const lista = favoriteLists.find((list: any) => list.id.toString() === listaId);
        
        if (lista) {
          setSelectedFavoriteList(lista);
          setSelected("detalle-lista");
        } else {
          // Si la lista no se encuentra (fue eliminada o no existe), redirigir a favoritos
          clearSelectedList();
          setSelected("favoritos");
          const newParams = new URLSearchParams(window.location.search);
          newParams.set("section", "favoritos");
          newParams.delete("listaId");
          router.replace(`?${newParams.toString()}`, { scroll: false });
        }
      };

      checkAndRestoreList();
    }
  }, [router, clearSelectedList]);

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
          </Suspense>{" "}
          <div className="flex-1 h-fit rounded-lg sm:px-6">
            {" "}
            {selected === "favoritos" && (
              <FavoritosSection
                setNombreNuevaLista={setNombreNuevaLista}
                setErrorNombreLista={setErrorNombreLista}
                setModalCrearListaVisible={setModalCrearListaVisible}
                onViewListDetail={handleViewList}
              />
            )}
            {selected === "detalle-lista" && (
              <DetalleListaSection 
                onVolver={handleBackToFavorites} 
                onListDeleted={handleListDeleted}
              />
            )}
            {selected === "datos" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <DatosPersonalesForm />
              </div>
            )}
            {selected === "detalle-compra" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <DetalleCompra
                  pedido={pedidoSeleccionado}
                  setSection={setSelected}
                />
              </div>
            )}
            {selected === "direcciones" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                {loadingDirecciones ? (
                  <div className="flex justify-center items-center py-10">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <DireccionesSection
                    direcciones={direcciones}
                  />
                )}
              </div>
            )}
            {selected === "compras" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <ComprasSection
                  compras={compras}
                  busqueda={busqueda}
                  setBusqueda={setBusqueda}
                  setPedidoSeleccionado={setPedidoSeleccionado}
                  setSelected={setSelected}
                  router={router}
                  loading={loadingOrders}
                />
              </div>
            )}
            {selected === "cambiar-contraseña" && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <CambiarContraseñaSection />
              </div>
            )}
          </div>
        </div>{" "}
        {modalLogoutVisible && (
          <ModalLogout 
            onClose={() => setModalLogoutVisible(false)} 
            dataCyConfirm="confirm-logout-btn"
            dataCyCancel="cancel-logout-btn"
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
      </div>
    </div>
  );
}
