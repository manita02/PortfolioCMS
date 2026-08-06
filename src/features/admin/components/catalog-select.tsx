"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CatalogItem } from "@/types/domain";

export function CatalogSelect({
  items,
  value,
  onChange,
  placeholder = "Seleccionar…",
  className,
}: {
  items: CatalogItem[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const selectItems = items.map((item) => ({
    value: item.id,
    label: item.name,
  }));

  return (
    <Select
      value={value || undefined}
      onValueChange={(next) => {
        if (next != null) onChange(next);
      }}
      items={selectItems}
    >
      <SelectTrigger className={className ?? "w-full"}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {selectItems.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
