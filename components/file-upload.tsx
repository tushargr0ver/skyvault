"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Upload, X, File, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@clerk/nextjs"

interface FileUploadProps {
  onUpload: (files: any[]) => void
  bucketName?: string
}

interface UploadingFile {
  id: string
  file: File
  progress: number
  status: "uploading" | "completed" | "error"
}

export function FileUpload({ onUpload, bucketName = "user-files" }: FileUploadProps) {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const { toast } = useToast()
  const { userId } = useAuth()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to upload files",
        variant: "destructive",
      })
      return
    }

    const newUploadingFiles = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: "uploading" as const,
    }))

    setUploadingFiles((prev) => [...prev, ...newUploadingFiles])

    // Upload files to Supabase
    newUploadingFiles.forEach((uploadingFile) => {
      uploadToSupabase(uploadingFile)
    })
  }, [userId, bucketName, toast])

  const uploadToSupabase = async (uploadingFile: UploadingFile) => {
    if (!userId) return

    try {
      const fileExt = uploadingFile.file.name.split('.').pop()
      const fileWithoutExt = uploadingFile.file.name.split('.').slice(0, -1).join('.')
      const fileName = `${fileWithoutExt}_${Math.random().toString(36).substr(2, 4)}.${fileExt}`
      // Store files in user-specific folders
      const filePath = `${userId}/${fileName}`

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, uploadingFile.file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      updateStorage(uploadingFile.file.size)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath)

      // Create file data
      const fileData = {
        id: Math.random().toString(36).substr(2, 9),
        name: uploadingFile.file.name,
        size: uploadingFile.file.size,
        type: uploadingFile.file.type,
        uploadedAt: new Date().toISOString(),
        url: publicUrl,
        path: filePath,
        userId: userId
      }

      onUpload([fileData])

      setUploadingFiles((prev) =>
        prev.map((file) => {
          if (file.id === uploadingFile.id) {
            return { ...file, progress: 100, status: "completed" as const }
          }
          return file
        })
      )

      toast({
        title: "Upload completed",
        description: `${uploadingFile.file.name} has been uploaded successfully.`,
      })

      // Remove from uploading files after a delay
      setTimeout(() => {
        setUploadingFiles((prev) => prev.filter((f) => f.id !== uploadingFile.id))
      }, 2000)

    } catch (error: any) {
      console.error('Error uploading file:', error)
      
      let errorMessage = `Failed to upload ${uploadingFile.file.name}`
      if (error.statusCode === 403) {
        errorMessage = `Access denied. Please check storage bucket permissions.`
      } else if (error.message) {
        errorMessage = error.message
      }

      setUploadingFiles((prev) =>
        prev.map((file) => {
          if (file.id === uploadingFile.id) {
            return { ...file, status: "error" as const }
          }
          return file
        })
      )

      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const removeUploadingFile = (id: string) => {
    setUploadingFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 50 * 1024 * 1024, // 50MB
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

  async function getStorage() {
    const response = await fetch("/api/storage")
    const data = await response.json()
    return data.storage
  }

  async function updateStorage(size: number) {
    const response = await fetch("/api/storage", {
      method: "POST",
      body: JSON.stringify({size}),
    })
    const data = await response.json()
  }

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
            <p className="text-xs text-muted-foreground mt-2">Maximum file size: 50 MB</p>
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
                    ) : file.status === "error" ? (
                      <X className="h-5 w-5 text-red-500" />
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
