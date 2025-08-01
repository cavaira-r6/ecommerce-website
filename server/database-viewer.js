import express from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3003;

app.use(express.json());
app.use(express.static('public'));

// Database setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Serve the database viewer HTML
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Database Viewer</title>
        <style>
            body { 
                font-family: Arial, sans-serif; 
                margin: 20px; 
                background: #000; 
                color: #fff; 
            }
            .container { max-width: 1200px; margin: 0 auto; }
            .section { margin-bottom: 30px; }
            table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-top: 10px;
                background: #111;
            }
            th, td { 
                padding: 12px; 
                text-align: left; 
                border-bottom: 1px solid #333; 
            }
            th { 
                background: #333; 
                font-weight: bold; 
            }
            .form-group { margin-bottom: 15px; }
            label { display: block; margin-bottom: 5px; }
            input, textarea, select { 
                width: 100%; 
                padding: 8px; 
                border: 1px solid #333; 
                background: #111; 
                color: #fff; 
                border-radius: 4px; 
            }
            button { 
                padding: 10px 20px; 
                background: #gold; 
                color: #000; 
                border: none; 
                border-radius: 4px; 
                cursor: pointer; 
                margin-right: 10px; 
            }
            button:hover { background: #ffd700; }
            .success { color: #4CAF50; }
            .error { color: #f44336; }
            .tabs { display: flex; margin-bottom: 20px; }
            .tab { 
                padding: 10px 20px; 
                background: #333; 
                cursor: pointer; 
                margin-right: 5px; 
            }
            .tab.active { background: #gold; color: #000; }
            .tab-content { display: none; }
            .tab-content.active { display: block; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🛍️ ModernShop Database Viewer</h1>
            
            <div class="tabs">
                <div class="tab active" onclick="showTab('users')">Users</div>
                <div class="tab" onclick="showTab('products')">Products</div>
                <div class="tab" onclick="showTab('add-product')">Add Product</div>
            </div>

            <div id="users" class="tab-content active">
                <h2>👥 Users Database</h2>
                <div id="users-table"></div>
            </div>

            <div id="products" class="tab-content">
                <h2>📦 Products Database</h2>
                <div id="products-table"></div>
            </div>

            <div id="add-product" class="tab-content">
                <h2>➕ Add New Product</h2>
                <form id="add-product-form">
                    <div class="form-group">
                        <label>Product Name:</label>
                        <input type="text" name="name" required>
                    </div>
                    <div class="form-group">
                        <label>Description:</label>
                        <textarea name="description" rows="3" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Price:</label>
                        <input type="number" name="price" step="0.01" required>
                    </div>
                    <div class="form-group">
                        <label>Category:</label>
                        <select name="category" required>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Home & Kitchen">Home & Kitchen</option>
                            <option value="Sports & Fitness">Sports & Fitness</option>
                            <option value="Books">Books</option>
                            <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Automotive">Automotive</option>
                            <option value="Health & Wellness">Health & Wellness</option>
                            <option value="Toys & Games">Toys & Games</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Image URL:</label>
                        <input type="url" name="image" required>
                    </div>
                    <div class="form-group">
                        <label>Stock Quantity:</label>
                        <input type="number" name="stockQuantity" required>
                    </div>
                    <button type="submit">Add Product</button>
                </form>
            </div>
        </div>

        <script>
            function showTab(tabName) {
                // Hide all tab contents
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.querySelectorAll('.tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                
                // Show selected tab
                document.getElementById(tabName).classList.add('active');
                event.target.classList.add('active');
                
                // Load data for the tab
                if (tabName === 'users') loadUsers();
                if (tabName === 'products') loadProducts();
            }

            async function loadUsers() {
                try {
                    const response = await fetch('/api/users');
                    const data = await response.json();
                    
                    if (data.success) {
                        const users = data.data;
                        const table = \`
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Created At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    \${users.map(user => \`
                                        <tr>
                                            <td>\${user.id}</td>
                                            <td>\${user.name}</td>
                                            <td>\${user.email}</td>
                                            <td>\${user.role}</td>
                                            <td>\${user.created_at}</td>
                                        </tr>
                                    \`).join('')}
                                </tbody>
                            </table>
                        \`;
                        document.getElementById('users-table').innerHTML = table;
                    }
                } catch (error) {
                    console.error('Error loading users:', error);
                }
            }

            async function loadProducts() {
                try {
                    const response = await fetch('/api/products');
                    const data = await response.json();
                    
                    if (data.success) {
                        const products = data.data;
                        const table = \`
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Price</th>
                                        <th>Category</th>
                                        <th>Stock</th>
                                        <th>Created At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    \${products.map(product => \`
                                        <tr>
                                            <td>\${product.id}</td>
                                            <td>\${product.name}</td>
                                            <td>$\${product.price}</td>
                                            <td>\${product.category}</td>
                                            <td>\${product.stockQuantity}</td>
                                            <td>\${product.created_at}</td>
                                        </tr>
                                    \`).join('')}
                                </tbody>
                            </table>
                        \`;
                        document.getElementById('products-table').innerHTML = table;
                    }
                } catch (error) {
                    console.error('Error loading products:', error);
                }
            }

            document.getElementById('add-product-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(e.target);
                const productData = Object.fromEntries(formData.entries());
                
                try {
                    const response = await fetch('/api/products', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(productData),
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        alert('Product added successfully!');
                        e.target.reset();
                        loadProducts();
                    } else {
                        alert('Error: ' + data.error);
                    }
                } catch (error) {
                    alert('Error adding product: ' + error.message);
                }
            });

            // Load initial data
            loadUsers();
        </script>
    </body>
    </html>
  `);
});

// API endpoints
app.get('/api/users', (req, res) => {
  db.all("SELECT * FROM users ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Database error' });
    }
    res.json({ success: true, data: rows });
  });
});

app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Database error' });
    }
    res.json({ success: true, data: rows });
  });
});

app.post('/api/products', (req, res) => {
  const { name, description, price, category, image, stockQuantity } = req.body;
  
  if (!name || !description || !price || !category || !image || !stockQuantity) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  db.run(
    "INSERT INTO products (name, description, price, category, image, stockQuantity, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))",
    [name, description, price, category, image, stockQuantity],
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, error: 'Failed to add product' });
      }
      res.json({ success: true, message: 'Product added successfully' });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Database viewer running on http://localhost:${PORT}`);
}); 