import React, { useState, useRef, useEffect } from "react";

export default function SearchBar() {
  const [category, setCategory] = useState("Lab Tests");
  const [showCategoryOptions, setShowCategoryOptions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchText, setSearchText] = useState("");
  const categoryRef = useRef(null);
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setShowCategoryOptions(false);
      }
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current !== event.target
      ) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categories = [
    { name: "Lab Tests" },
    { name: "Health Packages" },
    { name: "Home Collection" },
    { name: "Book Appointment" },
  ];

  const popularSearches = [
    "Full Body Checkup",
    "Blood Sugar Test",
    "Thyroid Profile",
    "Vitamin D Test",
  ];

  return (
    <div className="container my-4" style={{ maxWidth: "600px" }}>
      <div className="border rounded-3 p-3 d-flex align-items-center bg-light">
        {/* Category Dropdown */}
        <div className="btn-group me-2" ref={categoryRef}>
          <button
            type="button"
            className="btn btn-outline-secondary dropdown-toggle w-100"
            onClick={() => setShowCategoryOptions(!showCategoryOptions)}
            aria-expanded={showCategoryOptions}
            aria-label="Select category"
          >
            {category}
          </button>
          {showCategoryOptions && (
            <div className="dropdown-menu show shadow-sm w-100 mt-1">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setCategory(cat.name);
                    setShowCategoryOptions(false);
                    inputRef.current?.focus();
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="flex-grow-1 position-relative">
          <input
            type="text"
            className="form-control"
            placeholder="Search lab tests, packages, symptoms..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            ref={inputRef}
            aria-label="Search input"
          />
          {showSuggestions && (
            <div
              className="position-absolute bg-white border  text-dark rounded-3 shadow-sm w-100 mt-1"
              style={{ maxHeight: "200px", overflowY: "auto", zIndex: 1050 }}
              ref={suggestionsRef}
            >
              <div className="p-3">
                <h6 className="text-secondary mb-2">Popular Searches</h6>
                {popularSearches.map((item) => (
                  <div
                    key={item}
                    className="px-2 py-1 rounded text-dark"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSearchText(item);
                      setShowSuggestions(false);
                      inputRef.current?.focus();
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button type="button" className="btn btn-primary ms-2 px-4">
          Search
        </button>
      </div>

    </div>
  );
}
