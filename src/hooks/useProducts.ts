import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Product, RecentlyViewedItem, WishlistItem } from '../types';

export const useRecentlyViewed = (maxItems: number = 6) => {
  const [recentItems, setRecentItems] = useLocalStorage<RecentlyViewedItem[]>('recently-viewed', []);

  const addToRecent = (product: Product) => {
    setRecentItems(prev => {
      const filtered = prev.filter(item => item.productId !== product.id);
      return [
        { productId: product.id, viewedAt: new Date().toISOString() },
        ...filtered,
      ].slice(0, maxItems);
    });
  };

  return { recentItems, addToRecent };
};

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useLocalStorage<WishlistItem[]>('wishlist', []);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const addToWishlist = (product: Product) => {
    setWishlistItems(prev => {
      if (prev.some(item => item.productId === product.id)) {
        setToastMessage('Product already in wishlist');
        setShowToast(true);
        return prev;
      }
      setToastMessage('Added to wishlist');
      setShowToast(true);
      return [...prev, { productId: product.id, dateAdded: new Date().toISOString() }];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prev => prev.filter(item => item.productId !== productId));
    setToastMessage('Removed from wishlist');
    setShowToast(true);
  };

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    showToast,
    toastMessage,
  };
};

export const useProductRecommendations = (
  currentProduct?: Product,
  recentlyViewed: RecentlyViewedItem[] = [],
  wishlistItems: WishlistItem[] = []
) => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would call your backend API with the user's data
        const response = await fetch('/api/recommendations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentProductId: currentProduct?.id,
            recentlyViewed: recentlyViewed.map(item => item.productId),
            wishlistItems: wishlistItems.map(item => item.productId),
          }),
        });
        const data = await response.json();
        setRecommendations(data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentProduct?.id, recentlyViewed, wishlistItems]);

  return { recommendations, isLoading };
};

interface UseAnalyticsOptions {
  debug?: boolean;
}

export const useAnalytics = (options: UseAnalyticsOptions = {}) => {
  const trackEvent = async (eventName: string, eventData: Record<string, any> = {}) => {
    try {
      if (options.debug) {
        console.log(`[Analytics] ${eventName}:`, eventData);
      }

      // In production, send to your analytics service
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName,
          timestamp: new Date().toISOString(),
          data: eventData,
        }),
      });
    } catch (error) {
      console.error(`Error tracking event ${eventName}:`, error);
    }
  };

  return { trackEvent };
};
