// Login.js
import React, { useState } from 'react';
import { auth, firestore } from '../firebase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDoc = await firestore.collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        console.log('User  Role:', userData.role);
        // Redirect based on role or perform other actions
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return(
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
