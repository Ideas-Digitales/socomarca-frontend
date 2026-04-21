'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RutInput from '@/app/components/global/RutInputVisualIndicators';
import Image from 'next/image';
import useStore from '@/stores/base';
import TerminosYCondicionesContent from '@/app/components/global/TerminosYCondicionesContent';
import {getUserData} from '@/services/actions/user.actions';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';
import ShippingAddressSelect from '@/app/components/user/ShippingAddressSelect';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { fetchPaymentMethods, type PaymentMethod } from '@/services/actions/payment.actions';
import { mockLineaCredito } from '@/mock/lineaCredito';
import { logCreditoRaw } from '@/app/components/mi-cuenta/LineaCreditoSection';

type PaymentMethodCode = string;

const formatCLP = (value: number) =>
  value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

export default function FinalizarCompraPage() {
  const router = useRouter();
  const cartProducts = useStore((state) => state.cartProducts);
  const [loadingUser, setLoadingUser] = useState(true);
  const { openModal } = useStore();
  const [direccionError, setDireccionError] = useState('');
  const [terminosError, setTerminosError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodCode>('transbank');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    correo: '',
    telefono: '',
    shippingAddressId: null as number | null,
  });
  const [aceptaTerminos, setAceptaTerminos] = useState(true);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAceptaTerminos(e.target.checked);
  };

  const validarEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validarTelefono = (telefono: string) =>
    /^(\+?56)?(\s?)(0?9)(\s?)[98765432]\d{7}$/.test(telefono);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      if (name === 'correo') {
        if (!validarEmail(value)) newErrors.correo = 'Correo inválido';
        else delete newErrors.correo;
      }
      if (name === 'telefono') {
        if (!validarTelefono(value)) newErrors.telefono = 'Teléfono chileno inválido';
        else delete newErrors.telefono;
      }
      return newErrors;
    });
  };

  const handleRutChange = (value: string) => {
    setFormData((prev) => ({ ...prev, rut: value }));
  };

  const handleRutValidation = (isValid: boolean) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (!isValid && formData.rut) newErrors.rut = 'RUT inválido';
      else delete newErrors.rut;
      return newErrors;
    });
  };

  const totalQuantity = cartProducts.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartProducts.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const shipping = subtotal * 0.1;
  const total = subtotal + shipping;

  const handleOpenModal = () => {
    openModal('', {
      content: <TerminosYCondicionesContent />,
      showCloseButton: true,
      size: 'xl',
    });
  };

  const goNext = () => {
    let hasError = false;

    if (!formData.shippingAddressId) {
      setDireccionError('Debes seleccionar una dirección de envío.');
      hasError = true;
    } else {
      setDireccionError('');
    }

    if (!aceptaTerminos) {
      setTerminosError('Debes aceptar los términos y condiciones.');
      hasError = true;
    } else {
      setTerminosError('');
    }

    if (hasError) return;

    if (formData.shippingAddressId !== null) {
      localStorage.setItem('selectedAddressId', formData.shippingAddressId.toString());
      localStorage.setItem('paymentMethod', paymentMethod);
      router.push('/redirect');
    }
  };

  useEffect(() => {
    logCreditoRaw({
      KOEN:   '—',
      SUEN:   '—',
      CRSD:   mockLineaCredito.limite,
      CRSDVU: mockLineaCredito.utilizado,
      CRSDVV: 0,
      CRSDCU: 0,
      CRSDCV: 0,
    });
  }, []);

  useEffect(() => {
    fetchPaymentMethods().then((methods) => {
      setPaymentMethods(methods);
      if (methods.length > 0) setPaymentMethod(methods[0].code);
    });
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getUserData();
        setFormData((prev) => ({
          ...prev,
          nombre: userData.name || '',
          rut: userData.rut || '',
          correo: userData.email || '',
          telefono: userData.phone || '',
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="bg-[#f1f5f9] min-h-screen p-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* Formulario de facturación */}
        <div className="w-full lg:w-2/3 bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-2xl font-bold mb-6">Datos de facturación</h2>
          {loadingUser ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-medium">Nombre completo</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 rounded bg-[#EBEFF7]"
                  disabled
                />
              </div>

              <div>
                <label className="block font-medium">Rut</label>
                <RutInput
                  className="w-full p-2 mt-1 rounded bg-[#EBEFF7]"
                  name="rut"
                  value={formData.rut}
                  onChange={handleRutChange}
                  onValidationChange={handleRutValidation}
                  errorMessage="RUT inválido"
                  disabled
                />
              </div>

              <div>
                <label className="block font-medium">Correo electrónico</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className="w-full p-2 mt-1 rounded bg-[#EBEFF7]"
                  disabled
                />
                {errors.correo && (
                  <p className="text-red-500 text-sm mt-1">{errors.correo}</p>
                )}
              </div>

              <div>
                <label className="block font-medium">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={'+56 ' + formData.telefono}
                  className="w-full p-2 mt-1 rounded bg-[#EBEFF7]"
                  disabled
                />
              </div>

              <div className="col-span-1 md:col-span-2 flex items-start gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-md px-3 py-2">
                <InformationCircleIcon width={16} height={16} className="shrink-0 mt-0.5" />
                <p>Si necesitas actualizar tu información personal, por favor comunícate con el soporte.</p>
              </div>

              <div className="col-span-1 md:col-span-2 mt-8">
                <h2 className="text-2xl font-bold mb-2">Información de envío</h2>
              </div>

              <div className="col-span-1 md:col-span-2">
                <ShippingAddressSelect
                  selectedAddressId={formData.shippingAddressId}
                  onChange={(id) => {
                    setFormData({ ...formData, shippingAddressId: id });
                    if (id) setDireccionError('');
                  }}
                />
                {direccionError && (
                  <p className="text-red-500 text-sm mt-1">{direccionError}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Resumen de la orden */}
        <aside className="w-full lg:w-1/3 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Tu Orden</h3>

          <div className="flex justify-between border-t-slate-200 border-t py-5">
            <span>Productos ({totalQuantity})</span>
            <span className="text-black"></span>
          </div>
          <div className="flex justify-between border-t-slate-200 border-t py-5">
            <span className="font-bold">Subtotal</span>
            <span className="font-bold">{formatCLP(subtotal)}</span>
          </div>
          <div className="flex justify-between mb-5">
            <span>Costos de envío</span>
            <span>{formatCLP(shipping)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t-slate-200 border-t py-5">
            <span>Total a pagar</span>
            <span>{formatCLP(total)}</span>
          </div>

          {/* Selección de método de pago */}
          <div className="mb-4 border-t border-slate-200 pt-5">
            <p className="font-bold mb-3">Método de pago</p>

            {paymentMethods.map((method) => {
              const isTransbank = method.code === 'transbank';
              const isSelected = paymentMethod === method.code;
              const saldoDisponible = mockLineaCredito.disponible;
              const saldoInsuficiente = !isTransbank && saldoDisponible < total;

              return (
                <label
                  key={method.id}
                  className={`flex items-start gap-3 p-3 rounded border mb-2 ${
                    saldoInsuficiente
                      ? 'border-slate-200 bg-[#f8f8f8] opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'border-lime-500 bg-[#f0fdf4] cursor-pointer'
                      : 'border-slate-200 bg-white hover:border-slate-300 cursor-pointer'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.code}
                    checked={isSelected}
                    disabled={saldoInsuficiente}
                    onChange={() => !saldoInsuficiente && setPaymentMethod(method.code)}
                    className="mt-1 shrink-0"
                  />
                  {isTransbank ? (
                    <div>
                      <p className="font-bold text-sm">{method.name}</p>
                      <Image
                        width={104}
                        height={27}
                        style={{ width: '130px', height: 'auto' }}
                        src="/assets/global/logo_webpay.png"
                        alt="Webpay"
                        className="my-1"
                        unoptimized
                      />
                      <p className="text-xs text-gray-500">Tarjeta de crédito, débito o Redcompra</p>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <p className="font-bold text-sm">{method.name}</p>
                      <div className="flex items-center gap-2 my-1">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-lime-100 text-lime-600 shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
                            <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-500">
                            Saldo disponible: {formatCLP(saldoDisponible)}
                          </p>
                          {saldoInsuficiente ? (
                            <p className="text-xs text-gray-400">Saldo insuficiente para esta compra</p>
                          ) : (
                            <p className="text-xs text-gray-500">Pago con crédito asignado a tu cuenta</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </label>
              );
            })}
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <input
              type="checkbox"
              name="acepta"
              id="acepta"
              className="mr-2"
              checked={aceptaTerminos}
              onChange={handleCheckboxChange}
            />
            Todos los derechos reservados tankandtrailco.cl
            <br />
            Al comprar aceptas los{' '}
            <span onClick={handleOpenModal} className="text-lime-500 cursor-pointer">
              términos y condiciones
            </span>{' '}
            de tankandtrailco.cl
            {terminosError && (
              <p className="text-red-500 text-sm mt-1">{terminosError}</p>
            )}
          </div>

          <button
            onClick={goNext}
            className="w-full bg-lime-500 hover:bg-lime-600 text-white py-2 rounded cursor-pointer"
          >
            Finalizar compra
          </button>
        </aside>
      </div>
    </div>
  );
}
