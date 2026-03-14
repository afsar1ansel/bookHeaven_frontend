import React, { useState, useEffect } from "react";
import { fetchOrderHistory } from "../../utils/orderApi";
import "./MyOrders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const data = await fetchOrderHistory();
      setOrders(data);
    } catch (err) {
      setError("Failed to load order history.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="history-loading">Loading orders...</div>;
  if (error) return <div className="history-error">{error}</div>;

  return (
    <div className="my-orders-container">
      <header className="history-header">
        <h1>My Order History</h1>
        <p>Manage your past purchases and access digital content.</p>
      </header>

      {orders.length === 0 ? (
        <div className="empty-history">
          <p>You haven't placed any orders yet.</p>
          <button onClick={() => window.location.href = "/books"} className="shop-btn">
            Explore Books
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.order_id} className="order-card">
              <div className="order-main-info">
                <div className="order-id">
                  <span className="label">Order ID:</span>
                  <span className="value">#{order.order_id}</span>
                </div>
                <div className="order-date">
                  <span className="label">Date:</span>
                  <span className="value">{order.date}</span>
                </div>
                <div className="order-total">
                  <span className="label">Total:</span>
                  <span className="value">${order.total_amount}</span>
                </div>
                <div className={`order-status ${order.status.toLowerCase()}`}>
                  {order.status}
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item-row">
                    <div className="item-title-info">
                      <span className="item-name">{item.title}</span>
                      <span className="item-format-tag">{item.format}</span>
                    </div>
                    <div className="item-qty">Qty: {item.quantity}</div>
                    <div className="item-price">${item.unit_price}</div>
                    {item.download_link && (
                      <a 
                        href={item.download_link} 
                        className="download-btn" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        Download Content
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
