interface PageMeta {
  title: string;
  description: string;
  keywords: string;
}

interface MetaConfig {
  [key: string]: PageMeta;
}

export const metaConfig: MetaConfig = {
  home: {
    title: 'MiniU - Your One-Stop Shop for Everything',
    description: 'Discover a wide range of quality products at MiniU. Shop electronics, fashion, home goods, and more with secure payment and fast delivery in Tunisia.',
    keywords: 'online shop, e-commerce, Tunisia shopping, electronics, fashion, home goods',
  },
  shop: {
    title: 'Shop All Products - MiniU',
    description: 'Browse our complete collection of products. Find great deals on electronics, fashion, accessories, and more.',
    keywords: 'shop, products, deals, electronics, fashion, accessories, Tunisia',
  },
  cart: {
    title: 'Your Shopping Cart - MiniU',
    description: 'Review your shopping cart and proceed to checkout. Secure payments and fast delivery available.',
    keywords: 'shopping cart, checkout, online payment, delivery',
  },
  checkout: {
    title: 'Secure Checkout - MiniU',
    description: 'Complete your purchase securely. Multiple payment options available including Flouci and cash on delivery.',
    keywords: 'checkout, payment, secure payment, Flouci, cash on delivery',
  },
  account: {
    title: 'Your Account - MiniU',
    description: 'Manage your account settings, view orders, and track deliveries.',
    keywords: 'account, orders, profile, settings, order tracking',
  },
  contact: {
    title: 'Contact Us - MiniU',
    description: 'Get in touch with our customer support team. We\'re here to help with any questions or concerns.',
    keywords: 'contact, support, help, customer service',
  },
  about: {
    title: 'About Us - MiniU',
    description: 'Learn more about MiniU and our commitment to providing quality products and excellent service.',
    keywords: 'about us, company, mission, values',
  },
  privacy: {
    title: 'Privacy Policy - MiniU',
    description: 'Learn about how we collect, use, and protect your personal information.',
    keywords: 'privacy policy, data protection, personal information',
  },
  terms: {
    title: 'Terms and Conditions - MiniU',
    description: 'Read our terms and conditions regarding the use of our website and services.',
    keywords: 'terms, conditions, legal, agreements',
  },
  returns: {
    title: 'Returns & Refunds - MiniU',
    description: 'Learn about our return policy and refund process.',
    keywords: 'returns, refunds, policy, shipping return',
  },
  admin: {
    title: 'Admin Dashboard - MiniU',
    description: 'Manage products, orders, and users.',
    keywords: 'admin, dashboard, management',
  },
  error404: {
    title: 'Page Not Found - MiniU',
    description: 'The page you are looking for could not be found.',
    keywords: '404, error, not found',
  },
};
