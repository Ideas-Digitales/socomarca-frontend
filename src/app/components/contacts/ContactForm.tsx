"use client";

import RutInput, { formatRut } from "@/app/components/global/RutInputVisualIndicators";
import type { ContactBranchOption } from "@/hooks/useContactBranches";
import type { ContactDraft } from "@/utils/contact";

const inputClass = "w-full p-2 mt-1 rounded bg-[#EBEFF7]";

export const emptyContactDraft = (branchUserId: number | null = null): ContactDraft => ({
  rut: "",
  name: "",
  email: "",
  phone: "",
  branchUserId,
  authorized: false,
  address: "",
});

export default function ContactForm({
  draft,
  errors,
  onChange,
  rutReadOnly = false,
  branches = null,
}: {
  draft: ContactDraft;
  errors: Record<string, string>;
  onChange: (draft: ContactDraft) => void;
  rutReadOnly?: boolean;
  /** `null` oculta la lista: la sucursal la asigna el backend. */
  branches?: ContactBranchOption[] | null;
}) {
  const set = (patch: Partial<ContactDraft>) => onChange({ ...draft, ...patch });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block font-medium text-sm">RUT</label>
        {rutReadOnly ? (
          <input value={formatRut(draft.rut)} disabled className={`${inputClass} text-gray-500`} />
        ) : (
          <div className="mt-1">
            <RutInput
              value={draft.rut}
              onChange={(rut) => set({ rut })}
              placeholder="12.345.678-5"
            />
          </div>
        )}
        {errors.rut && <p className="text-red-500 text-sm mt-1">{errors.rut}</p>}
      </div>

      <div>
        <label className="block font-medium text-sm">Nombre</label>
        <input
          value={draft.name}
          onChange={(e) => set({ name: e.target.value })}
          className={inputClass}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label className="block font-medium text-sm">Correo</label>
        <input
          type="email"
          value={draft.email}
          onChange={(e) => set({ email: e.target.value })}
          className={inputClass}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block font-medium text-sm">Teléfono</label>
        <input
          value={draft.phone}
          onChange={(e) => set({ phone: e.target.value })}
          maxLength={30}
          className={inputClass}
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
      </div>

      {branches && branches.length > 0 && (
        <div className="md:col-span-2">
          <label className="block font-medium text-sm">Sucursal</label>
          <select
            value={draft.branchUserId ?? ""}
            onChange={(e) => set({ branchUserId: e.target.value ? Number(e.target.value) : null })}
            className={inputClass}
          >
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.label}
              </option>
            ))}
          </select>
          {errors.branchUserId && <p className="text-red-500 text-sm mt-1">{errors.branchUserId}</p>}
        </div>
      )}

      <div>
        <label className="block font-medium text-sm">Dirección</label>
        <input
          value={draft.address}
          onChange={(e) => set({ address: e.target.value })}
          maxLength={50}
          className={inputClass}
        />
        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
      </div>

      <label className="md:col-span-2 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={draft.authorized}
          onChange={(e) => set({ authorized: e.target.checked })}
        />
        Contacto autorizado
      </label>
    </div>
  );
}
