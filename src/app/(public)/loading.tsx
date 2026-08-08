import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function LocaleLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-28 pb-16 sm:px-6">
      <LoadingSkeleton />
    </div>
  );
}
