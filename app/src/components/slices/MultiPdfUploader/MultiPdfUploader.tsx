'use client'
import { useState } from "react"
import { useDropzone } from "react-dropzone-esm"
import './multiPdfUploader.css'

export default function MultiPdfUploader() {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    onDrop: (acceptedFiles: any) => {
      setUploadedFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    }
  })

  console.log(uploadedFiles)
  return (
    <div className="multi-pdf-uploader">
      <div {...getRootProps()} className="dropzone-container">
        <input {...getInputProps()} />
        <p>Drag and drop files here or click to browse.</p>
      </div>
      <div>
        {uploadedFiles.length > 0 && (
          <ul>
            {uploadedFiles.map(file => (
              <li key={file.path}>{file.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}