import React, { useState, useEffect } from "react";
import { 
  fetchCart, 
  updateCartItem, 
  removeCartItem, 
  clearCart, 
  checkout 
} from "../../utils/orderApi";
import "./Cart.css";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutData, setCheckoutData] = useState({
    shipping_address: "",
    payment: { method: "Credit Card", card_number: "" }
  });
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const data = await fetchCart();
      setCart(data);
    } catch (err) {
      setError("Failed to load cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateQuantity = async (bookId, newQuantity) => {
    if (newQuantity < 0) return;
    try {
      await updateCartItem(bookId, newQuantity);
      loadCart();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemove = async (bookId) => {
    try {
      await removeCartItem(bookId);
      loadCart();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleClear = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      try {
        await clearCart();
        loadCart();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!checkoutData.shipping_address || !checkoutData.payment.card_number) {
      alert("Please fill in all checkout details");
      return;
    }

    try {
      setIsCheckingOut(true);
      const result = await checkout(
        checkoutData.shipping_address,
        checkoutData.payment
      );
      setOrderSuccess(result);
      setCart({ items: [], total_amount: "0.00", item_count: 0 });
    } catch (err) {
      alert(err.message || "Checkout failed");
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (isLoading) return <div className="cart-loading">Loading your cart...</div>;
  if (error) return <div className="cart-error">{error}</div>;

  if (orderSuccess) {
    return (
      <div className="checkout-success">
        <div className="success-icon">✓</div>
        <h1>Order Placed!</h1>
        <p>{orderSuccess.message}</p>
        <div className="order-details-card">
          <p><strong>Order ID:</strong> #{orderSuccess.order_id}</p>
          <p><strong>Transaction:</strong> {orderSuccess.transaction_id}</p>
          <p><strong>Amount:</strong> ${orderSuccess.total_amount}</p>
          {orderSuccess.estimated_delivery && (
            <p><strong>Est. Delivery:</strong> {orderSuccess.estimated_delivery}</p>
          )}
        </div>
        <button onClick={() => setOrderSuccess(null)} className="continue-btn">
          Back to Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <header className="cart-header">
        <h1>Shopping Cart</h1>
        {cart.item_count > 0 && (
          <button className="clear-cart-btn" onClick={handleClear}>Clear Cart</button>
        )}
      </header>

      {cart.items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <button onClick={() => window.location.href = "/books"} className="shop-now-btn">Shop Now</button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items-section">
            {cart.items.map((item) => (
              <div key={item.book_id} className="cart-item-card">
                <img src={item.cover_image || "/placeholder.png"} alt={item.title} className="item-img" />
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p className="item-format">{item.format}</p>
                  <p className="item-price">${item.price}</p>
                </div>
                <div className="item-actions">
                  <div className="quantity-controls">
                    <button onClick={() => handleUpdateQuantity(item.book_id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.book_id, item.quantity + 1)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => handleRemove(item.book_id)}>Remove</button>
                </div>
                <div className="item-subtotal">
                  ${item.subtotal}
                </div>
              </div>
            ))}
          </div>

          <aside className="checkout-section">
            <div className="summary-card">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Items ({cart.item_count})</span>
                <span>${cart.total_amount}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount</span>
                <span>${cart.total_amount}</span>
              </div>

              <form className="checkout-form" onSubmit={handleCheckout}>
                <h3>Shipping & Payment</h3>
                <div className="form-group">
                  <label>Shipping Address</label>
                  <textarea 
                    value={checkoutData.shipping_address}
                    onChange={(e) => setCheckoutData({...checkoutData, shipping_address: e.target.value})}
                    required
                    placeholder="Enter full address..."
                  />
                </div>
                <div className="form-group">
                  <label>Card Number</label>
                  <input 
                    type="text" 
                    value={checkoutData.payment.card_number}
                    onChange={(e) => setCheckoutData({
                      ...checkoutData, 
                      payment: {...checkoutData.payment, card_number: e.target.value}
                    })}
                    placeholder="1234123412341234"
                    maxLength="16"
                    required
                  />
                  <small>Use 0000000000000000 to simulate failure</small>
                </div>
                <button 
                  type="submit" 
                  className="checkout-btn"
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? "Processing..." : "Place Order"}
                </button>
              </form>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
