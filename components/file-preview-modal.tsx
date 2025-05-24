"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { formatFileSize, formatDate } from "@/lib/utils"

interface FilePreviewModalProps {
  file: any
  open: boolean
  onClose: () => void
}

export function FilePreviewModal({ file, open, onClose }: FilePreviewModalProps) {
  if (!file) return null

  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const renderPreview = () => {
    if (file.type.startsWith("image/")) {
      return (
        <div className="flex justify-center">
          <img
            src={file.url || "/placeholder.svg"}
            alt={file.name}
            className="max-w-full max-h-96 object-contain rounded-lg"
          />
        </div>
      )
    }

    if (file.type.startsWith("video/")) {
      return (
        <div className="flex justify-center">
          <video controls className="max-w-full max-h-96 rounded-lg" src={file.url}>
            Your browser does not support the video tag.
          </video>
        </div>
      )
    }

    if (file.type.startsWith("audio/")) {
      return (
        <div className="flex justify-center p-8">
          <audio controls className="w-full max-w-md">
            <source src={file.url} type={file.type} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      )
    }

    if (file.type === "application/pdf") {
      return (
        <div className="h-96">
          <iframe src={file.url} className="w-full h-full rounded-lg border" title={file.name} />
        </div>
      )
    }

    if (file.type.startsWith("text/")) {
      return (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">Text file preview not available. Download to view contents.</p>
        </div>
      )
    }

    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Preview not available for this file type.</p>
        <Button onClick={handleDownload} className="mt-4">
          <Download className="mr-2 h-4 w-4" />
          Download to view
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="truncate pr-4">{file.name}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button onClick={handleDownload} size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{formatFileSize(file.size)}</span>
            <span>•</span>
            <span>Modified {formatDate(file.uploadedAt)}</span>
          </div>
        </DialogHeader>

        <div className="mt-4">{renderPreview()}</div>
      </DialogContent>
    </Dialog>
  )
}
