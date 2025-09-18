import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Home/header";

const BookTest = () => {
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    prescription: null,
    doctorName: "",
    prescriptionDate: "",
    tests: [],
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch user info on mount
  useEffect(() => {
    const email = JSON.parse(localStorage.getItem("user"))?.email;
    if (!email) {
      navigate("/login");
      return;
    }

    axios
      .post("http://localhost:8080/account", { email })
      .then((res) => {
        if (res.data.success) {
          const user = res.data.user;
          setFormData((prev) => ({
            ...prev,
            name: user.userName || "",
            email: user.email || "",
          }));
        }
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleFileClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFormData((prev) => ({ ...prev, prescription: selectedFile }));
      setMessage(`✅ Prescription selected: ${selectedFile.name}`);

      // Send file to backend for OCR extraction
      const tempPayload = new FormData();
      tempPayload.append("prescription", selectedFile);
      tempPayload.append("name", formData.name);
      tempPayload.append("email", formData.email);
      tempPayload.append("phone", formData.phone);

      try {
        setLoading(true);
        const res = await axios.post(
          "http://localhost:8080/api/orders/ocr-preview",
          tempPayload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (res.data.extractedTests?.length) {
          // Auto-suggested tests from OCR
          setFormData((prev) => ({ ...prev, tests: res.data.extractedTests }));
          setMessage(
            `📄 Tests auto-suggested via OCR: ${res.data.extractedTests.join(", ")}`
          );
        } else {
          // Manual review fallback
          setMessage(
            "📥 Prescription uploaded. Our team will review and assist with test selection shortly, similar to Pathkind Labs and Trident Diagnostics."
          );
        }
      } catch (err) {
        console.error("OCR preview error:", err);
        setMessage("Error analyzing prescription. You can still enter tests manually.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestChange = (e) => {
    const tests = e.target.value
      .split(",")
      .map((test) => test.trim())
      .filter(Boolean);
    setFormData((prev) => ({ ...prev, tests }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.prescription || formData.tests.length === 0) {
      setMessage(
        "Please upload a prescription or ensure at least one test is listed."
      );
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("phone", formData.phone);
    payload.append("doctorName", formData.doctorName);
    payload.append("prescriptionDate", formData.prescriptionDate);
    payload.append("tests", formData.tests.join(","));
    payload.append("prescription", formData.prescription);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8080/api/orders",
        payload,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage(res.data.message || "Order placed successfully!");
      navigate("/my-orders");
    } catch (err) {
      console.error("❌ Order error:", err);
      setMessage(err.response?.data?.error || "Error placing order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h2>Upload Prescription & Book Test</h2>

        {message && <div className="alert alert-info">{message}</div>}
        {loading && <div className="text-muted">Processing...</div>}

        <div className="alert alert-secondary">
          
        </div>

     

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input
              name="name"
              className="form-control"
              value={formData.name}
              readOnly
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              readOnly
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Phone</label>
            <input
              name="phone"
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Doctor Name</label>
            <input
              name="doctorName"
              className="form-control"
              value={formData.doctorName}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Prescription Date</label>
            <input
              name="prescriptionDate"
              className="form-control"
              value={formData.prescriptionDate}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-12">
            <label className="form-label">Tests to Book (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              value={formData.tests.join(", ")}
              onChange={handleTestChange}
              required
            />

               <div className="bg-white rounded shadow p-4 mb-4">
          <h5 className="fw-semibold mb-3">Upload Prescription</h5>
          <div
            className="border rounded text-center p-5 mb-4 bg-light"
            style={{ cursor: "pointer" }}
            onClick={handleFileClick}
          >
            <i className="fas fa-cloud-upload-alt fa-2x text-secondary mb-3"></i>
            <p className="mb-1">Click to browse your prescription</p>
            <input
              type="file"
              ref={fileInputRef}
              className="d-none"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={handleFileChange}
            />
          </div>
          {formData.prescription && (
            <p>
              <strong>Uploaded:</strong> {formData.prescription.name}
            </p>
          )}
        </div>
        
          </div>
          <div className="col-12 text-end">
            <button type="submit" className="btn btn-primary">
              Place Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookTest;