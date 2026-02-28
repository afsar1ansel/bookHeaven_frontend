import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../utils/baseurl";
import "./BookManagement.css";

const BookManagement = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    ISBN: "",
    Title: "",
    Authors: "", // Comma-separated string in form
    Description: "",
    Price: "",
    StockQuantity: "",
    Format: "Physical",
    PublicationDate: "",
    CoverImageURL: "",
  });

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
      if (!response.ok) throw new Error("Failed to fetch books");
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      setError("Failed to load inventory.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        ISBN: book.ISBN,
        Title: book.Title,
        Authors: book.Authors ? book.Authors.join(", ") : "",
        Description: book.Description || "",
        Price: book.Price,
        StockQuantity: book.StockQuantity,
        Format: book.Format || "Physical",
        PublicationDate: book.PublicationDate || "",
        CoverImageURL: book.CoverImageURL || "",
      });
    } else {
      setEditingBook(null);
      setFormData({
        ISBN: "",
        Title: "",
        Authors: "",
        Description: "",
        Price: "",
        StockQuantity: "",
        Format: "Physical",
        PublicationDate: "",
        CoverImageURL: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const method = editingBook ? "PUT" : "POST";
    const url = editingBook
      ? `${BASE_URL}/api/books/${editingBook.BookID}`
      : `${BASE_URL}/api/books/`;

    // Process authors string into array
    const authorsArray = formData.Authors.split(",")
      .map((a) => a.trim())
      .filter((a) => a !== "");

    const payload = {
      ISBN: formData.ISBN,
      Title: formData.Title,
      Description: formData.Description,
      Price: parseFloat(formData.Price),
      StockQuantity: parseInt(formData.StockQuantity),
      Format: formData.Format,
      PublicationDate: formData.PublicationDate,
      CoverImageURL: formData.CoverImageURL,
      Authors: authorsArray,
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save book");

      alert(editingBook ? "Book updated!" : "Book added!");
      setIsModalOpen(false);
      fetchBooks();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}/api/books/${bookId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete book");
      alert("Book deleted!");
      fetchBooks();
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading)
    return <div className="loading-spinner">Loading inventory...</div>;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1>Book Management</h1>
        <button className="btn-add" onClick={() => openModal()}>
          + Add New Book
        </button>
      </header>

      {error && <p className="error-message">{error}</p>}

      <div className="books-table-container">
        <table className="books-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Authors</th>
              <th>ISBN</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.BookID}>
                <td>{book.BookID}</td>
                <td>{book.Title}</td>
                <td>{book.Authors ? book.Authors.join(", ") : ""}</td>
                <td>{book.ISBN}</td>
                <td>${book.Price}</td>
                <td>{book.StockQuantity}</td>
                <td className="action-btns">
                  <button className="btn-edit" onClick={() => openModal(book)}>
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(book.BookID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <header className="modal-header">
              <h2>{editingBook ? "Edit Book" : "Add New Book"}</h2>
            </header>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  name="Title"
                  value={formData.Title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Author(s) (comma separated)</label>
                <input
                  name="Authors"
                  value={formData.Authors}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. J.K. Rowling, Stephen King"
                />
              </div>
              <div className="form-group">
                <label>ISBN</label>
                <input
                  name="ISBN"
                  value={formData.ISBN}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="Description"
                  value={formData.Description}
                  onChange={handleInputChange}
                />
              </div>
              <div
                className="form-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="Price"
                    value={formData.Price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock Quantity</label>
                  <input
                    type="number"
                    name="StockQuantity"
                    value={formData.StockQuantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div
                className="form-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                }}
              >
                <div className="form-group">
                  <label>Format</label>
                  <select
                    name="Format"
                    value={formData.Format}
                    onChange={handleInputChange}
                  >
                    <option value="Physical">Physical</option>
                    <option value="E-book">E-book</option>
                    <option value="Audiobook">Audiobook</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Cover Image URL</label>
                  <input
                    name="CoverImageURL"
                    value={formData.CoverImageURL}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Publication Date</label>
                <input
                  type="date"
                  name="PublicationDate"
                  value={formData.PublicationDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingBook ? "Update Book" : "Add Book"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookManagement;
