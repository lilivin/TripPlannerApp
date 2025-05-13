import { Button } from "@/components/ui/button";
import { MapPin, Book, PlusCircle, Star, Clock } from "lucide-react";
import type { QuickAction } from "@/types/home-page";

export function QuickActionsBar() {
  const actions: QuickAction[] = [
    {
      icon: "explore",
      label: "Explore Guides",
      path: "/guides",
    },
    {
      icon: "create",
      label: "Create Plan",
      path: "/plans/create",
    },
    {
      icon: "saved",
      label: "Saved Plans",
      path: "/plans",
    },
    {
      icon: "recent",
      label: "Recent Views",
      path: "/history",
    },
  ];

  // Map of icon names to components
  const iconMap: Record<string, React.ReactNode> = {
    explore: <MapPin className="w-5 h-5" />,
    create: <PlusCircle className="w-5 h-5" />,
    saved: <Star className="w-5 h-5" />,
    recent: <Clock className="w-5 h-5" />,
    guides: <Book className="w-5 h-5" />,
  };

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="flex flex-col items-center justify-center h-24 py-2 border-primary/10 hover:bg-primary/5"
            asChild
          >
            <a href={action.path}>
              <div className="bg-primary/10 p-2 rounded-full mb-2">
                {iconMap[action.icon] || <div className="w-5 h-5" />}
              </div>
              <span>{action.label}</span>
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
}
