import React, { useState, useEffect } from "react";
import { fetchAdminOrders, dispatchOrder } from "../../utils/orderApi";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAdminOrders();
      setOrders(data);
    } catch (err) {
      setError("Failed to load system orders.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDispatch = async (orderId) => {
    try {
      setActionLoading(orderId);
      await dispatchOrder(orderId);
      // Refresh order list
      const updatedOrders = await fetchAdminOrders();
      setOrders(updatedOrders);
    } catch (err) {
      alert(err.message || "Failed to dispatch order");
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) return <div className="admin-orders-loading">Loading management dashboard...</div>;
  if (error) return <div className="admin-orders-error">{error}</div>;

  return (
    <div className="admin-orders-container">
      <header className="admin-orders-header">
        <div className="title-section">
          <h1>Global Order Management</h1>
          <p>Monitor and fulfill customer orders across the platform.</p>
        </div>
        <button className="refresh-btn" onClick={loadOrders}>Refresh Data</button>
      </header>

      <div className="admin-orders-table-wrapper">
        <table className="admin-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User ID</th>
              <th>Date</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-orders">No orders found in the system.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.order_id}>
                  <td><strong>#{order.order_id}</strong></td>
                  <td>User {order.user_id}</td>
                  <td>{order.date}</td>
                  <td>${order.total_amount}</td>
                  <td>
                    <span className={`status-pill ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    {order.status === "Pending" ? (
                      <button 
                        className="dispatch-btn" 
                        onClick={() => handleDispatch(order.order_id)}
                        disabled={actionLoading === order.order_id}
                      >
                        {actionLoading === order.order_id ? "Processing..." : "Dispatch Now"}
                      </button>
                    ) : (
                      <span className="action-done">N/A</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
