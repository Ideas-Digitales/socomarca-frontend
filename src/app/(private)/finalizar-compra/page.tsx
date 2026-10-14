'use client';
import { useEffect, useState } from 'react';
import { unstable_rethrow, useRouter } from 'next/navigation';
import RutInput from '@/app/components/global/RutInputVisualIndicators';
import Image from 'next/image';
import useStore from '@/stores/base';
import TerminosYCondicionesContent from '@/app/components/global/TerminosYCondicionesContent';
import { getUserData, getUserCreditLine } from '@/services/actions/user.actions';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';
import ShippingAddressCard from '@/app/components/user/ShippingAddressCard';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { fetchPaymentMethods, type PaymentMethod } from '@/services/actions/payment.actions';
import { logCreditoRaw } from '@/app/components/mi-cuenta/LineaCreditoSection';
import useAuthStore from '@/stores/useAuthStore';
import { fetchAllBranches } from '@/services/actions/branches.actions';
import { branchTypeLabel, type Branch, type BranchType } from '@/interfaces/branch.interface';
import { getUserAddresses, type Address } from '@/services/actions/addressees.actions';
import { buildVatBreakdown } from '@/utils/vat';

type PaymentMethodCode = string;

const formatCLP = (value: number) =>
  value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });
const FREE_SHIPPING_MINIMUM = 70000;
const configuredShippingCost = Number(process.env.NEXT_PUBLIC_FIXED_SHIPPING_COST);
const FIXED_SHIPPING_COST = Number.isFinite(configuredShippingCost) ? configuredShippingCost : 5990;

const branchOptionLabel = (branch: Branch) =>
  [branch.name, branch.branch_code, branchTypeLabel(branch.branch_type)]
    .filter(Boolean)
    .join(' · ');

// Cada sucursal despacha a su dirección sincronizada desde Random
const pickShippingAddress = (addresses: Address[]): Address | null =>
  addresses.find((address) => address.is_synced) ??
  addresses.find((address) => address.is_default) ??
  addresses[0] ??
  null;

export default function FinalizarCompraPage() {
  const router = useRouter();
  const cartProducts = useStore((state) => state.cartProducts);
  const vatRate = useStore((state) => state.vatRate);
  const fetchVatRate = useStore((state) => state.fetchVatRate);
  const [loadingUser, setLoadingUser] = useState(true);
  const { openModal } = useStore();
  const { user } = useAuthStore();
  const [terminosError, setTerminosError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodCode>('transbank');
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [creditoDisponible, setCreditoDisponible] = useState<number | null>(null);
  const [creditoBloqueado, setCreditoBloqueado] = useState(false);
  const [creditoLoading, setCreditoLoading] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    correo: '',
    telefono: '',
  });
  const [aceptaTerminos, setAceptaTerminos] = useState(true);
  // `null` mientras no responde GET /profile: se usa el valor de la sesión
  const [profileCanOrderForBranches, setProfileCanOrderForBranches] = useState<boolean | null>(null);
  const [profileBranchType, setProfileBranchType] = useState<BranchType | null>(null);
  const [ownAddress, setOwnAddress] = useState<Address | null>(null);
  const [ownAddressLoading, setOwnAddressLoading] = useState(true);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [branchesError, setBranchesError] = useState('');
  // `null` = la propia sucursal: se compra para el usuario y no se envía customer_id
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [paymentDocumentType, setPaymentDocumentType] = useState<'invoice' | 'receipt'>('receipt');
  const [notes, setNotes] = useState('');
  const [docTypeError, setDocTypeError] = useState('');

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
  // Los precios del carrito llegan netos; el IVA se calcula acá con la tasa
  // vigente para que el resumen coincida con la orden que devuelve el backend.
  const netSubtotal = cartProducts.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const shipping = netSubtotal >= FREE_SHIPPING_MINIMUM ? 0 : FIXED_SHIPPING_COST;
  const {
    subtotal,
    vatAmount,
    amount: total,
  } = buildVatBreakdown(netSubtotal, vatRate, shipping);

  const canOrderForBranches = profileCanOrderForBranches ?? user.can_order_for_branches;
  const selectedBranch = customerId != null
    ? branches.find((branch) => branch.id === customerId) ?? null
    : null;
  const ownBranchLabel = [
    formData.nombre,
    branchTypeLabel(profileBranchType ?? user.branch_type),
  ]
    .filter(Boolean)
    .join(' · ');
  const shippingAddress = selectedBranch
    ? pickShippingAddress(selectedBranch.addresses ?? [])
    : ownAddress;
  const addressLoading = !selectedBranch && ownAddressLoading;
  const canPay = !addressLoading && shippingAddress != null;

  const handleCustomerChange = (value: string) => {
    const id = value ? Number(value) : null;
    const branch = id != null ? branches.find((b) => b.id === id) : undefined;

    setCustomerId(branch ? branch.id : null);
  };

  const handleOpenModal = () => {
    openModal('', {
      content: <TerminosYCondicionesContent />,
      showCloseButton: true,
      size: 'xl',
    });
  };

  const goNext = () => {
    // Sin dirección la tarjeta de envío ya explica por qué no se puede pagar
    let hasError = !canPay;

    if (!aceptaTerminos) {
      setTerminosError('Debes aceptar los términos y condiciones.');
      hasError = true;
    } else {
      setTerminosError('');
    }

    if (!paymentDocumentType) {
      setDocTypeError('Selecciona un tipo de documento.');
      hasError = true;
    } else {
      setDocTypeError('');
    }

    if (hasError) return;

    if (shippingAddress) {
      localStorage.setItem('selectedAddressId', shippingAddress.id.toString());
      localStorage.setItem('paymentMethod', paymentMethod);
      localStorage.setItem('paymentDocumentType', paymentDocumentType);
      localStorage.removeItem('branchId');
      if (selectedBranch) localStorage.setItem('customerId', selectedBranch.id.toString());
      else localStorage.removeItem('customerId');
      if (notes.trim()) localStorage.setItem('notes', notes.trim());
      else localStorage.removeItem('notes');
      router.push('/redirect');
    }
  };

  useEffect(() => {
    if (!user?.id) {
      setCreditoLoading(false);
      return;
    }

    setCreditoLoading(true);
    getUserCreditLine(user.id).then((res) => {
      if (res.success && res.data) {
        logCreditoRaw(res.data as unknown as Record<string, unknown>);
        setCreditoDisponible(Math.max(res.data.CRSD - res.data.CRSDVU, 0));
        setCreditoBloqueado(res.data.status === 'blocked');
      } else {
        setCreditoDisponible(null);
        setCreditoBloqueado(false);
      }
      setCreditoLoading(false);
    });
  }, [user?.id]);

  // El checkout puede abrirse sin pasar por el catálogo, que es quien deja la
  // tasa en el store.
  useEffect(() => {
    fetchVatRate();
  }, [fetchVatRate]);

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
        setProfileCanOrderForBranches(Boolean(userData.can_order_for_branches));
        setProfileBranchType(userData.branch_type ?? null);
      } catch (error) {
        unstable_rethrow(error);
        console.error('Error fetching user data:', error);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    getUserAddresses()
      .then((addresses) => setOwnAddress(pickShippingAddress(addresses ?? [])))
      .finally(() => setOwnAddressLoading(false));
  }, []);

  useEffect(() => {
    if (loadingUser || !canOrderForBranches) return;

    setBranchesLoading(true);
    fetchAllBranches()
      .then((res) => {
        if (res.ok && res.data) {
          setBranches(res.data);
          setBranchesError('');
        } else {
          setBranches([]);
          setBranchesError('No se pudieron cargar las sucursales. Solo puedes comprar para tu sucursal.');
        }
      })
      .finally(() => setBranchesLoading(false));
  }, [loadingUser, canOrderForBranches]);

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

              {canOrderForBranches && (
                <div className="col-span-1 md:col-span-2">
                  <label htmlFor="customer" className="block font-medium">Sucursal</label>
                  <select
                    id="customer"
                    value={customerId ?? ''}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                    disabled={branchesLoading}
                    className="w-full p-2 mt-1 rounded bg-[#EBEFF7]"
                  >
                    <option value="">{ownBranchLabel || 'Mi sucursal'}</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branchOptionLabel(branch)}
                      </option>
                    ))}
                  </select>
                  {branchesLoading && (
                    <p className="text-sm text-gray-500 mt-1">Cargando sucursales...</p>
                  )}
                  {branchesError && (
                    <p className="text-red-500 text-sm mt-1">{branchesError}</p>
                  )}
                  {selectedBranch && (
                    <p className="text-sm text-gray-500 mt-1">
                      El pedido se despacha a {selectedBranch.name} y se paga y factura a tu nombre.
                    </p>
                  )}
                </div>
              )}

              <div className="col-span-1 md:col-span-2 flex items-start gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm rounded-md px-3 py-2">
                <InformationCircleIcon width={16} height={16} className="shrink-0 mt-0.5" />
                <p>Si necesitas actualizar tu información personal, por favor comunícate con el soporte.</p>
              </div>

              <div className="col-span-1 md:col-span-2 mt-8">
                <h2 className="text-2xl font-bold mb-2">Información de envío</h2>
              </div>

              <div className="col-span-1 md:col-span-2">
                <ShippingAddressCard address={shippingAddress} loading={addressLoading} />
              </div>

              <div className="col-span-1 md:col-span-2 mt-6">
                <p className="font-medium mb-2">Tipo de documento</p>
                <div className="flex gap-4">
                  <label className={`flex items-center gap-2 p-3 rounded border cursor-pointer ${
                    paymentDocumentType === 'receipt'
                      ? 'border-lime-500 bg-[#f0fdf4]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentDocumentType"
                      value="receipt"
                      checked={paymentDocumentType === 'receipt'}
                      onChange={() => { setPaymentDocumentType('receipt'); setDocTypeError(''); }}
                      className="shrink-0"
                    />
                    <span className="text-sm font-medium">Boleta</span>
                  </label>
                  <label className={`flex items-center gap-2 p-3 rounded border cursor-pointer ${
                    paymentDocumentType === 'invoice'
                      ? 'border-lime-500 bg-[#f0fdf4]'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentDocumentType"
                      value="invoice"
                      checked={paymentDocumentType === 'invoice'}
                      onChange={() => { setPaymentDocumentType('invoice'); setDocTypeError(''); }}
                      className="shrink-0"
                    />
                    <span className="text-sm font-medium">Factura</span>
                  </label>
                </div>
                {docTypeError && (
                  <p className="text-red-500 text-sm mt-1">{docTypeError}</p>
                )}
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block font-medium">Notas del pedido</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Dejar en portería"
                  rows={3}
                  className="w-full p-2 mt-1 rounded bg-[#EBEFF7] resize-none"
                />
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
            <span className="font-bold">Subtotal (neto)</span>
            <span className="font-bold">{formatCLP(subtotal)}</span>
          </div>
          <div className="flex justify-between mb-5">
            <span>IVA ({vatRate}%)</span>
            <span>{formatCLP(vatAmount)}</span>
          </div>
          <div className="flex justify-between mb-5">
            <span>Costos de envío</span>
            <span className={shipping === 0 ? 'text-lime-600 font-semibold' : ''}>
              {shipping === 0 ? 'Gratis' : formatCLP(shipping)}
            </span>
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
              const isCreditoOption = !isTransbank;
              const saldoDisponible = creditoDisponible ?? 0;
              const saldoInsuficiente =
                isCreditoOption && creditoDisponible !== null && saldoDisponible < total;
              const optionDisabled =
                isCreditoOption &&
                (creditoLoading ||
                  creditoDisponible === null ||
                  creditoBloqueado ||
                  saldoInsuficiente);

              return (
                <label
                  key={method.id}
                  className={`flex items-start gap-3 p-3 rounded border mb-2 ${
                    optionDisabled
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
                    disabled={optionDisabled}
                    onChange={() => !optionDisabled && setPaymentMethod(method.code)}
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
                      <p className="font-bold text-sm">Línea de Crédito</p>
                      <div className="flex items-center gap-2 my-1">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-lime-100 text-lime-600 shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" />
                            <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-18 3.75a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          {creditoLoading ? (
                            <p className="text-xs font-semibold text-gray-500">
                              Cargando saldo disponible...
                            </p>
                          ) : creditoDisponible === null ? (
                            <p className="text-xs font-semibold text-gray-500">
                              Saldo no disponible
                            </p>
                          ) : (
                            <>
                              <p className="text-xs font-semibold text-gray-500">
                                Saldo disponible: {formatCLP(saldoDisponible)}
                              </p>
                              {creditoBloqueado ? (
                                <p className="text-xs text-amber-700">
                                  Tu pago anterior aún se está facturando. Intenta más tarde.
                                </p>
                              ) : saldoInsuficiente ? (
                                <p className="text-xs text-gray-400">Saldo insuficiente para esta compra</p>
                              ) : (
                                <p className="text-xs text-gray-500">Pago con crédito asignado a tu cuenta</p>
                              )}
                            </>
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
            Todos los derechos reservados appsocomarca.cl
            <br />
            Al comprar aceptas los{' '}
            <span onClick={handleOpenModal} className="text-lime-500 cursor-pointer">
              términos y condiciones
            </span>{' '}
            de appsocomarca.cl
            {terminosError && (
              <p className="text-red-500 text-sm mt-1">{terminosError}</p>
            )}
          </div>

          <button
            onClick={goNext}
            disabled={!canPay}
            className="w-full bg-lime-500 hover:bg-lime-600 text-white py-2 rounded cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Finalizar compra
          </button>
        </aside>
      </div>
    </div>
  );
}
