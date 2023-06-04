import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { ToastContainer, toast } from "react-toastify";
import '../../styles/Register.scss';
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        newEmail,
        newPassword
      );

      await updateProfile(res.user, {
        displayName: newUsername,
      });

      await setDoc(doc(db, 'users', res.user.uid), {
        uid: res.user.uid,
        displayName: newUsername,
        desc: 'Hello, my name is ' + newUsername,
        photoURL: '',
        email: newEmail,
        joinDate: res.user.metadata.createdAt,
      });

      await setDoc(doc(db, 'userChats', res.user.uid), {});
      await signOut(auth);
      navigate('/');
    } catch (err) {
      setLoading(false);
      notify()
    }
  };

  const notify = () =>
  toast.error("Incorrect data was entered", {
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
    <div className="register">
      <div className="register-form-container">
        <span className="logo">Messenger</span>
        <span className="title">Registration</span>
        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Name"
            onChange={(e) => {
              setNewUsername(e.target.value);
            }}
          />
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            onChange={(e) => {
              setNewEmail(e.target.value);
            }}
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={(e) => {
              setNewPassword(e.target.value);
            }}
          />
          <button disabled={loading}>Sign up</button>
        </form>
        <p>
          Do you have an account? <Link to="/login">Sign in</Link>
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

export default Register;
