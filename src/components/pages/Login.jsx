import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import { ToastContainer, toast } from "react-toastify";
import '../../styles/Login.scss';
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    localStorage.getItem('theme') === 'light' || (localStorage.getItem('theme') === '' || 
    localStorage.getItem('theme') === null) ? localStorage.setItem('theme', 'light') : localStorage.setItem('theme', 'dark');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      notify()
    }
  };

  const notify = () =>
  toast.error("Incorrect email or password!", {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });

  return (
    <div className="login">
      <div className="login-form-container">
        <span className="logo">Chat-App</span>
        <span className="title">Login</span>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button>Log in</button>
        </form>
        <p>
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
        <p>Created by GP & AK</p>
      </div>
      <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
    </div>
  );
};

export default Login;
