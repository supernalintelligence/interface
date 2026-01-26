# Voice Control Quick Start Guide

## 🚀 How to Enable Voice Control

### Step 1: Enable Voice Features

Voice control is **disabled by default**. To enable it:

**Option A: Via More Menu (Quickest)**
```
1. Open ChatBubble
2. Click the three dots (⋮) in the top-right corner
3. Click "🎤 Enable Voice"
4. You'll see a help message confirming it's enabled
```

**Option B: Via Settings Modal**
```
1. Open ChatBubble
2. Click settings icon (if available)
3. Scroll to "Voice Control" section
4. Toggle "Voice Control" ON
5. Click "Save Changes"
```

### Step 2: See the Features Appear

Once enabled, you'll see:
- **🎤 Microphone button** in the input field (bottom-right of text box)
- **🔊 Speaker icons** next to AI messages

---

## 🎤 Using Voice Input (Speech-to-Text)

1. **Click the microphone button** in the input field
2. **Speak your message** (icon turns red and pulses)
3. **Text appears automatically** in the input field
4. **Click mic again to stop** (or it stops automatically on silence)
5. **Edit if needed**, then click send

**Example**: Click mic → Say "Open the dashboard" → Text appears → Click send

---

## 🔊 Using Voice Output (Text-to-Speech)

### Manual Mode
1. **Send a message** to get an AI response
2. **Click the speaker icon** (🔊) next to the AI message
3. **Hear the message** spoken aloud
4. **Click again to stop** (or wait for it to finish)

### Auto-Read Mode
1. **Open settings** (via more menu or settings modal)
2. **Enable "Auto-read AI Responses"**
3. **All AI messages now speak automatically**

---

## ⚙️ API Configuration (Optional - Only for Premium Voices)

### Default: FREE Native Voices ✅
**No configuration needed!** Voice control works out-of-the-box using:
- **Web**: Browser's built-in voices (SpeechSynthesis API)
- **Mobile**: Device native voices (Capacitor TTS)
- **Cost**: $0.00 - Completely free!

### Optional: Premium OpenAI Voices 💎

If you want **higher-quality OpenAI voices** (alloy, echo, fable, nova, etc.):

**1. Get API Credentials**
- Sign up at https://tts.supernal.ai (or use your own TTS endpoint)
- Get your API key

**2. Add Environment Variables**

Create or edit `.env.local`:
```bash
# Premium TTS API (optional)
NEXT_PUBLIC_TTS_API_URL=https://tts.supernal.ai
NEXT_PUBLIC_TTS_API_KEY=your-api-key-here
```

**3. Enable in Settings**
```
1. Open ChatBubble settings
2. Scroll to "Voice Control"
3. Toggle "Premium Voices 💎" ON
4. You'll see a purple banner: "Using premium OpenAI voices"
```

**Cost**: ~$0.015 per 1,000 characters (only when premium enabled)

---

## 🎛️ Voice Settings

### Available Settings

1. **Voice Control** - Master toggle (on/off)
2. **Auto-read AI Responses** - Automatically speak AI messages
3. **Premium Voices 💎** - Use OpenAI voices (requires API key)
4. **Voice Speed** - Adjust playback speed (0.5x - 2.0x)

### Where to Find Settings

**Quick Toggle**:
- More menu (⋮) → "🎤 Enable Voice" or "🔇 Disable Voice"

**Full Settings**:
- If you have ChatBubbleSettingsModal integrated:
  - Open settings
  - Scroll to "Voice Control" section

---

## 📋 Troubleshooting

### "I don't see the microphone button"
- **Make sure voice is enabled** (more menu → Enable Voice)
- **Check browser support**: Chrome/Edge work best
- **Firefox**: Voice output works, but input requires Whisper API

### "I don't see speaker icons on messages"
- **Voice must be enabled** (more menu → Enable Voice)
- **Icons only appear on AI messages** (not user messages)
- **Hover over AI messages** to see the icon

### "Voice input isn't working"
- **Check microphone permissions**: Browser will ask for permission
- **Try Chrome/Edge**: Best support for Web Speech API
- **Safari**: Limited support (may not work on all versions)

### "Premium voices aren't working"
- **Check API key**: Make sure `NEXT_PUBLIC_TTS_API_KEY` is set
- **Check API URL**: Default is `https://tts.supernal.ai`
- **Test native first**: Disable premium to test basic functionality
- **Fallback**: If API fails, it automatically falls back to native voices

---

## 🌐 Browser Compatibility

| Browser | Voice Input (STT) | Voice Output (TTS) | Status |
|---------|------------------|-------------------|--------|
| **Chrome** | ✅ Excellent | ✅ Excellent | ✅ Recommended |
| **Edge** | ✅ Excellent | ✅ Excellent | ✅ Recommended |
| **Safari (macOS)** | ⚠️ Limited | ✅ Excellent | ⚠️ TTS works well |
| **Safari (iOS)** | ⚠️ Limited | ✅ Excellent | ⚠️ TTS works well |
| **Firefox** | ❌ Not supported | ✅ Good | ⚠️ TTS only |
| **Opera** | ✅ Excellent | ✅ Excellent | ✅ Recommended |

---

## 💰 Cost Comparison

### Free Native Voices (Default)
- **Cost**: $0.00
- **Setup**: None required
- **Quality**: Good
- **Offline**: Works offline
- **Languages**: Device-dependent

**Recommended for**: Chat interactions, feedback, most use cases

### Premium API Voices (Optional)
- **Cost**: ~$0.015 per 1,000 characters
- **Setup**: API key required
- **Quality**: Excellent (OpenAI voices)
- **Offline**: Requires network
- **Languages**: Multiple supported

**Recommended for**: Production content, marketing, when quality matters

---

## 📖 Full Documentation

**Implementation Guides**:
- [EFFICIENT_VOICE_CONTROL_PLAN.md](../../docs/planning/strategy/EFFICIENT_VOICE_CONTROL_PLAN.md) - Architecture & efficiency plan
- [VOICE_CONTROL_PHASE_2_COMPLETE.md](../../docs/planning/strategy/VOICE_CONTROL_PHASE_2_COMPLETE.md) - Complete integration guide

**API Hooks**:
- [useTTS.ts](src/hooks/useTTS.ts) - Text-to-Speech hook
- [useSTT.ts](src/hooks/useSTT.ts) - Speech-to-Text hook

**Components**:
- [TTSButton.tsx](src/components/TTSButton.tsx) - Speaker button component
- [ChatBubble.tsx](src/components/ChatBubble.tsx) - Main chat component with voice integration

---

## 🎯 Quick Reference

### Enable Voice Control
```
More menu (⋮) → "🎤 Enable Voice"
```

### Use Voice Input
```
Click microphone 🎤 → Speak → Click again to stop
```

### Use Voice Output
```
Click speaker 🔊 next to AI message
```

### Adjust Settings
```
Settings → Voice Control section
```

### Premium Voices
```
.env.local → Add NEXT_PUBLIC_TTS_API_KEY → Enable in settings
```

---

## 💡 Tips

1. **Test with native first** - Works immediately, no setup
2. **Start with manual mode** - Click speakers before enabling auto-read
3. **Adjust speed** - 1.2x is good for faster chat, 0.8x for complex content
4. **Check browser** - Chrome/Edge have best support
5. **Premium is optional** - Native voices work great for most use cases

---

## ❓ FAQ

**Q: Do I need an API key?**
A: No! Native voices work out-of-the-box. API key only needed for premium voices.

**Q: Does it work offline?**
A: Yes! Native voices work offline. Premium voices require internet.

**Q: What's the difference between native and premium?**
A: Native is free device voices (good quality). Premium is OpenAI voices (excellent quality).

**Q: Why don't I see voice controls?**
A: Voice is disabled by default. Enable via more menu → "🎤 Enable Voice"

**Q: Can I change the voice?**
A: Native voices use device default. Premium voices have options (alloy, echo, fable, etc.)

**Q: Does it work on mobile?**
A: Yes! Works on mobile web browsers. Can be enhanced with Capacitor for native apps.

---

## 🚀 Get Started Now

1. **Open ChatBubble**
2. **Click more menu (⋮)**
3. **Click "🎤 Enable Voice"**
4. **Start using voice control!**

That's it! No API key needed for basic functionality. 🎉
