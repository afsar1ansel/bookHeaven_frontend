import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../utils/baseurl";
import "./Books.css";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/books/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Failed to load books. Please make sure you are logged in.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="loading-spinner">Loading books...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="books-container">
      <header className="books-header">
        <h1>Our Book Collection</h1>
        <p>Explore a wide variety of titles across all genres.</p>
      </header>

      <div className="books-grid">
        {books.map((book) => (
          <div key={book.BookID} className="book-card">
            <img
              src={
                book.CoverImageURL ||
                "https://via.placeholder.com/400x600?text=No+Cover"
              }
              alt={book.Title}
              className="book-image"
            />
            <div className="book-info">
              <h2 className="book-title">{book.Title}</h2>
              <p className="book-authors">
                by {book.Authors ? book.Authors.join(", ") : "Unknown Author"}
              </p>
              <p className="book-isbn">ISBN: {book.ISBN}</p>
              <div className="book-meta">
                <span className="book-price">${book.Price}</span>
                <span
                  className={`book-stock ${
                    book.StockQuantity < 10 ? "low" : ""
                  }`}
                >
                  {book.StockQuantity} in stock
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;
