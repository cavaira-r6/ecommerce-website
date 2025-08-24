/// <reference types="vite/client" />

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export const fetchProducts = async () => {
  const response = await fetch(`${API_URL}/api/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const getProductById = async (id: number) => {
  const response = await fetch(`${API_URL}/api/products/${id}`);
  if (!response.ok) throw new Error('Product not found');
  return response.json();
};

export const searchProducts = async (query: string) => {
  const response = await fetch(`${API_URL}/api/products/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Failed to search products');
  return response.json();
};

export const getProductCategories = async () => {
  const response = await fetch(`${API_URL}/api/products/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};

export type { Product } from '../data/types';