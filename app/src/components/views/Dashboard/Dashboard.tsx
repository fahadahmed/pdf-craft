import { actions } from 'astro:actions'

export default function Dashboard() {
  return (
    <div>
      <h1>Welcome to the PDF-Craft</h1>
      <form action={actions.user.signOutUser} method="post">
        <button type="submit">Logout</button>
      </form>
    </div>
  )
}