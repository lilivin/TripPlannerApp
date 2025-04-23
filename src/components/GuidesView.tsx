import { useState, useEffect } from 'react';
import type { GuideSummaryDto, GuideQuery, PaginationInfo, GuideListResponse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from '@/components/ui/icons';
import GuidesFiltersPanel from './GuidesFiltersPanel';
import GuidesList from './GuidesList';

// Error types for better error handling
type ErrorType = 'network' | 'server' | 'notFound' | 'unknown';

interface ErrorState {
  type: ErrorType;
  message: string;
}

// Filter view model as per implementation plan
interface GuidesFilterViewModel {
  search?: string;
  creator_id?: string;
  language?: string;
  location?: string;
  min_days?: number;
  max_days?: number;
  is_published?: boolean;
  page?: number;
  limit?: number;
}

export default function GuidesView() {
  // State management
  const [filters, setFilters] = useState<GuidesFilterViewModel>({
    page: 1,
    limit: 12,
  });
  const [guides, setGuides] = useState<GuideSummaryDto[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 12,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState | null>(null);

  // Function to fetch guides from API
  const fetchGuides = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      // Add timeout for network error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout

      // Fetch guides from API
      const response = await fetch(`/api/guides?${queryParams.toString()}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      // Handle HTTP status codes
      if (response.status === 404) {
        throw { type: 'notFound', message: 'The requested resource was not found' };
      } else if (response.status >= 500) {
        throw { type: 'server', message: 'The server encountered an error. Please try again later.' };
      } else if (!response.ok) {
        throw { type: 'unknown', message: `Failed to fetch guides: ${response.statusText}` };
      }

      const data: GuideListResponse = await response.json();
      setGuides(data.data);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching guides:', err);
      
      // Categorize errors for better user feedback
      if (err instanceof DOMException && err.name === 'AbortError') {
        setError({ type: 'network', message: 'Request timed out. Please check your connection and try again.' });
      } else if (err instanceof TypeError && err.message.includes('fetch')) {
        setError({ type: 'network', message: 'Unable to connect to the server. Please check your internet connection.' });
      } else if (err && typeof err === 'object' && 'type' in err) {
        setError(err as ErrorState);
      } else {
        setError({ type: 'unknown', message: 'An unexpected error occurred. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: GuidesFilterViewModel) => {
    // Validate numeric filters
    if (newFilters.min_days && newFilters.min_days < 1) {
      newFilters.min_days = 1;
    }
    
    if (newFilters.max_days && newFilters.min_days && newFilters.max_days < newFilters.min_days) {
      newFilters.max_days = newFilters.min_days;
    }
    
    // Reset to page 1 when filters change
    setFilters({ ...newFilters, page: 1 });
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    // Ensure page is within valid range
    if (page < 1) page = 1;
    if (pagination.pages && page > pagination.pages) page = pagination.pages;
    
    setFilters(prev => ({ ...prev, page }));
  };

  // Get error UI based on error type
  const getErrorUI = () => {
    if (!error) return null;

    const errorClasses = {
      network: "bg-yellow-100 border-yellow-400 text-yellow-800",
      server: "bg-red-100 border-red-400 text-red-800",
      notFound: "bg-blue-100 border-blue-400 text-blue-800",
      unknown: "bg-gray-100 border-gray-400 text-gray-800"
    };

    return (
      <div 
        className={`${errorClasses[error.type]} border px-4 py-3 rounded mb-6 flex items-start justify-between`} 
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error.message}</p>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={fetchGuides}
          aria-label="Try again"
          className="ml-2 flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Try Again
        </Button>
      </div>
    );
  };

  // Fetch guides on initial load and when filters change
  useEffect(() => {
    fetchGuides();
  }, [filters]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Find Your Perfect Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <GuidesFiltersPanel
            initialFilters={filters} 
            onFiltersChange={handleFiltersChange} 
          />
        </CardContent>
      </Card>

      {getErrorUI()}

      <GuidesList
        guides={guides}
        pagination={pagination}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
  );
} 