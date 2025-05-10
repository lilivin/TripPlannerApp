import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { useGuidesData } from "@/components/hooks/useGuidesData";
import { GuidesError } from "@/components/guides/GuidesError";
import GuidesFiltersPanel from "./GuidesFiltersPanel";
import GuidesList from "./GuidesList";

// Presentational component for the guides view
const GuidesViewContent = memo(function GuidesViewContent() {
  const { guides, pagination, loading, error, filters, setFilters, handlePageChange, refreshGuides } = useGuidesData();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Find Your Perfect Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <GuidesFiltersPanel initialFilters={filters} onFiltersChange={setFilters} />
        </CardContent>
      </Card>

      {error && <GuidesError type={error.type} message={error.message} onRetry={refreshGuides} />}

      <GuidesList guides={guides} pagination={pagination} onPageChange={handlePageChange} loading={loading} />
    </div>
  );
});

// Container component that provides context and error boundary
export default function GuidesView() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <GuidesViewContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
