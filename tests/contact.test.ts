import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  contactFieldErrors,
  canCheckoutWithContact,
  contactCheckoutBranchLabel,
  contactCheckoutLabel,
  contactOwnershipLabel,
  contactPayload,
  isOwnContact,
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
  branchUserId: 8,
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

  it("exige los campos que Random guarda del contacto y deja la sucursal al backend", () => {
    const errors = contactFieldErrors({
      rut: "",
      name: "",
      email: "",
      phone: "",
      branchUserId: null,
      authorized: false,
      address: "",
    });

    assert.ok(errors.rut);
    assert.ok(errors.name);
    assert.ok(errors.email);
    assert.ok(errors.phone);
    assert.equal(errors.branchUserId, undefined);
    assert.ok(errors.address);
  });

  it("limita la dirección a 50 caracteres", () => {
    const errors = contactFieldErrors({
      ...validDraft(),
      address: "a".repeat(51),
    });

    assert.match(errors.address, /50/);
  });
});

describe("contacto en el checkout", () => {
  const contact = {
    name: "Ana Pérez",
    rut: "11111111-1",
    user_id: 20,
    authorized: true,
    branch: { name: "Local Norte", branch_code: "L01", branch_type: "S" },
  };

  it("distingue el contacto propio del de una sucursal secundaria", () => {
    assert.equal(isOwnContact(contact, 20), true);
    assert.equal(isOwnContact(contact, 8), false);
    assert.equal(contactOwnershipLabel(contact, 20), "Mi sucursal");
    assert.equal(contactOwnershipLabel(contact, 8), "Local Norte");
    assert.equal(contactCheckoutBranchLabel(contact, 20), "Mi sucursal");
    assert.equal(contactCheckoutBranchLabel(contact, 8), "L01");
    assert.equal(
      contactCheckoutLabel(contact, 20),
      "Ana Pérez · 11111111-1 · Mi sucursal",
    );
    assert.equal(
      contactCheckoutLabel(contact, 8),
      "Ana Pérez · 11111111-1 · L01",
    );
  });

  it("usa el nombre de la sucursal si el contacto no tiene código", () => {
    const withoutCode = { ...contact, branch: { name: "Local Norte", branch_code: null } };

    assert.equal(contactCheckoutBranchLabel(withoutCode, 8), "Local Norte");
    assert.equal(
      contactCheckoutLabel(withoutCode, 8),
      "Ana Pérez · 11111111-1 · Local Norte",
    );
  });

  it("marca y bloquea al contacto no autorizado", () => {
    assert.equal(canCheckoutWithContact(contact), true);
    assert.equal(canCheckoutWithContact({ authorized: false }), false);
    assert.match(
      contactCheckoutLabel({ ...contact, authorized: false }),
      /No autorizado/,
    );
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

  it("arma el alta con el RUT normalizado y sin sucursal", () => {
    const payload = contactPayload(validDraft());
    assert.equal(payload.rut, "11111111-1");
    assert.equal("user_id" in payload, false);
  });

  it("envía user_id cuando la principal elige sucursal", () => {
    assert.equal(contactPayload(validDraft(), true).user_id, 8);
  });
});
