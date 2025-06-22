'use client';
import './dashboard.css'
import { UserFileList } from '../../slices';

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <h1>Welcome to the Dashboard!</h1>
      <div>
        <h2>Tasks</h2>
        <div className="task-container">
          <div className="task-tile"><a href="/mergepdf">Merge PDFs</a></div>
          <div className="task-tile">Split PDF</div>
          <div className="task-tile">Convert to PDF</div>
          <div className="task-tile">Convert from PDF</div>
          <div className="task-tile">Edit PDF</div>
          <div className="task-tile">Sign PDF</div>
        </div>
      </div>
      <UserFileList />
    </div>
  )
}