import { useEffect, useState } from 'react';
import { db, auth } from '../../../firebase/client';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { DataTable, type TableHeader } from '../../ui'

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

  const tableHeaders: TableHeader[] = [
    { label: 'File Name', key: 'fileName' },
    { label: 'Operation', key: 'operation' },
    { label: 'Created At', key: 'createdAt' },
    { label: 'Actions', key: 'actions' }
  ]


  const tableData = files.map(file => ({
    id: file.id,
    fileName: file.fileName,
    operation: (file.operation as string).toUpperCase(),
    createdAt: file.createdAt.toDate().toLocaleString(),
    actions: (
      <div>
        <a href={file.fileUrl} target="_blank">Download</a>
      </div>
    )
  }))

  console.log('tableData', tableData);

  return (
    <div className="user-file-list">
      <h2>Your Files</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <DataTable headers={tableHeaders} data={tableData} />
      )}
    </div>
  );
}