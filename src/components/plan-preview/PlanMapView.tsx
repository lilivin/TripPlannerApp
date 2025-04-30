import { useEffect, useState } from "react";
import { type PlanDayViewModel } from "./hooks/usePlanPreview";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

// Fix Leaflet icon issue
// See: https://github.com/Leaflet/Leaflet/issues/4968
// Import marker icons
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Define the missing URLs for Leaflet markers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Define custom icons for each day
const createDayIcon = (dayNumber: number) => {
  return L.divIcon({
    className: "custom-day-marker",
    html: `<div class="w-6 h-6 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full">${dayNumber}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

interface PlanMapViewProps {
  planDays: PlanDayViewModel[];
  onMarkerClick: (attractionId: string) => void;
}

export default function PlanMapView({ planDays, onMarkerClick }: PlanMapViewProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
  const [mapZoom, setMapZoom] = useState(13);
  const [hasNoCoordinates, setHasNoCoordinates] = useState(false);

  // Calculate map center and zoom based on attractions coordinates
  useEffect(() => {
    // Collect all valid coordinates
    const coordinates: [number, number][] = [];
    let noCoordinates = false;

    planDays.forEach((day) => {
      day.attractions.forEach((attraction) => {
        if (attraction.geolocation?.latitude && attraction.geolocation?.longitude) {
          coordinates.push([attraction.geolocation.latitude, attraction.geolocation.longitude]);
        } else {
          noCoordinates = true;
        }
      });
    });

    setHasNoCoordinates(noCoordinates);

    if (coordinates.length === 0) {
      // Default to a generic location if no coordinates are available
      setMapCenter([51.505, -0.09]); // London as default
      setMapZoom(13);
      return;
    }

    if (coordinates.length === 1) {
      // If only one location, center on it
      setMapCenter(coordinates[0]);
      setMapZoom(15);
      return;
    }

    // Calculate bounds to fit all markers
    const bounds = L.latLngBounds(coordinates.map((coord) => L.latLng(coord[0], coord[1])));
    const center = bounds.getCenter();
    setMapCenter([center.lat, center.lng]);

    // Estimate zoom level based on bounds
    const maxDistance = Math.max(bounds.getNorth() - bounds.getSouth(), bounds.getEast() - bounds.getWest());

    // Adjust zoom based on the distance
    let newZoom = 13;
    if (maxDistance > 1) newZoom = 10;
    if (maxDistance > 5) newZoom = 8;
    if (maxDistance > 10) newZoom = 6;
    if (maxDistance > 20) newZoom = 5;

    setMapZoom(newZoom);
  }, [planDays]);

  // Generate colors for each day
  const dayColors = [
    "#3b82f6", // blue-500
    "#ef4444", // red-500
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#14b8a6", // teal-500
    "#f97316", // orange-500
    "#6366f1", // indigo-500
  ];

  // Get color for a day (repeats if more than 9 days)
  const getDayColor = (dayNumber: number) => {
    return dayColors[(dayNumber - 1) % dayColors.length];
  };

  return (
    <Card className="w-full h-[700px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Map View</CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {planDays.map((day) => (
            <Badge key={day.id} style={{ backgroundColor: getDayColor(day.dayNumber) }}>
              Day {day.dayNumber}
            </Badge>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-0 pb-2 px-2">
        {hasNoCoordinates && (
          <Alert className="mb-2">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Some attractions don&apos;t have location data and won&apos;t appear on the map.
            </AlertDescription>
          </Alert>
        )}

        <div className="h-[600px] rounded-md overflow-hidden">
          <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {planDays.map((day) => {
              // Get attractions with valid coordinates
              const validAttractions = day.attractions.filter(
                (attr) => attr.geolocation?.latitude && attr.geolocation?.longitude
              );

              // Create polyline coordinates
              const lineCoordinates = validAttractions.map((attr) => {
                if (attr.geolocation?.latitude && attr.geolocation?.longitude) {
                  return [attr.geolocation.latitude, attr.geolocation.longitude] as [number, number];
                }
                return [0, 0] as [number, number]; // Fallback, should never happen due to filter
              });

              const dayColor = getDayColor(day.dayNumber);

              return (
                <div key={day.id}>
                  {/* Polyline connecting attractions */}
                  {lineCoordinates.length > 1 && (
                    <Polyline positions={lineCoordinates} color={dayColor} weight={3} opacity={0.7} dashArray="5, 10" />
                  )}

                  {/* Markers for each attraction */}
                  {validAttractions.map((attraction) => (
                    <Marker
                      key={attraction.id}
                      position={[attraction.geolocation?.latitude || 0, attraction.geolocation?.longitude || 0]}
                      icon={createDayIcon(day.dayNumber)}
                      eventHandlers={{
                        click: () => onMarkerClick(attraction.id),
                      }}
                    >
                      <Popup>
                        <div className="max-w-[200px]">
                          <div className="font-medium">{attraction.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {attraction.startTime && attraction.endTime && (
                              <div>
                                {attraction.startTime} - {attraction.endTime}
                              </div>
                            )}
                            {attraction.address && <div className="mt-1">{attraction.address}</div>}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </div>
              );
            })}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}
