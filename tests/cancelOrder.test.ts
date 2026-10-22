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
  mapOrderPayments,
  parseCancelOrderResponse,
  showsCancelOrderMenu,
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
  it('un pedido propio a crédito en processing se puede cancelar', () => {
    assert.equal(
      canCancelOwnOrder({
        emitidoPor: null,
        estado: 'completed',
        pagos: mapOrderPayments([
          {
            status: 'processing',
            payment_method: { code: 'random_credit' },
          },
        ]),
      }),
      true
    );
  });

  it('basta un pago a crédito en processing entre otros pagos', () => {
    assert.equal(
      canCancelOwnOrder({
        emitidoPor: null,
        estado: 'completed',
        pagos: [
          { code: 'webpay', status: 'failed' },
          { code: 'random_credit', status: 'processing' },
        ],
      }),
      true
    );
  });

  it('un pedido emitido por otra sucursal no se puede cancelar', () => {
    assert.equal(
      canCancelOwnOrder({
        emitidoPor: 'Sucursal Norte',
        estado: 'completed',
        pagos: [{ code: 'random_credit', status: 'processing' }],
      }),
      false
    );
  });

  it('un pedido cancelado, uno Webpay y un crédito ya cobrado no muestran la acción', () => {
    const hidden = [
      {
        emitidoPor: null,
        estado: 'canceled',
        pagos: [{ code: 'random_credit', status: 'processing' }],
      },
      {
        emitidoPor: null,
        estado: 'completed',
        pagos: [{ code: 'webpay', status: 'completed' }],
      },
      {
        emitidoPor: null,
        estado: 'completed',
        pagos: [{ code: 'random_credit', status: 'completed' }],
      },
    ];

    for (const order of hidden) {
      assert.equal(canCancelOwnOrder(order), false);
    }
  });

  it('se queda con el código y el estado del pago', () => {
    assert.deepEqual(
      mapOrderPayments([
        {
          status: 'processing',
          payment_method: { code: 'random_credit' },
        },
      ]),
      [{ code: 'random_credit', status: 'processing' }]
    );
    assert.deepEqual(mapOrderPayments(undefined), []);
    assert.deepEqual(
      mapOrderPayments([{ status: 'processing', payment_method: null }]),
      []
    );
  });
});
