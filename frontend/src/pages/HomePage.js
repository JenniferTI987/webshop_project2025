import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage() {
  const [userId] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const [mostSoldItems, setMostSoldItems] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/items/most_sold/")
      .then(res => res.json())
      .then(data => setMostSoldItems(data))
      .catch(err => console.error("Failed to fetch most sold items:", err));
  }, []);

  const populateDB = () => {
    setActionLoading(true);
    fetch("http://localhost:8000/populate/")
      .then(res => {
        if (!res.ok) throw new Error("Failed to populate DB");
        return res.json();
      })
      .then(data => {
        alert(data.message);
      })
      .catch(err => alert(err))
      .finally(() => setActionLoading(false));
  };

  const payCart = () => {
    setActionLoading(true);
    fetch("http://localhost:8000/pay/", {
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
      })
      .catch(err => alert(err))
      .finally(() => setActionLoading(false));
  };

  return (
    <div className="home-page">
      <div className="welcome-section">
        <h1>Welcome to WebShop</h1>
        <p>Browse our amazing collection of products</p>
      </div>

      <div className="actions-section">
        <button onClick={populateDB} disabled={actionLoading} className="action-btn">
          {actionLoading ? "Processing..." : "Populate Database"}
        </button>
        <button onClick={payCart} disabled={actionLoading} className="action-btn">
          {actionLoading ? "Processing..." : "Pay Cart"}
        </button>
        <Link to="/items" className="browse-btn">
          Browse All Items
        </Link>
      </div>

      {mostSoldItems.length > 0 && (
        <div className="most-sold-section">
          <h2>Most Sold Items</h2>
          <div className="most-sold-container">
            <button className="scroll-btn left" onClick={() => document.querySelector('.most-sold-row').scrollBy({ left: -200, behavior: 'smooth' })}>
              ‹
            </button>
            <div className="most-sold-row">
              {mostSoldItems.map(item => (
                <Link key={item.id} to={`/items/${item.id}`} className="product-link">
                  <div className="product-card">
                    <img src={item.image_url} alt={item.title} className="product-image" />
                    <h3>{item.title}</h3>
                    <p className="price">€{item.price}</p>
                    <p className="seller">Sold by: {item.seller_username}</p>
                    <p className="sold-count">Sold: {item.sold_count}</p>
                  </div>
                </Link>
              ))}
            </div>
            <button className="scroll-btn right" onClick={() => document.querySelector('.most-sold-row').scrollBy({ left: 200, behavior: 'smooth' })}>
              ›
            </button>
          </div>
        </div>
      )}

      <div className="features-section">
        <h2>Features</h2>
        <div className="features-list">
          <div className="feature-item">
            <h3>🛍️ Browse Products</h3>
            <p>Explore thousands of products from trusted sellers</p>
          </div>
          <div className="feature-item">
            <h3>🔍 Smart Search</h3>
            <p>Find exactly what you're looking for with real-time search</p>
          </div>
          <div className="feature-item">
            <h3>🛒 Easy Shopping</h3>
            <p>Add items to your cart and manage your purchases</p>
          </div>
          <div className="feature-item">
            <h3>💳 Secure Checkout</h3>
            <p>Complete your transactions safely and securely</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
