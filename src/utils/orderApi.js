import { BASE_URL } from "./baseurl";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const fetchCart = async () => {
  const response = await fetch(`${BASE_URL}/api/orders/cart`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch cart");
  return response.json();
};

export const addToCart = async (bookId, quantity = 1) => {
  const response = await fetch(`${BASE_URL}/api/orders/cart/add`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ book_id: bookId, quantity }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to add to cart");
  return data;
};

export const updateCartItem = async (bookId, quantity) => {
  const response = await fetch(`${BASE_URL}/api/orders/cart/update`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ book_id: bookId, quantity }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to update cart");
  return data;
};

export const removeCartItem = async (bookId) => {
  const response = await fetch(`${BASE_URL}/api/orders/cart/remove/${bookId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to remove item");
  return data;
};

export const clearCart = async () => {
  const response = await fetch(`${BASE_URL}/api/orders/cart/clear`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to clear cart");
  return data;
};

export const checkout = async (shippingAddress, paymentInfo) => {
  const response = await fetch(`${BASE_URL}/api/orders/checkout`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      shipping_address: shippingAddress,
      payment: paymentInfo,
    }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Checkout failed");
  return data;
};

export const fetchOrderHistory = async () => {
  const response = await fetch(`${BASE_URL}/api/orders/history`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch order history");
  return response.json();
};

export const fetchAdminOrders = async () => {
  const response = await fetch(`${BASE_URL}/api/orders/admin/all`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error("Failed to fetch admin orders");
  return response.json();
};

export const dispatchOrder = async (orderId) => {
  const response = await fetch(
    `${BASE_URL}/api/orders/admin/${orderId}/dispatch`,
    {
      method: "POST",
      headers: getHeaders(),
    }
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Failed to dispatch order");
  return data;
};
