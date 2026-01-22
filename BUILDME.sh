#!/bin/bash
# BUILDME.sh - Build the @supernal/interface open-source package
# This script ensures clean builds with proper dependency installation

set -e  # Exit on error

echo "🔨 Building @supernal/interface..."

# Step 1: Install dependencies (including devDependencies)
echo "📦 Installing dependencies..."
npm install --include=dev

# Step 2: Build the package
echo "🏗️  Building ESM and CJS bundles..."
npm run build

echo "✅ Build complete!"
echo ""
echo "📊 Build output:"
ls -lh dist/esm/src/index.js dist/cjs/src/index.js 2>/dev/null || echo "⚠️  Warning: Build files not found"
