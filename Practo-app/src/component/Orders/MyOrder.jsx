import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../Home/header';

const MyOrder = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?.email) {
      navigate("/login");
      return;
    }

    axios.get(`https://diagnostic-lab-tests-booking-app-1.onrender.com/api/orders/by-email/${user.email}`)
      .then(res => {
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
      })
      .finally(() => setLoading(false));
  }, [navigate, user]);

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <h2 className="mb-4">My Diagnostic Orders</h2>

        {loading ? (
          <div className="text-muted">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="alert alert-warning">No orders found.</div>
        ) : (
          <div className="row g-4">
            {orders.map((order, index) => (
              <div key={index} className="col-md-6">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Order #{index + 1}</h5>
                    <p><strong>Name:</strong> {order.name}</p>
                    <p><strong>Email:</strong> {order.email}</p>
                    <p><strong>Phone:</strong> {order.phone}</p>
                    <p><strong>Status:</strong> <span className="badge bg-info">{order.status}</span></p>
                    <p><strong>Doctor:</strong> {order.doctorName || "N/A"}</p>
                    <p><strong>Date:</strong> {order.prescriptionDate || "N/A"}</p>
                    <p><strong>Tests:</strong> {order.tests.join(", ")}</p>
                    <p>
                      <strong>Prescription:</strong>{" "}
                     <a href={order.prescriptionUrl} target="_blank" rel="noopener noreferrer">
  View
</a>

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