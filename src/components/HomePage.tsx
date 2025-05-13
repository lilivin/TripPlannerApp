import GuestHomePage from "./home/GuestHomePage";
import UserHomePage from "./home/UserHomePage";
import { useAuth, AuthProvider } from "./providers/AuthProvider";
import { useHomePageData } from "./hooks/home-page";
import type { HomeGuestResponse, HomeUserResponse } from "@/types";
import { Button } from "./ui/button";
import { HomePageSkeleton } from "./home/ui/SkeletonLoaders";
import { useState, useEffect } from "react";

// Component that uses the auth hook
const HomePageContent = () => {
  const { user, isLoading: authLoading } = useAuth();
  const isAuthenticated = !!user;
  const { loadingState, error, data } = useHomePageData(isAuthenticated);
  const [isOffline, setIsOffline] = useState(false);

  // Track online/offline status
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    // Set initial status
    setIsOffline(!navigator.onLine);

    // Add event listeners
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  // If auth is still loading, show skeleton
  if (authLoading) {
    return <HomePageSkeleton isAuthenticated={false} />;
  }

  // Handle error state
  if (loadingState === "error") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">{error || "Failed to load content"}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state with skeleton
  if (loadingState === "loading") {
    return <HomePageSkeleton isAuthenticated={isAuthenticated} />;
  }

  // Show offline notification if needed
  if (isOffline) {
    return (
      <>
        <div className="bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-200 p-2 text-center text-sm mb-4">
          You&apos;re currently offline. Some content may not be up-to-date.
        </div>
        {isAuthenticated && data ? (
          <UserHomePage userData={data as HomeUserResponse} />
        ) : (
          <GuestHomePage featuredGuides={data ? (data as HomeGuestResponse).featured_guides : []} />
        )}
      </>
    );
  }

  // Render content based on user authentication state
  if (isAuthenticated && data) {
    return <UserHomePage userData={data as HomeUserResponse} />;
  } else {
    return <GuestHomePage featuredGuides={data ? (data as HomeGuestResponse).featured_guides : []} />;
  }
};

// Main component that provides the auth context
export default function HomePage() {
  return (
    <AuthProvider>
      <HomePageContent />
    </AuthProvider>
  );
}
