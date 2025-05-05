import React from "react";
import { Calendar, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GeneratePlanButtonProps {
  guideId: string;
  isPaid: boolean;
  hasAccess: boolean;
}

/**
 * Komponent przycisku umożliwiającego przejście do generowania planu wycieczki
 */
const GeneratePlanButton: React.FC<GeneratePlanButtonProps> = ({ guideId, isPaid, hasAccess }) => {
  // Jeśli przewodnik jest płatny i użytkownik nie ma dostępu, wyświetl przycisk kupna
  if (isPaid && !hasAccess) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Button disabled className="gap-2 w-full max-w-md">
          <Lock className="h-4 w-4" />
          Generuj plan wycieczki
        </Button>
        <p className="text-sm text-muted-foreground">
          Aby wygenerować plan, musisz najpierw zakupić dostęp do tego przewodnika.
        </p>
        <Button variant="outline" className="mt-2 gap-2">
          Kup dostęp do przewodnika
        </Button>
      </div>
    );
  }

  // Standardowy przycisk generowania planu
  return (
    <Button
      size="lg"
      className="gap-2 w-full max-w-md"
      onClick={() => {
        window.location.href = `/guides/${guideId}/generate`;
      }}
    >
      <Calendar className="h-5 w-5" />
      Generuj plan wycieczki
    </Button>
  );
};

export default GeneratePlanButton;
