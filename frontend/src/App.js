import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [userId] = useState(1); // temporary logged-in user
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // for populate/pay actions

  // Load products from backend
  const loadProducts = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/items/")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then(data => {
        // Handle pagination - DRF returns {results: [...]} when paginated
        const items = Array.isArray(data) ? data : (data.results || data);
        setProducts(items);
      })
      .catch(err => alert("Error loading products: " + err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Populate database
  const populateDB = () => {
    setActionLoading(true);
    fetch("http://127.0.0.1:8000/populate/")
      .then(res => {
        if (!res.ok) throw new Error("Failed to populate DB");
        return res.json();
      })
      .then(data => {
        alert(data.message);
        loadProducts(); // refresh product list
      })
      .catch(err => alert(err))
      .finally(() => setActionLoading(false));
  };

  // Add item to cart
  const addToCart = (itemId) => {
    fetch("http://127.0.0.1:8000/add-to-cart/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, item_id: itemId })
    })
    .then(res => {
      if (!res.ok) throw new Error("Failed to add to cart");
      return res.json();
    })
    .then(data => alert(JSON.stringify(data)))
    .catch(err => alert(err));
  };

  // Pay cart
  const payCart = () => {
    setActionLoading(true);
    fetch("http://127.0.0.1:8000/pay/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId })
    })
    .then(res => {
      if (!res.ok) throw new Error("Payment failed");
      return res.json();
    })
    .then(data => {
      alert(JSON.stringify(data));
      loadProducts(); // refresh items after purchase
    })
    .catch(err => alert(err))
    .finally(() => setActionLoading(false));
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <img src="/mylogo.png" alt="LOGO" className="header-logo" />
        </div>
        <div className="auth-buttons">
          <button onClick={() => alert('Login coming soon!')}>Login</button>
          <button onClick={() => alert('Logout coming soon!')}>Logout</button>
        </div>
      </header>

      <main>
        <div className="actions">
          <button onClick={populateDB} disabled={actionLoading}>
            {actionLoading ? "Processing..." : "Populate Database"}
          </button>
          <button onClick={payCart} disabled={actionLoading}>
            {actionLoading ? "Processing..." : "Pay Cart"}
          </button>
        </div>

        <h2>Products</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="products-grid">
            {products.length === 0 ? (
              <p>No products available. Click "Populate Database" to add some!</p>
            ) : (
              products.map(product => (
                <div key={product.id} className="product-card">
                  {product.image_url && (
                    <img 
                      src={product.image_url} 
                      alt={product.title} 
                      className="product-image"
                    />
                  )}
                  <h3 className="product-title">{product.title}</h3>
                  <p className="product-price">${product.price}</p>
                  <p className="product-seller">Seller: {product.seller_username || product.seller}</p>
                  <p className="product-description">{product.description}</p>
                  <button className="add-to-cart-btn" onClick={() => addToCart(product.id)}>Add to Cart</button>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
