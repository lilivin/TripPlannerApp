import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Calendar, MapPin, Loader2, CloudOff } from "lucide-react";
import type { RecentPlanDto } from "@/types";
import type { ToggleFavoriteState } from "@/types/home-page";
import { LazyImage } from "@/components/ui/LazyImage";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RecentPlansGridProps {
  plans: RecentPlanDto[];
  onToggleFavorite: (planId: string, isFavorite: boolean) => Promise<void>;
  favoriteState: Record<string, ToggleFavoriteState>;
}

export function RecentPlansGrid({ plans, onToggleFavorite, favoriteState }: RecentPlansGridProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-6">Your Recent Plans</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const planState = favoriteState[plan.id] || {};
          const isProcessing = planState.isProcessing || false;
          const isPendingSync = planState.pendingSync || false;

          return (
            <Card key={plan.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
                {plan.thumbnail_url ? (
                  <LazyImage
                    src={plan.thumbnail_url}
                    alt={plan.name}
                    aspectRatio="16/9"
                    containerClassName="w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <MapPin className="w-12 h-12 text-gray-300 dark:text-gray-700" />
                  </div>
                )}

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className={`absolute top-2 right-2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full backdrop-blur-sm ${
                          isPendingSync ? "ring-2 ring-yellow-500/50" : ""
                        }`}
                        onClick={() => onToggleFavorite(plan.id, !plan.is_favorite)}
                        disabled={isProcessing}
                        aria-label={plan.is_favorite ? "Remove from favorites" : "Add to favorites"}
                      >
                        {isProcessing ? (
                          <Loader2 className="w-5 h-5 text-gray-600 dark:text-gray-400 animate-spin" />
                        ) : isPendingSync ? (
                          <CloudOff className={`w-5 h-5 text-yellow-500`} />
                        ) : (
                          <Star
                            className={`w-5 h-5 ${
                              plan.is_favorite ? "text-yellow-500 fill-yellow-500" : "text-gray-400 dark:text-gray-600"
                            }`}
                          />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isProcessing
                        ? "Processing..."
                        : isPendingSync
                          ? "Will sync when online"
                          : plan.is_favorite
                            ? "Remove from favorites"
                            : "Add to favorites"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <CardContent className="p-4">
                <h3 className="text-xl font-bold mb-1 line-clamp-1">{plan.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="line-clamp-1">{plan.guide.location_name}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Created: {formatDate(plan.created_at)}</span>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button asChild variant="outline" className="w-full">
                  <a href={`/plans/${plan.id}`}>View Plan</a>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
