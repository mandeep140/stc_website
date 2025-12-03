# STC IIT Patna - Hybrid Programs

Official website for the Student Technical Council (STC) of IIT Patna's Hybrid Programs. This platform serves as the central hub for all technical activities, events, and initiatives organized by STC IITP.

## Features

- **Modern Web Stack**: Built with Next.js 14, TypeScript, and Tailwind CSS
- **Responsive Design**: Fully responsive layout that works on all devices
- **Authentication**: Secure user authentication system
- **Admin Dashboard**: Comprehensive admin panel for content management
- **Event Management**: System for managing and displaying events
- **Contact Forms**: Integrated contact and submission forms
- **Email Notifications**: Automated email notifications using Nodemailer
- **Image Management**: Cloud-based image handling with ImageKit

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or later)
- npm (v9 or later) or yarn
- MongoDB (for local development)
- ImageKit account (for image storage)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/stc_website.git
   cd stc_website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   
   # ImageKit Configuration
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   
   # Email Configuration
   EMAIL_SERVER=your_email_server
   EMAIL_FROM=your_email@example.com
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
stc_website/
├── app/                  # App Router directory
│   ├── api/              # API routes
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utility functions and configurations
│   ├── styles/           # Global styles
│   └── ...
├── public/               # Static files
├── types/                # TypeScript type definitions
└── ...
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint

## Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS with custom components
- **Form Handling**: React Hook Form
- **State Management**: React Context API
- **Image Optimization**: ImageKit
- **Email**: Nodemailer
- **Deployment**: Vercel

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

#updating