import React, { useState } from 'react';
import { auth, db } from './firebase';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '50px' }}>
      <h1>Welcome to iLearn</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginBottom: '20px' }}>
        <button onClick={signInWithGoogle} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
          Sign In with Google
        </button>
      </div>
      <div style={{ marginBottom: '20px', width: '300px' }}>
        <h2>{isRegistering ? 'Register' : 'Sign In'} with Email</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
        />
        <button
          onClick={handleSignInOrRegister}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', width: '100%' }}
        >
          {isRegistering ? 'Register' : 'Sign In'}
        </button>
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          style={{ marginTop: '10px', fontSize: '14px', color: 'blue', cursor: 'pointer', border: 'none', background: 'none' }}
        >
          {isRegistering ? 'Switch to Sign In' : 'Switch to Register'}
        </button>
      </div>
    </div>
  );
};

export default SignIn;
