import { actions } from 'astro:actions'

export default function Dashboard() {
  return (
    <div>
      <h1>Welcome to the Dashboard!</h1>
      <form action={actions.user.signOutUser} method="post">
        <button type="submit">Logout</button>
      </form>
    </div>
  )
}