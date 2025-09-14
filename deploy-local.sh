#!/bin/bash

echo "Google Maps Explained - Local Deployment"
echo "========================================"
echo ""

if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "npm is not available. Please install npm."
    exit 1
fi

echo "Node.js and npm are installed"
echo ""

echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "Failed to install dependencies"
    exit 1
fi

echo "Dependencies installed"
echo ""

echo "Building the project..."
npm run build

if [ $? -ne 0 ]; then
    echo "Build failed. Please check for errors above."
    exit 1
fi

echo "Build successful"
echo ""

if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing..."
    npm install -g vercel
    
    if [ $? -ne 0 ]; then
        echo "Failed to install Vercel CLI"
        echo "Try running: npm install -g vercel"
        echo "Or use drag & drop method from DEPLOYMENT.md"
        exit 1
    fi
fi

echo "Vercel CLI is ready"
echo ""

echo "Deploying to Vercel..."
echo "You may need to login to Vercel (browser will open)"
echo ""

vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "Deployment successful!"
    echo "Analytics will be available in your Vercel dashboard"
    echo "Manage your deployment at: https://vercel.com/dashboard"
else
    echo ""
    echo "Deployment failed"
    echo "Alternative methods available in DEPLOYMENT.md"
    echo "Try drag & drop: build folder -> vercel.com/new"
fi 