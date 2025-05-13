import { Search, Map, Calendar, Backpack } from "lucide-react";
import type { HowItWorksStep } from "@/types/home-page";

interface HowItWorksStepsProps {
  steps: HowItWorksStep[];
}

export function HowItWorksSteps({ steps }: HowItWorksStepsProps) {
  // Map of icon names to components
  const iconMap: Record<string, React.ReactNode> = {
    search: <Search className="w-8 h-8 text-primary" />,
    map: <Map className="w-8 h-8 text-primary" />,
    calendar: <Calendar className="w-8 h-8 text-primary" />,
    backpack: <Backpack className="w-8 h-8 text-primary" />,
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm flex flex-col items-center text-center"
            >
              <div className="mb-4 bg-primary/10 p-4 rounded-full">
                {iconMap[step.icon] || <div className="w-8 h-8 bg-primary/20 rounded-full" />}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
