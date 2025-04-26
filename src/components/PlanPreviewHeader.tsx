import { type GuideMinimalDto } from "@/types";
import { type GeneratedPlanViewModel } from "./hooks/usePlanPreview";
import { MapPin, Calendar, Coffee, Tag, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlanPreviewHeaderProps {
  guide: GuideMinimalDto;
  generationParams: GeneratedPlanViewModel["generationParams"];
}

export default function PlanPreviewHeader({ guide, generationParams }: PlanPreviewHeaderProps) {
  // Format time from 24h format "HH:MM" to a more readable format
  const formatTime = (time?: string) => {
    if (!time) return "Not specified";

    try {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch {
      return time;
    }
  };

  // Get preferences from generation params
  const { days, preferences } = generationParams;
  const includeTags = preferences.include_tags || [];
  const excludeTags = preferences.exclude_tags || [];
  const startTime = preferences.start_time;
  const endTime = preferences.end_time;
  const includeMeals = preferences.include_meals;
  const transportationMode = preferences.transportation_mode;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl">{guide.title}</CardTitle>
        <div className="flex items-center text-muted-foreground mt-1">
          <MapPin className="h-4 w-4 mr-1" />
          {guide.location_name}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            <div>
              <div className="text-sm font-medium">Plan Duration</div>
              <div className="text-sm text-muted-foreground">
                {days} {days === 1 ? "day" : "days"}
              </div>
            </div>
          </div>

          {(startTime || endTime) && (
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-primary" />
              <div>
                <div className="text-sm font-medium">Daily Schedule</div>
                <div className="text-sm text-muted-foreground">
                  {startTime && endTime
                    ? `${formatTime(startTime)} to ${formatTime(endTime)}`
                    : startTime
                      ? `Starting from ${formatTime(startTime)}`
                      : `Ending by ${formatTime(endTime)}`}
                </div>
              </div>
            </div>
          )}

          {transportationMode && (
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 mr-2 text-primary"
              >
                {transportationMode === "walking" && (
                  <path d="M13 4v16M7 4v1M7 9v6M7 21v-1M19 4v1M19 9v6M19 21v-1M4 4h1M9 4h6M20 4h-1M4 20h1M9 20h6M20 20h-1M4 7h1M4 13h1M4 19h1M20 7h1M20 13h1M20 19h1"></path>
                )}
                {transportationMode === "driving" && (
                  <>
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-2.7-.6-4.5-1.1C10.7 8.7 10 8 10 7v-2c0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1v8.5c0 .8.7 1.5 1.5 1.5h4"></path>
                    <circle cx="5" cy="17" r="2"></circle>
                    <path d="M16.3 17H7.7"></path>
                    <circle cx="19" cy="17" r="2"></circle>
                  </>
                )}
                {transportationMode === "bicycling" && (
                  <>
                    <circle cx="5" cy="17" r="3"></circle>
                    <circle cx="19" cy="17" r="3"></circle>
                    <path d="M12 17h-2"></path>
                    <path d="m9 10 3 3"></path>
                    <path d="M9 9h6"></path>
                    <path d="m15 12 3-3"></path>
                    <path d="M6 8h12"></path>
                  </>
                )}
                {transportationMode === "transit" && (
                  <>
                    <path d="M4 11h4"></path>
                    <path d="M4 5h16"></path>
                    <path d="M6 2v16"></path>
                    <path d="M18 2v16"></path>
                    <path d="M4 15h3"></path>
                    <path d="M17 15h3"></path>
                    <path d="M4 20h16"></path>
                  </>
                )}
                {!["walking", "driving", "bicycling", "transit"].includes(transportationMode || "") && (
                  <>
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 16v-4M12 8V7"></path>
                  </>
                )}
              </svg>
              <div>
                <div className="text-sm font-medium">Transportation</div>
                <div className="text-sm text-muted-foreground">
                  {transportationMode.charAt(0).toUpperCase() + transportationMode.slice(1)}
                </div>
              </div>
            </div>
          )}

          {includeMeals && (
            <div className="flex items-center">
              <Coffee className="h-5 w-5 mr-2 text-primary" />
              <div>
                <div className="text-sm font-medium">Meals</div>
                <div className="text-sm text-muted-foreground">Included in plan</div>
              </div>
            </div>
          )}
        </div>

        {(includeTags.length > 0 || excludeTags.length > 0) && (
          <div className="mt-4">
            <div className="flex flex-col gap-2">
              {includeTags.length > 0 && (
                <div>
                  <div className="flex items-center mb-1">
                    <Tag className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Included</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {includeTags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {excludeTags.length > 0 && (
                <div>
                  <div className="flex items-center mb-1">
                    <Tag className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Excluded</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {excludeTags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="line-through">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
