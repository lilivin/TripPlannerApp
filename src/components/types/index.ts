export interface TagDto {
  id: string;
  name: string;
  category: string;
}

export interface GuideMinimalDto {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  location_name: string;
}

export interface GuideDetailDto extends GuideMinimalDto {
  tags: TagDto[];
  attractions: GuideAttractionDto[];
  reviews: ReviewDto[];
  updated_at: string;
  created_at: string;
  is_published: boolean;
  version: number;
  reviews_count: number;
  creator: {
    id: string;
    name: string;
    avatar_url: string;
    display_name: string;
  };
  average_rating: number;
  recommended_days: number;
  price: number;
  cover_image_url: string;
  language: string;
}

export interface GuideAttractionDto extends AttractionDto {
  custom_description: string | null;
  order_index: number;
  is_highlight: boolean;
  address: string;
  visit_duration: number;
  note: string | null;
  images: string[];
  tags: TagDto[];
}

export interface AttractionDto {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface ReviewDto {
  id: string;
  rating: number;
  comment: string;
  author: string;
  createdAt: string;
}

export interface CreatorWithImageDto {
  id: string;
  name: string;
  display_name: string;
  profile_image_url: string | null;
}

export interface Json {
  [key: string]: Json | Json[] | string | number | boolean | null | undefined;
}

export interface PlanGenerationParams {
  days: number;
  preferences: {
    include_tags?: string[];
    exclude_tags?: string[];
    start_time?: string;
    end_time?: string;
    include_meals?: boolean;
    transportation_mode?: string;
  };
}
