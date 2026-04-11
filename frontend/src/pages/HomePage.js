import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

function HomePage() {
  const [userId] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);

  const populateDB = () => {
    setActionLoading(true);
    fetch("http://127.0.0.1:8000/populate/")
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
