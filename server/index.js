import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Helper to read products
const getProducts = () => {
  const data = fs.readFileSync(path.join(__dirname, 'data', 'products.json'));
  return JSON.parse(data);
};

// --- Routes ---

// 1. Get all products
app.get('/api/products', (req, res) => {
  try {
    const products = getProducts();
    const { category, search, trending } = req.query;

    let filtered = products;

    if (category) {
      filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.brand.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (trending === 'true') {
      filtered = filtered.filter(p => p.trending);
    }

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// 2. Get single product
app.get('/api/products/:id', (req, res) => {
  const products = getProducts();
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (product) res.json(product);
  else res.status(404).json({ message: 'Product not found' });
});

// 3. Mock Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  // Mock auth logic
  if (email && password) {
    res.json({ 
      user: { name: 'Demo User', email }, 
      token: 'mock-jwt-token-123' 
    });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

// 4. Mock Cart (In a real app, this would use a DB)
let mockCart = [];
app.get('/api/cart', (req, res) => res.json(mockCart));
app.post('/api/cart', (req, res) => {
  mockCart = req.body;
  res.json({ message: 'Cart updated', cart: mockCart });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
