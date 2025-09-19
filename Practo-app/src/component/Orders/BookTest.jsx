import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../Home/header";
import "bootstrap/dist/css/bootstrap.min.css";

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
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

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
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setMessage(`✅ Prescription selected: ${selectedFile.name}`);

      const tempPayload = new FormData();
      tempPayload.append("file", selectedFile);

      try {
        setLoading(true);
        const res = await axios.post(
          "http://localhost:8080/api/orders/upload-prescription",
          tempPayload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const { entities } = res.data;
        const autoTests = [
          ...(entities?.diagnoses || []),
          ...(entities?.symptoms || []),
        ];

        if (autoTests.length) {
          setFormData((prev) => ({ ...prev, tests: autoTests }));
          setMessage(`📄 Auto-suggested tests: ${autoTests.join(", ")}`);
        } else {
          setMessage("📥 Prescription uploaded. No tests auto-suggested.");
        }
      } catch (err) {
        console.error("OCR extraction error:", err);
        setMessage("Error analyzing prescription. You can still enter tests manually.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange({ target: { files: e.dataTransfer.files } });
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
      setMessage("Please upload a prescription or ensure at least one test is listed.");
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
      <div className="container my-5">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-4 p-md-5">
            <h2 className="fw-bold mb-4 text-primary">🩺 Upload Prescription & Book Test</h2>

            {message && <div className="alert alert-info">{message}</div>}
            {loading && <div className="text-muted mb-3">Processing...</div>}

            <form onSubmit={handleSubmit} className="row g-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Name</label>
                <input name="name" className="form-control" value={formData.name} readOnly />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Email</label>
                <input type="email" name="email" className="form-control" value={formData.email} readOnly />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Phone</label>
                <input name="phone" className="form-control" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Doctor Name</label>
                <input name="doctorName" className="form-control" value={formData.doctorName} onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Prescription Date</label>
                <input type="date" name="prescriptionDate" className="form-control" value={formData.prescriptionDate} onChange={handleChange} />
              </div>
              <div className="col-md-12">
                <label className="form-label fw-semibold">Tests to Book (comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.tests.join(", ")}
                  onChange={handleTestChange}
                  required
                />
                {formData.tests.length > 0 && (
                  <div className="mt-2">
                    {formData.tests.map((test, idx) => (
                      <span key={idx} className="badge bg-info text-dark me-2 mb-2">{test}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Drag & Drop Upload Section */}
              <div className="col-md-12">
                <div
                  className={`bg-light rounded-4 p-4 text-center border border-2 ${dragActive ? "border-primary" : "border-dashed"}`}
                  style={{ cursor: "pointer", borderStyle: "dashed" }}
                  onClick={handleFileClick}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <i className="fas fa-cloud-upload-alt fa-3x text-secondary mb-3"></i>
                  <p className="mb-1 fw-semibold">
                    Drag & drop your prescription here, or click to browse
                  </p>
                  <small className="text-muted">Accepted formats: JPG, PNG, PDF</small>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="d-none"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Preview */}
                {previewUrl && (
                  <div className="mt-3 text-center">
                    {formData.prescription?.type === "application/pdf" ? (
                      <div>
                        <i className="fas fa-file-pdf fa-3x text-danger"></i>
                        <p className="mt-2">{formData.prescription.name}</p>
                      </div>
                    ) : (
                      <img
                        src={previewUrl}
                        alt="Prescription Preview"
                        className="img-fluid rounded shadow-sm"
                                               style={{ maxWidth: "400px" }}
                      />
                    )}
                  </div>
                )}
              </div>

              <div className="col-md-12 text-center mt-4">
                <button type="submit" className="btn btn-primary px-5 py-2 fw-semibold">
                  {loading ? "Submitting..." : "Book Test"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookTest;