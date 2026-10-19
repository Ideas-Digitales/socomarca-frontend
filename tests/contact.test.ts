import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  contactFieldErrors,
  contactPayload,
  isValidContactRut,
  normalizeContactRut,
  payOrderBody,
  type ContactDraft,
} from "../src/utils/contact.ts";

const validDraft = (): ContactDraft => ({
  rut: "11.111.111-1",
  name: "Ana Pérez",
  email: "ana@cliente.cl",
  phone: "+56912345678",
  branchCode: "1",
  authorized: true,
  address: "San Francisco 22",
});

describe("RUT de contacto", () => {
  it("normaliza el RUT sin puntos", () => {
    assert.equal(normalizeContactRut("11.111.111-1"), "11111111-1");
    assert.equal(isValidContactRut("11.111.111-1"), true);
    assert.equal(isValidContactRut("11.111.111-2"), false);
  });
});

describe("validación del contacto", () => {
  it("acepta un contacto completo", () => {
    assert.deepEqual(contactFieldErrors(validDraft()), {});
  });

  it("exige los campos que Random guarda del contacto", () => {
    const errors = contactFieldErrors({
      rut: "",
      name: "",
      email: "",
      phone: "",
      branchCode: "",
      authorized: false,
      address: "",
    });

    assert.ok(errors.rut);
    assert.ok(errors.name);
    assert.ok(errors.email);
    assert.ok(errors.phone);
    assert.ok(errors.branchCode);
    assert.ok(errors.address);
  });

  it("limita sucursal y dirección", () => {
    const errors = contactFieldErrors({
      ...validDraft(),
      branchCode: "L001",
      address: "a".repeat(51),
    });

    assert.match(errors.branchCode, /3/);
    assert.match(errors.address, /50/);
  });
});

describe("cuerpo de POST /orders/pay", () => {
  const base = {
    shippingAddressId: 10,
    paymentMethod: "transbank",
    paymentDocumentType: "receipt" as const,
  };

  it("omite contact_id cuando no hay contacto", () => {
    assert.deepEqual(payOrderBody(base), {
      address_id: 10,
      payment_method: "transbank",
      payment_document_type: "receipt",
    });
    assert.equal("contact_id" in payOrderBody({ ...base, contactId: null }), false);
  });

  it("incluye contact_id cuando hay un contacto elegido", () => {
    assert.equal(payOrderBody({ ...base, contactId: 7 }).contact_id, 7);
  });

  it("arma el alta con el RUT normalizado", () => {
    assert.equal(contactPayload(validDraft()).rut, "11111111-1");
    assert.equal(contactPayload(validDraft()).branch_code, "1");
  });
});
