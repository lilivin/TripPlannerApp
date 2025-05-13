import { Button } from "@/components/ui/button";

interface RegisterCTAProps {
  variant?: "primary" | "secondary";
}

export function RegisterCTA({ variant = "primary" }: RegisterCTAProps) {
  if (variant === "primary") {
    return (
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Adventure?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto">
            Join our community of travelers and plan your dream trip today!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-gray-100" asChild>
              <a href="/auth/signup">Sign Up Free</a>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-white border-white hover:bg-primary-foreground/10"
              asChild
            >
              <a href="/auth/login">Log In</a>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // Secondary variant
  return (
    <div className="flex flex-wrap gap-4 justify-center my-8">
      <Button size="lg" className="min-w-40" asChild>
        <a href="/auth/signup">Sign Up Free</a>
      </Button>
      <Button size="lg" variant="outline" className="min-w-40" asChild>
        <a href="/auth/login">Log In</a>
      </Button>
    </div>
  );
}
