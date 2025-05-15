# E-Commerce Admin Panel with Hero Slider Module

A full-stack e-commerce website built with the MERN stack (MongoDB, Express, React, Node.js) featuring an Admin Panel with a dynamic Hero Slider module.

## 🌟 Features

- **Full-Stack MERN Application**
  - Frontend: React + TypeScript + Tailwind CSS
  - Backend: Node.js + Express + MongoDB Atlas + Mongoose
  
- **Admin Panel**
  - Dashboard with statistics overview
  - Hero Slider module with CRUD operations
  
- **Dynamic Hero Slider Management**
  - Create, Read, Update, Delete operations
  - Image and video support via Cloudinary integration
  - Form-based management interface
  
- **Cloud Storage**
  - Cloudinary integration for media storage
  - MongoDB Atlas for database

## 📋 Prerequisites

- Node.js (v14 or later)
- MongoDB Atlas account
- Cloudinary account

## 🚀 Getting Started

### Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd <repository-folder>
```

2. **Install frontend dependencies:**

```bash
npm install
```

3. **Install backend dependencies:**

```bash
cd server
npm install
```

4. **Set up environment variables:**

Create a `.env` file in the server directory with:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=your_cloudinary_url
MONGODB_URI=your_mongodb_uri
PORT=5000
```

### Running the Application

1. **Development mode (Frontend + Backend):**

```bash
# From the root directory
npm run dev:full
```

2. **Backend only:**

```bash
# From the root directory
npm run server
```

3. **Frontend only:**

```bash
# From the root directory
npm run dev
```

## 📦 Project Structure

```
/
├── src/                 # Frontend React application
│   ├── components/      # React components
│   ├── pages/           # Pages and routes
│   ├── context/         # React context providers
│   └── data/            # Static data and API helpers
│
├── server/              # Backend Express application
│   ├── models/          # Mongoose schemas
│   ├── controllers/     # Route controllers
│   ├── routes/          # API routes
│   ├── config/          # Configuration files
│   ├── middleware/      # Custom middleware
│   └── server.ts        # Server entry point
```

## 🔍 Features in Detail

### Hero Slider Module

- **Admin Interface:** `/admin/hero-slider`
- **Database Schema:**
  - title (text)
  - subtitle (text)
  - buttonLabel (text)
  - redirectUrl (link)
  - mediaUrl (image or video URL)
  - mediaType (image or video)
  - cloudinaryPublicId (for Cloudinary management)
- **API Endpoints:**
  - GET /api/hero-sliders - Get all hero sliders
  - GET /api/hero-sliders/:id - Get a single hero slider by ID
  - POST /api/hero-sliders - Create a new hero slider
  - PUT /api/hero-sliders/:id - Update a hero slider
  - DELETE /api/hero-sliders/:id - Delete a hero slider

## 📝 License

This project is licensed under the MIT License. 