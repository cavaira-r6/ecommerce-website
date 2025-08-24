import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';
import nodemailer from 'nodemailer';
import timeout from 'connect-timeout';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3002;

// Initialize express app
const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Request timeout middleware
app.use(timeout('30s'));
app.use((req, res, next) => {
  if (!req.timedout) next();
});

// Basic middleware
app.use(express.json());

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com' 
    : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir);
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Import and use payment routes
import paymentRoutes from './routes/payment.js';
app.use('/api/payment', paymentRoutes);
// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir));

// Database setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Create users table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT,
      image TEXT,
      stockQuantity INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Insert default admin user if not exists
  db.get("SELECT * FROM users WHERE email = 'admin@miniu.com'", (err, row) => {
    if (!row) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      db.run(
        "INSERT INTO users (email, name, password, role) VALUES (?, ?, ?, ?)",
        ['admin@miniu.com', 'Admin User', hashedPassword, 'admin']
      );
    }
  });
  
  // Insert default user if not exists
  db.get("SELECT * FROM users WHERE email = 'john.doe@example.com'", (err, row) => {
    if (!row) {
      const hashedPassword = bcrypt.hashSync('password123', 10);
      db.run(
        "INSERT INTO users (email, name, password, role) VALUES (?, ?, ?, ?)",
        ['john.doe@example.com', 'John Doe', hashedPassword, 'user']
      );
    }
  });
});

// JWT Secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Routes

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    // Check if user already exists
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, row) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          error: 'Database error' 
        });
      }

      if (row) {
        return res.status(400).json({ 
          success: false, 
          error: 'User with this email already exists' 
        });
      }

      // Hash password
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Insert new user
      db.run(
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        function(err) {
          if (err) {
            return res.status(500).json({ 
              success: false, 
              error: 'Failed to create user' 
            });
          }

          // Get the created user
          db.get("SELECT * FROM users WHERE id = ?", [this.lastID], (err, user) => {
            if (err) {
              return res.status(500).json({ 
                success: false, 
                error: 'Failed to retrieve user' 
              });
            }

            const token = generateToken(user);
            res.json({
              success: true,
              data: {
                user: {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  role: user.role,
                  createdAt: user.created_at
                },
                token
              }
            });
          });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }

    // Find user
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          error: 'Database error' 
        });
      }

      if (!user) {
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid credentials' 
        });
      }

      // Check password
      const isValidPassword = bcrypt.compareSync(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid credentials' 
        });
      }

      const token = generateToken(user);
      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.created_at
          },
          token
        }
      });
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Server error' 
    });
  }
});

// Middleware to verify admin role
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// Create orders table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_email TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      payment_method TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Get all products
app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Database error' });
    }
    // Transform products to match frontend type
    const transformedProducts = rows.map(product => ({
      id: product.id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.original_price,
      category: product.category,
      images: [product.image],
      inStock: product.stockQuantity > 0,
      stockQuantity: product.stockQuantity,
      rating: product.rating || 4.5,
      reviewCount: product.reviewCount || 0,
      tags: [],
      features: product.features ? JSON.parse(product.features) : [],
      specifications: product.specifications ? JSON.parse(product.specifications) : {},
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));
    res.json(transformedProducts);
  });
});

// Admin: Get dashboard stats
app.get('/api/admin/stats', verifyAdmin, (req, res) => {
  const queries = {
    totalProducts: "SELECT COUNT(*) as count FROM products",
    totalUsers: "SELECT COUNT(*) as count FROM users",
    totalOrders: "SELECT COUNT(*) as count FROM orders",
    revenue: "SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status = 'completed'"
  };

  const stats = {};
  let completed = 0;
  const total = Object.keys(queries).length;

  Object.entries(queries).forEach(([key, query]) => {
    db.get(query, (err, row) => {
      if (err) {
        console.error(`Error executing ${key} query:`, err);
        stats[key] = 0;
      } else {
        stats[key] = key === 'revenue' ? row.total : row.count;
      }
      
      completed++;
      if (completed === total) {
        res.json({
          totalProducts: stats.totalProducts || 0,
          totalUsers: stats.totalUsers || 0,
          totalOrders: stats.totalOrders || 0,
          revenue: stats.revenue || 0
        });
      }
    });
  });
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Database error' });
    }
    if (!row) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    // Transform product to match frontend type
    const transformedProduct = {
      id: row.id.toString(),
      name: row.name,
      description: row.description,
      price: row.price,
      originalPrice: row.original_price,
      category: row.category,
      images: [row.image],
      inStock: row.stockQuantity > 0,
      stockQuantity: row.stockQuantity,
      rating: row.rating || 4.5,
      reviewCount: row.reviewCount || 0,
      tags: [],
      features: row.features ? JSON.parse(row.features) : [],
      specifications: row.specifications ? JSON.parse(row.specifications) : {},
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
    res.json(transformedProduct);
  });
});

// Search products
app.get('/api/products/search', (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ success: false, error: 'Search query is required' });
  }

  const searchTerm = `%${query}%`;
  db.all(
    "SELECT * FROM products WHERE name LIKE ? OR description LIKE ? OR category LIKE ?",
    [searchTerm, searchTerm, searchTerm],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ success: false, error: 'Database error' });
      }
      // Transform products to match frontend type
      const transformedProducts = rows.map(product => ({
        id: product.id.toString(),
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.original_price,
        category: product.category,
        images: [product.image],
        inStock: product.stockQuantity > 0,
        stockQuantity: product.stockQuantity,
        rating: product.rating || 4.5,
        reviewCount: product.reviewCount || 0,
        tags: [],
        features: product.features ? JSON.parse(product.features) : [],
        specifications: product.specifications ? JSON.parse(product.specifications) : {},
        createdAt: product.created_at,
        updatedAt: product.updated_at
      }));
      res.json(transformedProducts);
    }
  );
});

// Get product categories
app.get('/api/products/categories', (req, res) => {
  db.all("SELECT DISTINCT category FROM products", (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Database error' });
    }
    const categories = rows.map(row => row.category);
    res.json(categories);
  });
});

// Image upload endpoint
app.post('/api/upload', verifyAdmin, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file uploaded' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, imageUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Image upload failed' });
  }
});

// Admin: Add new product with image upload
app.post('/api/admin/products', verifyAdmin, upload.single('image'), (req, res) => {
  const { name, description, price, category, stockQuantity } = req.body;
  let imageUrl = req.body.image || '';
  
  // If an image file was uploaded, use its URL
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }
  
  db.run(
    "INSERT INTO products (name, description, price, category, image, stockQuantity) VALUES (?, ?, ?, ?, ?, ?)",
    [name, description, price, category, imageUrl, stockQuantity],
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, error: 'Failed to add product' });
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});

// Admin: Update product
app.put('/api/admin/products/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, image, stockQuantity } = req.body;
  
  db.run(
    "UPDATE products SET name = ?, description = ?, price = ?, category = ?, image = ?, stockQuantity = ? WHERE id = ?",
    [name, description, price, category, image, stockQuantity, id],
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, error: 'Failed to update product' });
      }
      res.json({ success: true });
    }
  );
});

// Admin: Delete product
app.delete('/api/admin/products/:id', verifyAdmin, (req, res) => {
  const { id } = req.params;
  
  db.run("DELETE FROM products WHERE id = ?", [id], function(err) {
    if (err) {
      return res.status(500).json({ success: false, error: 'Failed to delete product' });
    }
    res.json({ success: true });
  });
});

// Admin: Get all orders
app.get('/api/admin/orders', verifyAdmin, (req, res) => {
  db.all("SELECT * FROM orders ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Database error' });
    }
    res.json(rows);
  });
});

// Admin: Get all users
app.get('/api/admin/users', verifyAdmin, (req, res) => {
  db.all("SELECT id, email, name, role, created_at FROM users ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Database error' });
    }
    res.json(rows);
  });
});

// Create order endpoint
app.post('/api/orders', (req, res) => {
  const { customer_email, total, payment_method } = req.body;
  
  db.run(
    "INSERT INTO orders (customer_email, total, payment_method, status) VALUES (?, ?, ?, 'completed')",
    [customer_email, total, payment_method],
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, error: 'Failed to create order' });
      }
      res.json({ success: true, orderId: this.lastID });
    }
  );
});

// Get all users (for admin)
app.get('/api/users', (req, res) => {
  db.all("SELECT id, email, name, role, created_at FROM users", (err, rows) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        error: 'Database error' 
      });
    }
    res.json({ success: true, data: rows });
  });
});

// Configure nodemailer (using Gmail SMTP as example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate input
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'All fields are required' 
      });
    }

    // Email options
    const mailOptions = {
      from: email,
      to: 'yaccine.tarki@gmail.com', // Your business email
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p><small>This message was sent from the MiniU website contact form.</small></p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message. Please try again later.' 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 
// Create newsletter table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS newsletter (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Newsletter signup endpoint
app.post('/api/newsletter', (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address' });
  }
  db.run(
    'INSERT OR IGNORE INTO newsletter (email) VALUES (?)',
    [email],
    function (err) {
      if (err) {
        return res.status(500).json({ success: false, error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(200).json({ success: true, message: 'Already subscribed' });
      }
      res.json({ success: true, message: 'Subscribed successfully' });
    }
  );
});
// Send product drop email to all newsletter subscribers
app.post('/api/newsletter/send', async (req, res) => {
  const { productName, productUrl } = req.body;
  if (!productName || !productUrl) {
    return res.status(400).json({ success: false, error: 'Missing product info' });
  }

  // Get all newsletter emails
  db.all('SELECT email FROM newsletter', async (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Database error' });
    }
    if (!rows.length) {
      return res.status(400).json({ success: false, error: 'No subscribers found' });
    }

    // Get user names for personalization
    db.all('SELECT email, name FROM users', async (err2, userRows) => {
      const userMap = {};
      if (!err2 && userRows) {
        userRows.forEach(u => userMap[u.email] = u.name);
      }

      let sent = 0, failed = 0;
      for (const { email } of rows) {
        const name = userMap[email] || 'Subscriber';
        const mailOptions = {
          from: process.env.EMAIL_USER || 'your-email@gmail.com',
          to: email,
          subject: `New Product Drop: ${productName}`,
          html: `
            <h2>Hello ${name},</h2>
            <p>We're excited to announce a new product: <strong>${productName}</strong>!</p>
            <p><a href="${productUrl}">Click here to check it out</a></p>
            <p>Thank you for subscribing to our newsletter!</p>
            <hr>
            <p><small>This message was sent from the MiniU newsletter.</small></p>
          `
        };
        try {
          await transporter.sendMail(mailOptions);
          sent++;
        } catch (e) {
          failed++;
        }
      }
      res.json({ success: true, sent, failed });
    });
  });
});