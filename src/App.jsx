import React, { useState, useEffect, useCallback, useRef } from 'react';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const CATEGORIES   = ['All','Saree','Anarkali','Suit','Tops','Crop Top','Jeans','Fashion Jeans','Winter Jacket','Kids Wear'];
const GENDERS      = ['All','Women','Men','Kids','Boys','Girls'];
const WEAR_TYPES   = ['All','Upper Wear','Lower Wear','Full Set'];
const SEASONS      = ['All','Summer','Winter','All Season'];

const LOCATION_MAP = {
  manali:    { season:'Winter', label:'❄️ Manali — Cozy winter wear' },
  shimla:    { season:'Winter', label:'🏔️ Shimla — Warm layers for hills' },
  leh:       { season:'Winter', label:'⛄ Leh Ladakh — Heavy winter jackets' },
  kashmiri:  { season:'Winter', label:'❄️ Kashmir — Woolens & jackets' },
  goa:       { season:'Summer', label:'🌊 Goa — Breezy beach & summer wear' },
  mumbai:    { season:'Summer', label:'☀️ Mumbai — Light summer casuals' },
  kerala:    { season:'Summer', label:'🌴 Kerala — Breathable summer wear' },
  delhi:     { season:'All Season', label:'🏙️ Delhi — Mix of traditional & western' },
  jaipur:    { season:'All Season', label:'🌸 Jaipur — Vibrant traditional wear' },
  kolkata:   { season:'All Season', label:'🎨 Kolkata — Sarees & ethnic wear' },
};

// ─── UTILS ───────────────────────────────────────────────────────────────────
const getDiscount = (p) => p.originalPrice
  ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : null;

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
const ProductCard = ({ product, onProductClick, addToCart }) => {
  const [imgError, setImgError] = useState(false);
  const discount = getDiscount(product);

  return (
    <article className="product-card" onClick={() => onProductClick(product)}>
      <div className="product-card__image-wrap">
        {imgError ? (
          <div className="img-fallback" style={{ background: product.colors?.[0] || '#1a1a24' }}>
            <span>🛍️</span>
            <p>{product.name}</p>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
        {product.badge && <span className="badge-top-left">{product.badge}</span>}
        {discount && <span className="badge-top-right">-{discount}%</span>}
        <div className="card-gender-tag">{product.gender} · {product.season}</div>
        <button
          className="quick-add-btn"
          onClick={e => { e.stopPropagation(); addToCart(product); }}
        >🛒 Quick Add</button>
      </div>
      <div className="product-card__info">
        <p className="product-card__brand">{product.brand}</p>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__meta">
          <span className="category-tag">{product.category}</span>
          <span className="wear-tag">{product.wearType}</span>
        </div>
        <div className="product-card__rating">
          {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
          <span>({product.reviews})</span>
        </div>
        <div className="product-card__price-row">
          <span className="price">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </article>
  );
};

// ─── PRODUCT DETAIL MODAL ─────────────────────────────────────────────────────
const ProductDetail = ({ product, onClose, addToCart }) => {
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const discount = getDiscount(product);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleAdd = () => {
    addToCart({ ...product, selectedColor, selectedSize, qty });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-body">
          <div className="modal-image">
            {imgError ? (
              <div className="img-fallback" style={{ background: product.colors?.[0] || '#1a1a24' }}>
                <span>🛍️</span><p>{product.name}</p>
              </div>
            ) : (
              <img src={product.image} alt={product.name} onError={() => setImgError(true)} />
            )}
            {product.badge && <span className="badge-top-left">{product.badge}</span>}
          </div>
          <div className="modal-info">
            <div className="modal-tags">
              <span className="category-tag">{product.category}</span>
              <span className="wear-tag">{product.gender}</span>
              <span className="season-chip">{product.season}</span>
            </div>
            <p className="modal-brand">{product.brand}</p>
            <h2 className="modal-name">{product.name}</h2>
            <div className="modal-rating">
              {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
              <span>{product.rating} · {product.reviews} reviews</span>
            </div>
            <div className="modal-price-row">
              <span className="modal-price">₹{product.price.toLocaleString()}</span>
              {product.originalPrice && <>
                <span className="modal-original">₹{product.originalPrice.toLocaleString()}</span>
                <span className="discount-chip">{discount}% OFF</span>
              </>}
            </div>
            <p className="modal-desc">{product.description}</p>

            {product.colors?.length > 0 && (
              <div className="modal-section">
                <h4>Color</h4>
                <div className="color-swatches">
                  {product.colors.map((c, i) => (
                    <button key={i} className={`color-swatch ${selectedColor===c?'active':''}`}
                      style={{ background: c }} onClick={() => setSelectedColor(c)} />
                  ))}
                </div>
              </div>
            )}

            {product.sizes?.length > 0 && (
              <div className="modal-section">
                <h4>Size</h4>
                <div className="size-options">
                  {product.sizes.map(s => (
                    <button key={s} className={`size-btn ${selectedSize===s?'active':''}`}
                      onClick={() => setSelectedSize(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="modal-section">
              <h4>Quantity</h4>
              <div className="qty-control">
                <button onClick={() => setQty(q => Math.max(1,q-1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => q+1)}>+</button>
              </div>
            </div>

            <button className={`modal-add-btn ${added?'added':''}`} onClick={handleAdd}>
              {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── CART SIDEBAR ─────────────────────────────────────────────────────────────
const CartSidebar = ({ cart, setCart, onClose }) => {
  const total = cart.reduce((s, i) => s + i.price * (i.qty||1), 0);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="cart-sidebar" onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2>🛒 My Cart <span>({cart.length})</span></h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {cart.length === 0
          ? <div className="cart-empty"><p>🛍️</p><p>Your cart is empty</p></div>
          : <>
            <div className="cart-items">
              {cart.map((item, i) => (
                <div key={i} className="cart-item">
                  <img src={item.image} alt={item.name}
                    onError={e => { e.target.style.background=item.colors?.[0]||'#333'; e.target.src=''; }} />
                  <div className="cart-item__info">
                    <p className="cart-item__name">{item.name}</p>
                    {item.selectedSize && <p className="cart-item__meta">Size: {item.selectedSize}</p>}
                    <p className="cart-item__price">₹{item.price.toLocaleString()} × {item.qty||1}</p>
                  </div>
                  <button className="cart-item__remove" onClick={() => setCart(p=>p.filter((_,j)=>j!==i))}>✕</button>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total"><span>Total</span><strong>₹{total.toLocaleString()}</strong></div>
              <button className="cart-checkout-btn">Proceed to Checkout →</button>
            </div>
          </>
        }
      </div>
    </div>
  );
};

// ─── FILTER PANEL ─────────────────────────────────────────────────────────────
const FilterPanel = ({ filters, setFilters }) => (
  <aside className="filter-panel">
    <h3>🔽 Filters</h3>

    <div className="filter-group">
      <label>Gender</label>
      <div className="filter-options">
        {GENDERS.map(g => (
          <button key={g}
            className={`filter-chip ${filters.gender===g?'active':''}`}
            onClick={() => setFilters(f => ({...f, gender: g}))}>
            {g}
          </button>
        ))}
      </div>
    </div>

    <div className="filter-group">
      <label>Type</label>
      <div className="filter-options">
        {WEAR_TYPES.map(w => (
          <button key={w}
            className={`filter-chip ${filters.wearType===w?'active':''}`}
            onClick={() => setFilters(f => ({...f, wearType: w}))}>
            {w}
          </button>
        ))}
      </div>
    </div>

    <div className="filter-group">
      <label>Season</label>
      <div className="filter-options">
        {SEASONS.map(s => (
          <button key={s}
            className={`filter-chip ${filters.season===s?'active':''}`}
            onClick={() => setFilters(f => ({...f, season: s}))}>
            {s==='Winter'?'❄️ ':s==='Summer'?'☀️ ':''}{s}
          </button>
        ))}
      </div>
    </div>

    <button className="clear-filters-btn"
      onClick={() => setFilters({ gender:'All', wearType:'All', season:'All' })}>
      ✕ Clear All Filters
    </button>
  </aside>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [allProducts, setAllProducts]     = useState([]);
  const [products, setProducts]           = useState([]);
  const [cart, setCart]                   = useState(() => JSON.parse(localStorage.getItem('cart')||'[]'));
  const [loading, setLoading]             = useState(true);
  const [search, setSearch]               = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [filters, setFilters]             = useState({ gender:'All', wearType:'All', season:'All' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart]           = useState(false);
  const [isScrolled, setIsScrolled]       = useState(false);
  const [cartBounce, setCartBounce]       = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [locationSuggestion, setLocationSuggestion] = useState(null);
  const [showFilters, setShowFilters]     = useState(false);

  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch('/api/products')
      .then(r => r.json())
      .then(data => { setAllProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...allProducts];
    if (activeCategory !== 'All') result = result.filter(p => p.category === activeCategory);
    if (filters.gender !== 'All')   result = result.filter(p => p.gender === filters.gender);
    if (filters.wearType !== 'All') result = result.filter(p => p.wearType === filters.wearType);
    if (filters.season !== 'All')   result = result.filter(p => p.season === filters.season || p.season === 'All Season');
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.gender.toLowerCase().includes(q)
      );
    }
    setProducts(result);
  }, [allProducts, activeCategory, filters, search]);

  const handleLocationSearch = (val) => {
    setLocationInput(val);
    const key = Object.keys(LOCATION_MAP).find(k => val.toLowerCase().includes(k));
    if (key) {
      const loc = LOCATION_MAP[key];
      setLocationSuggestion(loc);
    } else {
      setLocationSuggestion(null);
    }
  };

  const applyLocationFilter = () => {
    if (locationSuggestion) {
      setFilters(f => ({...f, season: locationSuggestion.season}));
      setActiveCategory('All');
      document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const addToCart = useCallback((product) => {
    setCart(prev => [...prev, { ...product, qty: product.qty||1 }]);
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 400);
  }, []);

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    setSearch('');
    setMobileMenuOpen(false);
    document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeFiltersCount = [
    filters.gender !== 'All',
    filters.wearType !== 'All',
    filters.season !== 'All'
  ].filter(Boolean).length;

  return (
    <div className="app">

      {/* NAVBAR */}
      <header className={`navbar ${isScrolled?'scrolled':''}`}>
        <div className="container navbar-inner">
          <a href="#" className="logo" onClick={() => setActiveCategory('All')}>Shop<span>.co</span></a>

          <nav className={`nav-links ${mobileMenuOpen?'open':''}`}>
            {CATEGORIES.slice(1,7).map(cat => (
              <button key={cat} className="nav-link" onClick={() => handleCategoryClick(cat)}>{cat}</button>
            ))}
            <a href="#about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About</a>
          </nav>

          <div className="nav-actions">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input type="text" placeholder="Search..." className="search-input"
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveCategory('All'); }} />
            </div>
            <button className={`nav-icon-btn ${cartBounce?'bounce':''}`}
              onClick={() => setShowCart(true)} aria-label="Cart">
              🛒{cart.length>0 && <span className="cart-badge">{cart.length}</span>}
            </button>
            <button className="nav-icon-btn mobile-menu-btn"
              onClick={() => setMobileMenuOpen(p => !p)}>
              {mobileMenuOpen?'✕':'☰'}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero" id="home">
          <div className="hero-blob hero-blob-1" />
          <div className="hero-blob hero-blob-2" />
          <div className="container">
            <div className="hero-content">
              <span className="hero-tag">✦ New 2026 Collection — Fashion for Every Occasion</span>
              <h1 className="hero-title">Style That<br/><span className="hero-gradient">Speaks For You.</span></h1>
              <p className="hero-sub">Sarees · Suits · Anarkali · Jeans · Tops · Kids Wear · Winter Jackets<br/>Premium fashion for every occasion, season & gender.</p>
              <div className="hero-btns">
                <button className="btn btn-primary"
                  onClick={() => document.getElementById('collections')?.scrollIntoView({behavior:'smooth'})}>
                  Shop the Drop →
                </button>
                <button className="btn btn-outline"
                  onClick={() => { setActiveCategory('All'); document.getElementById('collections')?.scrollIntoView({behavior:'smooth'}); }}>
                  Explore Collections
                </button>
              </div>
              {/* Location Suggestion */}
              <div className="location-bar">
                <span className="location-icon">📍</span>
                <input type="text" placeholder="Enter your destination (e.g. Manali, Goa, Mumbai...)"
                  className="location-input" value={locationInput}
                  onChange={e => handleLocationSearch(e.target.value)} />
                {locationSuggestion && (
                  <button className="location-apply-btn" onClick={applyLocationFilter}>
                    {locationSuggestion.label} — Show outfits
                  </button>
                )}
              </div>
              <div className="hero-stats">
                <div className="stat"><strong>25+</strong><span>Products</span></div>
                <div className="stat-div"/>
                <div className="stat"><strong>9</strong><span>Categories</span></div>
                <div className="stat-div"/>
                <div className="stat"><strong>5</strong><span>Genders</span></div>
                <div className="stat-div"/>
                <div className="stat"><strong>4.7★</strong><span>Avg Rating</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY STRIP */}
        <section className="category-strip">
          <div className="container">
            <div className="category-scroll">
              {CATEGORIES.map(cat => (
                <button key={cat}
                  className={`cat-pill ${activeCategory===cat?'active':''}`}
                  onClick={() => handleCategoryClick(cat)}>
                  {cat==='Saree'&&'🥻 '}{cat==='Anarkali'&&'👘 '}{cat==='Suit'&&'👗 '}
                  {cat==='Tops'&&'👚 '}{cat==='Crop Top'&&'🩱 '}{cat==='Jeans'&&'👖 '}
                  {cat==='Fashion Jeans'&&'🌀 '}{cat==='Winter Jacket'&&'🧥 '}
                  {cat==='Kids Wear'&&'🧒 '}{cat==='All'&&'🛍️ '}
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* COLLECTIONS */}
        <section id="collections" className="collections-section">
          <div className="container">
            <div className="collections-layout">

              {/* Filter Panel */}
              <div className={`filter-wrapper ${showFilters?'open':''}`}>
                <FilterPanel filters={filters} setFilters={setFilters} />
              </div>

              <div className="collections-main">
                <div className="collections-header">
                  <div>
                    <h2 className="section-title">
                      {activeCategory === 'All' ? 'All Products' : activeCategory}
                    </h2>
                    <p className="section-sub">
                      {search ? `Results for "${search}"` : `${products.length} items`}
                      {activeFiltersCount > 0 && ` · ${activeFiltersCount} filter${activeFiltersCount>1?'s':''} applied`}
                    </p>
                  </div>
                  <button className={`filter-toggle-btn ${showFilters?'active':''}`}
                    onClick={() => setShowFilters(p=>!p)}>
                    🔽 Filters {activeFiltersCount > 0 && <span className="filter-badge">{activeFiltersCount}</span>}
                  </button>
                </div>

                {loading ? (
                  <div className="loader-wrap"><div className="loader"/><p>Loading products...</p></div>
                ) : products.length === 0 ? (
                  <div className="no-results">
                    <p>😔 No products found</p>
                    <button className="btn btn-outline"
                      onClick={() => { setSearch(''); setActiveCategory('All'); setFilters({gender:'All',wearType:'All',season:'All'}); }}>
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <div className="product-grid">
                    {products.map(p => (
                      <ProductCard key={p.id} product={p}
                        onProductClick={setSelectedProduct} addToCart={addToCart} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="about-section">
          <div className="container">
            <div className="about-grid">
              <div className="about-img-wrap">
                <img
                  src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80"
                  alt="About Shop.co"
                  onError={e => { e.target.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80'; }}
                />
                <div className="about-img-badge">Est. 2026</div>
              </div>
              <div className="about-content">
                <span className="section-tag">Our Story</span>
                <h2 className="section-title">Crafting the<br/>New Standard.</h2>
                <p className="about-text">
                  Shop.co was born from a belief: fashion should be accessible to everyone.
                  Whether you're dressing for a wedding, a beach vacation, a snowy mountain trip,
                  or buying for your children — we have something beautiful for every occasion.
                </p>
                <div className="about-features">
                  <div className="feature">✅ 100% Authentic Products</div>
                  <div className="feature">✅ Gender & Season Smart Filtering</div>
                  <div className="feature">✅ Free Returns within 30 Days</div>
                  <div className="feature">✅ Fast Delivery Across India</div>
                </div>
                <button className="btn btn-primary"
                  onClick={() => document.getElementById('collections')?.scrollIntoView({behavior:'smooth'})}>
                  Shop Now →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="trust-section">
          <div className="container">
            <div className="trust-grid">
              {[
                {icon:'🚀', title:'Free Shipping', sub:'Orders above ₹999'},
                {icon:'🔒', title:'Secure Payment', sub:'256-bit SSL encryption'},
                {icon:'↩️', title:'Easy Returns', sub:'30-day return policy'},
                {icon:'⭐', title:'Top Rated', sub:'4.7/5 average rating'},
              ].map(t => (
                <div className="trust-card" key={t.title}>
                  <span>{t.icon}</span>
                  <strong>{t.title}</strong>
                  <p>{t.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <h2 className="logo">Shop<span>.co</span></h2>
              <p className="footer-desc">Your one-stop fashion destination. Quality you can feel.</p>
            </div>
            <div>
              <h4>Categories</h4>
              <ul>{CATEGORIES.slice(1).map(c => <li key={c}><button onClick={()=>handleCategoryClick(c)}>{c}</button></li>)}</ul>
            </div>
            <div>
              <h4>By Gender</h4>
              <ul>{GENDERS.slice(1).map(g => <li key={g}><button onClick={()=>{setFilters(f=>({...f,gender:g}));document.getElementById('collections')?.scrollIntoView({behavior:'smooth'});}}>{g}</button></li>)}</ul>
            </div>
            <div>
              <h4>Support</h4>
              <ul>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Shipping Policy</a></li>
                <li><a href="#">Return Policy</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Shop.co · All Rights Reserved · Made with ❤️ in India</p>
          </div>
        </div>
      </footer>

      {selectedProduct && (
        <ProductDetail product={selectedProduct}
          onClose={() => setSelectedProduct(null)} addToCart={addToCart} />
      )}
      {showCart && <CartSidebar cart={cart} setCart={setCart} onClose={() => setShowCart(false)} />}
    </div>
  );
}
