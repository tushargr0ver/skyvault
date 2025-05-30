"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Cloud, Search, Settings, User, LogOut, Home, Menu, X, Clock, HardDrive } from "lucide-react"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: "All Files", href: "/dashboard", icon: Home },
    { name: "Recent", href: "/dashboard/recent", icon: Clock },
    { name: "Storage", href: "/dashboard/storage", icon: HardDrive },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <Link href="/" className="flex items-center space-x-2">
              <Cloud className="h-8 w-8 text-sky-600" />
              <span className="text-xl font-bold">SkyVault</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-8">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search files..." className="flex-1" />
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <UserButton/>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-40 w-64 transform bg-background border-r transition-transform duration-200 ease-in-out
          md:relative md:translate-x-0 md:inset-y-auto md:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <div className="flex h-full flex-col pt-16 md:pt-0">
            <nav className="flex-1 space-y-1 p-4">
              {navigation.map((item) => {
                const isActive = typeof window !== "undefined" && window.location.pathname === item.href

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                      ${
                        isActive
                          ? "bg-sky-100 text-sky-900 dark:bg-sky-900/50 dark:text-sky-100"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }
                    `}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
