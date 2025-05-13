import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-primary/10 to-transparent pt-8 pb-16">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between">
        <div className="lg:w-1/2 mb-10 lg:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Plan Your Perfect Trip with TripPlanner</h1>
          <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
            Discover unique guides created by local experts and plan unforgettable adventures.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" asChild>
              <a href="/auth/signup">Sign Up for Free</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/guides">Browse Guides</a>
            </Button>
          </div>
        </div>
        <div className="lg:w-1/2">
          <img
            src="/images/hero-image.jpg"
            alt="Trip Planning"
            className="rounded-lg shadow-xl"
            width={600}
            height={400}
          />
        </div>
      </div>
    </section>
  );
}
