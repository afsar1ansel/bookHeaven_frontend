import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../utils/baseurl";
import "./Books.css";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const booksPerPage = 10;

  useEffect(() => {
    fetchBooks();
  }, []);

  // Debounce search term
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setDebouncedSearchTerm(searchTerm);
        setIsSearching(false);
      }, 500); // 500ms delay for a "lil delay" as requested
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

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

  const handleCardClick = async (book) => {
    setSelectedBook(book);
    setIsDetailLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/books/${book.BookID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const fullDetails = await response.json();
        setSelectedBook(fullDetails);
      }
    } catch (err) {
      console.error("Failed to fetch book details", err);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  // Filtering Logic (using debounced term)
  const filteredBooks = books.filter((book) => {
    const searchLow = debouncedSearchTerm.toLowerCase();
    const titleMatch = book.Title.toLowerCase().includes(searchLow);
    const authorMatch = book.Authors
      ? book.Authors.some((author) => author.toLowerCase().includes(searchLow))
      : false;
    return titleMatch || authorMatch;
  });

  // Pagination Logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) return <div className="loading-spinner">Loading books...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="books-container">
      <header className="books-header">
        <h1>Our Book Collection</h1>
        <p>Explore a wide variety of titles across all genres.</p>
      </header>

      <div className="search-container">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by title or author name..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <div
            className={`search-loading-bar ${isSearching ? "active" : ""}`}
          ></div>
        </div>
      </div>

      <div className="books-grid">
        {currentBooks.length > 0 ? (
          currentBooks.map((book) => (
            <div
              key={book.BookID}
              className="book-card"
              onClick={() => handleCardClick(book)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={
                  book.CoverImageURL
                    ? `${book.CoverImageURL}?random=${book.BookID}`
                    : `https://via.placeholder.com/400x600?text=${encodeURIComponent(
                        book.Title,
                      )}`
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
          ))
        ) : (
          <div className="no-results">
            <h3>No books found matching "{searchTerm}"</h3>
            <p>Try searching with a different title or author name.</p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button
            className="pagination-btn"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={`pagination-btn ${currentPage === index + 1 ? "active" : ""}`}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="pagination-btn"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Book Detail Modal */}
      {selectedBook && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="book-detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={closeModal}>
              &times;
            </button>

            <div className="modal-image-section">
              <img
                src={
                  selectedBook.CoverImageURL
                    ? `${selectedBook.CoverImageURL}?random=${selectedBook.BookID}`
                    : `https://via.placeholder.com/400x600?text=${encodeURIComponent(
                        selectedBook.Title,
                      )}`
                }
                alt={selectedBook.Title}
              />
            </div>

            <div className="modal-info-section">
              <h2 className="modal-title">{selectedBook.Title}</h2>
              <p className="modal-authors">
                by{" "}
                {selectedBook.Authors
                  ? selectedBook.Authors.join(", ")
                  : "Unknown Author"}
              </p>

              <div className="modal-price-stock">
                <span className="modal-price">${selectedBook.Price}</span>
                <span
                  className="modal-stock"
                  style={{
                    backgroundColor:
                      selectedBook.StockQuantity > 0 ? "#e6f4ea" : "#fce8e6",
                    color:
                      selectedBook.StockQuantity > 0 ? "#1e8e3e" : "#d93025",
                  }}
                >
                  {selectedBook.StockQuantity > 0
                    ? `${selectedBook.StockQuantity} available`
                    : "Out of Stock"}
                </span>
              </div>

              <div className="modal-description">
                {isDetailLoading ? (
                  <p>Loading full description...</p>
                ) : (
                  selectedBook.Description ||
                  "No description available for this book."
                )}
              </div>

              <div className="modal-extra-details">
                <div className="modal-stat">
                  <span className="stat-label">ISBN</span>
                  <span className="stat-value">{selectedBook.ISBN}</span>
                </div>
                <div className="modal-stat">
                  <span className="stat-label">Format</span>
                  <span className="stat-value">{selectedBook.Format}</span>
                </div>
                <div className="modal-stat">
                  <span className="stat-label">Publication Date</span>
                  <span className="stat-value">
                    {selectedBook.PublicationDate || "N/A"}
                  </span>
                </div>
                <div className="modal-stat">
                  <span className="stat-label">Product ID</span>
                  <span className="stat-value">#{selectedBook.BookID}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Books;
