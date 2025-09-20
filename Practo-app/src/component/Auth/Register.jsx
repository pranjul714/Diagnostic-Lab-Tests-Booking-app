import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  phone: Yup.string()
    .matches(/^\+91\d{10}$/, 'Invalid Mobile. Must start with +91 followed by 10 digits')
    .required('Required'),
  password: Yup.string()
    .required('Required')
    .matches(/^(?=.*[A-Z]).{4,15}$/, 'Must be 4–15 chars & include one uppercase letter'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
  userId: Yup.string().required('User ID is required'),
  userName: Yup.string().required('User Name is required'),
  age: Yup.number().required('Age is required').positive().integer(),
});

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className='container mt-5 d-flex flex-wrap justify-content-center'>
      <div>
        <img src="/illustration.png" alt="Doctor" style={{ maxWidth: '300px' }} />
      </div>

      <div style={{ width: '500px' }}>
        <div className="card p-4 shadow-sm mt-3">
          <h3 className="card-title mb-3 text-center">Register Your Account</h3>

          <Formik
            initialValues={{
              userId: '',
              userName: '',
              email: '',
              phone: '',
              password: '',
              confirmPassword: '',
              age: '',
              rememberMe: false,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              const payload = {
                userId: values.userId,
                userName: values.userName,
                email: values.email.trim().toLowerCase(),
                phone: values.phone,
                password: values.password,
                age: values.age,
              };

              axios.post("https://diagnostic-lab-tests-booking-app-1.onrender.com/register", payload)
                .then(() => {
                  navigate("/login");
                })
                .catch((error) => {
                  console.error("Registration error:", error);
                  alert("Registration failed. Please try again.");
                });
            }}
          >
            {() => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="userId" className="form-label">User ID</label>
                  <Field type="text" name="userId" className="form-control" />
                  <ErrorMessage name="userId" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label htmlFor="userName" className="form-label">User Name</label>
                  <Field type="text" name="userName" className="form-control" />
                  <ErrorMessage name="userName" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email address</label>
                  <Field type="email" name="email" className="form-control" />
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Mobile Number</label>
                  <Field type="text" name="phone" className="form-control" />
                  <ErrorMessage name="phone" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label htmlFor="age" className="form-label">Age</label>
                  <Field type="number" name="age" className="form-control" />
                  <ErrorMessage name="age" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <Field type="password" name="password" className="form-control" />
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <Field type="password" name="confirmPassword" className="form-control" />
                  <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                </div>

                <div className="form-check mb-3">
                  <Field type="checkbox" name="rememberMe" className="form-check-input" id="rememberMe" />
                  <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                </div>

                <button type="submit" className="btn btn-primary w-100">Register</button>
              </Form>
            )}
          </Formik>

          <div className="text-center mt-3">
            <span>Already have an account? </span>
            <Link to="/login" className="text-decoration-none">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;