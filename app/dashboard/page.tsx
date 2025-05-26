"use client"

import { useState,useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { FileUpload } from "@/components/file-upload"
import { FileGrid } from "@/components/file-grid"
import { FileList } from "@/components/file-list"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Grid, List, Search, SortAsc } from "lucide-react"
import { mockFiles } from "@/lib/mock-data"
import { useAuth } from "@clerk/nextjs"
import { supabase } from "@/lib/supabase"

export default function Dashboard() {
  const { userId } = useAuth()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [files, setFiles] = useState(mockFiles)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUserFiles() {
      if (!userId) return

      try {
        const { data, error } = await supabase.storage
          .from('user-files')
          .list(`${userId}/`)

        if (error) throw error

        // Transform the data to match your file interface
        const userFiles = await Promise.all(
          data.map(async (file) => {
            const { data: { publicUrl } } = supabase.storage
              .from('user-files')
              .getPublicUrl(`${userId}/${file.name}`)

            return {
              id: file.id,
              name: file.name,
              size: file.metadata?.size || 0,
              type: file.metadata?.mimetype || 'application/octet-stream',
              uploadedAt: file.created_at,
              url: publicUrl,
              path: `${userId}/${file.name}`
            }
          })
        )
        
        setFiles(userFiles)
      } catch (error) {
        console.error('Error fetching files:', error)
        // Keep mock files as fallback
        setFiles(mockFiles)
      } finally {
        setLoading(false)
      }
    }

    fetchUserFiles()
  }, [userId])

  const filteredFiles = files
    .filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "size":
          return b.size - a.size
        case "date":
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        default:
          return 0
      }
    })

  const handleFileUpload = (newFiles: any[]) => {
    setFiles((prev) => [...newFiles, ...prev])
  }

  const handleFileDelete = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const handleFileRename = (fileId: string, newName: string) => {
    setFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, name: newName } : file)))
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Upload Section */}
        <FileUpload onUpload={handleFileUpload} />

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="size">Size</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>

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
        </div>

        {/* File Display */}
        {filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No files found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try adjusting your search terms" : "Upload your first file to get started"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <FileGrid files={filteredFiles} onDelete={handleFileDelete} onRename={handleFileRename} />
        ) : (
          <FileList files={filteredFiles} onDelete={handleFileDelete} onRename={handleFileRename} />
        )}
      </div>
    </DashboardLayout>
  )
}
