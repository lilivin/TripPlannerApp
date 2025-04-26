import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

/**
 * Komponent wyświetlający animację ładowania
 * Wykorzystywany podczas pobierania danych
 */
const LoadingState: React.FC<LoadingStateProps> = ({ message = "Wczytywanie danych..." }) => {
  return (
    <div className="w-full h-64 flex flex-col items-center justify-center p-8">
      <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">{message}</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Proszę czekać, trwa pobieranie danych.</p>
    </div>
  );
};

export default LoadingState;
