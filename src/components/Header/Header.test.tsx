import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Header from './Header'

describe('Header', () => {
  it('renders the header text', () => {
    render(<Header />)
    expect(screen.getByRole('heading')).toHaveTextContent('My Astro Site')
  })
})
