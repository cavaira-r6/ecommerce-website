import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Sample products data
const sampleProducts = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.',
    price: 199.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
    stockQuantity: 25
  },
  {
    name: 'Smart Fitness Watch',
    description: 'Advanced fitness tracking watch with heart rate monitoring, GPS, and smartphone integration.',
    price: 299.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    stockQuantity: 15
  },
  {
    name: 'Organic Cotton T-Shirt',
    description: 'Comfortable and sustainable organic cotton t-shirt. Perfect for everyday wear with a classic fit.',
    price: 29.99,
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
    stockQuantity: 50
  },
  {
    name: 'Professional Coffee Maker',
    description: 'High-end coffee maker with programmable settings and thermal carafe. Brew café-quality coffee at home.',
    price: 149.99,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop',
    stockQuantity: 12
  },
  {
    name: 'Leather Laptop Bag',
    description: 'Premium leather laptop bag with multiple compartments. Professional and stylish for business use.',
    price: 89.99,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop',
    stockQuantity: 8
  },
  {
    name: 'Yoga Mat Premium',
    description: 'High-quality yoga mat with superior grip and cushioning. Perfect for all types of yoga practice.',
    price: 49.99,
    category: 'Sports & Fitness',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop',
    stockQuantity: 30
  },
  {
    name: 'Gaming Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with tactile switches, perfect for gaming and professional use.',
    price: 129.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=500&h=500&fit=crop',
    stockQuantity: 20
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof portable speaker with 360-degree sound and 24-hour battery life.',
    price: 79.99,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop',
    stockQuantity: 35
  },
  {
    name: 'Professional Chef Knife',
    description: 'High-carbon steel chef knife with ergonomic handle. Essential tool for any kitchen.',
    price: 89.99,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=500&h=500&fit=crop',
    stockQuantity: 15
  },
  {
    name: 'Memory Foam Pillow',
    description: 'Contour memory foam pillow with cooling gel layer for better sleep and neck support.',
    price: 59.99,
    category: 'Home & Kitchen',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&h=500&fit=crop',
    stockQuantity: 40
  }
];

// Clear existing products (optional)
db.run("DELETE FROM products", (err) => {
  if (err) {
    console.error('Error clearing products:', err);
  } else {
    console.log('Cleared existing products');
  }
});

// Add sample products
const insertProduct = db.prepare(`
  INSERT INTO products (name, description, price, category, image, stockQuantity, created_at) 
  VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
`);

sampleProducts.forEach((product, index) => {
  insertProduct.run([
    product.name,
    product.description,
    product.price,
    product.category,
    product.image,
    product.stockQuantity
  ], function(err) {
    if (err) {
      console.error(`Error adding product ${product.name}:`, err);
    } else {
      console.log(`✅ Added product: ${product.name} (ID: ${this.lastID})`);
    }
    
    // Close database after adding all products
    if (index === sampleProducts.length - 1) {
      insertProduct.finalize();
      
      // Add some sample orders for testing
      const sampleOrders = [
        {
          customer_email: 'john.doe@example.com',
          total: 199.99,
          status: 'completed',
          payment_method: 'Credit Card'
        },
        {
          customer_email: 'jane.smith@example.com',
          total: 159.98,
          status: 'completed',
          payment_method: 'PayPal'
        },
        {
          customer_email: 'mike.wilson@example.com',
          total: 89.99,
          status: 'pending',
          payment_method: 'Credit Card'
        }
      ];

      const insertOrder = db.prepare(`
        INSERT INTO orders (customer_email, total, status, payment_method, created_at) 
        VALUES (?, ?, ?, ?, datetime('now'))
      `);

      sampleOrders.forEach((order, orderIndex) => {
        insertOrder.run([
          order.customer_email,
          order.total,
          order.status,
          order.payment_method
        ], function(err) {
          if (err) {
            console.error(`Error adding order:`, err);
          } else {
            console.log(`✅ Added order: ${order.customer_email} - $${order.total}`);
          }
          
          if (orderIndex === sampleOrders.length - 1) {
            insertOrder.finalize();
            db.close((err) => {
              if (err) {
                console.error('Error closing database:', err);
              } else {
                console.log('\n🎉 Successfully added all sample data to the database!');
                console.log('\nYou can now:');
                console.log('1. Start your server: npm run dev (in the server directory)');
                console.log('2. View the database: node database-viewer.js (in the server directory)');
                console.log('3. Check the admin dashboard in your React app');
              }
            });
          }
        });
      });
    }
  });
});
