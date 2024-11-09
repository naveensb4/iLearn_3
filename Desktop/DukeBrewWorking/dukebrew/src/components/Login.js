// src/components/Login.js

import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import a CSS file for improved styling

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  // Google sign-in method
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create a user profile in Firestore if signing in for the first time
      const userDocRef = doc(db, 'Users', user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        name: user.displayName || '',
        grade: '',
        major: '',
        hobbies: '',
        linkedIn: '',
        profile_image: '',
        calendlyLink: '',
      }, { merge: true });

      navigate('/profile'); // Redirect to profile page to complete the profile
    } catch (error) {
      console.error('Error with Google Sign-In:', error);
    }
  };

  // Email and Password Sign-In or Sign-Up
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        // Sign Up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save the user in Firestore
        await setDoc(doc(db, 'Users', user.uid), {
          email: user.email,
          name: '',
          grade: '',
          major: '',
          hobbies: '',
          linkedIn: '',
          profile_image: '',
          calendlyLink: '',
        });
        navigate('/profile'); // Redirect to profile page to complete the profile
      } else {
        // Log In
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/profile'); // Redirect to profile page to ensure profile completion
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">{isSignUp ? 'Sign Up' : 'Login'}</button>
      </form>

      <button onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? 'Already have an account? Log In' : 'New user? Sign Up'}
      </button>

      <hr />
      <button onClick={handleGoogleSignIn}>Sign in with Google</button>
    </div>
  );
};

export default Login;
