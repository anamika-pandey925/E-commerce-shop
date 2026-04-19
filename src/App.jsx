import React, { useState, useEffect, useCallback } from 'react';

const CATEGORIES = ['All','Saree','Suit','Jeans','Fashion Jeans','Tops','Crop Top','Kids Wear','Winter Jacket','Wedding'];
const GENDERS    = ['All','Women','Men','Boys','Girls','Kids','Newborn','Maternity','Senior'];
const WEAR_TYPES = ['All','Upper Wear','Lower Wear','Full Set'];
const SEASONS    = ['All','Summer','Winter','All Season'];
const OCCASIONS  = ['All','Casual','Wedding','Haldi','Mehendi','Sangeet','Reception','Beach','Party'];

const LOCATION_MAP = {
  manali:  {season:'Winter',  label:'❄️ Manali — Winter jackets & warm layers'},
  shimla:  {season:'Winter',  label:'🏔️ Shimla — Cozy winter collection'},
  leh:     {season:'Winter',  label:'⛄ Leh Ladakh — Heavy winter jackets'},
  goa:     {season:'Summer',  label:'🌊 Goa — Beach & summer wear'},
  mumbai:  {season:'Summer',  label:'☀️ Mumbai — Light summer casuals'},
  kerala:  {season:'Summer',  label:'🌴 Kerala — Breathable summer wear'},
  delhi:   {season:'All Season', label:'🏙️ Delhi — Traditional & western mix'},
  jaipur:  {season:'All Season', label:'🌸 Jaipur — Vibrant ethnic collection'},
  kolkata: {season:'All Season', label:'🎨 Kolkata — Sarees & ethnic wear'},
};

const WEDDING_OCCASIONS = [
  {key:'Haldi',    emoji:'💛', desc:'Yellow & bright outfits'},
  {key:'Mehendi',  emoji:'💚', desc:'Green & floral prints'},
  {key:'Sangeet',  emoji:'💜', desc:'Colorful & festive'},
  {key:'Wedding',  emoji:'❤️', desc:'Bridal & sherwani'},
  {key:'Reception',emoji:'✨', desc:'Gowns & indo-western'},
];

const getDiscount = p => p.originalPrice
  ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : null;

// ── Product Card ────────────────────────────────────────────────────────────
const ProductCard = ({ product, onProductClick, addToCart }) => {
  const [imgErr, setImgErr] = useState(false);
  const disc = getDiscount(product);
  const FALLBACK_COLORS = { Saree:'#8e44ad',Suit:'#c0392b',Wedding:'#c0392b',Jeans:'#1565c0','Fashion Jeans':'#1a237e',Tops:'#e91e63','Crop Top':'#ff6090','Kids Wear':'#ff9800','Winter Jacket':'#1a237e',default:'#333' };
  const bg = FALLBACK_COLORS[product.category] || FALLBACK_COLORS.default;

  return (
    <article className="pcard" onClick={() => onProductClick(product)}>
      <div className="pcard__img">
        {imgErr
          ? <div className="pcard__fallback" style={{background:`linear-gradient(135deg,${bg}88,${bg}44)`}}>
              <span>🛍️</span><p>{product.name}</p>
            </div>
          : <img src={product.image} alt={product.name} loading="lazy" onError={() => setImgErr(true)} />
        }
        {product.badge && <span className="bdg-left">{product.badge}</span>}
        {disc && <span className="bdg-right">-{disc}%</span>}
        <div className="pcard__hover-tag">{product.gender} · {product.occasion}</div>
        <button className="pcard__qadd" onClick={e=>{e.stopPropagation();addToCart(product);}}>🛒 Quick Add</button>
      </div>
      <div className="pcard__info">
        <p className="pcard__brand">{product.brand}</p>
        <h3 className="pcard__name">{product.name}</h3>
        <div className="pcard__chips">
          <span className="chip">{product.category}</span>
          <span className="chip chip--season">{product.season}</span>
        </div>
        <div className="pcard__stars">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5-Math.floor(product.rating))} <span>({product.reviews})</span></div>
        <div className="pcard__prices">
          <strong>₹{product.price.toLocaleString()}</strong>
          {product.originalPrice && <s>₹{product.originalPrice.toLocaleString()}</s>}
        </div>
      </div>
    </article>
  );
};

// ── Product Detail ──────────────────────────────────────────────────────────
const ProductDetail = ({ product, onClose, addToCart }) => {
  const [color, setColor]   = useState(product.colors?.[0]);
  const [size, setSize]     = useState(null);
  const [qty, setQty]       = useState(1);
  const [added, setAdded]   = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const disc = getDiscount(product);

  useEffect(() => { document.body.style.overflow='hidden'; return ()=>{ document.body.style.overflow=''; }; }, []);

  const handleAdd = () => {
    addToCart({...product, selectedColor:color, selectedSize:size, qty});
    setAdded(true); setTimeout(()=>setAdded(false), 2000);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>✕</button>
        <div className="modal__body">
          <div className="modal__img">
            {imgErr
              ? <div className="pcard__fallback" style={{background:'#1a1a2e',minHeight:400}}><span>🛍️</span><p>{product.name}</p></div>
              : <img src={product.image} alt={product.name} onError={()=>setImgErr(true)} />
            }
            {product.badge && <span className="bdg-left">{product.badge}</span>}
          </div>
          <div className="modal__info">
            <div className="modal__chips">
              <span className="chip">{product.category}</span>
              <span className="chip chip--season">{product.season}</span>
              <span className="chip chip--occ">{product.occasion}</span>
            </div>
            <p className="modal__brand">{product.brand}</p>
            <h2 className="modal__name">{product.name}</h2>
            <p className="modal__gender">👤 {product.gender} · {product.ageGroup}</p>
            <div className="modal__stars">{'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5-Math.floor(product.rating))} <span>{product.rating} · {product.reviews} reviews</span></div>
            <div className="modal__prices">
              <strong>₹{product.price.toLocaleString()}</strong>
              {product.originalPrice && <><s>₹{product.originalPrice.toLocaleString()}</s><span className="disc-chip">{disc}% OFF</span></>}
            </div>
            <p className="modal__desc">{product.description}</p>

            {product.colors?.length > 0 && (
              <div className="modal__section">
                <h4>Color</h4>
                <div className="swatches">
                  {product.colors.map((c,i)=>(
                    <button key={i} className={`swatch${color===c?' active':''}`} style={{background:c}} onClick={()=>setColor(c)} />
                  ))}
                </div>
              </div>
            )}

            {product.sizes?.length > 0 && (
              <div className="modal__section">
                <h4>Size</h4>
                <div className="sizes">
                  {product.sizes.map(s=>(
                    <button key={s} className={`size-btn${size===s?' active':''}`} onClick={()=>setSize(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}

            <div className="modal__section">
              <h4>Quantity</h4>
              <div className="qty">
                <button onClick={()=>setQty(q=>Math.max(1,q-1))}>−</button>
                <span>{qty}</span>
                <button onClick={()=>setQty(q=>q+1)}>+</button>
              </div>
            </div>

            <button className={`add-btn${added?' added':''}`} onClick={handleAdd}>
              {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Cart Sidebar ────────────────────────────────────────────────────────────
const CartSidebar = ({ cart, setCart, onClose }) => {
  const total = cart.reduce((s,i)=>s+i.price*(i.qty||1),0);
  return (
    <div className="overlay" onClick={onClose}>
      <div className="cart-panel" onClick={e=>e.stopPropagation()}>
        <div className="cart-panel__head">
          <h2>🛒 Cart <span>({cart.length})</span></h2>
          <button className="modal__close" onClick={onClose}>✕</button>
        </div>
        {cart.length===0
          ? <div className="cart-empty"><p>🛍️</p><p>Your cart is empty</p></div>
          : <>
            <div className="cart-items">
              {cart.map((item,i)=>(
                <div key={i} className="cart-item">
                  <img src={item.image} alt={item.name} onError={e=>{e.target.style.display='none';}} />
                  <div>
                    <p className="ci__name">{item.name}</p>
                    {item.selectedSize&&<p className="ci__meta">Size: {item.selectedSize}</p>}
                    <p className="ci__price">₹{item.price.toLocaleString()} × {item.qty||1}</p>
                  </div>
                  <button className="ci__rm" onClick={()=>setCart(p=>p.filter((_,j)=>j!==i))}>✕</button>
                </div>
              ))}
            </div>
            <div className="cart-foot">
              <div className="cart-total"><span>Total</span><strong>₹{total.toLocaleString()}</strong></div>
              <button className="checkout-btn">Proceed to Checkout →</button>
            </div>
          </>
        }
      </div>
    </div>
  );
};

// ── Filter Panel ────────────────────────────────────────────────────────────
const FilterPanel = ({ filters, setFilters, onClose }) => (
  <div className="filter-panel">
    <div className="filter-panel__head">
      <h3>🔽 Filters</h3>
      {onClose && <button className="modal__close" onClick={onClose}>✕</button>}
    </div>

    {[
      {label:'Gender',   key:'gender',   opts:GENDERS},
      {label:'Type',     key:'wearType', opts:WEAR_TYPES},
      {label:'Season',   key:'season',   opts:SEASONS},
      {label:'Occasion', key:'occasion', opts:OCCASIONS},
    ].map(({label,key,opts})=>(
      <div className="fgroup" key={key}>
        <label>{label}</label>
        <div className="fchips">
          {opts.map(o=>(
            <button key={o} className={`fchip${filters[key]===o?' active':''}`}
              onClick={()=>setFilters(f=>({...f,[key]:o}))}>
              {o==='Winter'?'❄️ ':o==='Summer'?'☀️ ':''}{o}
            </button>
          ))}
        </div>
      </div>
    ))}

    <button className="clear-btn" onClick={()=>setFilters({gender:'All',wearType:'All',season:'All',occasion:'All'})}>
      ✕ Clear All Filters
    </button>
  </div>
);

// ── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts]       = useState([]);
  const [cart, setCart]               = useState(()=>JSON.parse(localStorage.getItem('cart')||'[]'));
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [category, setCategory]       = useState('All');
  const [filters, setFilters]         = useState({gender:'All',wearType:'All',season:'All',occasion:'All'});
  const [selProduct, setSelProduct]   = useState(null);
  const [showCart, setShowCart]       = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [cartBounce, setCartBounce]   = useState(false);
  const [mobileMenu, setMobileMenu]   = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [locInput, setLocInput]       = useState('');
  const [locSuggest, setLocSuggest]   = useState(null);

  useEffect(()=>{ localStorage.setItem('cart',JSON.stringify(cart)); },[cart]);
  useEffect(()=>{ const fn=()=>setScrolled(window.scrollY>60); window.addEventListener('scroll',fn); return()=>window.removeEventListener('scroll',fn); },[]);

  useEffect(()=>{
    setLoading(true);
    fetch('/api/products').then(r=>r.json()).then(d=>{setAllProducts(d);setLoading(false);}).catch(()=>setLoading(false));
  },[]);

  useEffect(()=>{
    let r=[...allProducts];
    if(category!=='All') r=r.filter(p=>p.category===category);
    if(filters.gender!=='All') r=r.filter(p=>p.gender===filters.gender||p.gender==='Kids'&&['Boys','Girls','Newborn'].includes(filters.gender));
    if(filters.wearType!=='All') r=r.filter(p=>p.wearType===filters.wearType);
    if(filters.season!=='All') r=r.filter(p=>p.season===filters.season||p.season==='All Season');
    if(filters.occasion!=='All') r=r.filter(p=>p.occasion===filters.occasion);
    if(search.trim()){ const q=search.toLowerCase(); r=r.filter(p=>p.name.toLowerCase().includes(q)||p.brand.toLowerCase().includes(q)||p.category.toLowerCase().includes(q)||p.gender.toLowerCase().includes(q)||p.occasion.toLowerCase().includes(q)); }
    setProducts(r);
  },[allProducts,category,filters,search]);

  const handleLocation = val => {
    setLocInput(val);
    const key=Object.keys(LOCATION_MAP).find(k=>val.toLowerCase().includes(k));
    setLocSuggest(key?LOCATION_MAP[key]:null);
  };

  const applyLocation = () => {
    if(locSuggest){ setFilters(f=>({...f,season:locSuggest.season})); document.getElementById('collections')?.scrollIntoView({behavior:'smooth'}); }
  };

  const goOccasion = occ => {
    setFilters(f=>({...f,occasion:occ}));
    setCategory('All');
    document.getElementById('collections')?.scrollIntoView({behavior:'smooth'});
    setMobileMenu(false);
  };

  const goCat = cat => {
    setCategory(cat); setSearch(''); setMobileMenu(false);
    document.getElementById('collections')?.scrollIntoView({behavior:'smooth'});
  };

  const addToCart = useCallback(product=>{
    setCart(p=>[...p,{...product,qty:product.qty||1}]);
    setCartBounce(true); setTimeout(()=>setCartBounce(false),400);
  },[]);

  const activeFilters = [filters.gender!=='All',filters.wearType!=='All',filters.season!=='All',filters.occasion!=='All'].filter(Boolean).length;

  return (
    <div className="app">
      {/* NAVBAR */}
      <header className={`navbar${scrolled?' scrolled':''}`}>
        <div className="container navbar-inner">
          <a href="#" className="logo" onClick={()=>setCategory('All')}>Shop<span>.co</span></a>
          <nav className={`nav-links${mobileMenu?' open':''}`}>
            {['Saree','Suit','Jeans','Tops','Kids Wear','Wedding'].map(c=>(
              <button key={c} className="nav-link" onClick={()=>goCat(c)}>{c}</button>
            ))}
            <a href="#about" className="nav-link" onClick={()=>setMobileMenu(false)}>About</a>
          </nav>
          <div className="nav-actions">
            <div className="srch-wrap">
              <span>🔍</span>
              <input placeholder="Search..." className="srch" value={search}
                onChange={e=>{setSearch(e.target.value);setCategory('All');}} />
            </div>
            <button className={`icon-btn${cartBounce?' bounce':''}`} onClick={()=>setShowCart(true)}>
              🛒{cart.length>0&&<span className="cbadge">{cart.length}</span>}
            </button>
            <button className="icon-btn mmenu-btn" onClick={()=>setMobileMenu(p=>!p)}>
              {mobileMenu?'✕':'☰'}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero" id="home">
          <div className="blob b1"/><div className="blob b2"/>
          <div className="container">
            <div className="hero-content">
              <span className="hero-tag">✦ 2026 Collection — Fashion for Every Occasion & Season</span>
              <h1 className="hero-title">Style That<br/><span className="grad">Speaks For You.</span></h1>
              <p className="hero-sub">Sarees · Suits · Jeans · Tops · Wedding Collections · Kids Wear · Winter Jackets<br/>Smart outfit recommendations by gender, occasion, season & location.</p>
              <div className="hero-btns">
                <button className="btn btn-primary" onClick={()=>document.getElementById('collections')?.scrollIntoView({behavior:'smooth'})}>Shop the Drop →</button>
                <button className="btn btn-outline" onClick={()=>{setCategory('All');document.getElementById('collections')?.scrollIntoView({behavior:'smooth'});}}>Explore Collections</button>
              </div>

              {/* Location Bar */}
              <div className="loc-bar">
                <span>📍</span>
                <input placeholder="Enter destination (Manali, Goa, Delhi...)" className="loc-input"
                  value={locInput} onChange={e=>handleLocation(e.target.value)} />
                {locSuggest&&<button className="loc-btn" onClick={applyLocation}>{locSuggest.label} — Show Outfits</button>}
              </div>

              <div className="hero-stats">
                {[['30+','Products'],['9','Categories'],['6','Genders'],['5','Occasions']].map(([v,l])=>(
                  <React.Fragment key={l}><div className="stat"><strong>{v}</strong><span>{l}</span></div><div className="stat-div"/></React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WEDDING OCCASIONS STRIP */}
        <section className="wedding-strip">
          <div className="container">
            <p className="wedding-strip__label">💍 Wedding Functions</p>
            <div className="wedding-occasions">
              {WEDDING_OCCASIONS.map(o=>(
                <button key={o.key} className={`occ-btn${filters.occasion===o.key?' active':''}`}
                  onClick={()=>goOccasion(o.key)}>
                  <span>{o.emoji}</span>
                  <strong>{o.key}</strong>
                  <p>{o.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORY STRIP */}
        <section className="cat-strip">
          <div className="container">
            <div className="cat-scroll">
              {CATEGORIES.map(c=>(
                <button key={c} className={`cat-pill${category===c?' active':''}`} onClick={()=>goCat(c)}>
                  {c==='Saree'&&'🥻 '}{c==='Suit'&&'👗 '}{c==='Jeans'&&'👖 '}{c==='Fashion Jeans'&&'🌀 '}
                  {c==='Tops'&&'👚 '}{c==='Crop Top'&&'🩱 '}{c==='Kids Wear'&&'🧒 '}
                  {c==='Winter Jacket'&&'🧥 '}{c==='Wedding'&&'💍 '}{c==='All'&&'🛍️ '}
                  {c}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* COLLECTIONS */}
        <section id="collections" className="coll-section">
          <div className="container">
            <div className="coll-layout">
              {/* Filter - desktop */}
              <div className="filter-desk">
                <FilterPanel filters={filters} setFilters={setFilters} />
              </div>

              <div className="coll-main">
                <div className="coll-header">
                  <div>
                    <h2 className="sec-title">{category==='All'?'All Products':category}</h2>
                    <p className="sec-sub">{search?`Results for "${search}"`:''} {products.length} items{activeFilters>0?` · ${activeFilters} filter${activeFilters>1?'s':''} active`:''}</p>
                  </div>
                  <button className={`filter-toggle${mobileFilters?' active':''}`} onClick={()=>setMobileFilters(p=>!p)}>
                    🔽 Filters{activeFilters>0&&<span className="cbadge">{activeFilters}</span>}
                  </button>
                </div>

                {/* Mobile Filter Overlay */}
                {mobileFilters&&(
                  <div className="overlay" onClick={()=>setMobileFilters(false)}>
                    <div className="mobile-filter-panel" onClick={e=>e.stopPropagation()}>
                      <FilterPanel filters={filters} setFilters={setFilters} onClose={()=>setMobileFilters(false)} />
                    </div>
                  </div>
                )}

                {loading
                  ? <div className="loader-wrap"><div className="loader"/><p>Loading products...</p></div>
                  : products.length===0
                    ? <div className="no-results">
                        <p>😔 No products found</p>
                        <button className="btn btn-outline" onClick={()=>{setSearch('');setCategory('All');setFilters({gender:'All',wearType:'All',season:'All',occasion:'All'});}}>Clear All Filters</button>
                      </div>
                    : <div className="pgrid">
                        {products.map(p=><ProductCard key={p.id} product={p} onProductClick={setSelProduct} addToCart={addToCart}/>)}
                      </div>
                }
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="about-sec">
          <div className="container">
            <div className="about-grid">
              <div className="about-img">
                <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80" alt="About Shop.co"
                  onError={e=>{e.target.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=80';}} />
                <span className="about-badge">Est. 2026</span>
              </div>
              <div className="about-content">
                <span className="sec-tag">Our Story</span>
                <h2 className="sec-title">Crafting the<br/>New Standard.</h2>
                <p className="about-text">Shop.co was built on one belief — fashion should be for everyone. Whether you're dressing for a Haldi ceremony, heading to Manali in winter, shopping for your newborn, or looking for a reception gown — we have you covered.</p>
                <div className="about-features">
                  {['100% Authentic Products','Smart Outfit Recommendations','Wedding Collection & Styling','Free Returns · Fast Delivery across India'].map(f=><div key={f} className="af">✅ {f}</div>)}
                </div>
                <button className="btn btn-primary" onClick={()=>document.getElementById('collections')?.scrollIntoView({behavior:'smooth'})}>Shop Now →</button>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section className="trust-sec">
          <div className="container">
            <div className="trust-grid">
              {[{i:'🚀',t:'Free Shipping',s:'Orders above ₹999'},{i:'🔒',t:'Secure Payment',s:'256-bit SSL'},{i:'↩️',t:'Easy Returns',s:'30-day policy'},{i:'⭐',t:'Top Rated',s:'4.8/5 average'}].map(x=>(
                <div className="trust-card" key={x.t}><span>{x.i}</span><strong>{x.t}</strong><p>{x.s}</p></div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div><h2 className="logo">Shop<span>.co</span></h2><p className="footer-desc">Premium fashion for every occasion, season & generation. Made with ❤️ in India.</p></div>
            <div><h4>Categories</h4><ul>{CATEGORIES.slice(1).map(c=><li key={c}><button onClick={()=>goCat(c)}>{c}</button></li>)}</ul></div>
            <div><h4>Occasions</h4><ul>{OCCASIONS.slice(1).map(o=><li key={o}><button onClick={()=>goOccasion(o)}>{o}</button></li>)}</ul></div>
            <div><h4>Support</h4><ul>{['Contact Us','Shipping Policy','Return Policy','FAQ'].map(s=><li key={s}><a href="#">{s}</a></li>)}</ul></div>
          </div>
          <div className="footer-btm"><p>© 2026 Shop.co · All Rights Reserved</p></div>
        </div>
      </footer>

      {selProduct&&<ProductDetail product={selProduct} onClose={()=>setSelProduct(null)} addToCart={addToCart}/>}
      {showCart&&<CartSidebar cart={cart} setCart={setCart} onClose={()=>setShowCart(false)}/>}
    </div>
  );
}
