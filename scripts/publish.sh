#!/bin/bash
set -e

echo "🚀 Publishing @supernal/interface to npm..."

# Verify we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run from open-source/ directory."
    exit 1
fi

# Clean
echo "🧹 Cleaning build artifacts..."
rm -rf dist node_modules

# Install
echo "📦 Installing dependencies..."
npm ci

# Build
echo "🏗️  Building package..."
npm run build

# Test
echo "🧪 Running tests..."
npm test || {
    echo "❌ Tests failed. Fix tests before publishing."
    exit 1
}

# Verify build artifacts
echo "🔍 Verifying build artifacts..."
if [ ! -f "dist/cjs/index.js" ]; then
    echo "❌ Missing CJS build"
    exit 1
fi

if [ ! -f "dist/esm/index.js" ]; then
    echo "❌ Missing ESM build"
    exit 1
fi

# Show what will be published
echo ""
echo "📋 Files to be published:"
npm pack --dry-run

# Confirm
echo ""
read -p "Ready to publish @supernal/interface? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Publish cancelled"
    exit 1
fi

# Publish
echo "📤 Publishing to npm..."
npm publish

# Verify
echo "✅ Published successfully!"
echo ""
echo "📦 Package info:"
npm view @supernal/interface

echo ""
echo "🎉 Done! Package is now available:"
echo "   npm install @supernal/interface"

