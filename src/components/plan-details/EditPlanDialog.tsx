import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { UpdatePlanCommand } from "@/types";

interface EditPlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdatePlanCommand) => void;
  initialData: {
    name: string;
    is_favorite: boolean;
  };
}

export function EditPlanDialog({ isOpen, onClose, onSave, initialData }: EditPlanDialogProps) {
  const [name, setName] = useState(initialData.name);
  const [isFavorite, setIsFavorite] = useState(initialData.is_favorite);
  const [nameError, setNameError] = useState<string | null>(null);

  // Reset form when dialog opens
  const onOpenChange = (open: boolean) => {
    if (open) {
      setName(initialData.name);
      setIsFavorite(initialData.is_favorite);
      setNameError(null);
    } else {
      onClose();
    }
  };

  const handleSave = () => {
    // Walidacja
    if (name.trim().length < 3) {
      setNameError("Name must be at least 3 characters long");
      return;
    }

    onSave({
      name: name.trim(),
      is_favorite: isFavorite,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Plan</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="plan-name">Plan Name</Label>
            <Input
              id="plan-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError(null);
              }}
              className={nameError ? "border-red-500" : ""}
            />
            {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="favorite"
              checked={isFavorite}
              onCheckedChange={(checked) => setIsFavorite(checked === true)}
            />
            <Label htmlFor="favorite" className="cursor-pointer">
              Mark as favorite
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
