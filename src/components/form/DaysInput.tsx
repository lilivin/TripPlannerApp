import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface DaysInputProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  min?: number;
  max?: number;
  label?: string;
}

const DaysInput: React.FC<DaysInputProps> = ({
  value,
  onChange,
  error,
  min = 1,
  max = 30,
  label = "Liczba dni",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="days-input" className="font-medium">
        {label}
      </Label>
      <div className="flex items-center space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          onClick={handleDecrement}
          disabled={value <= min}
          aria-label="Zmniejsz liczbę dni"
        >
          <span className="sr-only">Zmniejsz</span>
          <span aria-hidden="true">-</span>
        </Button>
        
        <Input
          id="days-input"
          type="number"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          className={cn(
            "text-center w-20",
            error && "border-red-500 focus-visible:ring-red-500"
          )}
          aria-invalid={!!error}
          aria-describedby={error ? "days-input-error" : undefined}
        />
        
        <Button 
          type="button" 
          variant="outline" 
          size="icon" 
          onClick={handleIncrement}
          disabled={value >= max}
          aria-label="Zwiększ liczbę dni"
        >
          <span className="sr-only">Zwiększ</span>
          <span aria-hidden="true">+</span>
        </Button>
      </div>
      
      {error && (
        <p 
          id="days-input-error" 
          className="text-sm text-red-500 mt-1"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default DaysInput; 