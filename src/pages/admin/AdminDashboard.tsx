import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Menu,
  X,
  Plus,
  Edit,
  Trash2,
  Save
} from 'lucide-react';

// Type definitions
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stockQuantity: number;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

interface Order {
  id: number;
  customer_email: string;
  total: number;
  status: string;
  payment_method: string;
  created_at: string;
}
// Dashboard components
const DashboardOverview = () => {
  const [sending, setSending] = useState(false);
  const [productName, setProductName] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [result, setResult] = useState<string | null>(null);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">MiniU Admin Dashboard</h1>
      <div className="bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-4">Welcome to MiniU Admin Panel</h2>
        <p className="text-gray-400 mb-4">Manage your products, orders, and users from this dashboard.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium text-gray-900">Products</h3>
            <p className="text-sm text-gray-600">Add, edit, and manage your product catalog</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium text-gray-900">Orders</h3>
            <p className="text-sm text-gray-600">View and manage customer orders</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium text-gray-900">Users</h3>
            <p className="text-sm text-gray-600">Manage user accounts and permissions</p>
          </div>
        </div>
        <div className="mt-8 border-t pt-6">
          <h3 className="font-medium text-gray-900 mb-2">Send Product Drop Newsletter</h3>
          <div className="flex flex-col sm:flex-row gap-4 mb-2">
            <input
              type="text"
              placeholder="Product Name"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              className="border px-3 py-2 rounded-md flex-1"
            />
            <input
              type="text"
              placeholder="Product URL"
              value={productUrl}
              onChange={e => setProductUrl(e.target.value)}
              className="border px-3 py-2 rounded-md flex-1"
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
              disabled={sending || !productName || !productUrl}
              onClick={async () => {
                setSending(true);
                setResult(null);
                try {
                  const res = await fetch('http://localhost:3002/api/newsletter/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ productName, productUrl })
                  });
                  const data = await res.json();
                  if (data.success) {
                    setResult(`Sent to ${data.sent} subscribers. Failed: ${data.failed}`);
                  } else {
                    setResult(data.error || 'Failed to send.');
                  }
                } catch (err) {
                  setResult('Network error.');
                }
                setSending(false);
              }}
            >
              {sending ? 'Sending...' : 'Send Newsletter'}
            </button>
          </div>
          {result && <div className="text-sm mt-2 text-gray-700">{result}</div>}
        </div>
      </div>
    </div>
  );
};

const ProductsManager = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stockQuantity: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('description', newProduct.description);
      formData.append('price', newProduct.price);
      formData.append('category', newProduct.category);
      formData.append('stockQuantity', newProduct.stockQuantity);
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      
      const response = await fetch('http://localhost:3002/api/admin/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Product added successfully:', result);
        setNewProduct({ name: '', description: '', price: '', category: '', stockQuantity: '' });
        setSelectedImage(null);
        setImagePreview('');
        setShowAddForm(false);
        fetchProducts();
        alert('Product added successfully!');
      } else {
        const errorData = await response.json();
        console.error('Failed to add product:', errorData);
        alert(`Failed to add product: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product. Please check your connection and try again.');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:3002/api/admin/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        if (response.ok) {
          fetchProducts();
          alert('Product deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const formData = new FormData();
      formData.append('name', editingProduct.name);
      formData.append('description', editingProduct.description);
      formData.append('price', editingProduct.price.toString());
      formData.append('category', editingProduct.category);
      formData.append('stockQuantity', editingProduct.stockQuantity.toString());
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      
      const response = await fetch(`http://localhost:3002/api/admin/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formData
      });
      
      if (response.ok) {
        setShowEditForm(false);
        setEditingProduct(null);
        fetchProducts();
        alert('Product updated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to update product: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product. Please check your connection and try again.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Products Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      {showEditForm && editingProduct && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
          <form onSubmit={handleEditProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={editingProduct.name}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              className="border rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={editingProduct.price}
              onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
              className="border rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={editingProduct.category}
              onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
              className="border rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              value={editingProduct.stockQuantity}
              onChange={(e) => setEditingProduct({ ...editingProduct, stockQuantity: parseInt(e.target.value) })}
              className="border rounded-md px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border rounded-md px-3 py-2 w-full dark:bg-gray-700 dark:border-gray-600"
              />
              {imagePreview ? (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-md"
                  />
                </div>
              ) : editingProduct.image && (
                <div className="mt-2">
                  <img
                    src={editingProduct.image?.startsWith('http') ? editingProduct.image : `http://localhost:3002${editingProduct.image}`}
                    alt="Current"
                    className="h-20 w-20 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
            <textarea
              placeholder="Description"
              value={editingProduct.description}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              className="border rounded-md px-3 py-2 md:col-span-2 h-24 dark:bg-gray-700 dark:border-gray-600"
              required
            />
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Update Product
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEditForm(false);
                  setEditingProduct(null);
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showAddForm && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-700 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Add New Product</h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="border border-gray-600 bg-gray-700 text-white px-3 py-2 rounded-md placeholder-gray-400"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="border rounded-md px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Category"
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="border rounded-md px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Stock Quantity"
              value={newProduct.stockQuantity}
              onChange={(e) => setNewProduct({ ...newProduct, stockQuantity: e.target.value })}
              className="border rounded-md px-3 py-2"
              required
            />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border rounded-md px-3 py-2 w-full"
                required
              />
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
            <textarea
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              className="border rounded-md px-3 py-2 md:col-span-2 h-24"
              required
            />
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Product
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        className="h-10 w-10 rounded-md object-cover" 
                        src={product.image?.startsWith('http') ? product.image : `http://localhost:3002${product.image}`} 
                        alt={product.name} 
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{product.name}</div>
                        <div className="text-sm text-gray-400">{product.description?.substring(0, 50)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{product.stockQuantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingProduct(product);
                          setShowEditForm(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const OrdersManager = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Add dark mode styles
  const tableStyles = {
    container: "bg-gray-800 rounded-lg shadow-sm border border-gray-700",
    header: "bg-gray-900",
    headerText: "text-gray-400",
    row: "bg-gray-800 border-gray-700",
    cell: "text-gray-300",
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Orders Management</h1>
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">#{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.customer_email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${order.total}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const UsersManager = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Users Management</h1>
      <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatsPage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-white mb-4">Statistics</h1>
    <p className="text-gray-400">View detailed analytics and reports here.</p>
  </div>
);

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Set dark mode by default
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, current: location.pathname === '/admin' },
    { name: 'Products', href: '/admin/products', icon: Package, current: location.pathname === '/admin/products' },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart, current: location.pathname === '/admin/orders' },
    { name: 'Users', href: '/admin/users', icon: Users, current: location.pathname === '/admin/users' },
    { name: 'Statistics', href: '/admin/stats', icon: BarChart3, current: location.pathname === '/admin/stats' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      <div className="flex relative z-0">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          </div>
        )}

        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800/90 backdrop-blur-sm shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Admin Panel</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="mt-6 px-3">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      item.current
                        ? 'bg-blue-900 text-blue-200'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          {/* Top bar */}
          <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 lg:hidden">
            <div className="flex items-center justify-between h-16 px-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
              <div></div>
            </div>
          </div>

          {/* Page content */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/products" element={<ProductsManager />} />
              <Route path="/orders" element={<OrdersManager />} />
              <Route path="/users" element={<UsersManager />} />
              <Route path="/stats" element={<StatsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;