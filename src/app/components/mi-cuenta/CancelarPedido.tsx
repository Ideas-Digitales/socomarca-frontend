"use client";

import { useEffect, useState } from "react";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { cancelOrder } from "@/services/actions/order.actions";
import {
  canCancelOwnOrder,
  formatCancellationRemaining,
  visibleCancellationSeconds,
} from "@/utils/cancelOrder";

interface CancelarPedidoProps {
  compra: {
    numero: string;
    cancelableUntil: string | null;
    cancelSecondsRemaining: number | null;
  };
  onCanceled: (numero: string) => Promise<void> | void;
  /** En el detalle el botón ocupa el ancho del resumen. En el listado va en la fila de acciones. */
  fullWidth?: boolean;
}

export default function CancelarPedido({
  compra,
  onCanceled,
  fullWidth = false,
}: CancelarPedidoProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    if (!compra.cancelableUntil) return;

    const tick = () => setNowMs(Date.now());
    tick();
    const id = window.setInterval(tick, 1000);

    return () => window.clearInterval(id);
  }, [compra.cancelableUntil]);

  const secondsLeft = visibleCancellationSeconds(
    compra.cancelableUntil,
    compra.cancelSecondsRemaining,
    nowMs
  );
  const canCancel = canCancelOwnOrder(secondsLeft);
  const hasFeedback = Boolean(successMessage || formError || fieldErrors.length > 0);

  const clearFeedback = () => {
    setFieldErrors([]);
    setFormError("");
    setSuccessMessage("");
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    clearFeedback();

    const result = await cancelOrder(compra.numero);

    if (result.ok) {
      setSuccessMessage(result.message ?? "");
      setIsConfirmOpen(false);
      await onCanceled(compra.numero);
    } else {
      setFieldErrors(result.fieldErrors?.order_number ?? []);
      setFormError(result.message ?? "");
      setIsConfirmOpen(false);
    }

    setIsSubmitting(false);
  };

  if (!canCancel && !hasFeedback) return null;

  const button = canCancel ? (
    <button
      type="button"
      onClick={() => {
        clearFeedback();
        setIsConfirmOpen(true);
      }}
      disabled={isSubmitting}
      data-cy="cancel-own-order"
      className={`${
        fullWidth ? "w-full py-2" : "px-4 py-2 text-sm"
      } rounded text-white ${
        isSubmitting
          ? "bg-red-300 cursor-not-allowed"
          : "bg-red-500 hover:bg-red-600"
      }`}
    >
      {isSubmitting ? "Cancelando..." : "Cancelar pedido"}
    </button>
  ) : null;

  const remaining =
    canCancel && secondsLeft != null ? (
      <p
        className={`text-sm text-gray-500 ${fullWidth ? "" : "self-center"}`}
        data-cy="cancel-own-order-remaining"
      >
        {formatCancellationRemaining(secondsLeft)}
      </p>
    ) : null;

  const feedback = hasFeedback ? (
    <div className={fullWidth ? undefined : "basis-full"}>
      {fieldErrors.length > 0 && (
        <ul className="space-y-1" data-cy="cancel-own-order-field-errors">
          {fieldErrors.map((error) => (
            <li key={error} className="text-sm text-red-600">
              {error}
            </li>
          ))}
        </ul>
      )}
      {formError && (
        <p className="text-sm text-red-600" data-cy="cancel-own-order-error">
          {formError}
        </p>
      )}
      {successMessage && (
        <p
          className="flex items-center gap-2 text-sm text-lime-600"
          data-cy="cancel-own-order-success"
        >
          <CheckCircleIcon className="w-5 h-5 shrink-0" />
          {successMessage}
        </p>
      )}
    </div>
  ) : null;

  const modal = isConfirmOpen ? (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4 sm:px-0">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`cancel-own-order-title-${compra.numero}`}
        className="bg-white rounded-lg shadow p-6 max-w-md w-full"
      >
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-500 mt-1 shrink-0" />
          <div>
            <h2
              id={`cancel-own-order-title-${compra.numero}`}
              className="text-lg font-bold text-gray-800"
            >
              ¿Cancelar el pedido Nº {compra.numero}?
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Se anulará el pedido Nº {compra.numero}. Esta acción no se puede
              deshacer desde el sitio.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => setIsConfirmOpen(false)}
            disabled={isSubmitting}
            data-cy="cancel-own-order-back"
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-60"
          >
            Volver
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            data-cy="cancel-own-order-confirm"
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-60"
          >
            {isSubmitting ? "Cancelando..." : "Confirmar cancelación"}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  if (fullWidth) {
    return (
      <div className="mt-3 space-y-3">
        {button}
        {remaining}
        {feedback}
        {modal}
      </div>
    );
  }

  return (
    <>
      {button}
      {remaining}
      {feedback}
      {modal}
    </>
  );
}
