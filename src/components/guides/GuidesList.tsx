import type { GuideSummaryDto, PaginationInfo } from "@/types";
import GuideCard from "./GuideCard";
import { Button } from "@/components/ui/button";

interface GuidesListProps {
  guides: GuideSummaryDto[];
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  loading: boolean;
}

export default function GuidesList({ guides, pagination, onPageChange, loading }: GuidesListProps) {
  // Calculate page numbers to show
  const getPageNumbers = () => {
    const { page, pages } = pagination;
    const pageNumbers: number[] = [];

    // Always show first page
    if (pages > 0) pageNumbers.push(1);

    // Show pages around current page
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) {
      pageNumbers.push(i);
    }

    // Always show last page if there are multiple pages
    if (pages > 1) pageNumbers.push(pages);

    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading guides...</p>
      </div>
    );
  }

  if (guides.length === 0) {
    return (
      <div className="py-12 text-center border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">No guides found</h2>
        <p className="text-muted-foreground">Try adjusting your filters to find what you&apos;re looking for.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>

          {getPageNumbers().map((pageNumber, index, array) => {
            // Add ellipsis between non-consecutive page numbers
            const showEllipsis = index > 0 && pageNumber - array[index - 1] > 1;

            return (
              <div key={pageNumber} className="flex items-center">
                {showEllipsis && <span className="px-2 text-muted-foreground">...</span>}
                <Button
                  variant={pagination.page === pageNumber ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </Button>
              </div>
            );
          })}

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(pagination.pages, pagination.page + 1))}
            disabled={pagination.page === pagination.pages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Showing results info */}
      <div className="text-center mt-4 text-sm text-muted-foreground">
        Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} guides
      </div>
    </div>
  );
}
