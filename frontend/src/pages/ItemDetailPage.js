import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/ItemDetailPage.css';

function ItemDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/api/items/${id}/`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch item");
        return res.json();
      })
      .then(data => setItem(data))
      .catch(err => alert("Error loading item: " + err))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = () => {
    setActionLoading(true);
    fetch("http://localhost:8000/add-to-cart/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, item_id: id })
    })
    .then(res => {
      if (!res.ok) throw new Error("Failed to add to cart");
      return res.json();
    })
    .then(data => alert(JSON.stringify(data)))
    .catch(err => alert(err))
    .finally(() => setActionLoading(false));
  };

  if (loading) {
    return (
      <div className="item-detail-page">
        <Link to="/items" className="back-link">← Back to Items</Link>
        <p className="loading-message">Loading item details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="item-detail-page">
        <Link to="/items" className="back-link">← Back to Items</Link>
        <p className="error-message">Item not found</p>
      </div>
    );
  }

  return (
    <div className="item-detail-page">
      <Link to="/items" className="back-link">← Back to Items</Link>
      
      <div className="detail-container">
        <div className="detail-image-section">
          {item.image_url && (
            <img 
              src={item.image_url} 
              alt={item.title} 
              className="detail-image"
            />
          )}
        </div>

        <div className="detail-info-section">
          <h1 className="detail-title">{item.title}</h1>
          
          <div className="detail-seller">
            <span className="label">Seller:</span>
            <span className="value">{item.seller_username || item.seller}</span>
          </div>

          <div className="detail-price">
            <span className="price-label">Price:</span>
            <span className="price-value">€{parseFloat(item.price).toFixed(2)}</span>
          </div>

          <div className="detail-status">
            <span className="label">Status:</span>
            <span className="value status-badge">{item.status}</span>
          </div>

          <div className="detail-description">
            <h2>Description</h2>
            <p>{item.description}</p>
          </div>

          <div className="detail-meta">
            <div className="meta-item">
              <span className="label">Item ID:</span>
              <span className="value">{item.id}</span>
            </div>
            <div className="meta-item">
              <span className="label">Added:</span>
              <span className="value">
                {new Date(item.date_added).toLocaleDateString()}
              </span>
            </div>
          </div>

          <button 
            className="add-to-cart-btn-detail" 
            onClick={addToCart}
            disabled={actionLoading}
          >
            {actionLoading ? "Adding to Cart..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ItemDetailPage;
