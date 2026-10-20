import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_PAYMENT_DOCUMENT_TYPE,
  PAYMENT_DOCUMENT_OPTIONS,
} from "../src/utils/paymentDocument.ts";

describe("tipo de documento del checkout", () => {
  it("muestra Factura antes que Boleta", () => {
    assert.deepEqual(
      PAYMENT_DOCUMENT_OPTIONS.map((option) => option.label),
      ["Factura", "Boleta"],
    );
  });

  it("envía invoice para Factura y receipt para Boleta", () => {
    assert.deepEqual(
      PAYMENT_DOCUMENT_OPTIONS.map((option) => option.value),
      ["invoice", "receipt"],
    );
  });

  it("deja Boleta seleccionada por defecto", () => {
    assert.equal(DEFAULT_PAYMENT_DOCUMENT_TYPE, "receipt");
  });
});
