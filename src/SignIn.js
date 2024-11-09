import React, { useState } from 'react';
import { auth, db } from './firebase';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: 'user',
        });
      }
      navigate('/home');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  const handleSignInOrRegister = async () => {
    try {
      let userCredential;
      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: email,
          role: 'user',
        });
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/home');
    } catch (error) {
      console.error(isRegistering ? 'Error registering:' : 'Error signing in:', error);
      setError(isRegistering ? 'Registration failed. Please try again.' : 'Sign-in failed. Please check your credentials.');
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h1 className="signin-title">Welcome to iLearn</h1>
        {error && <p className="error-message">{error}</p>}
        <button onClick={signInWithGoogle} className="google-signin-button">
          <img src="google-icon.png" alt="Google" className="google-icon" />
          Sign In with Google
        </button>
        <div className="divider">
          <span>or</span>
        </div>
        <h2 className="email-signin-title">{isRegistering ? 'Register' : 'Sign In'} with Email</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <button
          onClick={handleSignInOrRegister}
          className="email-signin-button"
        >
          {isRegistering ? 'Register' : 'Sign In'}
        </button>
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="switch-button"
        >
          {isRegistering ? 'Already have an account? Sign In' : 'Need an account? Register'}
        </button>
      </div>
    </div>
  );
};

export default SignIn;