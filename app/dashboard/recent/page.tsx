"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { FileGrid } from "@/components/file-grid"
import { FileList } from "@/components/file-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Grid, List, Clock, Calendar } from "lucide-react"
import {useAuth} from "@clerk/nextjs"
import {supabase} from "@/lib/supabase"

interface FileObject {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: string
  url: string
  path: string
  userId: string
}

export default function RecentFilesPage() {
  const {userId, isLoaded} = useAuth()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [files, setFiles] = useState<FileObject[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    fetchUserFiles()
  }, [userId, isLoaded])

  // Sort files by most recent first
  const recentFiles = [...files]
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, 100) // Show only last 10 files

  const todayFiles = recentFiles.filter((file) => {
    const fileDate = new Date(file.uploadedAt)
    const today = new Date()
    return fileDate.toDateString() === today.toDateString()
  })

  const yesterdayFiles = recentFiles.filter((file) => {
    const fileDate = new Date(file.uploadedAt)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return fileDate.toDateString() === yesterday.toDateString()
  })

  const olderFiles = recentFiles.filter((file) => {
    const fileDate = new Date(file.uploadedAt)
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    return fileDate < yesterday
  })

  const handleFileDelete = async (fileId: string, size: number) => {
    setFiles((prev) => prev.filter((file) => file.name !== fileId))
    await deleteUserFile(fileId, size)
    await fetchUserFiles()
  }

  const handleFileRename = async (fileId: string, newName: string) => {
    setFiles((prev) => prev.map((file) => (file.name === fileId ? { ...file, name: newName } : file)))
    await renameUserFile(fileId, newName)
    await fetchUserFiles()
  }

  async function deleteUserFile(fileName: string, size: number) {
    const filePath = `${userId}/${fileName}`
    const { error } = await supabase.storage
      .from('user-files')
      .remove([filePath])
    updateStorage(size)
  }

  async function updateStorage(size: number) {
    const response = await fetch("/api/storage", {
      method: "POST",
      body: JSON.stringify({size}),
    })
    const data = await response.json()
  }

  async function renameUserFile(oldFilename: string, newFilename: string) {
    const oldPath = `${userId}/${oldFilename}`
    const newPath = `${userId}/${newFilename}`
    const { error } = await supabase.storage
      .from('user-files')
      .move(oldPath, newPath)
  }

  async function fetchUserFiles() {
    if (!isLoaded) {
      return
    }

    if (!userId) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.storage
        .from('user-files')
        .list(userId, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'name', order: 'asc' }
        })

      if (error) {
        throw error
      }

      if (!data || data.length === 0) {
        setFiles([])
        return
      }

      const userFiles = await Promise.all(
        data.map(async (file) => {
          const filePath = `${userId}/${file.name}`
          const { data } = await supabase.storage
            .from('user-files')
            .createSignedUrl(filePath, 3600)
          
          return {
            id: file.id,
            name: file.name,
            size: file.metadata?.size || 0,
            type: file.metadata?.mimetype || 'application/octet-stream',
            uploadedAt: file.created_at,
            url: data?.signedUrl || '',
            path: filePath,
            userId: userId
          }
        })
      )
      
      setFiles(userFiles)
    } catch (error) {
      setFiles([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  const FileSection = ({ title, files, icon: Icon }: { title: string; files: any[]; icon: any }) => {
    if (files.length === 0) return null

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">{title}</h2>
          <span className="text-sm text-muted-foreground">({files.length})</span>
        </div>

        {viewMode === "grid" ? (
          <FileGrid files={files} onDelete={handleFileDelete} onRename={handleFileRename} />
        ) : (
          <FileList files={files} onDelete={handleFileDelete} onRename={handleFileRename} />
        )}
      </div>
    )
  }

  

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Recent Files</h1>
            <p className="text-muted-foreground">Your recently uploaded and modified files</p>
          </div>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-lg font-semibold">{todayFiles.length}</p>
                  <p className="text-sm text-muted-foreground">Today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-lg font-semibold">{yesterdayFiles.length}</p>
                  <p className="text-sm text-muted-foreground">Yesterday</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-lg font-semibold">{recentFiles.length}</p>
                  <p className="text-sm text-muted-foreground">All Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* File Sections */}
        {recentFiles.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No recent files</h3>
              <p className="text-muted-foreground">Upload some files to see them here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <FileSection title="Today" files={todayFiles} icon={Clock} />
            <FileSection title="Yesterday" files={yesterdayFiles} icon={Calendar} />
            <FileSection title="Older" files={olderFiles} icon={Clock} />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
