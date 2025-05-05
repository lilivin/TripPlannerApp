import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TimeRangeInputProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  startError?: string;
  endError?: string;
  rangeError?: string;
}

const TimeRangeInput: React.FC<TimeRangeInputProps> = ({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  startError,
  endError,
  rangeError,
}) => {
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onStartTimeChange(e.target.value);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onEndTimeChange(e.target.value);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="start-time-input" className="font-medium">
          Godzina rozpoczęcia
        </Label>
        <Input
          id="start-time-input"
          type="time"
          value={startTime}
          onChange={handleStartTimeChange}
          className={cn("w-full", startError && "border-red-500 focus-visible:ring-red-500")}
          aria-invalid={!!startError}
          aria-describedby={startError ? "start-time-error" : undefined}
        />
        {startError && (
          <p id="start-time-error" className="text-sm text-red-500 mt-1">
            {startError}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="end-time-input" className="font-medium">
          Godzina zakończenia
        </Label>
        <Input
          id="end-time-input"
          type="time"
          value={endTime}
          onChange={handleEndTimeChange}
          className={cn("w-full", endError && "border-red-500 focus-visible:ring-red-500")}
          aria-invalid={!!endError}
          aria-describedby={endError ? "end-time-error" : undefined}
        />
        {endError && (
          <p id="end-time-error" className="text-sm text-red-500 mt-1">
            {endError}
          </p>
        )}
      </div>

      {rangeError && (
        <p id="time-range-error" className="text-sm text-red-500 mt-1">
          {rangeError}
        </p>
      )}
    </div>
  );
};

export default TimeRangeInput;
