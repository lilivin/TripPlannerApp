import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

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

interface GuidesFiltersPanelProps {
  initialFilters: GuidesFilterViewModel;
  onFiltersChange: (filters: GuidesFilterViewModel) => void;
}

// Available language options
const LANGUAGE_OPTIONS = [
  { value: 'all', label: 'All Languages' },
  { value: 'en', label: 'English' },
  { value: 'pl', label: 'Polish' },
  { value: 'es', label: 'Spanish' },
  { value: 'de', label: 'German' },
  { value: 'fr', label: 'French' },
];

export default function GuidesFiltersPanel({ initialFilters, onFiltersChange }: GuidesFiltersPanelProps) {
  // Local state to track filter values before submission
  const [localFilters, setLocalFilters] = useState<GuidesFilterViewModel>(initialFilters);
  
  // Update local filters when initial filters change (e.g., from parent)
  useEffect(() => {
    setLocalFilters(initialFilters);
  }, [initialFilters]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      const numValue = value === '' ? undefined : Number(value);
      setLocalFilters(prev => ({ ...prev, [name]: numValue }));
    } else {
      setLocalFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    // Convert "all" to empty string for API request
    const apiValue = value === 'all' ? '' : value;
    setLocalFilters(prev => ({ ...prev, [name]: apiValue }));
  };

  // Apply filters (can be automatic or on button click)
  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  // Reset filters
  const resetFilters = () => {
    const resetValues: GuidesFilterViewModel = {
      search: '',
      language: '',
      location: '',
      min_days: undefined,
      max_days: undefined,
      // Keep pagination settings
      page: initialFilters.page,
      limit: initialFilters.limit,
    };
    
    setLocalFilters(resetValues);
    onFiltersChange(resetValues);
  };

  // Handle keyboard submission
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  // Convert empty string to "all" for select display
  const getSelectValue = () => {
    return !localFilters.language || localFilters.language === '' ? 'all' : localFilters.language;
  };

  return (
    <div 
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" 
      role="search" 
      aria-label="Guide filters"
      onKeyDown={handleKeyDown}
    >
      {/* Search input */}
      <div className="space-y-2">
        <Label htmlFor="search" className="flex items-center">
          Search
          <span className="sr-only">(by title or description)</span>
        </Label>
        <Input
          id="search"
          name="search"
          placeholder="Search by title or description"
          value={localFilters.search || ''}
          onChange={handleInputChange}
          aria-label="Search guides by title or description"
        />
      </div>

      {/* Language selector */}
      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Select 
          value={getSelectValue()} 
          onValueChange={(value: string) => handleSelectChange('language', value)}
          name="language"
        >
          <SelectTrigger id="language" aria-label="Select language">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGE_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Location input */}
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          placeholder="Filter by location"
          value={localFilters.location || ''}
          onChange={handleInputChange}
          aria-label="Filter guides by location"
        />
      </div>

      {/* Minimum days input */}
      <div className="space-y-2">
        <Label htmlFor="min_days">Minimum Days</Label>
        <Input
          id="min_days"
          name="min_days"
          type="number"
          min={1}
          placeholder="Min. days"
          value={localFilters.min_days || ''}
          onChange={handleInputChange}
          aria-label="Filter by minimum number of days"
          inputMode="numeric"
        />
      </div>

      {/* Maximum days input */}
      <div className="space-y-2">
        <Label htmlFor="max_days">Maximum Days</Label>
        <Input
          id="max_days"
          name="max_days"
          type="number"
          min={1}
          placeholder="Max. days"
          value={localFilters.max_days || ''}
          onChange={handleInputChange}
          aria-label="Filter by maximum number of days"
          inputMode="numeric"
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-end space-x-2">
        <Button 
          onClick={applyFilters} 
          className="flex-1"
          aria-label="Apply filters"
          type="submit"
        >
          Apply Filters
        </Button>
        <Button 
          onClick={resetFilters} 
          variant="outline" 
          className="flex-1"
          aria-label="Reset all filters"
          type="reset"
        >
          Reset
        </Button>
      </div>
    </div>
  );
} 