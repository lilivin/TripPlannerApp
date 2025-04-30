import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

/**
 * Komponent wyświetlający animację ładowania
 * Wykorzystywany podczas pobierania danych
 */
export default function LoadingState({ message = "Wczytywanie danych..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <h2 className="mt-4 text-lg font-semibold">{message}</h2>
      <p className="mt-2 text-sm text-muted-foreground">Proszę czekać, trwa pobieranie danych.</p>
    </div>
  );
}
