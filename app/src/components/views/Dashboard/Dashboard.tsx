import './dashboard.css'

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard!</h1>
      <div>
        <h2>Tasks</h2>
        <div>
          <div><a href="/mergepdf">Merge PDFs</a></div>
          <div>Split PDF</div>
          <div>Convert to PDF</div>
          <div>Convert from PDF</div>
          <div>Edit PDF</div>
          <div>Sign PDF</div>
        </div>
      </div>
      <div>
        <h2>Your recent files</h2>
      </div>
    </div>
  )
}