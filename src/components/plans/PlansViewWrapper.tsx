import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PlansView from "./PlansView";

// Create a new QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function PlansViewWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <PlansView />
    </QueryClientProvider>
  );
}
