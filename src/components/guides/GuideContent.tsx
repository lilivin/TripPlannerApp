import React from 'react';
import { User, MapPin, ExternalLink } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CreatorWithImageDto {
  id: string;
  display_name: string;
  profile_image_url: string | null;
}

interface GuideContentProps {
  description: string;
  creator: CreatorWithImageDto;
  locationName: string;
}

/**
 * Komponent wyświetlający treść przewodnika i informacje o twórcy
 */
const GuideContent: React.FC<GuideContentProps> = ({
  description,
  creator,
  locationName
}) => {
  // Przygotuj inicjały twórcy dla awatara-fallbacka
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Podziel opis na akapity
  const paragraphs = description.split('\n').filter(p => p.trim() !== '');

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Główna treść przewodnika */}
        <div className="md:col-span-3">
          <h2 className="text-xl font-semibold mb-4">O przewodniku</h2>
          
          <div className="text-gray-700 dark:text-gray-300 space-y-4">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          
          <div className="flex items-center mt-6 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{locationName}</span>
          </div>
        </div>
        
        {/* Informacje o twórcy */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-16 w-16 mb-3">
                  {creator.profile_image_url ? (
                    <AvatarImage src={creator.profile_image_url} alt={creator.display_name} />
                  ) : (
                    <AvatarFallback>
                      {getInitials(creator.display_name)}
                    </AvatarFallback>
                  )}
                </Avatar>
                
                <h3 className="font-medium">{creator.display_name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Twórca przewodnika</p>
                
                <a 
                  href={`/creators/${creator.id}`} 
                  className="flex items-center text-sm text-primary mt-4 hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                  Zobacz profil twórcy
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GuideContent; 