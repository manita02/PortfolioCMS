"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type DateRangeFormValues = {
  startMonth: number;
  startYear: number;
  endMonth?: number | null;
  endYear?: number | null;
  isCurrent: boolean;
};

function numberOrNull(value: string): number | null {
  if (value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function MonthYearPair<T extends FieldValues & DateRangeFormValues>({
  monthName,
  yearName,
  monthLabel,
  yearLabel,
  disabled,
  control,
}: {
  monthName: "startMonth" | "endMonth";
  yearName: "startYear" | "endYear";
  monthLabel: string;
  yearLabel: string;
  disabled?: boolean;
  control: Control<T>;
}) {
  const isEnd = monthName === "endMonth";

  return (
    <div className="grid grid-cols-[minmax(0,4.5rem)_minmax(0,1fr)] gap-2">
      <FormField
        control={control}
        name={monthName as Path<T>}
        render={({ field }) => (
          <FormItem className="min-w-0">
            <FormLabel className="text-muted-foreground text-xs font-normal">
              {monthLabel}
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1}
                max={12}
                inputMode="numeric"
                disabled={disabled}
                className="min-w-0 px-2 tabular-nums"
                value={field.value ?? ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (isEnd) {
                    field.onChange(numberOrNull(raw));
                    return;
                  }
                  field.onChange(raw === "" ? undefined : Number(raw));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={yearName as Path<T>}
        render={({ field }) => (
          <FormItem className="min-w-0">
            <FormLabel className="text-muted-foreground text-xs font-normal">
              {yearLabel}
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                inputMode="numeric"
                disabled={disabled}
                className="min-w-0 px-2 tabular-nums"
                value={field.value ?? ""}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (isEnd) {
                    field.onChange(numberOrNull(raw));
                    return;
                  }
                  field.onChange(raw === "" ? undefined : Number(raw));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

/** Fecha inicio | Fecha fin | Actual — mismo layout para Experiencia y Educación. */
export function AdminDateRangeFields<T extends FieldValues & DateRangeFormValues>({
  control,
  isCurrent,
}: {
  control: Control<T>;
  isCurrent: boolean;
}) {
  return (
    <div className="grid gap-4 sm:col-span-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end">
      <div className="min-w-0 space-y-2">
        <p className="text-sm leading-none font-medium">Fecha inicio</p>
        <MonthYearPair
          control={control}
          monthName="startMonth"
          yearName="startYear"
          monthLabel="Mes"
          yearLabel="Año"
        />
      </div>

      <div className="min-w-0 space-y-2">
        <p className="text-sm leading-none font-medium">Fecha fin</p>
        <MonthYearPair
          control={control}
          monthName="endMonth"
          yearName="endYear"
          monthLabel="Mes"
          yearLabel="Año"
          disabled={isCurrent}
        />
      </div>

      <FormField
        control={control}
        name={"isCurrent" as Path<T>}
        render={({ field }) => (
          <FormItem className="flex min-h-9 items-center gap-2 space-y-0 sm:pb-0.5">
            <FormControl>
              <Checkbox
                checked={Boolean(field.value)}
                onCheckedChange={(v) => field.onChange(Boolean(v))}
              />
            </FormControl>
            <FormLabel className="whitespace-nowrap">Actual</FormLabel>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
