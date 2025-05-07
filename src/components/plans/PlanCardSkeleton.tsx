import { Skeleton } from "@/components/ui/skeleton";
import type { PlanCardSkeletonProps } from "./types";

/**
 * Loading skeleton for plan cards
 */
export function PlanCardSkeleton({ count = 1 }: PlanCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="mb-4 border rounded-lg p-4">
          <div className="flex justify-between mb-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-16" />
          </div>
          <Skeleton className="h-4 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/3 mb-4" />
          <div className="flex justify-between mt-4">
            <Skeleton className="h-9 w-24" />
            <div className="space-x-2">
              <Skeleton className="h-9 w-24 inline-block" />
              <Skeleton className="h-9 w-24 inline-block" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
