import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 pt-5 pb-4">
      <div className="container">
        <div className="row text-start">
          <div className="col-md-3 mb-4">
            <h5 className="fw-semibold mb-3 text-white">MediLab</h5>
            <p className="text-white">Advanced diagnostic testing made simple and accessible for everyone.</p>
          </div>

          <div className="col-md-3 mb-4">
            <h5 className="fw-semibold mb-3 text-white">Services</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white text-decoration-none">Diagnostic Tests</a></li>
              <li><a href="#" className="text-white text-decoration-none">Prescription Upload</a></li>
              <li><a href="#" className="text-white text-decoration-none">Online Results</a></li>
              <li><a href="#" className="text-white text-decoration-none">Teleconsultation</a></li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h5 className="fw-semibold mb-3 text-white">Support</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white text-decoration-none">Help Center</a></li>
              <li><a href="#" className="text-white text-decoration-none">Contact Us</a></li>
              <li><a href="#" className="text-white text-decoration-none">Privacy Policy</a></li>
              <li><a href="#" className="text-white text-decoration-none">Terms of Service</a></li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h5 className="fw-semibold mb-3 text-white">Contact</h5>
            <p className="text-white mb-1">123 Medical Plaza</p>
            <p className="text-white mb-1">Healthcare City, HC 12345</p>
            <p className="text-white mb-1">info@medilab.com</p>
            <p className="text-white">(555) 123-HELP</p>
          </div>
        </div>

        <hr className="border-light" />
        <div className="text-center mt-3">
          <p className="text-white"> All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;