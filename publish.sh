#!/bin/bash
# Quick publish script
# Get your 2FA code from your authenticator app, then run:
# ./publish.sh YOUR_OTP_CODE

cd /Users/ianderrington/git/supernal-nova/platform/packages/@supernal-interface/open-source

if [ -z "$1" ]; then
  echo "❌ Usage: ./publish.sh YOUR_OTP_CODE"
  echo ""
  echo "Example: ./publish.sh 123456"
  echo ""
  echo "Or run directly:"
  echo "npm publish --access public --otp=YOUR_CODE"
  exit 1
fi

echo "🚀 Publishing @supernal/interface v1.0.0..."
npm publish --access public --otp=$1

if [ $? -eq 0 ]; then
  echo ""
  echo "🎉 SUCCESS! Package published to npm"
  echo ""
  echo "✅ View at: https://www.npmjs.com/package/@supernal/interface"
  echo "✅ Install: npm install @supernal/interface"
  echo ""
  echo "📊 Next steps:"
  echo "  1. Verify: npm view @supernal/interface"
  echo "  2. Test: npm install @supernal/interface"
  echo "  3. Build enterprise package"
else
  echo ""
  echo "❌ Publish failed. Check the error above."
  echo ""
  echo "Common issues:"
  echo "  - OTP expired (codes expire every 30 seconds)"
  echo "  - Wrong OTP code"
  echo "  - Network issue"
  echo ""
  echo "Try again: npm publish --access public --otp=NEW_CODE"
fi







