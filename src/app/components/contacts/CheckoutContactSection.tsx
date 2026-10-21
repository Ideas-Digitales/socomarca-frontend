"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import ContactForm, { emptyContactDraft } from "@/app/components/contacts/ContactForm";
import { useContactBranches } from "@/hooks/useContactBranches";
import {
  createContact,
  getContacts,
  type Contact,
} from "@/services/actions/contacts.actions";
import {
  canCheckoutWithContact,
  contactCheckoutBranchLabel,
  contactCheckoutLabel,
  contactFieldErrors,
  contactPayload,
  type ContactDraft,
} from "@/utils/contact";

export type ContactMode = "none" | "existing" | "create";

export interface CheckoutContactHandle {
  /** `null` cuando se paga sin contacto. `undefined` cuando la selección o el alta fallan. */
  resolveContactId: () => Promise<number | null | undefined>;
}

const optionClass = (active: boolean) =>
  `flex items-center gap-2 p-3 rounded border cursor-pointer ${
    active
      ? "border-lime-500 bg-[#f0fdf4]"
      : "border-slate-200 bg-white hover:border-slate-300"
  }`;

const CheckoutContactSection = forwardRef<CheckoutContactHandle>(function CheckoutContactSection(_props, ref) {
  const [mode, setMode] = useState<ContactMode>("none");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [contactId, setContactId] = useState<number | null>(null);
  const [draft, setDraft] = useState<ContactDraft>({
    ...emptyContactDraft(),
    authorized: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const { options: branches, ownUserId } = useContactBranches();
  const selectedContact = contacts.find((contact) => contact.id === contactId) ?? null;

  useEffect(() => {
    getContacts().then((data) => {
      setContacts(data ?? []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const id = branches?.[0]?.id ?? null;
    if (!id) return;
    setDraft((current) => (current.branchUserId ? current : { ...current, branchUserId: id }));
  }, [branches]);

  useImperativeHandle(ref, () => ({
    async resolveContactId() {
      setFormError("");
      setErrors({});

      if (mode === "none") return null;

      if (mode === "existing") {
        const selected = contacts.find((contact) => contact.id === contactId);
        if (!selected) {
          setFormError("Selecciona un contacto o continúa sin uno.");
          return undefined;
        }
        if (!canCheckoutWithContact(selected)) {
          setFormError("Ese contacto no está autorizado para la compra.");
          return undefined;
        }
        return selected.id;
      }

      if (!draft.authorized) {
        setFormError("Solo puedes comprar con un contacto autorizado.");
        return undefined;
      }

      const fieldErrors = contactFieldErrors(draft);
      if (Object.keys(fieldErrors).length > 0) {
        setErrors(fieldErrors);
        return undefined;
      }

      const result = await createContact(contactPayload(draft, branches !== null));
      if (!result.ok || !result.contact || !canCheckoutWithContact(result.contact)) {
        if (result.contact && !canCheckoutWithContact(result.contact)) {
          setFormError("Solo puedes comprar con un contacto autorizado.");
          return undefined;
        }
        const apiErrors: Record<string, string> = {};
        for (const [field, messages] of Object.entries(result.errors ?? {})) {
          const key = field === "user_id" ? "branchUserId" : field;
          apiErrors[key] = messages[0];
        }
        setErrors(apiErrors);
        setFormError(result.message ?? "No se pudo crear el contacto.");
        return undefined;
      }

      return result.contact.id;
    },
  }));

  return (
    <div className="col-span-1 md:col-span-2 mt-6">
      <p className="font-medium mb-1">Contacto</p>
      <p className="text-sm text-gray-500 mb-2">
        Opcional. Si eliges uno, su RUT se envía a Random en la nota de venta.
      </p>
      <div className="flex flex-wrap gap-3">
        <label className={optionClass(mode === "none")}>
          <input
            type="radio"
            name="contactMode"
            checked={mode === "none"}
            onChange={() => setMode("none")}
          />
          <span className="text-sm font-medium">Sin contacto</span>
        </label>
        <label className={optionClass(mode === "existing")}>
          <input
            type="radio"
            name="contactMode"
            checked={mode === "existing"}
            onChange={() => setMode("existing")}
          />
          <span className="text-sm font-medium">Contacto existente</span>
        </label>
        <label className={optionClass(mode === "create")}>
          <input
            type="radio"
            name="contactMode"
            checked={mode === "create"}
            onChange={() => setMode("create")}
          />
          <span className="text-sm font-medium">Crear contacto</span>
        </label>
      </div>

      {mode === "existing" && (
        <div className="mt-3">
          <select
            value={contactId ?? ""}
            onChange={(e) => setContactId(e.target.value ? Number(e.target.value) : null)}
            disabled={loading}
            className="w-full p-2 rounded bg-[#EBEFF7]"
          >
            <option value="">Selecciona un contacto</option>
            {contacts.map((contact) => (
              <option
                key={contact.id}
                value={contact.id}
                disabled={!canCheckoutWithContact(contact)}
              >
                {contactCheckoutLabel(contact, ownUserId)}
              </option>
            ))}
          </select>
          {selectedContact && (
            <p className="text-sm text-gray-600 mt-1">
              {contactCheckoutBranchLabel(selectedContact, ownUserId)}
            </p>
          )}
          {!loading && contacts.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">No hay contactos. Puedes crear uno.</p>
          )}
          {!loading && contacts.some((contact) => !contact.authorized) && (
            <p className="text-sm text-gray-500 mt-1">
              Los contactos no autorizados no se pueden usar en la compra.
            </p>
          )}
        </div>
      )}

      {mode === "create" && (
        <div className="mt-4">
          <ContactForm draft={draft} errors={errors} onChange={setDraft} branches={branches} />
        </div>
      )}

      {formError && <p className="text-red-500 text-sm mt-2">{formError}</p>}
    </div>
  );
});

export default CheckoutContactSection;
