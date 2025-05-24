import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { FileText, ImageIcon, Video, Music, Archive, FileIcon } from "lucide-react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) {
    return "Today"
  } else if (diffDays === 2) {
    return "Yesterday"
  } else if (diffDays <= 7) {
    return `${diffDays - 1} days ago`
  } else {
    return date.toLocaleDateString()
  }
}

export function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) {
    return ImageIcon
  } else if (mimeType.startsWith("video/")) {
    return Video
  } else if (mimeType.startsWith("audio/")) {
    return Music
  } else if (mimeType.startsWith("text/") || mimeType === "application/pdf") {
    return FileText
  } else if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("tar")) {
    return Archive
  } else {
    return FileIcon
  }
}
