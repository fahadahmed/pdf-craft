import { actions } from 'astro:actions'
import './header.css'

export default function Header() {
  return (
    <div className="header">
      <div>PDF-Craft</div>
      <form action={actions.user.signOutUser} method="post">
        <button type="submit">Logout</button>
      </form>
    </div>
  )
}