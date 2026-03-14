import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../utils/baseurl";
import { addToCart } from "../../utils/orderApi";
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
  const [cartMessage, setCartMessage] = useState({ text: "", type: "" });

  // Filter States
  const [selectedFormatFilter, setSelectedFormatFilter] = useState("All"); // "All", "Physical Copy", "Digital eBook"
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [priceRange, setPriceRange] = useState(500); // Max price default
  const [minRating, setMinRating] = useState(0);

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

  const handleAddToCart = async (e, bookId) => {
    e.stopPropagation();
    try {
      await addToCart(bookId, 1);
      setCartMessage({ text: "Added to cart successfully!", type: "success" });
      setTimeout(() => setCartMessage({ text: "", type: "" }), 3000);
    } catch (err) {
      setCartMessage({ text: err.message || "Failed to add to cart", type: "error" });
      setTimeout(() => setCartMessage({ text: "", type: "" }), 3000);
    }
  };

  const closeModal = () => {
    setSelectedBook(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  // Filtering Logic (using debounced term + sidebar filters)
  const filteredBooks = books.filter((book) => {
    const searchLow = debouncedSearchTerm.toLowerCase();

    // Search Filter (Title, Author, or ISBN)
    const titleMatch = book.Title.toLowerCase().includes(searchLow);
    const authorMatch = book.Authors
      ? book.Authors.some((author) => author.toLowerCase().includes(searchLow))
      : false;
    const isbnMatch = book.ISBN
      ? book.ISBN.toLowerCase().includes(searchLow)
      : false;

    const matchesSearch = titleMatch || authorMatch || isbnMatch;

    // Sidebar Filters
    const matchesGenre =
      selectedGenre === "All" || book.Format === selectedGenre; // Using Format as Genre for now if Genre not explicit

    // Safety check on Price: parse to float before comparison
    const bookPrice = parseFloat(book.Price) || 0;
    const matchesPrice = bookPrice <= priceRange;

    // Format Type Filter (Mock logic for Physical vs Digital)
    // Since API doesn't distinguish, we'll just apply the filter as a UI state
    // But since it affects price... let's define how it works:
    // If "All", show all.
    // If "Physical" or "Digital", we still show all, but the card displays the respective price.
    // Wait, the user said: "filter the ebook and physical books from among".
    // If the API `Format` field actually contains "E-book" or "Hardcover", we should filter by that!
    // Let's check if the format filter matches the actual API Format field if it's not "All".
    // For now, let's assume Physical = ['Hardcover', 'Paperback'], Digital = ['E-book', 'Audiobook'] (or similar string matching).
    // If the API strictly uses `Format: "E-book"`, then:
    let matchesFormatType = true;
    if (selectedFormatFilter === "Physical Copy") {
      matchesFormatType =
        book.Format &&
        !book.Format.toLowerCase().includes("e-book") &&
        !book.Format.toLowerCase().includes("ebook") &&
        !book.Format.toLowerCase().includes("audio");
    } else if (selectedFormatFilter === "Digital eBook") {
      matchesFormatType =
        book.Format &&
        (book.Format.toLowerCase().includes("e-book") ||
          book.Format.toLowerCase().includes("ebook"));
    }

    const matchesRating = (book.Rating || 0) >= minRating;

    return (
      matchesSearch &&
      matchesFormatType &&
      matchesGenre &&
      matchesPrice &&
      matchesRating
    );
  });

  // Extract unique genres/formats for filter dropdown
  const genres = ["All", ...new Set(books.map((book) => book.Format))].filter(
    Boolean,
  );

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
        
        {cartMessage.text && (
          <div className={`cart-notification ${cartMessage.type}`}>
            {cartMessage.text}
          </div>
        )}
      </header>

      <div className="search-container">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by title, author, or ISBN..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <div
            className={`search-loading-bar ${isSearching ? "active" : ""}`}
          ></div>
        </div>
      </div>

      <div className="books-main-layout">
        {/* Smart Filter Sidebar */}
        <aside className="filter-sidebar">
          <div className="filter-group">
            <h3>Book Format</h3>
            <div
              className="format-toggle-group"
              style={{ marginBottom: "1rem" }}
            >
              <button
                className={`format-btn ${selectedFormatFilter === "All" ? "active" : ""}`}
                onClick={() => setSelectedFormatFilter("All")}
                style={{ padding: "0.5rem", fontSize: "0.9rem" }}
              >
                All
              </button>
              <button
                className={`format-btn ${selectedFormatFilter === "Physical Copy" ? "active" : ""}`}
                onClick={() => setSelectedFormatFilter("Physical Copy")}
                style={{ padding: "0.5rem", fontSize: "0.9rem" }}
              >
                Physical
              </button>
              <button
                className={`format-btn ${selectedFormatFilter === "Digital eBook" ? "active" : ""}`}
                onClick={() => setSelectedFormatFilter("Digital eBook")}
                style={{ padding: "0.5rem", fontSize: "0.9rem" }}
              >
                Digital
              </button>
            </div>
          </div>

          <div className="filter-group">
            <h3>Genre / Format</h3>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="filter-select"
            >
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <h3>Price Range (Up to ${priceRange})</h3>
            <input
              type="range"
              min="0"
              max="1000"
              step="10"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="filter-range"
            />
            <div className="price-labels">
              <span>$0</span>
              <span>$1000</span>
            </div>
          </div>

          <div className="filter-group">
            <h3>Minimum Rating</h3>
            <div
              className="rating-filter"
              style={{
                flexDirection: "row",
                gap: "0.2rem",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`star-btn ${minRating >= star ? "active" : ""}`}
                    onClick={() => setMinRating(star === minRating ? 0 : star)}
                  >
                    ★
                  </button>
                ))}
              </div>
              <span
                className="rating-text"
                style={{ marginTop: 0, marginLeft: "0.5rem" }}
              >
                {minRating > 0 ? `${minRating}+ Stars` : "Any Rating"}
              </span>
            </div>
          </div>

          <button
            className="reset-filters-btn"
            onClick={() => {
              setSelectedFormatFilter("All");
              setSelectedGenre("All");
              setPriceRange(1000);
              setMinRating(0);
              setSearchTerm("");
            }}
          >
            Reset All Filters
          </button>
        </aside>

        <div className="books-content-area">
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
                      by{" "}
                      {book.Authors
                        ? book.Authors.join(", ")
                        : "Unknown Author"}
                    </p>
                    <p className="book-isbn">ISBN: {book.ISBN}</p>
                    <div
                      className="book-rating"
                      style={{ marginBottom: "0.5rem" }}
                    >
                      <span style={{ color: "#ffc107", fontSize: "1.2rem" }}>
                        {"★".repeat(book.Rating || 0)}
                        <span style={{ color: "#e4e5e9" }}>
                          {"★".repeat(5 - (book.Rating || 0))}
                        </span>
                      </span>
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "#666",
                          marginLeft: "0.25rem",
                        }}
                      >
                        ({book.Rating || 0})
                      </span>
                    </div>
                    <div className="book-meta">
                      <span className="book-price">
                        $
                        {selectedFormatFilter === "Digital eBook" ||
                        (book.Format &&
                          book.Format.toLowerCase().includes("e-book"))
                          ? (parseFloat(book.Price) * 0.8).toFixed(2) // 20% discount for digital
                          : book.Price}
                      </span>
                      <span
                        className={`book-stock ${
                          book.StockQuantity < 10 &&
                          selectedFormatFilter !== "Digital eBook" &&
                          (!book.Format ||
                            !book.Format.toLowerCase().includes("e-book"))
                            ? "low"
                            : ""
                        }`}
                        style={{
                          backgroundColor:
                            selectedFormatFilter === "Digital eBook" ||
                            (book.Format &&
                              book.Format.toLowerCase().includes("e-book"))
                              ? "#e6f4ea"
                              : "",
                          color:
                            selectedFormatFilter === "Digital eBook" ||
                            (book.Format &&
                              book.Format.toLowerCase().includes("e-book"))
                              ? "#1e8e3e"
                              : "",
                        }}
                      >
                        {selectedFormatFilter === "Digital eBook" ||
                        (book.Format &&
                          book.Format.toLowerCase().includes("e-book"))
                          ? "Always Available"
                          : book.StockQuantity > 0
                            ? `${book.StockQuantity} in stock`
                            : "Out of Stock"}
                      </span>
                    </div>
                    <button 
                      className="add-to-cart-btn-grid"
                      onClick={(e) => handleAddToCart(e, book.BookID)}
                      disabled={book.StockQuantity === 0 && !book.Format?.toLowerCase().includes("e-book")}
                    >
                      Add to Cart
                    </button>
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
        </div>
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

              <div
                className="modal-rating"
                style={{
                  marginBottom: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    color: "#ffc107",
                    fontSize: "1.5rem",
                    letterSpacing: "2px",
                  }}
                >
                  {"★".repeat(selectedBook.Rating || 0)}
                  <span style={{ color: "#e4e5e9" }}>
                    {"★".repeat(5 - (selectedBook.Rating || 0))}
                  </span>
                </span>
                <span
                  style={{
                    fontSize: "1rem",
                    color: "#666",
                    marginLeft: "0.5rem",
                    fontWeight: 500,
                  }}
                >
                  ({selectedBook.Rating || 0} out of 5)
                </span>
              </div>

              <div className="modal-price-stock">
                <span className="modal-price">
                  $
                  {selectedFormatFilter === "Digital eBook" ||
                  (selectedBook.Format &&
                    selectedBook.Format.toLowerCase().includes("e-book"))
                    ? (parseFloat(selectedBook.Price) * 0.8).toFixed(2) // 20% discount for digital
                    : selectedBook.Price}
                </span>
                <span
                  className="modal-stock"
                  style={{
                    backgroundColor:
                      selectedFormatFilter === "Digital eBook" ||
                      (selectedBook.Format &&
                        selectedBook.Format.toLowerCase().includes("e-book")) ||
                      selectedBook.StockQuantity > 0
                        ? "#e6f4ea"
                        : "#fce8e6",
                    color:
                      selectedFormatFilter === "Digital eBook" ||
                      (selectedBook.Format &&
                        selectedBook.Format.toLowerCase().includes("e-book")) ||
                      selectedBook.StockQuantity > 0
                        ? "#1e8e3e"
                        : "#d93025",
                  }}
                >
                  {selectedFormatFilter === "Digital eBook" ||
                  (selectedBook.Format &&
                    selectedBook.Format.toLowerCase().includes("e-book"))
                    ? "Always Available"
                    : selectedBook.StockQuantity > 0
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

              <button 
                className="modal-add-to-cart-btn"
                onClick={(e) => handleAddToCart(e, selectedBook.BookID)}
                disabled={selectedBook.StockQuantity === 0 && !selectedBook.Format?.toLowerCase().includes("e-book")}
              >
                Add to Cart
              </button>

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
