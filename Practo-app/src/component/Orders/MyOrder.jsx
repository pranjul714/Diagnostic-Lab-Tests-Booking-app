import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../Home/header';

const MyOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);
    if (!user?.email) {
      navigate("/login");
      return;
    }

    axios.get(`https://diagnostic-lab-tests-booking-app-1.onrender.com/api/orders/by-email/${user.email}`)
      .then(res => {
        if (res.data.success) {
          setOrders(res.data.orders);
        } else {
          setErrorMsg("Failed to load orders.");
        }
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
        setErrorMsg("Unable to fetch orders. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h2 className="mb-4">My Diagnostic Orders</h2>

        {loading ? (
          <div className="text-muted">Loading orders...</div>
        ) : errorMsg ? (
          <div className="alert alert-danger">{errorMsg}</div>
        ) : orders.length === 0 ? (
          <div className="alert alert-warning">No orders found.</div>
        ) : (
          <div className="row g-4">
            {orders.map((order, index) => (
              <div key={order._id || index} className="col-md-6">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title">Order #{index + 1}</h5>
                    <p><strong>Name:</strong> {order.name}</p>
                    <p><strong>Email:</strong> {order.email}</p>
                    <p><strong>Phone:</strong> {order.phone}</p>
                    <p><strong>Status:</strong> <span className="badge bg-info">{order.status}</span></p>
                    <p><strong>Doctor:</strong> {order.doctorName || "N/A"}</p>
                    <p><strong>Date:</strong> {order.prescriptionDate || "N/A"}</p>
                    <p><strong>Tests:</strong> {Array.isArray(order.tests) ? order.tests.join(", ") : "N/A"}</p>
                    <p>
                      <strong>Prescription:</strong>{" "}
                      {order.prescriptionUrl ? (
                        <a href={order.prescriptionUrl} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      ) : (
                        "Not available"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrder;