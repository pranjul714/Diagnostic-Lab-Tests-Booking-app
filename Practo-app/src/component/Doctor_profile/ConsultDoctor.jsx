
import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const doctors = [
  {
    name: "Dr. Aditi Sharma",
    specialty: "Cardiologist",
    experience: "12 years",
    image: "/images/doctors/aditi.jpg",
    rating: 4.9
  },
  {
    name: "Dr. Rajesh Kumar",
    specialty: "Dermatologist",
    experience: "8 years",
    image: "/images/doctors/rajesh.jpg",
    rating: 4.7
  },
  {
    name: "Dr. Neha Verma",
    specialty: "Pediatrician",
    experience: "10 years",
    image: "/images/doctors/neha.jpg",
    rating: 4.8
  }
];

function ConsultDoctor() {
  return (
    <div className="container my-5">
      <h2 className="fw-bold text-center mb-4">Consult a Doctor</h2>
      <p className="text-center text-muted mb-5">
        Connect with experienced doctors online for quick and reliable medical advice
      </p>
      <div className="row g-4">
        {doctors.map((doc, idx) => (
          <div className="col-md-4" key={idx}>
            <div className="card shadow-sm h-100">
              <img
                src={doc.image}
                className="card-img-top"
                alt={doc.name}
                style={{ height: "250px", objectFit: "cover" }}
              />
              <div className="card-body text-center">
                <h5 className="card-title">{doc.name}</h5>
                <p className="text-primary fw-semibold">{doc.specialty}</p>
                <p className="text-muted mb-1">Experience: {doc.experience}</p>
                <p className="mb-2">⭐ {doc.rating} / 5</p>
                <Link to="/consult" className="btn btn-success">
                  Consult Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConsultDoctor;