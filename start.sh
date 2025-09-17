#!/bin/bash

# Sentence Builder - Quick Start Script (Mac/Linux)
# Makes it easy to start the development server

echo "🚀 Starting Sentence Builder..."
echo "================================"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env exists, if not create from example
if [ ! -f ".env" ]; then
    echo "🔧 Creating .env file..."
    cp .env.example .env
    echo "✅ Created .env file (configure API keys if needed)"
fi

# Clear any port conflicts
echo "🧹 Checking for port conflicts..."
lsof -ti:5173 | xargs kill -9 2>/dev/null

# Start the development server
echo "🎮 Starting development server..."
echo "================================"
echo "📱 Local:   http://localhost:5173"
echo "📱 Network: Will display after startup"
echo "================================"

# Open browser and start dev server
npm run dev -- --host --open