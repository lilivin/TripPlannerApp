import { Wifi, UserCircle, Compass, DollarSign } from "lucide-react";
import type { Benefit } from "@/types/home-page";

interface BenefitsListProps {
  benefits: Benefit[];
}

export function BenefitsList({ benefits }: BenefitsListProps) {
  // Map of icon names to components
  const iconMap: Record<string, React.ReactNode> = {
    offline: <Wifi className="w-8 h-8 text-primary" />,
    personalize: <UserCircle className="w-8 h-8 text-primary" />,
    discover: <Compass className="w-8 h-8 text-primary" />,
    save: <DollarSign className="w-8 h-8 text-primary" />,
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Why Use TripPlanner</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-4 p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
              <div className="bg-primary/10 p-3 rounded-full shrink-0">
                {iconMap[benefit.icon] || <div className="w-8 h-8 bg-primary/20 rounded-full" />}
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
