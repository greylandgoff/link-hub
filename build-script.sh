#!/bin/bash

# Build script for Vercel deployment
echo "Building frontend..."
cd client
npm run build
cd ..

echo "Frontend built successfully!"
echo "Files ready for Vercel deployment."