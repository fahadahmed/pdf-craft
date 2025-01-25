'use client'
import { useState } from 'react'
import { actions } from 'astro:actions'
import { getAuth, inMemoryPersistence, signInWithEmailAndPassword } from 'firebase/auth'
import { app } from '../../../firebase/client'

export default function SigninForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const auth = getAuth(app)

    try {
      await auth.setPersistence(inMemoryPersistence)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await userCredential.user.getIdToken()
      // TODO: call the action to set the cookie and navigate to the url
      const formData = new FormData()
      formData.append('idToken', idToken)
      const response = await actions.user.verifyUser(formData)
      if (response.data?.redirected) {
        window.location.assign(response.data?.url)
      }
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.')
      console.error('Error signing in:', err)
    }

  }
  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <label htmlFor="email">Email</label>
      <input
        type="email"
        name="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  )
}