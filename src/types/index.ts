export interface Agency {
  id: string;
  title: string;
  slug: string;
  totalScore: number | null;
  reviewsCount: number | null;
  street: string | null;
  city: string | null;
  cityNormalized: string;
  state: string | null;
  countryCode: string | null;
  country: string;
  website: string | null;
  phone: string | null;
  categoryName: string | null;
  category: string;
  url: string;
  description: string;
  featured: boolean;
  imageUrl?: string | null;
  location?: {
    lat: number;
    lng: number;
  } | null;
  verified?: boolean;
  email?: string | null;
}

export interface FilterOptions {
  city: string;
  country: string;
  rating: number;
  category: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
}
