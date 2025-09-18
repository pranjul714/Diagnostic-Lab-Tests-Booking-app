import React from 'react';
import Header from "../Home/header";
import Footer from '../Home/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

import SearchBar from '../orders/searchBar';

function Home() {
  return (
    <div>
      <Header />
      <div
        className="rounded container mb-5 mt-5 mx-auto px-4 py-12 pt-3 pb-5"
        style={{ background: "linear-gradient(135deg, #2563EB 60%, #06B6D4 100%)" }}
      >
        <div className="container text-center mb-5">
          <h2 className="display-5 fw-bold text-white mb-3">
            Book Diagnostic Lab Tests
          </h2>
          <SearchBar />
          <p className="fs-5 text-white">
            Trusted labs, accurate reports, convenient sample collection
          </p>
          <p className="fs-5 text-white">
            Upload prescriptions, schedule tests, and get results online — all in one secure platform
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
