#!/bin/bash
set -e

echo "🚀 Publishing @supernal/interface-nextjs to npm..."

# Verify we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run from interface-nextjs/ directory."
    exit 1
fi

# Verify package name
PACKAGE_NAME=$(node -p "require('./package.json').name")
if [ "$PACKAGE_NAME" != "@supernal/interface-nextjs" ]; then
    echo "❌ Error: Wrong package. Expected @supernal/interface-nextjs, got $PACKAGE_NAME"
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

# Verify build artifacts (tsup generates index.js and index.mjs)
echo "🔍 Verifying build artifacts..."
if [ ! -f "dist/index.js" ]; then
    echo "❌ Missing CJS build (dist/index.js)"
    exit 1
fi

if [ ! -f "dist/index.mjs" ]; then
    echo "❌ Missing ESM build (dist/index.mjs)"
    exit 1
fi

if [ ! -f "dist/index.d.ts" ]; then
    echo "❌ Missing TypeScript declarations (dist/index.d.ts)"
    exit 1
fi

# Show what will be published
echo ""
echo "📋 Files to be published:"
npm pack --dry-run

# Confirm
echo ""
read -p "Ready to publish @supernal/interface-nextjs? (y/N) " -n 1 -r
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
npm view @supernal/interface-nextjs

echo ""
echo "🎉 Done! Package is now available:"
echo "   npm install @supernal/interface-nextjs"
