import React from 'react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TRANSPORTATION_OPTIONS } from '../types/plan';

interface TransportationModeSelectProps {
  value: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
  label?: string;
  error?: string;
}

const TransportationModeSelect: React.FC<TransportationModeSelectProps> = ({
  value,
  onChange,
  options = TRANSPORTATION_OPTIONS,
  label = "Środek transportu",
  error,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="transportation-mode-select" className="font-medium">
        {label}
      </Label>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger 
          id="transportation-mode-select"
          className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
          aria-invalid={!!error}
          aria-describedby={error ? "transportation-error" : undefined}
        >
          <SelectValue placeholder="Wybierz środek transportu" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Dostępne opcje</SelectLabel>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      
      {error && (
        <p id="transportation-error" className="text-sm text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default TransportationModeSelect; 