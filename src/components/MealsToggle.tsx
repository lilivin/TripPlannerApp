import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface MealsToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
}

const MealsToggle: React.FC<MealsToggleProps> = ({
  value,
  onChange,
  label = "Uwzględnij posiłki w planie",
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch 
        id="meals-toggle"
        checked={value}
        onCheckedChange={onChange}
      />
      <Label 
        htmlFor="meals-toggle" 
        className="font-medium cursor-pointer"
      >
        {label}
      </Label>
    </div>
  );
};

export default MealsToggle; 