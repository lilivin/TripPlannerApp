import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { UserGreetingDto } from "@/types";

interface UserWelcomeProps {
  greeting: UserGreetingDto;
}

export function UserWelcome({ greeting }: UserWelcomeProps) {
  // Determine greeting based on time of day
  const getTimeBasedGreeting = (): string => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const timeGreeting = getTimeBasedGreeting();
  const displayName = greeting.display_name || "Traveler";

  return (
    <div className="bg-gradient-to-b from-primary/5 to-transparent pt-8 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-14 h-14 border-2 border-primary">
            <AvatarImage src={greeting.avatar_url || undefined} alt={displayName} />
            <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-3xl font-bold">
              {timeGreeting}, {displayName}!
            </h1>
            <p className="text-muted-foreground">What are you planning today?</p>
          </div>
        </div>
      </div>
    </div>
  );
}
