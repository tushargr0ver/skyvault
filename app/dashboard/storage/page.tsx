"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { HardDrive, FileText, ImageIcon, Video, Music, Archive } from "lucide-react"
import { useEffect, useState } from "react"

export default function StoragePage() {
  const [totalSize, setTotalSize] = useState(0)
  const [totalFiles, setTotalFiles] = useState(0)
  async function getStorage() {
    const response = await fetch("/api/storage")
    const data = await response.json()
    setTotalSize(data.storage[0].usedStorage)
    setTotalFiles(data.storage[0].totalFiles)    
  }
  useEffect(() => { 
    getStorage()
  }, [])

  const storageLimit = 200 * 1024 * 1024 // 200 MB Limit
  const usagePercentage = (totalSize / storageLimit) * 100

  

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Storage Overview</h1>
          <p className="text-muted-foreground">Monitor your storage usage and file distribution</p>
        </div>

        {/* Storage Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Storage Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Used Storage</span>
                <span className="text-sm text-muted-foreground">
                  {formatBytes(totalSize)} of {formatBytes(storageLimit)}
                </span>
              </div>
              <Progress value={usagePercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">{(100 - usagePercentage).toFixed(1)}% storage remaining</p>
            </div>
          </CardContent>
        </Card>


        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{totalFiles}</p>
                  <p className="text-sm text-muted-foreground">Total Files</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <HardDrive className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{formatBytes(totalSize)}</p>
                  <p className="text-sm text-muted-foreground">Used Space</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <Archive className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{formatBytes(storageLimit - totalSize)}</p>
                  <p className="text-sm text-muted-foreground">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
