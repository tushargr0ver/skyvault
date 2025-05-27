"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Download, Trash2, Edit, Eye } from "lucide-react"
import { formatFileSize, formatDate, getFileIcon } from "@/lib/utils"
import { FilePreviewModal } from "@/components/file-preview-modal"
import { RenameDialog } from "@/components/rename-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"

interface FileGridProps {
  files: any[]
  onDelete: (fileId: string, size: number) => void
  onRename: (fileId: string, newName: string) => void
}

export function FileGrid({ files, onDelete, onRename }: FileGridProps) {
  const [previewFile, setPreviewFile] = useState<any>(null)
  const [renameFile, setRenameFile] = useState<any>(null)
  const [deleteFile, setDeleteFile] = useState<any>(null)

  const handleDownload = (file: any) => {
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {files.map((file) => {
          const Icon = getFileIcon(file.type)

          return (
            <Card key={file.id} className="group hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <Icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setPreviewFile(file)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownload(file)}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setRenameFile(file)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setDeleteFile(file)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-2">
                  <h3
                    className="font-medium text-sm truncate cursor-pointer hover:text-sky-600"
                    onClick={() => setPreviewFile(file)}
                    title={file.name}
                  >
                    {file.name}
                  </h3>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatFileSize(file.size)}</span>
                    <span>{formatDate(file.uploadedAt)}</span>
                  </div>

                  {file.type.startsWith("image/") && (
                    <div className="mt-2 aspect-video rounded-md overflow-hidden bg-muted">
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt={file.name}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => setPreviewFile(file)}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <FilePreviewModal file={previewFile} open={!!previewFile} onClose={() => setPreviewFile(null)} />

      <RenameDialog file={renameFile} open={!!renameFile} onClose={() => setRenameFile(null)} onRename={onRename} />

      <DeleteConfirmDialog
        file={deleteFile}
        open={!!deleteFile}
        onClose={() => setDeleteFile(null)}
        onDelete={onDelete}
      />
    </>
  )
}
