"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { CatalogItem } from "@/types/domain";

export function CatalogSelect({
  items,
  value,
  onChange,
  placeholder = "Seleccionar…",
  className,
  dangerItemIds,
  disabled = false,
}: {
  items: CatalogItem[];
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  className?: string;
  dangerItemIds?: readonly string[];
  disabled?: boolean;
}) {
  const danger = new Set(dangerItemIds ?? []);
  const selectItems = items.map((item) => ({
    value: item.id,
    label: item.name,
    danger: danger.has(item.id),
  }));
  const selectedIsDanger = danger.has(value);

  return (
    <Select
      value={value || undefined}
      onValueChange={(next) => {
        if (next != null) onChange(next);
      }}
      items={selectItems}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          className ?? "w-full",
          selectedIsDanger && "text-red-600 dark:text-red-400",
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {selectItems.map((item) => (
          <SelectItem
            key={item.value}
            value={item.value}
            className={
              item.danger ? "text-red-600 dark:text-red-400" : undefined
            }
          >
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
