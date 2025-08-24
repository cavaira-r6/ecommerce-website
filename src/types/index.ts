export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  variants?: string[];
  createdAt: string;
}

export interface WishlistItem {
  productId: string;
  dateAdded: string;
}

export interface RecentlyViewedItem {
  productId: string;
  viewedAt: string;
}

export interface CategoryWithIcon {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export interface ProductRecommendation {
  product: Product;
  score: number;
  reason: string;
}

export interface SocialProof {
  type: 'purchase' | 'review' | 'wishlist';
  productId: string;
  userId: string;
  userName: string;
  timestamp: string;
  message: string;
}

export interface AnalyticsEvent {
  eventName: string;
  timestamp: string;
  data: Record<string, any>;
  userId?: string;
}
