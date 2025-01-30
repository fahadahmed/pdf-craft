'use client'
import { useState } from "react"
import { useDropzone } from "react-dropzone-esm"
import { DndContext, useSensors, useSensor, PointerSensor, closestCenter } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import './multiPdfUploader.css'

type SortableItemProps = {
  id: string
  children: React.ReactNode
}

function SortableItem({ id, children }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = uploadedFiles.findIndex((file) => file.name === active.id)
      const newIndex = uploadedFiles.findIndex((file) => file.name === over?.id)
      setUploadedFiles((items) => arrayMove(items, oldIndex, newIndex))
    }
  }

  console.log(uploadedFiles)
  return (
    <div className="multi-pdf-uploader">
      {uploadedFiles.length < 5 ? (
        <div {...getRootProps()} className="dropzone-container">
          <input {...getInputProps()} />
          <p>Drag and drop files here or click to browse.</p>
        </div>
      ) : <div>You can merge a maximum of 5 files at a time.</div>}
      <div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={uploadedFiles.map((file) => file.name)}>
            {uploadedFiles.map((file) => (
              <SortableItem key={file.name} id={file.name}>
                <div
                  style={{
                    padding: '10px',
                    margin: '5px 0',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    background: '#f9f9f9',
                  }}
                >{file.name}</div>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}