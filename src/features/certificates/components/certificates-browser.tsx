"use client";

import { useMemo, useState } from "react";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CertificateCard } from "@/features/certificates/components/certificate-card";
import type { Certificate } from "@/types/domain";

export function CertificatesBrowser({ items }: { items: Certificate[] }) {
  const [query, setQuery] = useState("");
  const [orgId, setOrgId] = useState("all");

  const organizations = useMemo(() => {
    const map = new Map<string, string>();
    items.forEach((item) => {
      if (item.organization) {
        map.set(item.organization.id, item.organization.name);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.organization?.name ?? "").toLowerCase().includes(q);
      const matchesOrg =
        orgId === "all" || item.organizationId === orgId;
      return matchesQuery && matchesOrg;
    });
  }, [items, query, orgId]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar"
          aria-label="Buscar"
          className="sm:max-w-sm"
        />
        <Select value={orgId} onValueChange={(v) => setOrgId(v ?? "all")}>
          <SelectTrigger className="sm:w-56" aria-label="Filtrar por organización">
            <SelectValue placeholder="Filtrar por organización" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {organizations.map((org) => (
              <SelectItem key={org.id} value={org.id}>
                {org.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState message="Sin resultados." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <CertificateCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
