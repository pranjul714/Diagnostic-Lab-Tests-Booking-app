import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { toast } from 'react-toastify'; // Optional for toast feedback

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Required'),
  phone: Yup.string()
    .matches(/^\+91\d{10}$/, 'Must start with +91 followed by 10 digits')
    .required('Required'),
  password: Yup.string()
    .required('Required')
    .matches(/^(?=.*[A-Z]).{4,15}$/, '4–15 chars & include one uppercase letter'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
  userId: Yup.string().required('User ID is required'),
  userName: Yup.string().required('User Name is required'),
  age: Yup.number().required('Age is required').min(1, 'Age must be at least 1').integer(),
});

const Register = () => {
  const navigate = useNavigate();

  return (
    <div className='container mt-5 d-flex flex-wrap justify-content-center'>
      <div>
        <img src="/illustration.png" alt="Doctor illustration" style={{ maxWidth: '300px' }} />
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
            onSubmit={(values, { setSubmitting }) => {
              const payload = {
                userId: values.userId,
                userName: values.userName,
                email: values.email.trim().toLowerCase(),
                phone: values.phone,
                password: values.password,
                age: values.age,
              };

              axios.post("https://diagnostic-lab-tests-booking-app-1.onrender.com/register", payload, {
                withCredentials: true
              })
                .then(() => {
                  alert("✅ Registration successful!");
                  // toast.success("Registration successful!");
                  navigate("/login");
                })
                .catch((error) => {
                  const message = error.response?.data?.message || "Registration failed. Please try again.";
                  console.error("Registration error:", error);
                  alert(`❌ ${message}`);
                  // toast.error(message);
                })
                .finally(() => setSubmitting(false));
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                {[
                  { label: "User ID", name: "userId", type: "text" },
                  { label: "User Name", name: "userName", type: "text" },
                  { label: "Email address", name: "email", type: "email" },
                  { label: "Mobile Number", name: "phone", type: "text" },
                  { label: "Age", name: "age", type: "number" },
                  { label: "Password", name: "password", type: "password" },
                  { label: "Confirm Password", name: "confirmPassword", type: "password" },
                ].map(({ label, name, type }) => (
                  <div className="mb-3" key={name}>
                    <label htmlFor={name} className="form-label">{label}</label>
                    <Field type={type} name={name} className="form-control" />
                    <ErrorMessage name={name} component="div" className="text-danger" />
                  </div>
                ))}

                <div className="form-check mb-3">
                  <Field type="checkbox" name="rememberMe" className="form-check-input" id="rememberMe" />
                  <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                </div>

                <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                  {isSubmitting ? "Registering..." : "Register"}
                </button>
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