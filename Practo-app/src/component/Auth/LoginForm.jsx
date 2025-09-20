// src/components/LoginForm.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Required'),
});

const LoginForm = () => {
  const navigate = useNavigate();

  return (
    <div className='container mt-1 gap-5 d-flex' style={{ maxHeight: '60vh' }}>
      <div>
        <img src="/illustration.png" alt="Doctor" />
      </div>

      <div style={{ minHeight: '60vh', width: '550px' }}>
        <div className="card p-4 shadow-sm mt-5" style={{ width: '500px' }}>
          <h3 className="card-title mb-3 text-center">Login to Your Account</h3>

          <Formik
            initialValues={{ email: '', password: '', rememberMe: false }}
            validationSchema={validationSchema}
           onSubmit={(values, { setSubmitting }) => {
             axios.post("https://diagnostic-lab-tests-booking-app-1.onrender.com/login", {
                    email: values.email,
                    password: values.password
                       })
                .then(response => {
                     if (response.data.success)
                      {
                     localStorage.setItem("user", JSON.stringify(response.data.user));
                     navigate("/"); 
                     }
                      else {
                       navigate("/invalid");
                         }
                       })
                      .catch(error => {
                         console.error("Login error:", error);
                             navigate("/invalid");
                           })
                         .finally(() => setSubmitting(false));
                            }}
            
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <Field
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <Field
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter your password"
                  />
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="form-check">
                    <Field
                      type="checkbox"
                      name="rememberMe"
                      className="form-check-input"
                      id="rememberMe"
                    />
                    <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                  </div>
                  <a href="#" className="text-decoration-none">Forgot password?</a>
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </Form>
            )}
          </Formik>

          <div className="text-center mt-3">
            <span>Don't have an account? </span>
            <Link to="/register" className="text-decoration-none">Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;