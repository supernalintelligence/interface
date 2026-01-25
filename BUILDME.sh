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

# Step 3: Build interface-nextjs
echo ""
echo "🏗️  Building @supernal/interface-nextjs..."
cd interface-nextjs
npm install --include=dev
npm run build
cd ..

echo ""
echo "✅ Build complete!"
echo ""
echo "📊 Build output:"
echo "  - interface:        $(ls -lh dist/esm/src/index.js 2>/dev/null | awk '{print $5}' || echo 'N/A')"
echo "  - interface-nextjs: $(ls -lh interface-nextjs/dist/index.mjs 2>/dev/null | awk '{print $5}' || echo 'N/A')"
