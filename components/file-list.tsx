"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Download, Trash2, Edit, Eye } from "lucide-react"
import { formatFileSize, formatDate, getFileIcon } from "@/lib/utils"
import { FilePreviewModal } from "@/components/file-preview-modal"
import { RenameDialog } from "@/components/rename-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"

interface FileListProps {
  files: any[]
  onDelete: (fileId: string) => void
  onRename: (fileId: string, newName: string) => void
}

export function FileList({ files, onDelete, onRename }: FileListProps) {
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
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-24">Size</TableHead>
              <TableHead className="w-32">Modified</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((file) => {
              const Icon = getFileIcon(file.type)

              return (
                <TableRow key={file.id} className="group">
                  <TableCell>
                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </TableCell>

                  <TableCell>
                    <button
                      onClick={() => setPreviewFile(file)}
                      className="text-left hover:text-sky-600 transition-colors font-medium"
                    >
                      {file.name}
                    </button>
                  </TableCell>

                  <TableCell className="text-muted-foreground">{formatFileSize(file.size)}</TableCell>

                  <TableCell className="text-muted-foreground">{formatDate(file.uploadedAt)}</TableCell>

                  <TableCell>
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
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
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
