/* eslint-disable prettier/prettier */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignInForm from './SignInForm'
import { signInWithEmailAndPassword } from 'firebase/auth'
// import { app } from '../../firebase/client'
import { vi, describe, beforeEach, it, expect, type Mock } from 'vitest'

vi.mock('firebase/auth')
vi.mock('../../firebase/client')

describe('SignInForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the form', () => {
    render(<SignInForm />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('displays an error message when sign in fails', async () => {
    // eslint-disable-next-line prettier/prettier
    ;(signInWithEmailAndPassword as Mock).mockRejectedValue(new Error('Failed to sign in'))

    render(<SignInForm />)

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText(/failed to sign in/i)).toBeInTheDocument()
    })
  })

  // it('redirects on successful sign in', async () => {
  //   // const mockUserCredential = {
  //   //   user: {
  //   //     getIdToken: vi.fn().mockResolvedValue('mock-id-token'),
  //   //   },
  //   // }
  //   (signInWithEmailAndPassword as Mock).mockResolvedValue(mockUserCredential)
  //   // (fetch as Mock).mockResolvedValue({ redirected: true, url: 'http://example.com' })

  //   render(<SignInForm />)

  //   fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } })
  //   fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } })
  //   fireEvent.click(screen.getByRole('button', { name: /login/i }))

  //   await waitFor(() => {
  //     expect(window.location.assign).toHaveBeenCalledWith('http://example.com')
  //   })
  // })
})
