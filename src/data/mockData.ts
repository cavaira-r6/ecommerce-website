import { Product, User, Order, AdminStats } from './types';

// Mock Products Data
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    price: 199.99,
    originalPrice: 249.99,
    category: 'Electronics',
    subcategory: 'Audio',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop'
    ],
    inStock: true,
    stockQuantity: 25,
    rating: 4.5,
    reviewCount: 128,
    tags: ['wireless', 'bluetooth', 'noise-cancelling', 'premium'],
    features: [
      'Active Noise Cancellation',
      '30-hour battery life',
      'Quick charge (5 min = 3 hours)',
      'Premium comfort fit',
      'High-quality audio drivers'
    ],
    specifications: {
      'Battery Life': '30 hours',
      'Charging Time': '2 hours',
      'Weight': '250g',
      'Connectivity': 'Bluetooth 5.0',
      'Frequency Response': '20Hz - 20kHz'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking watch with heart rate monitoring, GPS, and smartphone integration.',
    price: 299.99,
    category: 'Electronics',
    subcategory: 'Wearables',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop'
    ],
    inStock: true,
    stockQuantity: 15,
    rating: 4.3,
    reviewCount: 89,
    tags: ['fitness', 'smartwatch', 'health', 'gps'],
    features: [
      'Heart rate monitoring',
      'Built-in GPS',
      'Water resistant (50m)',
      '7-day battery life',
      'Sleep tracking'
    ],
    specifications: {
      'Display': '1.4" AMOLED',
      'Battery Life': '7 days',
      'Water Resistance': '5ATM',
      'Sensors': 'Heart rate, GPS, Accelerometer',
      'Compatibility': 'iOS & Android'
    },
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-18T12:00:00Z'
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable organic cotton t-shirt. Perfect for everyday wear with a classic fit.',
    price: 29.99,
    originalPrice: 39.99,
    category: 'Clothing',
    subcategory: 'T-Shirts',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500&h=500&fit=crop'
    ],
    inStock: true,
    stockQuantity: 50,
    rating: 4.7,
    reviewCount: 203,
    tags: ['organic', 'cotton', 'sustainable', 'casual'],
    features: [
      '100% Organic Cotton',
      'Pre-shrunk fabric',
      'Comfortable fit',
      'Machine washable',
      'Eco-friendly production'
    ],
    specifications: {
      'Material': '100% Organic Cotton',
      'Fit': 'Regular',
      'Care': 'Machine wash cold',
      'Origin': 'Ethically sourced',
      'Sizes': 'XS - XXL'
    },
    createdAt: '2024-01-05T14:00:00Z',
    updatedAt: '2024-01-12T09:30:00Z'
  },
  {
    id: '4',
    name: 'Professional Coffee Maker',
    description: 'High-end coffee maker with programmable settings and thermal carafe. Brew café-quality coffee at home.',
    price: 149.99,
    category: 'Home & Kitchen',
    subcategory: 'Appliances',
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop'
    ],
    inStock: true,
    stockQuantity: 12,
    rating: 4.6,
    reviewCount: 156,
    tags: ['coffee', 'appliance', 'kitchen', 'programmable'],
    features: [
      'Programmable 24-hour timer',
      'Thermal carafe keeps coffee hot',
      'Auto shut-off safety feature',
      'Permanent gold-tone filter',
      'Brew strength control'
    ],
    specifications: {
      'Capacity': '12 cups',
      'Power': '1000W',
      'Dimensions': '14" x 10" x 16"',
      'Weight': '8 lbs',
      'Warranty': '2 years'
    },
    createdAt: '2024-01-08T11:00:00Z',
    updatedAt: '2024-01-16T16:45:00Z'
  },
  {
    id: '5',
    name: 'Leather Laptop Bag',
    description: 'Premium leather laptop bag with multiple compartments. Professional and stylish for business use.',
    price: 89.99,
    originalPrice: 119.99,
    category: 'Accessories',
    subcategory: 'Bags',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=500&fit=crop'
    ],
    inStock: true,
    stockQuantity: 8,
    rating: 4.4,
    reviewCount: 67,
    tags: ['leather', 'laptop', 'professional', 'business'],
    features: [
      'Genuine leather construction',
      'Fits laptops up to 15.6"',
      'Multiple organizational pockets',
      'Adjustable shoulder strap',
      'Professional appearance'
    ],
    specifications: {
      'Material': 'Genuine Leather',
      'Laptop Size': 'Up to 15.6"',
      'Dimensions': '16" x 12" x 4"',
      'Weight': '2.5 lbs',
      'Color': 'Brown'
    },
    createdAt: '2024-01-12T13:00:00Z',
    updatedAt: '2024-01-19T10:15:00Z'
  },
  {
    id: '6',
    name: 'Yoga Mat Premium',
    description: 'High-quality yoga mat with superior grip and cushioning. Perfect for all types of yoga practice.',
    price: 49.99,
    category: 'Sports & Fitness',
    subcategory: 'Yoga',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1506629905607-d9b1e5b6e5a5?w=500&h=500&fit=crop'
    ],
    inStock: true,
    stockQuantity: 30,
    rating: 4.8,
    reviewCount: 245,
    tags: ['yoga', 'fitness', 'exercise', 'premium'],
    features: [
      'Non-slip surface',
      'Extra thick cushioning (6mm)',
      'Eco-friendly materials',
      'Easy to clean',
      'Comes with carrying strap'
    ],
    specifications: {
      'Thickness': '6mm',
      'Dimensions': '72" x 24"',
      'Material': 'TPE (Eco-friendly)',
      'Weight': '2.2 lbs',
      'Colors': 'Multiple available'
    },
    createdAt: '2024-01-07T09:00:00Z',
    updatedAt: '2024-01-14T14:20:00Z'
  }
];

// Mock Users Data
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@modernshop.com',
    name: 'Admin User',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'john.doe@example.com',
    name: 'John Doe',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '3',
    email: 'jane.smith@example.com',
    name: 'Jane Smith',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    createdAt: '2024-01-20T14:15:00Z'
  }
];

// Mock Orders Data
export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    userId: '2',
    items: [
      {
        id: '1',
        productId: '1',
        name: 'Wireless Bluetooth Headphones',
        price: 199.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
        quantity: 1,
        maxQuantity: 25
      }
    ],
    totalAmount: 199.99,
    status: 'delivered',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    billingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    paymentMethod: 'Credit Card',
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-28T15:30:00Z',
    trackingNumber: 'TRK123456789'
  },
  {
    id: 'ORD-002',
    userId: '3',
    items: [
      {
        id: '2',
        productId: '3',
        name: 'Organic Cotton T-Shirt',
        price: 29.99,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
        quantity: 2,
        maxQuantity: 50
      },
      {
        id: '3',
        productId: '6',
        name: 'Yoga Mat Premium',
        price: 49.99,
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=100&h=100&fit=crop',
        quantity: 1,
        maxQuantity: 30
      }
    ],
    totalAmount: 109.97,
    status: 'processing',
    shippingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    billingAddress: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    paymentMethod: 'PayPal',
    createdAt: '2024-01-26T14:30:00Z',
    updatedAt: '2024-01-26T14:30:00Z'
  }
];

// Mock Admin Stats
export const mockAdminStats: AdminStats = {
  totalUsers: 1250,
  totalOrders: 3420,
  totalRevenue: 125000,
  totalProducts: 156,
  recentOrders: mockOrders.slice(0, 5),
  topProducts: mockProducts.slice(0, 5),
  salesData: [
    { month: 'Jan', sales: 12000, orders: 145 },
    { month: 'Feb', sales: 15000, orders: 178 },
    { month: 'Mar', sales: 18000, orders: 203 },
    { month: 'Apr', sales: 22000, orders: 234 },
    { month: 'May', sales: 25000, orders: 267 },
    { month: 'Jun', sales: 28000, orders: 289 }
  ]
};

// Product Categories
export const productCategories = [
  'Electronics',
  'Clothing',
  'Home & Kitchen',
  'Sports & Fitness',
  'Books',
  'Beauty & Personal Care',
  'Accessories',
  'Automotive',
  'Health & Wellness',
  'Toys & Games'
];

// Helper functions
export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter(product => product.category === category);
};

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getOrdersByUserId = (userId: string): Order[] => {
  return mockOrders.filter(order => order.userId === userId);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockProducts.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};