import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = "Generowanie planu w toku..."
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="bg-card shadow-lg rounded-lg p-6 max-w-md w-full mx-auto flex flex-col items-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <h3 className="text-xl font-semibold mb-2">
          {message}
        </h3>
        <p className="text-muted-foreground text-sm text-center">
          To może potrwać kilka chwil. Prosimy o cierpliwość.
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay; 