import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Cloud, Shield, Upload, FolderOpen, Download } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cloud className="h-8 w-8 text-sky-600" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">SkyVault</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Your Files, <span className="text-sky-600">Anywhere</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            SkyVault is a secure cloud storage platform that lets you store, manage, and access your files from
            anywhere. Upload, organize, and share with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-3" asChild>
              <Link href="/dashboard">
                <Cloud className="mr-2 h-5 w-5" />
                Start Storing
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              Learn More
            </Button>
          </div>

          {/* Hero Image */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 border">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="h-20 bg-sky-100 dark:bg-sky-900/30 rounded-lg flex items-center justify-center">
                  <FolderOpen className="h-8 w-8 text-sky-600" />
                </div>
                <div className="h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                  <Upload className="h-8 w-8 text-emerald-600" />
                </div>
                <div className="h-20 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <Download className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Intuitive file management at your fingertips
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Everything you need for file storage
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Powerful features designed to make file management simple and secure
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-sky-600" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Secure Storage</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Your files are protected with enterprise-grade encryption and security measures
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Easy Upload</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Drag and drop files or upload multiple files at once with our intuitive interface
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <FolderOpen className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">File Management</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Organize, rename, and manage your files with powerful tools and folder organization
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-sky-600 dark:bg-sky-700 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of users who trust SkyVault with their files</p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3" asChild>
            <Link href="/dashboard">
              <Cloud className="mr-2 h-5 w-5" />
              Start Your Journey
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-slate-200 dark:border-slate-700">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Cloud className="h-6 w-6 text-sky-600" />
            <span className="text-lg font-semibold text-slate-900 dark:text-white">SkyVault</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400">© 2024 SkyVault. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
