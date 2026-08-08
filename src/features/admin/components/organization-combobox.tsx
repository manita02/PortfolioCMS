"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type OrgOption = { id: string; name: string };

export function OrganizationCombobox({
  organizations,
  value,
  onChange,
  allowNone = false,
  noneLabel = "Sin organización",
  placeholder = "Seleccionar organización…",
}: {
  organizations: OrgOption[];
  value: string;
  onChange: (id: string) => void;
  allowNone?: boolean;
  noneLabel?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected =
    value === "none" || !value
      ? null
      : organizations.find((o) => o.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          buttonVariants({ variant: "outline" }),
          "w-full justify-between font-normal",
        )}
        aria-expanded={open}
      >
        <span className="truncate">
          {selected?.name ??
            (allowNone && value === "none" ? noneLabel : placeholder)}
        </span>
        <ChevronsUpDown className="opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar organización…" />
          <CommandList>
            <CommandEmpty>Sin resultados</CommandEmpty>
            <CommandGroup>
              {allowNone ? (
                <CommandItem
                  value="__none__"
                  onSelect={() => {
                    onChange("none");
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      value === "none" ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {noneLabel}
                </CommandItem>
              ) : null}
              {organizations.map((org) => (
                <CommandItem
                  key={org.id}
                  value={org.name}
                  onSelect={() => {
                    onChange(org.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      value === org.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {org.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
