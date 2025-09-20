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
    <div className="container mt-5">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-5 text-center">
          <img src="/illustration.png" alt="Doctor illustration" className="img-fluid" />
        </div>

        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h3 className="card-title mb-3 text-center">Login to Your Account</h3>

            <Formik
              initialValues={{ email: '', password: '', rememberMe: false }}
              validationSchema={validationSchema}
              onSubmit={(values, { setSubmitting }) => {
                axios.post(`${process.env.REACT_APP_API_URL}/login`, {
                  email: values.email,
                  password: values.password
                }, { withCredentials: true })
                  .then(response => {
                    if (response.data.success) {
                      localStorage.setItem("user", JSON.stringify(response.data.user));
                      navigate("/");
                    } else {
                      alert("Invalid credentials. Please try again.");
                      navigate("/invalid");
                    }
                  })
                  .catch(error => {
                    console.error("Login error:", error);
                    alert("Login failed. Please check your credentials.");
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
                      autoComplete="email"
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
                      autoComplete="current-password"
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
    </div>
  );
};

export default LoginForm;