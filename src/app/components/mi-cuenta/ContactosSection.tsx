"use client";

import { useEffect, useState } from "react";
import ContactForm, { emptyContactDraft } from "@/app/components/contacts/ContactForm";
import LoadingSpinner from "@/app/components/global/LoadingSpinner";
import {
  createContact,
  getContacts,
  updateContact,
  type Contact,
} from "@/services/actions/contacts.actions";
import { contactFieldErrors, contactPayload, type ContactDraft } from "@/utils/contact";

function draftFromContact(contact: Contact): ContactDraft {
  return {
    rut: contact.rut,
    name: contact.name,
    email: contact.email ?? "",
    phone: contact.phone ?? "",
    branchCode: contact.branch_code ?? "",
    authorized: contact.authorized,
    address: contact.address ?? "",
  };
}

export default function ContactosSection({ branchCode }: { branchCode?: string | null }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [draft, setDraft] = useState<ContactDraft>(emptyContactDraft(branchCode ?? ""));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const data = await getContacts();
    setContacts(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId("new");
    setDraft(emptyContactDraft(branchCode ?? ""));
    setErrors({});
    setFormError("");
  };

  const openEdit = (contact: Contact) => {
    setEditingId(contact.id);
    setDraft(draftFromContact(contact));
    setErrors({});
    setFormError("");
  };

  const save = async () => {
    const fieldErrors = contactFieldErrors(draft);
    setErrors(fieldErrors);
    setFormError("");
    if (Object.keys(fieldErrors).length > 0) return;

    setSaving(true);
    const payload = contactPayload(draft);
    const result =
      editingId === "new"
        ? await createContact(payload)
        : await updateContact(editingId as number, payload);
    setSaving(false);

    if (!result.ok) {
      const apiErrors: Record<string, string> = {};
      for (const [field, messages] of Object.entries(result.errors ?? {})) {
        const key = field === "branch_code" ? "branchCode" : field;
        apiErrors[key] = messages[0];
      }
      setErrors(apiErrors);
      setFormError(result.message ?? "No se pudo guardar el contacto.");
      return;
    }

    setEditingId(null);
    await load();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3">
        <h2 className="text-xl font-bold">Contactos</h2>
        {editingId === null && (
          <button
            type="button"
            onClick={openCreate}
            className="bg-lime-500 hover:bg-lime-600 text-white text-sm px-3 py-2 rounded"
          >
            Nuevo contacto
          </button>
        )}
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Personas de tu entidad en Random. Puedes elegir una al finalizar la compra.
      </p>

      {editingId !== null && (
        <div className="mb-6 space-y-4">
          <ContactForm
            draft={draft}
            errors={errors}
            onChange={setDraft}
            rutReadOnly={editingId !== "new"}
          />
          {formError && <p className="text-red-500 text-sm">{formError}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="bg-lime-500 hover:bg-lime-600 text-white text-sm px-3 py-2 rounded disabled:bg-gray-300"
            >
              {saving ? "Guardando..." : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="text-sm px-3 py-2 rounded border border-slate-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {contacts.length === 0 ? (
        <p className="text-sm text-gray-500">No tienes contactos registrados.</p>
      ) : (
        <div className="space-y-2">
          {contacts.map((contact) => (
            <div key={contact.id} className="bg-[#edf2f7] px-4 py-3 rounded space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-gray-700">{contact.name}</span>
                <button
                  type="button"
                  onClick={() => openEdit(contact)}
                  className="text-sm text-lime-700"
                >
                  Editar
                </button>
              </div>
              <p className="text-sm text-gray-600">
                RUT {contact.rut}
                {contact.email ? ` · ${contact.email}` : ""}
                {contact.phone ? ` · ${contact.phone}` : ""}
              </p>
              {contact.authorized && (
                <p className="text-xs text-gray-500">Autorizado</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
