import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star } from 'lucide-react';

interface TabNavigationProps {
  activeTab: number;
  onTabChange: (index: number) => void;
  attractionsCount: number;
  reviewsCount: number;
  children: React.ReactNode;
}

/**
 * Komponent nawigacji zakładkowej
 * Umożliwia przełączanie między atrakcjami i recenzjami
 */
const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  attractionsCount,
  reviewsCount,
  children,
}) => {
  // Definiujemy dostępne zakładki
  const tabs = [
    { 
      id: 'attractions',
      label: 'Atrakcje',
      count: attractionsCount,
      icon: <MapPin className="h-4 w-4 mr-2" />
    },
    { 
      id: 'reviews',
      label: 'Recenzje', 
      count: reviewsCount,
      icon: <Star className="h-4 w-4 mr-2" />
    }
  ];

  // Konwertujemy indeks na wartość dla komponentu Tabs
  const value = tabs[activeTab]?.id || tabs[0].id;
  
  // Obsługa zmiany zakładki
  const handleValueChange = (newValue: string) => {
    const newIndex = tabs.findIndex(tab => tab.id === newValue);
    if (newIndex !== -1) {
      onTabChange(newIndex);
    }
  };

  return (
    <Tabs 
      defaultValue={value} 
      value={value}
      onValueChange={handleValueChange}
      className="w-full mt-6"
    >
      <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
        {tabs.map((tab) => (
          <TabsTrigger 
            key={tab.id} 
            value={tab.id}
            className="flex items-center justify-center"
          >
            {tab.icon}
            {tab.label}
            {tab.count > 0 && (
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                {tab.count}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <div className="mt-6">
        {children}
      </div>
    </Tabs>
  );
};

export default TabNavigation; 