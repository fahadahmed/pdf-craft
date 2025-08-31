'use client';
import './dashboard.css'
import { useEffect, useState } from 'react';
import { db, auth } from '../../../firebase/client';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { UserFileList } from '../../slices';
import { actions } from 'astro:actions';

const tasks = [
  { name: 'Merge PDFs', link: '/mergepdf' },
  { name: 'Split PDF', link: '/splitpdf' },
  { name: 'Encrypt PDF', link: '/encryptpdf' },
  { name: 'Decrypt PDF', link: '/decryptpdf' },
];

export default function Dashboard() {
  const [files, setFiles] = useState<any[]>([]);
  const [profile, setProfile] = useState<{ name?: string; credits?: number; isSubscriber?: boolean }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const filesRef = collection(db, 'users', user.uid, 'files');
          const snapshot = await getDocs(filesRef);
          setFiles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

          // Fetch profile
          const profileRef = doc(db, 'users', user.uid);
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            const data = profileSnap.data();
            if (data.profile) {
              setProfile(data.profile);
            }
          }
        } catch (error) {
          console.error('Error fetching files:', error);
          setFiles([]);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleBuyCredits = async () => {
    const formData = new FormData();
    formData.append('credits', '5');
    // first navigate to the payment page
    const paymentResponse = await fetch('http://127.0.0.1:5010/pdf-craft-mvp/us-central1/processPayment', {
      method: 'POST',
      body: formData,
    })
    if (!paymentResponse.ok) {
      console.error('Failed to initiate payment');
      return;
    }
    const paymentData = await paymentResponse.json();
    if (!paymentData.url) {
      console.error('Payment URL not found in response');
      return;
    } else {
      window.location.href = paymentData.url;
    }

    // then call the buyCredits action
    const response = await actions.credits.buyCredits(formData);

    console.log('Buy Credits clicked, response:', response);
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Welcome, {profile.name ? `${profile.name}` : ''}</h1>
          <p>Manage your PDF files and operations here.</p>
        </div>
        <div>
          {profile.credits !== undefined && (
            <p><strong>Available Credits:</strong> {profile.credits}</p>
          )}
          <button onClick={handleBuyCredits}>Buy Credits</button>
        </div>
      </div>
      <div>
        <h2>Tasks</h2>
        <div className="task-container">
          {tasks.map((task) => (
            <div key={task.name} className="task-tile">
              <a href={task.link}><strong>{task.name}</strong></a>
            </div>
          ))}
        </div>
      </div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <UserFileList files={files} />
        )}
      </div>
    </div>
  )
}