import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="space-y-10" aria-busy="true" aria-live="polite">
      <div className="space-y-4">
        <Skeleton className="h-12 w-64 max-w-full" />
        <Skeleton className="h-5 w-full max-w-xl" />
        <Skeleton className="h-5 w-full max-w-md" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-10 w-36 rounded-lg" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-52 rounded-2xl" />
        <Skeleton className="h-52 rounded-2xl" />
        <Skeleton className="h-52 rounded-2xl" />
      </div>
    </div>
  );
}
