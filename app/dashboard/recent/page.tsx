"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { FileGrid } from "@/components/file-grid"
import { FileList } from "@/components/file-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Grid, List, Clock, Calendar } from "lucide-react"
import { mockFiles } from "@/lib/mock-data"

export default function RecentFilesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [files, setFiles] = useState(mockFiles)

  // Sort files by most recent first
  const recentFiles = [...files]
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, 10) // Show only last 10 files

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

  const handleFileDelete = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const handleFileRename = (fileId: string, newName: string) => {
    setFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, name: newName } : file)))
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
                  <p className="text-sm text-muted-foreground">Last 10 files</p>
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
