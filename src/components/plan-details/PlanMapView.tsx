import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import type { PlanDayViewModel } from "@/types/plan-view";

interface PlanMapViewProps {
  planDays: PlanDayViewModel[];
  onMarkerClick: (attractionId: string) => void;
}

export function PlanMapView({ planDays, onMarkerClick }: PlanMapViewProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(planDays.length > 0 ? planDays[0].id : null);

  // Płaski tablica atrakcji z geolokalizacją
  const attractions = planDays.flatMap((day) => day.attractions.filter((attraction) => attraction.geolocation));

  // Atrakcje dla wybranego dnia
  const selectedDayAttractions = selectedDay
    ? planDays.find((day) => day.id === selectedDay)?.attractions.filter((attraction) => attraction.geolocation) || []
    : [];

  // Efekt ładowania mapy
  useEffect(() => {
    // W tym miejscu zostanie dodany kod inicjalizacji mapy
    // np. przy użyciu Leaflet, Google Maps, Mapbox itp.

    const loadMap = async () => {
      try {
        // Symulacja ładowania mapy
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsMapLoaded(true);
      } catch (error) {
        console.error("Failed to load map:", error);
      }
    };

    loadMap();
  }, []);

  // Funkcja do obsługi kliknięcia przykładowego markera (do demonstracji)
  const handleMarkerClick = (attractionId: string) => {
    // Wywołuje przekazaną funkcję onMarkerClick
    onMarkerClick(attractionId);
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 flex gap-2 flex-wrap">
        {planDays.map((day) => (
          <button
            key={day.id}
            onClick={() => setSelectedDay(day.id)}
            className={`px-3 py-1 text-sm rounded-md ${
              selectedDay === day.id ? "bg-primary text-primary-foreground" : "bg-muted/50 hover:bg-muted"
            }`}
          >
            Day {day.dayNumber}
          </button>
        ))}
      </div>

      <div className="w-full h-[500px] bg-muted/30 relative" role="region" aria-label="Map View">
        {!isMapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-muted-foreground">Loading map...</div>
          </div>
        ) : attractions.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-muted-foreground text-center p-4">
              <p>No attractions with geolocation data available.</p>
              <p className="text-sm mt-1">Switch to list view to see all attractions.</p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 p-4 text-center">
            <p>
              Map implementation placeholder. In a real implementation, markers for{" "}
              {selectedDay ? "selected day" : "all days"} would be displayed here.
            </p>
            <p className="mt-2 text-sm">
              {selectedDay
                ? `${selectedDayAttractions.length} attractions with location data for selected day`
                : `${attractions.length} total attractions with location data`}
            </p>

            {/* Przykładowy przycisk demonstrujący użycie onMarkerClick */}
            {selectedDayAttractions.length > 0 && (
              <button
                onClick={() => handleMarkerClick(selectedDayAttractions[0].id)}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
              >
                Symuluj kliknięcie na pierwszy marker
              </button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
