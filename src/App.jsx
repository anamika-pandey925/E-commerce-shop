import React, { useState, useEffect } from 'react';

const ProductCard = ({ product, addToCart }) => (
  <article className="product-card">
    <div className="product-image-container">
      <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
      {product.trending && <span className="product-badge">Trending</span>}
    </div>
    <div className="product-info">
      <span className="product-brand">{product.brand}</span>
      <h3 className="product-name">{product.name}</h3>
      <div className="product-footer">
        <span className="product-price">₹{product.price}</span>
        <button onClick={() => addToCart(product)} className="add-to-cart" aria-label="Add to cart">+</button>
      </div>
    </div>
  </article>
);

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'));
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll handler for navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme management
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Cart persistence
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Fetch products with filtering
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = new URL('/api/products', window.location.origin);
        if (filter !== 'All') url.searchParams.append('category', filter);
        if (search) url.searchParams.append('search', search);
        
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Fetch failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filter, search]);

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
    // Feedback: can add a toast or toast-like effect here
  };

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <div className="app">
      {/* Navigation */}
      <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          <a href="#" className="logo">MDRN<span>.</span></a>
          
          <nav className="nav-links">
            <a href="#" className="nav-link active">Shop</a>
            <a href="#collections" className="nav-link">Collections</a>
            <a href="#about" className="nav-link">About</a>
          </nav>

          <div className="nav-actions">
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <button onClick={toggleTheme} className="action-btn" aria-label="Toggle Theme">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            
            <button className="action-btn cart-icon" aria-label="Cart">
              🛒
              <span className="cart-count">{cart.length}</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <span className="hero-tag">✦ New 2026 Season drop</span>
              <h2 className="hero-title">
                Dress Like <span>Tomorrow.</span>
              </h2>
              <p className="hero-p">
                Minimalist silhouettes for the generation that doesn't follow trends — it sets them.
              </p>
              <div className="hero-btns">
                <button className="btn btn-primary">Shop the Drop</button>
                <button className="btn btn-outline">Explore Collections</button>
              </div>
            </div>
          </div>
        </section>

        {/* Collections Section */}
        <section id="collections" className="section">
          <div className="container">
            <div className="collections-header">
              <div>
                <h2 className="section-title">Collections</h2>
                <p className="muted-text">Curated drops for the modern individual.</p>
              </div>
              <div className="filter-tabs">
                {['All', 'Apparel', 'Footwear', 'Accessories'].map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`filter-tab ${filter === cat ? 'active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="loader-container">
                <div className="loader"></div>
              </div>
            ) : (
              <div className="product-grid">
                {products.length > 0 ? (
                  products.map(product => (
                    <ProductCard key={product.id} product={product} addToCart={addToCart} />
                  ))
                ) : (
                  <p className="no-results">No products found matching your search.</p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="section">
          <div className="container">
            <div className="about-section">
              <div className="about-content">
                <h2 className="about-title">Crafting the<br/>New Standard.</h2>
                <p className="about-text">
                  MDRN was born out of a desire for simplicity in a noisy world. We don't believe in trends; we believe in timeless silhouettes, premium materials, and the power of the individual.
                </p>
                <div className="about-features">
                  <div className="feature-item"><span className="feature-dot"></span> Sustainable Materials</div>
                  <div className="feature-item"><span className="feature-dot"></span> Artisan Craftsmanship</div>
                  <div className="feature-item"><span className="feature-dot"></span> Ethical Production</div>
                  <div className="feature-item"><span className="feature-dot"></span> Carbon Neutral</div>
                </div>
              </div>
              <div className="about-visual"></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="section footer">
        <div className="container">
          <div className="footer-top">
            <h2 className="logo">MDRN<span>.</span></h2>
            <p className="footer-p">© 2026 MDRN Store. All Rights Reserved. Built for the Future.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
