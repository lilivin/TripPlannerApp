import type { FeaturedGuideDto } from "@/types";
import { FeaturedGuidesCarousel } from "./guest/FeaturedGuidesCarousel";
import { HeroSection } from "./guest/HeroSection";
import { HowItWorksSteps } from "./guest/HowItWorksSteps";
import { TestimonialSlider } from "./guest/TestimonialSlider";
import { BenefitsList } from "./guest/BenefitsList";
import { RegisterCTA } from "./guest/RegisterCTA";
import type { HowItWorksStep, Testimonial, Benefit } from "@/types/home-page";

// Static data for components
const howItWorksSteps: HowItWorksStep[] = [
  {
    icon: "search",
    title: "Find Your Destination",
    description: "Browse our curated guides from unique locations around the world",
  },
  {
    icon: "map",
    title: "Customize Your Plan",
    description: "Personalize your itinerary based on your preferences and interests",
  },
  {
    icon: "calendar",
    title: "Plan Your Trip",
    description: "Save your plan and access it anytime, even offline",
  },
  {
    icon: "backpack",
    title: "Enjoy Your Journey",
    description: "Experience your trip with detailed guides and recommendations",
  },
];

const testimonials: Testimonial[] = [
  {
    avatarUrl: "/images/testimonials/user-1.jpg",
    name: "Alex Morgan",
    text: "TripPlanner made planning our honeymoon so easy! The personalized recommendations were spot on.",
    rating: 5,
  },
  {
    avatarUrl: "/images/testimonials/user-2.jpg",
    name: "Sara Johnson",
    text: "I love how I can access all my travel plans offline. Saved me when I lost connection in rural Italy!",
    rating: 5,
  },
  {
    avatarUrl: "/images/testimonials/user-3.jpg",
    name: "David Chen",
    text: "As a frequent business traveler, this app has simplified my life. The custom plans save me hours of research.",
    rating: 4,
  },
];

const benefits: Benefit[] = [
  {
    icon: "offline",
    title: "Offline Access",
    description: "Access your travel plans anytime, anywhere, even without internet connection",
  },
  {
    icon: "personalize",
    title: "Personalized Plans",
    description: "Get customized itineraries based on your preferences and travel style",
  },
  {
    icon: "discover",
    title: "Local Insights",
    description: "Discover hidden gems and authentic experiences from local experts",
  },
  {
    icon: "save",
    title: "Save Time & Money",
    description: "Efficient planning tools help you make the most of your budget and time",
  },
];

interface GuestHomePageProps {
  featuredGuides: FeaturedGuideDto[];
}

export default function GuestHomePage({ featuredGuides }: GuestHomePageProps) {
  return (
    <div className="flex flex-col gap-16 py-6">
      <HeroSection />

      <FeaturedGuidesCarousel guides={featuredGuides} />

      <HowItWorksSteps steps={howItWorksSteps} />

      <TestimonialSlider testimonials={testimonials} />

      <BenefitsList benefits={benefits} />

      <RegisterCTA />
    </div>
  );
}
