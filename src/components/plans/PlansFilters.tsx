import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PlansViewFilterState {
  isFavorite?: boolean;
  guideId?: string;
  page: number;
  limit: number;
}

interface PlansFiltersProps {
  filters: PlansViewFilterState;
  onFilterChange: (filters: Partial<PlansViewFilterState>) => void;
  isLoading: boolean;
}

export default function PlansFilters({ filters, onFilterChange, isLoading }: PlansFiltersProps) {
  const handleFavoriteToggle = (checked: boolean) => {
    onFilterChange({ isFavorite: checked ? true : undefined });
  };

  const handleLimitChange = (value: string) => {
    onFilterChange({ limit: parseInt(value, 10) });
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <div className="text-lg font-medium mb-4">Filter Plans</div>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-center space-x-2">
          <Switch
            id="favorite-filter"
            checked={filters.isFavorite === true}
            onCheckedChange={handleFavoriteToggle}
            disabled={isLoading}
          />
          <Label htmlFor="favorite-filter">Favorite Plans Only</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Label htmlFor="limit-filter">Show per page:</Label>
          <Select value={filters.limit.toString()} onValueChange={handleLimitChange} disabled={isLoading}>
            <SelectTrigger id="limit-filter" className="w-[120px]">
              <SelectValue placeholder="Select limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
