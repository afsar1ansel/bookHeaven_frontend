import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../utils/baseurl";
import "./Home.css";

const Home = () => {
  const [homeData, setHomeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/api/books/home`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("Unauthorized");
        throw new Error("Failed to fetch home data");
      }

      const data = await response.json();
      setHomeData(data);
    } catch (err) {
      console.error("Home Data Fetch Error:", err);
      setError(
        err.message === "Unauthorized"
          ? "Please login to view this page"
          : "Failed to load home page content.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="home-container">
        <div
          className="hero-section skeleton"
          style={{ height: "600px" }}
        ></div>
        <div className="home-section">
          <div className="section-header">
            <div
              className="skeleton"
              style={{ width: "200px", height: "40px" }}
            ></div>
          </div>
          <div className="books-slider">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="slider-item skeleton"
                style={{ height: "400px" }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="home-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <div className="error-message">
          <h2>Oops!</h2>
          <p>{error}</p>
          {error.includes("login") && (
            <Link to="/login" className="hero-btn">
              Login Now
            </Link>
          )}
        </div>
      </div>
    );
  }

  const { hero, sections, categories, stats, bookOfTheWeek } = homeData;

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        {hero && hero.length > 0 && (
          <div
            className="hero-slide"
            style={{
              backgroundImage: `url(${hero[0].image || "https://picsum.photos/1920/1080?random=hero"})`,
            }}
          >
            <div className="hero-content">
              <h1>{hero[0].title}</h1>
              <p>{hero[0].tagline}</p>
              <div
                style={{ display: "flex", alignItems: "center", gap: "2rem" }}
              >
                <Link to="/books" className="hero-btn">
                  Explore Collection
                </Link>
                {hero[0].price && (
                  <span
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "var(--color-accent)",
                    }}
                  >
                    from ${hero[0].price}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Dynamic Sections (Sliders/Grids) */}
      {sections &&
        sections.map((section, idx) => (
          <section key={idx} className="home-section">
            <div className="section-header">
              <h2>{section.title}</h2>
              <Link to="/books" className="view-all-link">
                View All →
              </Link>
            </div>

            <div
              className={
                section.type === "slider" ? "books-slider" : "books-grid"
              }
            >
              {section.books.map((book) => (
                <Link
                  key={book.BookID || book.id}
                  to="/books" // Navigation to books page for now, or we could pass state to open modal
                  className={
                    section.type === "slider" ? "slider-item" : "book-card"
                  }
                  style={{ textDecoration: "none" }}
                >
                  <img
                    src={
                      book.CoverImageURL
                        ? `${book.CoverImageURL}?random=${book.BookID || book.id}`
                        : `https://via.placeholder.com/400x600?text=${encodeURIComponent(
                            book.Title || book.title,
                          )}`
                    }
                    alt={book.Title || book.title}
                    className={
                      section.type === "slider" ? "slider-img" : "book-image"
                    }
                  />
                  <div
                    className={
                      section.type === "slider" ? "slider-info" : "book-info"
                    }
                  >
                    <h3
                      className={
                        section.type === "slider"
                          ? "slider-title"
                          : "book-title"
                      }
                    >
                      {book.Title || book.title}
                    </h3>
                    <p
                      className={
                        section.type === "slider"
                          ? "slider-author"
                          : "book-authors"
                      }
                    >
                      {book.Authors
                        ? book.Authors.join(", ")
                        : "Various Authors"}
                    </p>
                    <div
                      className={
                        section.type === "slider"
                          ? "slider-footer"
                          : "book-meta"
                      }
                    >
                      <span
                        className={
                          section.type === "slider"
                            ? "slider-price"
                            : "book-price"
                        }
                      >
                        ${book.Price || book.price}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}

      {/* Categories Grid */}
      {categories && (
        <section className="home-section">
          <div className="section-header">
            <h2>Popular Categories</h2>
          </div>
          <div className="categories-grid">
            {categories.map((cat, idx) => (
              <div key={idx} className="category-card">
                <img
                  src={
                    cat.image || `https://picsum.photos/400/300?random=${idx}`
                  }
                  alt={cat.name}
                  className="category-img"
                />
                <div className="category-overlay">
                  <h3>{cat.name}</h3>
                  {cat.bookCount && <span>{cat.bookCount} Books</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Stats Section */}
      {stats && (
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>{stats.TotalBooks}</h3>
              <p>Total Books</p>
            </div>
            <div className="stat-item">
              <h3>{stats.HappyReaders}</h3>
              <p>Happy Readers</p>
            </div>
            <div className="stat-item">
              <h3>{stats.Authors}</h3>
              <p>Verified Authors</p>
            </div>
            <div className="stat-item">
              <h3>{stats.CountriesServed}</h3>
              <p>Countries</p>
            </div>
          </div>
        </section>
      )}

      {/* Book of the Week Spotlight */}
      {bookOfTheWeek && (
        <section className="home-section">
          <div className="botw-section">
            <div
              className="botw-img"
              style={{
                backgroundImage: `url(${
                  bookOfTheWeek.CoverImageURL
                    ? `${bookOfTheWeek.CoverImageURL}?random=${bookOfTheWeek.BookID}`
                    : `https://via.placeholder.com/800x1200?text=${encodeURIComponent(
                        bookOfTheWeek.Title,
                      )}`
                })`,
              }}
            ></div>
            <div className="botw-content">
              <span className="botw-badge">Book of the Week</span>
              <h2 className="botw-title">{bookOfTheWeek.Title}</h2>
              <p className="botw-desc">{bookOfTheWeek.Description}</p>
              <div
                className="slider-footer"
                style={{ justifyContent: "flex-start", gap: "3rem" }}
              >
                <span className="modal-price" style={{ fontSize: "2.5rem" }}>
                  ${bookOfTheWeek.Price}
                </span>
                <Link to="/books" className="hero-btn">
                  Read More
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
