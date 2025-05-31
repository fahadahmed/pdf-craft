import { useEffect, useState } from 'react';
import { db, auth } from '../../../firebase/client';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

export default function UserFileList() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const filesRef = collection(db, 'users', user.uid, 'files');
          const snapshot = await getDocs(filesRef);
          setFiles(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        } catch (error) {
          console.error('Error fetching files:', error);
          setFiles([]);
        }
      }
      setLoading(false);
    })
    return () => unsubscribe();
  }, []);

  return (
    <div className="user-file-list">
      <h2>Your Files</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {files.map(file => (
            <li key={file.id}>
              <a href={file.fileUrl} target="_blank">{file.fileName}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}