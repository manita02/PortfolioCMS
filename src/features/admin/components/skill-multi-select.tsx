"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { skillTypeIds } from "@/constants/catalog-ids";
import { cn } from "@/lib/utils";

type SkillOption = { id: string; name: string; typeId?: string };

export function SkillMultiSelect({
  skills,
  value,
  onChange,
}: {
  skills: SkillOption[];
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q
      ? skills.filter((s) => s.name.toLowerCase().includes(q))
      : skills;
    return [...list].sort((a, b) => {
      const aHidden = a.typeId === skillTypeIds.hidden ? 1 : 0;
      const bHidden = b.typeId === skillTypeIds.hidden ? 1 : 0;
      if (aHidden !== bHidden) return aHidden - bHidden;
      return a.name.localeCompare(b.name);
    });
  }, [skills, query]);

  function toggle(id: string) {
    if (value.includes(id)) onChange(value.filter((x) => x !== id));
    else onChange([...value, id]);
  }

  return (
    <div className="space-y-2">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar habilidad…"
        aria-label="Buscar habilidad"
      />
      <div className="max-h-48 space-y-1 overflow-auto rounded-xl border p-2">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground px-2 py-3 text-center text-xs">
            Sin resultados. Creá la habilidad en el catálogo primero.
          </p>
        ) : (
          filtered.map((skill) => {
            const checked = value.includes(skill.id);
            const isHidden = skill.typeId === skillTypeIds.hidden;
            return (
              <button
                key={skill.id}
                type="button"
                onClick={() => toggle(skill.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition-colors",
                  isHidden
                    ? checked
                      ? "bg-red-500/15 text-red-700 dark:text-red-300"
                      : "text-red-600 hover:bg-red-500/10 dark:text-red-400"
                    : checked
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted",
                )}
              >
                <Check
                  className={cn(
                    "size-4 shrink-0",
                    checked ? "opacity-100" : "opacity-0",
                  )}
                />
                <span className="min-w-0 flex-1 truncate">{skill.name}</span>
                {isHidden ? (
                  <span className="shrink-0 text-[10px] font-medium tracking-wide uppercase opacity-80">
                    no visible
                  </span>
                ) : null}
              </button>
            );
          })
        )}
      </div>
      {value.length > 0 ? (
        <p className="text-muted-foreground text-xs">
          {value.length} seleccionada{value.length === 1 ? "" : "s"}
        </p>
      ) : null}
    </div>
  );
}
