# E-Commerce Admin Panel Server

Backend server for the e-commerce admin panel, built with Node.js, Express, TypeScript, and MongoDB.

## Features

- MongoDB Atlas integration with Mongoose schemas
- Cloudinary integration for image and video storage
- Full CRUD operations for managing hero slider content
- TypeScript for type safety
- RESTful API design

## Environment Variables

Make sure to set up the following environment variables in your `.env` file:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=your_cloudinary_url
MONGODB_URI=your_mongodb_uri
PORT=5000
```

## Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Start the production server:

```bash
npm start
```

## API Endpoints

### Hero Slider

- `GET /api/hero-sliders` - Get all hero sliders
- `GET /api/hero-sliders/:id` - Get a single hero slider by ID
- `POST /api/hero-sliders` - Create a new hero slider
- `PUT /api/hero-sliders/:id` - Update a hero slider
- `DELETE /api/hero-sliders/:id` - Delete a hero slider

## Project Structure

```
server/
├── models/            # Mongoose schemas
├── controllers/       # Route controllers
├── routes/            # API routes
├── config/            # Configuration files
├── middleware/        # Custom middleware
├── server.ts          # Server entry point
```

## Media Handling

- All media files (images/videos) are stored in Cloudinary
- Media is uploaded and managed in the `heroslider` folder
- Files are named with a structured pattern: `hero-title-timestamp.jpg`
- When updates or deletions occur, old media is automatically removed from Cloudinary 