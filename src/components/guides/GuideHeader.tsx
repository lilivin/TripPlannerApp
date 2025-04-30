import React from 'react';
import type { GuideDetailDto } from '@/types';
import { Globe, Calendar, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface GuideHeaderProps {
  guide: GuideDetailDto;
  averageRating: number;
  recommendedDays: number;
  price: number;
}

/**
 * Komponent wyświetlający nagłówek przewodnika
 */
const GuideHeader: React.FC<GuideHeaderProps> = ({
  guide,
  averageRating,
  recommendedDays,
  price
}) => {
  // Generowanie gwiazdek oceny
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : index < rating
            ? 'text-yellow-400 fill-yellow-400 opacity-50'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  // Formatowanie ceny
  const formatPrice = (price: number) => {
    if (price === 0) return 'Darmowy';
    return `${price.toFixed(2)} zł`;
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{guide.title}</h1>
          
          <div className="flex items-center mt-2 space-x-4">
            <div className="flex items-center">
              {renderStars(averageRating)}
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                {averageRating > 0 
                  ? `${averageRating.toFixed(1)} (${guide.reviews_count})` 
                  : 'Brak ocen'}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Globe className="h-4 w-4 mr-1" />
              {guide.language}
            </div>
          </div>
          
          <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{recommendedDays} {recommendedDays === 1 ? 'dzień' : 
                 recommendedDays < 5 ? 'dni' : 'dni'}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="text-2xl font-bold text-primary">
            {formatPrice(price)}
          </div>
          
          {!guide.is_published && (
            <Badge variant="outline" className="mt-2 border-amber-500 text-amber-500">
              Wersja robocza
            </Badge>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex items-center">
        <span className="text-sm font-medium">Lokalizacja:</span>
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
          {guide.location_name}
        </span>
      </div>
    </div>
  );
};

export default GuideHeader; 