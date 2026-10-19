"use client";

import { useEffect, useState } from "react";
import { fetchAllBranches } from "@/services/actions/branches.actions";
import { useAuthUser } from "@/stores/useAuthStore";

export interface ContactBranchOption {
  id: number;
  label: string;
}

/**
 * Sucursales que una principal puede asignar a un contacto.
 * `null` cuando no hay que mostrar la lista: sucursal secundaria, o principal sin secundarias.
 */
export function useContactBranches(): {
  loading: boolean;
  options: ContactBranchOption[] | null;
  ownUserId: number | null;
} {
  const user = useAuthUser();
  const ownUserId = user?.id ?? null;
  const branchType = user?.branch_type;
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<ContactBranchOption[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (branchType !== "P" || ownUserId == null) {
      setOptions(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchAllBranches()
      .then((branches) => {
        if (cancelled) return;

        const secondaries = branches.data ?? [];
        if (secondaries.length === 0) {
          setOptions(null);
          return;
        }

        setOptions([
          { id: ownUserId, label: "Mi sucursal" },
          ...secondaries.map((branch) => ({
            id: branch.id,
            label: [branch.name, branch.branch_code].filter(Boolean).join(" · "),
          })),
        ]);
      })
      .catch(() => {
        if (!cancelled) setOptions(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [branchType, ownUserId]);

  return { loading, options, ownUserId };
}
