"use client";
import { useState } from "react";
import Sidebar from "@/app/components/mi-cuenta/Sidebar";
import {
  HeartIcon as HeartSolid,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";
import { regionesYComunas } from "@/app/components/regionesYComunas";
import { useRouter } from "next/navigation";
import {
  PencilSquareIcon,
  TrashIcon,
  HeartIcon as HeartOutline,
} from "@heroicons/react/24/outline";

export default function MiCuentaPage() {
  const [selected, setSelected] = useState("datos");
  const [modalListaVisible, setModalListaVisible] = useState(false);
  const [listaSeleccionada, setListaSeleccionada] = useState<any | null>(null);
  const [modalCrearListaVisible, setModalCrearListaVisible] = useState(false);
  const [nombreNuevaLista, setNombreNuevaLista] = useState("");
  const [errorNombreLista, setErrorNombreLista] = useState("");
  const [modalLogoutVisible, setModalLogoutVisible] = useState(false);
  const [regionSeleccionada, setRegionSeleccionada] = useState("");
  const [comunaSeleccionada, setComunaSeleccionada] = useState("");
  const [favoritaIndex, setFavoritaIndex] = useState<number | null>(null);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<any | null>(
    null
  );
  const [modalAbierto, setModalAbierto] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    primerApellido: "",
    segundoApellido: "",
    email: "",
    telefono: "",
    rut: "",
  });

  const [formErrors, setFormErrors] = useState({
    nombre: "",
    primerApellido: "",
    segundoApellido: "",
    email: "",
    telefono: "",
    rut: "",
  });
  const listasFavoritas = [
    {
      nombre: "Pizzas",
      productos: [
        { nombre: "Arroz granel", imagen: "/img/arroz.png" },
        { nombre: "Fideos", imagen: "/img/arroz.png" },
        { nombre: "Aceite", imagen: "/img/arroz.png" },
      ],
    },
    {
      nombre: "Canasta mensual",
      productos: [
        { nombre: "Café", imagen: "/img/arroz.png" },
        { nombre: "Pan", imagen: "/img/arroz.png" },
      ],
    },
  ];
  const [busqueda, setBusqueda] = useState("");

  const [compras] = useState([
    {
      fecha: "2 de diciembre",
      numero: "123456789",
      hora: "15:56",
      total: 999999,
      productos: [
        {
          nombre: "Arroz Gl laminado 1 kg.",
          marca: "Miraflores",
          imagen: "/img/arroz.png",
          precio: 99999,
          cantidad: 33,
        },
        {
          nombre: "Arroz Gl laminado 1 kg.",
          marca: "Miraflores",
          imagen: "/img/arroz.png",
          precio: 99999,
          cantidad: 33,
        },
      ],
    },
    {
      fecha: "2 de diciembre",
      numero: "456789123",
      hora: "15:56",
      total: 999999,
      productos: [
        {
          nombre: "Fideos 500g",
          marca: "Carozzi",
          imagen: "/img/fideos.png",
          precio: 1890,
          cantidad: 2,
        },
      ],
    },
  ]);

  const comprasFiltradas = compras.filter((c) =>
    c.numero.includes(busqueda.trim())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" })); // limpiar error al escribir
  };
  const router = useRouter();

  const validateForm = () => {
    const errors: any = {};
    if (!formData.nombre) errors.nombre = "El nombre es requerido";
    if (!formData.primerApellido)
      errors.primerApellido = "El primer apellido es requerido";
    if (!formData.segundoApellido)
      errors.segundoApellido = "El segundo apellido es requerido";
    if (!formData.email) {
      errors.email = "El correo es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Correo no válido";
    }
    if (!formData.telefono) {
      errors.telefono = "El teléfono es requerido";
    } else if (!/^\d{9}$/.test(formData.telefono)) {
      errors.telefono = "Teléfono no válido (9 dígitos)";
    }
    if (!formData.rut) errors.rut = "El RUT es requerido";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Datos guardados correctamente");
    }
  };

  return (
    <div className="bg-[#f1f5f9] min-h-screen px-4">
      <div className="max-w-7xl mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Hola, Damary</h1>
        <div className="flex flex-col md:flex-row gap-6">
          <Sidebar
            selectedKey={selected}
            onSelect={setSelected}
            onLogoutClick={() => setModalLogoutVisible(true)}
          />

          <div className="flex-1 bg-white rounded-lg shadow p-6">
            {selected === "datos" && (
              <div>
                <h2 className="text-xl font-bold mb-4">Datos personales</h2>
                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {[
                    { label: "Nombre", name: "nombre" },
                    { label: "Primer apellido", name: "primerApellido" },
                    { label: "Segundo apellido", name: "segundoApellido" },
                    {
                      label: "Correo electrónico",
                      name: "email",
                      type: "email",
                    },
                    { label: "Teléfono", name: "telefono", type: "tel" },
                    { label: "RUT", name: "rut" },
                  ].map(({ label, name, type = "text" }) => (
                    <div key={name}>
                      <label className="block font-medium">{label}</label>
                      <input
                        type={type}
                        name={name}
                        value={(formData as any)[name]}
                        onChange={handleInputChange}
                        className={`w-full mt-1 p-2 bg-gray-100 rounded ${
                          (formErrors as any)[name] && "border border-red-500"
                        }`}
                      />
                      {(formErrors as any)[name] && (
                        <p className="text-red-500 text-sm mt-1">
                          {(formErrors as any)[name]}
                        </p>
                      )}
                    </div>
                  ))}

                  <div className="md:col-span-3 mt-4">
                    <button
                      type="submit"
                      className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded"
                    >
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Resto de secciones (direcciones, favoritos, compras...) igual que antes */}
            {selected === "direcciones" && (
              <div>
                <h2 className="text-xl font-bold mb-4">Direcciones</h2>

                <div className="space-y-2 mb-4">
                  {["Casa", "Oficina", "Otro"].map((nombre, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-[#edf2f7] px-4 py-2 rounded"
                    >
                      <div className="flex items-center gap-2 text-gray-700">
                        <button
                          onClick={() => setFavoritaIndex(idx)}
                          title="Marcar como favorita"
                        >
                          {favoritaIndex === idx ? (
                            <HeartSolid className="w-5 h-5 text-gray-500" />
                          ) : (
                            <HeartOutline className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                        <span>{nombre}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          title="Editar"
                          onClick={() => {
                            setModalAbierto(true);
                          }}
                        >
                          <PencilSquareIcon className="w-5 h-5 text-gray-800 hover:text-gray-600" />
                        </button>

                        <button title="Eliminar">
                          <TrashIcon className="w-5 h-5 text-gray-800 hover:text-gray-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setModalAbierto(true);
                  }}
                  className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded"
                >
                  Agregar nueva dirección
                </button>
              </div>
            )}
            {selected === "favoritos" && (
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
                          <h3 className="font-semibold text-lg">
                            {lista.nombre}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {lista.productos.length} Productos
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setListaSeleccionada(lista);
                            setModalListaVisible(true);
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
                                "/assets/global/logo_default.png";
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
                    setNombreNuevaLista("");
                    setErrorNombreLista("");
                    setModalCrearListaVisible(true);
                  }}
                  className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded text-sm"
                >
                  Crear nueva lista
                </button>
              </div>
            )}

            {selected === "compras" && (
              <div className=" p-4 rounded">
                <h2 className="text-xl font-bold mb-6">Mis compras</h2>

                <div className="flex justify-end mb-4">
                  <div className="relative w-full md:w-72">
                    <input
                      type="text"
                      placeholder="Buscar Nº de pedido"
                      className="border border-slate-400 px-4 py-2 rounded w-full pr-10"
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                    />
                    <MagnifyingGlassIcon className="w-5 h-5 absolute right-3 top-2.5 text-gray-500" />
                  </div>
                </div>

                <div className="space-y-4">
                  {comprasFiltradas.length > 0 ? (
                    comprasFiltradas.map((c, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-4 rounded border-slate-200 border"
                      >
                        <div className="flex justify-between mb-2 border-b border-b-slate-200 pb-1">
                          <span className="font-semibold">{c.fecha}</span>
                          <span className="font-bold">
                            ${c.total.toLocaleString("es-CL")}
                          </span>
                        </div>

                        <p className="text-slate-400 font-medium">
                          Pedido Nº {c.numero}
                        </p>
                        <p className="text-sm text-gray-500 mb-2">
                          Entregado a las {c.hora} hrs.
                        </p>

                        <div className="flex gap-2 overflow-x-auto mb-4">
                          {c.productos.map((producto, i) => (
                            <img
                              key={i}
                              src={producto.imagen}
                              alt={producto.nombre}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src =
                                  "/assets/global/logo_default.png";
                              }}
                              className="w-12 h-16 object-contain bg-gray-100 rounded"
                            />
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setPedidoSeleccionado(c);
                              console.log(c);
                              setSelected("detalle-compra");
                            }}
                            className="bg-gray-300 hover:bg-gray-400 text-white px-4 py-2 rounded text-sm"
                          >
                            Revisar Detalle
                          </button>

                          <button
                            onClick={() => router.push("/carro-de-compra")}
                            className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded text-sm"
                          >
                            Repetir Pedido
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">
                      No se encontraron pedidos.
                    </p>
                  )}
                </div>
              </div>
            )}
            {selected === "detalle-compra" && pedidoSeleccionado && (
              <div className="bg-[#f1f5f9] p-4 rounded min-h-screen">
                <h2 className="text-lg font-bold mb-2">
                  Pedido Nº {pedidoSeleccionado.numero}
                </h2>
                <p className="text-sm text-gray-500 mb-4">
                  Pedido entregado el {pedidoSeleccionado.fecha}
                </p>
                <p className="text-green-600 font-medium mb-6">
                  {pedidoSeleccionado.productos.length} Productos
                </p>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-4">
                    {pedidoSeleccionado.productos.map((p: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-white p-4 rounded shadow"
                      >
                        <div className="flex gap-4 items-center">
                          <img
                            src={p.imagen}
                            className="w-14 h-16 object-contain"
                            alt={p.nombre}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src =
                                "/assets/global/logo_default.png";
                            }}
                          />

                          <div>
                            <p className="text-sm font-medium text-gray-500">
                              {p.marca}
                            </p>
                            <p className="font-semibold">{p.nombre}</p>
                            <p className="text-green-600 font-bold">
                              ${p.precio}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            Cant: {p.cantidad}
                          </p>
                          <p className="text-right font-semibold text-gray-800">
                            ${p.precio}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white p-6 rounded shadow h-fit">
                    <h3 className="text-lg font-bold mb-4">
                      Resumen de compra
                    </h3>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Subtotal</span>
                      <span className="text-sm">
                        ${pedidoSeleccionado.total}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2 mb-2">
                      <span>Total todo medio de pago</span>
                      <span>${pedidoSeleccionado.total}</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">
                      Impuestos y envíos calculados al finalizar la compra
                    </p>
                    <button onClick={() => router.push('/carro-de-compra')} className="w-full bg-lime-500 hover:bg-lime-600 text-white py-2 rounded">
                      Continuar con la compra
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {modalLogoutVisible && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow max-w-md w-full">
              <div className="flex items-start gap-2 mb-4">
                <QuestionMarkCircleIcon className="w-6 h-6 text-blue-500 mt-1" />

                <div>
                  <h2 className="text-lg font-bold">¿Deseas cerrar sesión?</h2>
                  <p className="text-sm text-gray-600">
                    Se perderán los datos no guardados.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    router.push("/login");
                    setModalLogoutVisible(false);
                  }}
                  className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded"
                >
                  Continuar
                </button>
                <button
                  onClick={() => setModalLogoutVisible(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
        {modalListaVisible && listaSeleccionada && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow max-w-xl w-full relative">
              <h2 className="text-xl font-bold mb-4">
                Lista: {listaSeleccionada.nombre}
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {listaSeleccionada.productos.map((prod: any, i: number) => (
                  <div
                    key={i}
                    className="bg-gray-100 rounded p-2 text-center text-sm flex flex-col items-center"
                  >
                    <img
                      src={prod.imagen}
                      alt={prod.nombre}
                      className="w-20 h-24 object-contain rounded mb-2"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/assets/global/logo_default.png";
                      }}
                    />

                    <span>{prod.nombre}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setModalListaVisible(false)}
                  className="border border-gray-300 text-gray-700 px-6 py-2 rounded"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
        {modalCrearListaVisible && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Crear nueva lista</h2>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!nombreNuevaLista.trim()) {
                    setErrorNombreLista("Este campo es obligatorio");
                    return;
                  }

                  // Aquí puedes agregar la lógica para guardar la lista:
                  // setListasFavoritas(prev => [...prev, { nombre: nombreNuevaLista, productos: [] }]);

                  setModalCrearListaVisible(false);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block font-medium">
                    Nombre de lista <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={nombreNuevaLista}
                    onChange={(e) => {
                      setNombreNuevaLista(e.target.value);
                      setErrorNombreLista("");
                    }}
                    className="w-full mt-1 p-2 bg-[#edf2f7] rounded"
                  />
                  {errorNombreLista && (
                    <p className="text-red-500 text-sm mt-1">
                      {errorNombreLista}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded"
                  >
                    Crear
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalCrearListaVisible(false)}
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {modalAbierto && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)]  flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow max-w-2xl w-full relative">
              <h2 className="text-xl font-bold mb-4">Editar dirección</h2>

              <div className="absolute right-6 top-6 text-green-600 font-medium text-sm cursor-pointer flex items-center gap-1">
                <HeartOutline className="w-4 h-4" />
                <span>Marcar como dirección principal</span>
              </div>

              <form
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  // Validar y guardar...
                  // Puedes agregar validaciones aquí
                  setModalAbierto(false);
                }}
              >
                <div>
                  <label className="block font-medium">
                    Región<span className="text-red-500">*</span>
                  </label>
                  <select
                    value={regionSeleccionada}
                    onChange={(e) => {
                      setRegionSeleccionada(e.target.value);
                      setComunaSeleccionada(""); // reset comuna
                    }}
                    className="w-full mt-1 p-2 bg-[#edf2f7] rounded"
                  >
                    <option value="">Selecciona una región</option>
                    {Object.keys(regionesYComunas).map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>

                  {regionSeleccionada === "" && (
                    <p className="text-red-500 text-sm mt-1">
                      No ha seleccionado una región.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-medium">
                    Comuna<span className="text-red-500">*</span>
                  </label>
                  <select
                    value={comunaSeleccionada}
                    onChange={(e) => setComunaSeleccionada(e.target.value)}
                    className="w-full mt-1 p-2 bg-[#edf2f7] rounded"
                    disabled={!regionSeleccionada}
                  >
                    <option value="">Selecciona una comuna</option>
                    {(regionSeleccionada
                      ? regionesYComunas[regionSeleccionada]
                      : []
                    ).map((comuna: string) => (
                      <option key={comuna} value={comuna}>
                        {comuna}
                      </option>
                    ))}
                  </select>

                  {comunaSeleccionada === "" && (
                    <p className="text-red-500 text-sm mt-1">
                      No ha seleccionado una comuna.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block font-medium">
                    Dirección<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 bg-[#edf2f7] rounded"
                  />
                </div>

                <div>
                  <label className="block font-medium">
                    Detalle de la dirección
                  </label>
                  <input
                    type="text"
                    className="w-full mt-1 p-2 bg-[#edf2f7] rounded"
                  />
                </div>

                <div className="col-span-2 flex gap-2 mt-4">
                  <button
                    type="submit"
                    className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalAbierto(false)}
                    className="border border-gray-300 text-gray-700 px-6 py-2 rounded"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
