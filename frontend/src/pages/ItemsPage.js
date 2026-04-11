import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ItemsPage.css';

function ItemsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [userId] = useState(1);

  // Load products from backend
  const loadProducts = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/items/")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then(data => {
        const items = Array.isArray(data) ? data : (data.results || data);
        setProducts(items);
        setFilteredProducts(items);
      })
      .catch(err => alert("Error loading products: " + err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.seller_username || product.seller).toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const listAllItems = () => {
    setSearchTerm('');
    setFilteredProducts(products);
  };

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

  return (
    <div className="items-page">
      <div className="page-header">
        <h2>All Items</h2>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>

      {/* Search and Filter Controls */}
      <div className="search-controls">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search products by title, description, or seller..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button onClick={listAllItems} className="list-all-btn">
          List All Items
        </button>
        {searchTerm && (
          <p className="search-results">
            Found {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''} 
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        )}
      </div>

      {/* Items Display */}
      {loading ? (
        <p className="loading-message">Loading items...</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <p className="no-products-message">{searchTerm ? `No items found matching "${searchTerm}"` : 'No items available.'}</p>
          ) : (
            filteredProducts.map(product => (
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
    </div>
  );
}

export default ItemsPage;
