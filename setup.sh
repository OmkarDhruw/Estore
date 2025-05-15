#!/bin/bash

# Print a message
echo "Setting up E-Commerce Admin Panel with Hero Slider Module..."

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Navigate to server directory and install backend dependencies
echo "Installing backend dependencies..."
cd server
npm install

# Return to root
cd ..

# Create .env file if it doesn't exist
if [ ! -f "./server/.env" ]; then
    echo "Creating .env file in server directory..."
    cp ./server/.env.example ./server/.env
    echo "Please update the .env file with your actual credentials."
fi

echo "Setup complete! You can now run the application with:"
echo "- Frontend only: npm run dev"
echo "- Backend only: npm run server"
echo "- Full stack: npm run dev:full" 