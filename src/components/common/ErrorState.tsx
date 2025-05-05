import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  code: number;
  message: string;
  onRetry?: () => void;
}

/**
 * Komponent wyświetlający informacje o błędzie
 * z opcjonalnym przyciskiem ponowienia próby
 */
const ErrorState: React.FC<ErrorStateProps> = ({ code, message, onRetry }) => {
  // Określ tytuł błędu na podstawie kodu
  const getErrorTitle = (code: number) => {
    switch (code) {
      case 404:
        return "Nie znaleziono przewodnika";
      case 403:
        return "Brak dostępu";
      case 500:
        return "Błąd serwera";
      default:
        return "Wystąpił błąd";
    }
  };

  const errorTitle = getErrorTitle(code);

  return (
    <div className="w-full rounded-lg border border-destructive/20 bg-destructive/5 p-8 flex flex-col items-center">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <h2 className="text-xl font-semibold text-destructive">{errorTitle}</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 text-center mt-2 mb-6">{message}</p>

      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Ponów próbę
        </Button>
      )}

      <Button variant="link" onClick={() => (window.location.href = "/guides")} className="mt-4">
        Powrót do listy przewodników
      </Button>
    </div>
  );
};

export default ErrorState;
