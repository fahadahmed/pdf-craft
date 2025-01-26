'use client'
import { useState } from 'react'
import { actions } from 'astro:actions'
import { getAuth, inMemoryPersistence, signInWithEmailAndPassword } from 'firebase/auth'
import { app } from '../../../firebase/client'
import { Button } from '../../../components'
import '../../../styles/form.css'

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
    <form onSubmit={handleSubmit} className="form">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit" text="Login" kind="primary" />
    </form>
  )
}