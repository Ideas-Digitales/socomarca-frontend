'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import useAuthStore from '@/stores/useAuthStore';
import LoadingSpinner from '@/app/components/global/LoadingSpinner';
import { cancelOrder } from '@/services/actions/order.actions';
import { canAccessCancelOrder } from '@/utils/cancelOrder';

/**
 * Cancela una orden que está en espera de factura (FCV).
 * Solo admin y superadmin, con `read-all-orders` y `cancel-orders`.
 */
export default function CancelarOrdenPage() {
  const router = useRouter();
  const { getUserRole, getUserPermissions } = useAuthStore();

  const [hasAccess, setHasAccess] = useState(false);
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(true);
  const [orderNumber, setOrderNumber] = useState('');
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!canAccessCancelOrder(getUserRole(), getUserPermissions())) {
      router.push('/acceso-denegado');
      return;
    }

    setHasAccess(true);
    setIsCheckingPermissions(false);
  }, [getUserPermissions, getUserRole, router]);

  const clearFeedback = () => {
    setFieldErrors([]);
    setFormError('');
    setSuccessMessage('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    clearFeedback();
    setIsConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    clearFeedback();

    const result = await cancelOrder(orderNumber);

    if (result.ok) {
      setOrderNumber('');
      setSuccessMessage(result.message ?? '');
      setIsConfirmOpen(false);
    } else {
      setFieldErrors(result.fieldErrors?.order_number ?? []);
      setFormError(result.message ?? '');
      setIsConfirmOpen(false);
    }

    setIsSubmitting(false);
  };

  if (isCheckingPermissions || !hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Cancelar orden</h1>
      <p className="text-sm text-gray-600 mb-6">
        Cancela una orden que está en espera de factura. Se elimina la nota de
        venta en Random y no se puede deshacer desde esta pantalla.
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6">
        <label htmlFor="order-number" className="block text-sm font-semibold mb-2">
          Número de orden
        </label>
        <input
          id="order-number"
          name="order_number"
          inputMode="numeric"
          autoComplete="off"
          value={orderNumber}
          disabled={isSubmitting}
          data-cy="cancel-order-number"
          onChange={(event) => {
            setOrderNumber(event.target.value);
            clearFeedback();
          }}
          className="w-full md:w-48 p-2 rounded bg-[#EBEFF7] disabled:opacity-60"
        />

        {fieldErrors.length > 0 && (
          <ul className="mt-3 space-y-1" data-cy="cancel-order-field-errors">
            {fieldErrors.map((error) => (
              <li key={error} className="text-sm text-red-600">
                {error}
              </li>
            ))}
          </ul>
        )}

        {formError && (
          <p className="text-sm text-red-600 mt-3" data-cy="cancel-order-error">
            {formError}
          </p>
        )}

        {successMessage && (
          <p
            className="flex items-center gap-2 text-sm text-lime-600 mt-3"
            data-cy="cancel-order-success"
          >
            <CheckCircleIcon className="w-5 h-5" />
            {successMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          data-cy="cancel-order-submit"
          className={`mt-6 px-6 py-2 rounded text-white ${
            isSubmitting
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600'
          }`}
        >
          Cancelar orden
        </button>
      </form>

      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4 sm:px-0">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-order-confirm-title"
            className="bg-white rounded-lg shadow p-6 max-w-md w-full"
          >
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mt-1 shrink-0" />
              <div>
                <h2
                  id="cancel-order-confirm-title"
                  className="text-lg font-bold text-gray-800"
                >
                  ¿Cancelar la orden {orderNumber.trim() || 'ingresada'}?
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Se eliminará la nota de venta en Random. Esta acción no se
                  puede deshacer desde esta pantalla.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsConfirmOpen(false)}
                disabled={isSubmitting}
                data-cy="cancel-order-back"
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-60"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
                data-cy="cancel-order-confirm"
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-60"
              >
                {isSubmitting ? 'Cancelando...' : 'Confirmar cancelación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
