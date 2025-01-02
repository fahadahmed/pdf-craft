'use client'
import { useState } from 'react'
import { getAuth, inMemoryPersistence, signInWithEmailAndPassword } from 'firebase/auth'
import { app } from '../../firebase/client'

function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    const auth = getAuth(app)

    try {
      await auth.setPersistence(inMemoryPersistence)

      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await userCredential.user.getIdToken()
      // Send the token to the server
      const response = await fetch('api/auth/signin', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      })

      if (response.redirected) {
        window.location.assign(response.url)
      }
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.')
      console.error('Error signin in: ', err)
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

export default SignInForm
