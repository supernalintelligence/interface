#!/bin/bash
# Build script for @supernal/interface (open-source)
set -e

echo "🏗️  Building @supernal/interface (open-source)"
echo "================================================"

# Clean previous build
echo "🧹 Cleaning previous build..."
npm run clean

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build package
echo "🔨 Building ESM + CJS..."
npm run build

echo "✅ @supernal/interface build complete!"
echo ""
echo "📦 Package info:"
echo "   - ESM: dist/esm/"
echo "   - CJS: dist/cjs/"
echo "   - Types: dist/esm/**/*.d.ts"
echo ""
echo "🔗 To use locally in other packages:"
echo "   npm link"

