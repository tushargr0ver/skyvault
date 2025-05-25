"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, X, File, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileUploadProps {
  onUpload: (files: any[]) => void
}

interface UploadingFile {
  id: string
  file: File
  progress: number
  status: "uploading" | "completed" | "error"
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newUploadingFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: "uploading" as const,
    }))

    setUploadingFiles((prev) => [...prev, ...newUploadingFiles])

    // Simulate upload progress
    newUploadingFiles.forEach((uploadingFile) => {
      simulateUpload(uploadingFile)
    })
  }, [])

  const simulateUpload = (uploadingFile: UploadingFile) => {
    const interval = setInterval(() => {
      setUploadingFiles((prev) =>
        prev.map((file) => {
          if (file.id === uploadingFile.id) {
            const newProgress = Math.min(file.progress + Math.random() * 30, 100)
            if (newProgress >= 100) {
              clearInterval(interval)

              // Create mock file data
              const mockFile = {
                id: Math.random().toString(36).substr(2, 9),
                name: file.file.name,
                size: file.file.size,
                type: file.file.type,
                uploadedAt: new Date().toISOString(),
                url: URL.createObjectURL(file.file),
              }

              onUpload([mockFile])

              toast({
                title: "Upload completed",
                description: `${file.file.name} has been uploaded successfully.`,
              })

              // Remove from uploading files after a delay
              setTimeout(() => {
                setUploadingFiles((prev) => prev.filter((f) => f.id !== uploadingFile.id))
              }, 2000)

              return { ...file, progress: 100, status: "completed" as const }
            }
            return { ...file, progress: newProgress }
          }
          return file
        }),
      )
    }, 200)
  }

  const removeUploadingFile = (id: string) => {
    setUploadingFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 100 * 1024 * 1024, // 100MB
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach((rejection) => {
        toast({
          title: "Upload failed",
          description: `${rejection.file.name}: ${rejection.errors[0].message}`,
          variant: "destructive",
        })
      })
    },
  })

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${
                isDragActive
                  ? "border-sky-500 bg-sky-50 dark:bg-sky-950/50"
                  : "border-muted-foreground/25 hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-sky-950/25"
              }
            `}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{isDragActive ? "Drop files here" : "Upload files"}</h3>
            <p className="text-muted-foreground mb-4">Drag and drop files here, or click to select files</p>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Choose Files
            </Button>
            <p className="text-xs text-muted-foreground mt-2">Maximum file size: 10 MB</p>
          </div>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Uploading files</h4>
            <div className="space-y-3">
              {uploadingFiles.map((file) => (
                <div key={file.id} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {file.status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <File className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">{file.file.name}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUploadingFile(file.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={file.progress} className="flex-1" />
                      <span className="text-xs text-muted-foreground w-12">{Math.round(file.progress)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
