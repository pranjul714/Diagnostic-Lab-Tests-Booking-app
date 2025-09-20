import React from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link
import Header from "../Home/header";
import Footer from '../Home/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

import SearchBar from './searchBar';

// Practo-app\src\component\Orders\searchBar.jsx

function Home() {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <div
        className="container-fluid py-5"
        style={{
          background: "linear-gradient(135deg, rgba(37,99,235,0.85) 60%, rgba(6,182,212,0.85) 100%), url('/images/lab-bg.jpg') center/cover no-repeat",
          color: "white"
        }}
      >
        <div className="container text-center">
          <h1 className="fw-bold mb-3">Your Health, Our Priority</h1>
          <p className="lead mb-4">Book lab tests, consult doctors, and get reports online</p>
          <SearchBar />
          <div className="mt-4 d-flex justify-content-center gap-3 flex-wrap">
            <Link to="/book-test" className="btn btn-light btn-lg">Book Lab Test</Link>
          
            <button className="btn btn-outline-light btn-lg">Order Medicines</button>
            <Link to="/consult-doctor" className="btn btn-light btn-lg">Consult Doctor</Link>
          </div>
        </div>
      </div>

      {/* Service Categories */}
      <div className="container text-center my-5">
        <h2 className="fw-bold mb-4">Our Services</h2>
        <div className="row g-4">
          {[
            { icon: "🧪", title: "Lab Tests", desc: "Book diagnostic tests from certified labs" },
            { icon: "💬", title: "Online Consultation", desc: "Talk to doctors from home" },
            { icon: "🏥", title: "Surgeries", desc: "Safe and affordable surgical care" },
            { icon: "📦", title: "Medicines", desc: "Order medicines with doorstep delivery" }
          ].map((f, idx) => (
            <div className="col-md-3" key={idx}>
              <div className="p-4 border rounded shadow-sm h-100">
                <div style={{ fontSize: "2rem" }}>{f.icon}</div>
                <h5 className="mt-3">{f.title}</h5>
                <p className="text-muted">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-light py-5">
        <div className="container text-center">
          <div className="row">
            {[
              "NABL Certified Labs",
              "100% Safe & Secure",
              "Trusted by Thousands"
            ].map((badge, idx) => (
              <div className="col-md-4" key={idx}>
                <h5 className="fw-bold">{badge}</h5>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Tests */}
      <div className="container my-5">
        <h2 className="fw-bold text-center mb-4">Popular Tests & Packages</h2>
        <div className="row g-4">
          {[
            { name: "Full Body Checkup", price: "₹1999" },
            { name: "Diabetes Screening", price: "₹499" },
            { name: "Thyroid Profile", price: "₹699" },
            { name: "Lipid Profile", price: "₹799" }
          ].map((test, idx) => (
            <div className="col-md-3" key={idx}>
              <div className="p-4 border rounded shadow-sm h-100 text-center">
                <h5>{test.name}</h5>
                <p className="fw-bold">{test.price}</p>
                <Link to="/book-test" className="btn btn-primary">Book Now</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-primary text-white py-5">
        <div className="container text-center">
          <div className="row">
            <div className="col-md-4">
              <h3 className="fw-bold">5000+</h3>
              <p>Tests Booked</p>
            </div>
            <div className="col-md-4">
              <h3 className="fw-bold">200+</h3>
              <p>Partner Labs</p>
            </div>
            <div className="col-md-4">
              <h3 className="fw-bold">98%</h3>
              <p>Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="container my-5">
        <h2 className="fw-bold text-center mb-4">What Our Customers Say</h2>
        <div className="row g-4">
          {[
            { name: "Amit Sharma", feedback: "Quick booking and fast reports. Highly recommended!" },
            { name: "Priya Verma", feedback: "Loved the home collection service. Very convenient." },
            { name: "Rahul Singh", feedback: "Affordable and trustworthy lab tests." }
          ].map((t, idx) => (
            <div className="col-md-4" key={idx}>
              <div className="p-4 border rounded shadow-sm h-100">
                <p>"{t.feedback}"</p>
                <h6 className="fw-bold mt-3">- {t.name}</h6>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* App Download Section */}
      <div className="bg-light py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-3">Get Our App</h2>
          <p>Book tests, track reports, and consult doctors on the go</p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <img src="/images/google-play.png" alt="Google Play" height="50" />
            <img src="/images/app-store.png" alt="App Store" height="50" />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;