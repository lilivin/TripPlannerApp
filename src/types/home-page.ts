import type { HomeGuestResponse, HomeUserResponse } from "@/types";

// Types for components with static data
export interface HowItWorksStep {
  icon: string;
  title: string;
  description: string;
}

export interface Testimonial {
  avatarUrl: string;
  name: string;
  text: string;
  rating: number;
}

export interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export interface QuickAction {
  icon: string;
  label: string;
  path: string;
}

// Types for loading states
export type LoadingState = "idle" | "loading" | "success" | "error";

export interface HomePageState {
  loadingState: LoadingState;
  error?: string;
  data: HomeGuestResponse | HomeUserResponse | null;
}

// For handling favorite plan toggling
export interface ToggleFavoriteState {
  isProcessing: boolean;
  pendingSync?: boolean;
  error?: string;
}
