import {
  createUserWithEmailAndPassword,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { useState } from 'react';
import { nwitter_firebase_auth } from '../firebase';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState('');

  function handleChange(e) {
    const {
      target: { name, value },
    } = e;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let data;
      const auth = getAuth();
      if (newAccount) {
        // create new account
        data = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // log in
        data = await signInWithEmailAndPassword(auth, email, password);
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  }
  function toggleAccount() {
    setNewAccount((prev) => !prev);
  }

  async function onSocialClick(e) {
    const {
      target: { name },
    } = e;
    let provider;
    if (name === 'google') {
      provider = new GoogleAuthProvider();
      const result = await signInWithPopup(nwitter_firebase_auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
    } else if (name === 'github') {
      provider = new GithubAuthProvider();
      const result = await signInWithPopup(nwitter_firebase_auth, provider);
      console.log(result);
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={handleChange}
        />
        <input
          type="submit"
          value={newAccount ? 'createAccount' : 'Log In'}
        />
      </form>
      <div>{error}</div>
      <span onClick={toggleAccount}>{newAccount ? 'Sign in' : 'Create Account'}</span>
      <div>
        <button
          onClick={onSocialClick}
          name="google"
        >
          Continue with Google
        </button>
        <button
          onClick={onSocialClick}
          name="github"
        >
          Continue with Github
        </button>
      </div>
    </div>
  );
}
