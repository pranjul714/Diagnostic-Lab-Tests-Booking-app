import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../Home/header';

const Account = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const storedUser  = JSON.parse(localStorage.getItem("user"));
  const email = storedUser ?.email;

  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }

    axios.post("http://localhost:8080/account", { email })
      .then(res => {
        if (res.data.success) {
          setFormData(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user)); // sync localStorage
        }
      })
      .catch(err => console.error("Error fetching account:", err));
  }, [email, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatedProfile = {
      ...formData,
      extraPhones: formData.extraPhones?.split(',').map(p => p.trim()) || []
    };

    axios.post("http://localhost:8080/update-profile", {
      email,
      profile: updatedProfile
    })
    .then(res => {
      if (res.data.success) {
        alert("Profile updated");
        localStorage.setItem("user", JSON.stringify(updatedProfile)); // update stored user
      } else {
        alert("Update failed");
      }
    })
    .catch(err => console.error("Update error:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
      },
      (error) => {
        alert("Unable to retrieve your location");
        console.error("Geolocation error:", error);
      }
    );
  };

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <div className="card p-4 shadow-sm position-relative">
          

          <div className="row g-4">
            <div className="col-md-3 text-center">
              <div className="border rounded p-3">
                {/* Removed icon */}
                <p className="mt-2"><a href="#">Add Photo</a></p>
              </div>
            </div>

            <div className="col-md-9">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Name*</label>
                  <input type="text" name="userName" className="form-control" value={formData.userName || ''} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone Number</label>
                  <input type="text" name="phone" className="form-control" value={formData.phone || ''} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email Address</label>
                  <input type="email" name="email" className="form-control" value={formData.email || ''} disabled />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Date of Birth</label>
                  <input type="date" name="dob" className="form-control" value={formData.dob || ''} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Blood Group</label>
                  <select name="bloodGroup" className="form-select" value={formData.bloodGroup || ''} onChange={handleChange}>
                    <option value="">Select an option</option>
                    <option>A+</option><option>B+</option><option>O+</option><option>AB+</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Gender</label>
                  <select name="gender" className="form-select" value={formData.gender || ''} onChange={handleChange}>
                    <option value="">Select an option</option>
                    <option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Timezone</label>
                  <input type="text" name="timezone" className="form-control" value={formData.timezone || 'Asia/Kolkata'} onChange={handleChange} />
                </div>

                <div className="col-12">
                  <label className="form-label">Address</label>
                  <input type="text" name="street" className="form-control mb-2" placeholder="House No./ Street Name/ Area" value={formData.street || ''} onChange={handleChange} />
                  <input type="text" name="locality" className="form-control mb-2" placeholder="Colony / Street / Locality" value={formData.locality || ''} onChange={handleChange} />
                  <input type="text" name="city" className="form-control mb-2" placeholder="City" value={formData.city || ''} onChange={handleChange} />
                  <input type="text" name="state" className="form-control mb-2" placeholder="State" value={formData.state || ''} onChange={handleChange} />
                  <input type="text" name="country" className="form-control mb-2" value={formData.country || 'India'} onChange={handleChange} />
                  <input type="text" name="pincode" className="form-control mb-2" placeholder="Pincode" value={formData.pincode || ''} onChange={handleChange} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Extra Phone Numbers</label>
                  <input type="text" name="extraPhones" className="form-control" placeholder="Comma-separated" value={formData.extraPhones?.join(', ') || ''} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Language</label>
                  <select name="language" className="form-select" value={formData.language || 'English'} onChange={handleChange}>
                    <option>English</option>
                    <option>Hindi</option>
                  </select>
                </div>

                {/* Live Location Fields */}
            
               
              </div>
            </div>
          </div>

          <div className="text-center mt-4">
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Logout
            </button>

            <button className="btn btn-success position-absolute top-0 end-0 m-3" onClick={handleSave}>
            Save Changes
          </button>
          
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
