import { Skeleton } from "../../ui/skeleton";

export const GuideSkeleton = () => (
  <div className="flex flex-col gap-2 w-full">
    <Skeleton className="h-[180px] w-full rounded-lg" />
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-2/3" />
    <div className="flex items-center justify-between mt-1">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/5" />
    </div>
  </div>
);

export const FeaturedGuidesSkeleton = () => (
  <div className="w-full space-y-4">
    <div className="flex justify-between items-center">
      <Skeleton className="h-7 w-[200px]" />
      <Skeleton className="h-7 w-[100px]" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <GuideSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const HowItWorksSkeleton = () => (
  <div className="w-full space-y-4">
    <Skeleton className="h-7 w-[200px]" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-5 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ))}
    </div>
  </div>
);

export const TestimonialSkeleton = () => (
  <div className="w-full px-6 py-8 rounded-lg border">
    <div className="flex items-center gap-3 mb-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-3 w-[80px]" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

export const TestimonialSliderSkeleton = () => (
  <div className="w-full space-y-4">
    <Skeleton className="h-7 w-[200px]" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <TestimonialSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const BenefitsSkeleton = () => (
  <div className="w-full space-y-4">
    <Skeleton className="h-7 w-[200px]" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 p-4 border rounded-lg">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ))}
    </div>
  </div>
);

export const UserWelcomeSkeleton = () => (
  <div className="flex items-center gap-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-6 w-[250px]" />
      <Skeleton className="h-4 w-[150px]" />
    </div>
  </div>
);

export const QuickActionsSkeleton = () => (
  <div className="w-full">
    <div className="flex overflow-x-auto gap-4 pb-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex-none">
          <Skeleton className="h-10 w-[100px] rounded-full" />
        </div>
      ))}
    </div>
  </div>
);

export const RecentPlansSkeleton = () => (
  <div className="w-full space-y-4">
    <Skeleton className="h-7 w-[200px]" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 p-4 border rounded-lg">
          <Skeleton className="h-[120px] w-full rounded-md" />
          <Skeleton className="h-5 w-3/4" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const HomePageSkeleton = ({ isAuthenticated = false }: { isAuthenticated?: boolean }) => (
  <div className="flex flex-col gap-16 py-6">
    {isAuthenticated ? (
      <>
        <UserWelcomeSkeleton />
        <QuickActionsSkeleton />
        <RecentPlansSkeleton />
        <FeaturedGuidesSkeleton />
      </>
    ) : (
      <>
        <div className="min-h-[400px] w-full relative">
          <Skeleton className="h-full w-full absolute" />
          <div className="absolute inset-0 flex flex-col justify-center items-start p-10 gap-4">
            <Skeleton className="h-10 w-3/4 max-w-[500px]" />
            <Skeleton className="h-6 w-2/3 max-w-[400px]" />
            <Skeleton className="h-12 w-[150px] mt-4" />
          </div>
        </div>
        <FeaturedGuidesSkeleton />
        <HowItWorksSkeleton />
        <TestimonialSliderSkeleton />
        <BenefitsSkeleton />
        <div className="w-full flex flex-col items-center gap-4 py-8">
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-6 w-[400px]" />
          <Skeleton className="h-12 w-[200px] mt-4" />
        </div>
      </>
    )}
  </div>
);
