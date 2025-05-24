"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RenameDialogProps {
  file: any
  open: boolean
  onClose: () => void
  onRename: (fileId: string, newName: string) => void
}

export function RenameDialog({ file, open, onClose, onRename }: RenameDialogProps) {
  const [newName, setNewName] = useState("")

  useEffect(() => {
    if (file) {
      setNewName(file.name)
    }
  }, [file])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newName.trim() && file) {
      onRename(file.id, newName.trim())
      onClose()
    }
  }

  if (!file) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename file</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="filename">File name</Label>
              <Input
                id="filename"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new file name"
                autoFocus
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!newName.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
