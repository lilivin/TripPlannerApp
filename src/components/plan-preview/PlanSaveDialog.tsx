import { useState, type ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, X, Loader2 } from "lucide-react";
import { type SavePlanFormData } from "@/types";

interface PlanSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: SavePlanFormData) => void;
  isSaving: boolean;
}

export default function PlanSaveDialog({ isOpen, onClose, onSave, isSaving }: PlanSaveDialogProps) {
  const [name, setName] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validate the form
  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError("Plan name is required");
      return false;
    }

    if (name.trim().length < 3) {
      setError("Plan name must be at least 3 characters");
      return false;
    }

    setError(null);
    return true;
  };

  // Handle save button click
  const handleSave = () => {
    if (validateForm()) {
      onSave({
        name: name.trim(),
        isFavorite,
      });
    }
  };

  // Reset form when dialog is closed
  const handleClose = () => {
    setName("");
    setIsFavorite(false);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Your Trip Plan</DialogTitle>
          <DialogDescription>Give your plan a name and save it to access later.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="plan-name" className="flex items-center">
              Plan Name <span className="text-destructive ml-1">*</span>
            </Label>
            <Input
              id="plan-name"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setName(e.target.value);
                if (error) validateForm();
              }}
              placeholder="My awesome trip plan"
              className={error ? "border-destructive" : ""}
              disabled={isSaving}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="favorite"
              checked={isFavorite}
              onCheckedChange={(checked: boolean) => setIsFavorite(checked)}
              disabled={isSaving}
            />
            <Label htmlFor="favorite" className="cursor-pointer">
              Add to favorites
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSaving}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave} disabled={isSaving} className="flex items-center gap-1">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? "Saving..." : "Save Plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
