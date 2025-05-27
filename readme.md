# SkyVault 🚀

A modern, secure, and user-friendly cloud storage solution built with Next.js and Supabase.

![SkyVault](https://img.shields.io/badge/SkyVault-Cloud%20Storage-blue)
![Next.js](https://img.shields.io/badge/Next.js-13-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Supabase](https://img.shields.io/badge/Supabase-Storage-orange)

## Overview

SkyVault is a powerful cloud storage platform that provides a seamless experience for storing, managing, and accessing your files. With a modern UI and robust features, it offers a secure and efficient way to handle your digital assets.

## ✨ Features

- **Secure File Storage**: Store your files securely with user-specific storage buckets
- **File Management**: Upload, download, rename, and delete files with ease
- **File Preview**: Preview images, videos, PDFs, and other file types directly in the browser
- **Storage Analytics**: Monitor your storage usage with detailed analytics
- **Recent Files**: Quick access to your recently uploaded files
- **Search & Sort**: Find files quickly with search and sorting capabilities
- **Responsive Design**: Beautiful UI that works on all devices
- **Dark Mode**: Support for both light and dark themes

## 🛠️ Tech Stack

- **Frontend**:

  - Next.js 13+ (App Router)
  - TypeScript
  - Tailwind CSS
  - Radix UI Components
  - React Hook Form
  - Zod Validation

- **Backend**:

  - Supabase (Storage & Database)
  - Drizzle ORM
  - PostgreSQL

- **Authentication**:
  - Clerk Authentication

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Clerk account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/skyvault.git
cd skyvault
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. Set up the database:

```bash
npm run db:push
# or
yarn db:push
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
skyvault/
├── app/                # Next.js app directory
├── components/         # React components
├── lib/               # Utility functions and configurations
├── public/            # Static assets
├── styles/            # Global styles
└── drizzle/           # Database migrations
```

## 🔒 Security

- User authentication handled by Clerk
- Secure file storage with Supabase
- File access restricted to authenticated users
- User-specific storage buckets
- Secure file URLs with expiration

## 📊 Storage Limits

- Free tier: 200MB storage limit
- File size limit: 50MB per file
- Supported file types: All common file formats

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Clerk](https://clerk.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
