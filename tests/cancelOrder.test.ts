import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { PERMISOS } from '../src/configs/permisos.ts';
import {
  CANCEL_ORDER_MENU_LABEL,
  CANCEL_ORDER_PATH,
  CANCEL_ORDER_PERMISSIONS,
  buildCancelOrderBody,
  canAccessCancelOrder,
  canCancelOwnOrder,
  cancellationSecondsLeft,
  formatCancellationRemaining,
  parseCancelOrderResponse,
  showsCancelOrderMenu,
  visibleCancellationSeconds,
} from '../src/utils/cancelOrder.ts';

const bothPermissions = [PERMISOS.ORDERS.READ_ALL, PERMISOS.ORDERS.CANCEL];

describe('permisos de órdenes', () => {
  it('usa los mismos nombres que el catálogo de permisos', () => {
    assert.deepEqual(CANCEL_ORDER_PERMISSIONS, [
      PERMISOS.ORDERS.READ_ALL,
      PERMISOS.ORDERS.CANCEL,
    ]);
  });
});

describe('menú de cancelar orden', () => {
  it('aparece para admin y superadmin en /admin/cancelar-orden', () => {
    assert.equal(CANCEL_ORDER_MENU_LABEL, 'Cancelar orden');
    assert.equal(CANCEL_ORDER_PATH, '/admin/cancelar-orden');
    assert.equal(showsCancelOrderMenu('admin'), true);
    assert.equal(showsCancelOrderMenu('superadmin'), true);
  });

  it('no aparece para otros roles', () => {
    for (const role of ['cliente', 'customer', 'supervisor', 'editor', 'developer', '', null]) {
      assert.equal(showsCancelOrderMenu(role), false);
      assert.equal(canAccessCancelOrder(role, bothPermissions), false);
    }
  });
});

describe('acceso a la pantalla', () => {
  it('exige read-all-orders y cancel-orders juntos', () => {
    assert.equal(canAccessCancelOrder('admin', bothPermissions), true);
    assert.equal(canAccessCancelOrder('superadmin', bothPermissions), true);
    assert.equal(canAccessCancelOrder('admin', [PERMISOS.ORDERS.READ_ALL]), false);
    assert.equal(canAccessCancelOrder('admin', [PERMISOS.ORDERS.CANCEL]), false);
    assert.equal(canAccessCancelOrder('superadmin', []), false);
    assert.equal(canAccessCancelOrder('admin', null), false);
  });
});

describe('POST /orders/cancel', () => {
  it('envía order_number numérico', () => {
    assert.deepEqual(buildCancelOrderBody(' 1234 '), { order_number: 1234 });
  });

  it('deja pasar un número vacío o inválido para que responda la API', () => {
    assert.deepEqual(buildCancelOrderBody('   '), { order_number: null });
    assert.deepEqual(buildCancelOrderBody('12a'), { order_number: '12a' });
  });

  it('un 200 confirma con el mensaje de la respuesta', () => {
    const result = parseCancelOrderResponse(200, {
      data: { id: 1234, status: 'canceled' },
      message: 'La orden fue cancelada.',
    });

    assert.equal(result.ok, true);
    assert.equal(result.message, 'La orden fue cancelada.');
    assert.equal(result.fieldErrors, undefined);
  });

  it('un 422 muestra errors.order_number y omite message si hay detalle', () => {
    const result = parseCancelOrderResponse(422, {
      message: 'The order cannot be canceled because it already has an invoice (FCV).',
      errors: {
        order_number: [
          'The order cannot be canceled because it already has an invoice (FCV).',
        ],
      },
    });

    assert.equal(result.ok, false);
    assert.equal(result.message, null);
    assert.deepEqual(result.fieldErrors?.order_number, [
      'The order cannot be canceled because it already has an invoice (FCV).',
    ]);
  });

  it('un 422 sin detalle de campo muestra message', () => {
    const result = parseCancelOrderResponse(422, {
      message: 'The order number field is required.',
      errors: {},
    });

    assert.equal(result.ok, false);
    assert.equal(result.message, 'The order number field is required.');
    assert.equal(result.fieldErrors, undefined);
  });

  it('un 403 muestra message', () => {
    const result = parseCancelOrderResponse(403, {
      message: 'You do not have permission.',
    });

    assert.equal(result.ok, false);
    assert.equal(result.message, 'You do not have permission.');
    assert.equal(result.fieldErrors, undefined);
  });

  it('un error de texto plano conserva el cuerpo de la API', () => {
    const result = parseCancelOrderResponse(
      500,
      'Random ERP rejected the deletion'
    );

    assert.equal(result.ok, false);
    assert.equal(result.message, 'Random ERP rejected the deletion');
  });
});

describe('cancelar un pedido propio desde Mis compras', () => {
  const now = Date.parse('2026-10-22T12:00:00.000Z');
  const until = '2026-10-22T13:00:00.000Z';

  it('un plazo con segundos restantes ofrece cancelar', () => {
    const left = visibleCancellationSeconds(until, 3600, now);

    assert.equal(left, 3600);
    assert.equal(canCancelOwnOrder(left), true);
    assert.equal(formatCancellationRemaining(left ?? 0), 'Quedan 60 min');
  });

  it('null o cero no ofrecen cancelar', () => {
    assert.equal(canCancelOwnOrder(null), false);
    assert.equal(canCancelOwnOrder(0), false);
    assert.equal(visibleCancellationSeconds(null, null, now), null);
    assert.equal(visibleCancellationSeconds(null, 0, now), 0);
  });

  it('al llegar cancelable_until el botón deja de mostrarse', () => {
    const deadline = Date.parse(until);
    const left = cancellationSecondsLeft(until, deadline);

    assert.equal(left, 0);
    assert.equal(canCancelOwnOrder(left), false);
    assert.equal(
      visibleCancellationSeconds(until, 3600, deadline + 1000),
      0
    );
  });

  it('cuenta desde la fecha y no desde el valor inicial ya vencido', () => {
    const later = Date.parse('2026-10-22T12:30:00.000Z');

    assert.equal(visibleCancellationSeconds(until, 3600, later), 1800);
    assert.equal(formatCancellationRemaining(1800), 'Quedan 30 min');
    assert.equal(formatCancellationRemaining(90), 'Quedan 1 min 30 s');
    assert.equal(formatCancellationRemaining(12), 'Quedan 12 s');
  });
});
