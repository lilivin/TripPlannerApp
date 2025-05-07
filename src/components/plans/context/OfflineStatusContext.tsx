import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useOfflineStatus } from "../hooks/useOfflineStatus";
import type { PlanSummaryViewModel } from "../types";

interface OfflineStatusContextValue {
  offlineStatuses: Record<string, boolean>;
  isLoading: boolean;
  error: string | null;
  retryFetch: () => void;
  toggleOfflineStatus: (planId: string, isOfflineAvailable: boolean) => Promise<boolean>;
}

const OfflineStatusContext = createContext<OfflineStatusContextValue | undefined>(undefined);

interface OfflineStatusProviderProps {
  children: ReactNode;
  plans: PlanSummaryViewModel[];
}

/**
 * Provider component for offline status context
 * Manages the offline status state for all plans
 */
export function OfflineStatusProvider({ children, plans }: OfflineStatusProviderProps) {
  const offlineStatus = useOfflineStatus(plans);

  return <OfflineStatusContext.Provider value={offlineStatus}>{children}</OfflineStatusContext.Provider>;
}

/**
 * Hook to consume the offline status context
 */
export function useOfflineStatusContext() {
  const context = useContext(OfflineStatusContext);

  if (context === undefined) {
    throw new Error("useOfflineStatusContext must be used within an OfflineStatusProvider");
  }

  return context;
}
