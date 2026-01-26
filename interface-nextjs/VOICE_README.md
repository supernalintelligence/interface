# 🎤 Voice Control Documentation

**Complete guide to voice control in Supernal Interface ChatBubble**

---

## 📚 Documentation Index

### 🚀 Getting Started
1. **[Quick Start Guide](./VOICE_CONTROL_QUICKSTART.md)** - How to enable and use voice control
2. **[Where Are the Controls?](./WHERE_ARE_VOICE_CONTROLS.md)** - Visual guide to finding voice features
3. **[API Configuration]((.env.local.example)** - Optional premium voice setup

### 🔧 Implementation Details
4. **[Phase 2 Complete](../../docs/planning/strategy/VOICE_CONTROL_PHASE_2_COMPLETE.md)** - Full integration guide
5. **[Efficient Architecture](../../docs/planning/strategy/EFFICIENT_VOICE_CONTROL_PLAN.md)** - Native-first design

### 💻 Code Reference
6. **[useTTS Hook](./src/hooks/useTTS.ts)** - Text-to-Speech implementation
7. **[useSTT Hook](./src/hooks/useSTT.ts)** - Speech-to-Text implementation
8. **[TTSButton Component](./src/components/TTSButton.tsx)** - Speaker button
9. **[ChatBubble Integration](./src/components/ChatBubble.tsx)** - Main component

---

## 🎯 Quick Links

### I want to...

**...enable voice control**
→ [Quick Start Guide](./VOICE_CONTROL_QUICKSTART.md#-how-to-enable-voice-control)

**...find the microphone button**
→ [Where Are Controls?](./WHERE_ARE_VOICE_CONTROLS.md#-using-voice-input)

**...configure premium voices**
→ [Quick Start Guide](./VOICE_CONTROL_QUICKSTART.md#-api-configuration-optional---only-for-premium-voices)

**...understand the architecture**
→ [Efficient Architecture](../../docs/planning/strategy/EFFICIENT_VOICE_CONTROL_PLAN.md)

**...see cost savings**
→ [Phase 2 Complete](../../docs/planning/strategy/VOICE_CONTROL_PHASE_2_COMPLETE.md#-cost-impact-summary)

---

## ❓ Common Questions

### Q: Why don't I see voice controls?

**A:** Voice is disabled by default. Enable it:
```
ChatBubble → More menu (⋮) → "🎤 Enable Voice"
```

See: [Where Are Controls?](./WHERE_ARE_VOICE_CONTROLS.md)

---

### Q: Do I need an API key?

**A:** No! Voice works out-of-the-box with free native voices.

- ✅ **Native voices** - FREE, no setup, works offline
- 💎 **Premium voices** - Optional upgrade, requires API key

See: [Quick Start Guide](./VOICE_CONTROL_QUICKSTART.md#-api-configuration-optional---only-for-premium-voices)

---

### Q: Where do I add the API key?

**A:** Create `.env.local`:
```bash
NEXT_PUBLIC_TTS_API_URL=https://tts.supernal.ai
NEXT_PUBLIC_TTS_API_KEY=your-key-here
```

See: [.env.local.example](.env.local.example)

---

### Q: How much does it cost?

**A:**
- **Native voices (default)**: $0.00 - Completely free!
- **Premium voices (opt-in)**: ~$0.015 per 1,000 characters

**Savings**: $629,625/year at scale by using native voices!

See: [Phase 2 Complete - Cost Impact](../../docs/planning/strategy/VOICE_CONTROL_PHASE_2_COMPLETE.md#-cost-impact-summary)

---

### Q: Does it work offline?

**A:** Yes! Native voices work completely offline. Premium voices require internet.

---

### Q: Which browsers are supported?

**A:**
- ✅ Chrome/Edge - Full support (STT + TTS)
- ✅ Safari - TTS works great, STT limited
- ⚠️ Firefox - TTS only (no STT)
- ✅ Opera - Full support

See: [Quick Start - Browser Compatibility](./VOICE_CONTROL_QUICKSTART.md#-browser-compatibility)

---

## 🎬 Visual Walkthrough

**Step 1: Enable Voice**
```
┌─────────────────────────────────┐
│  Chat                    ⋮     │  ← Click here
│                                 │
│  AI: Hello! How can I help?    │
│                                 │
│  [Type...]               [→]   │
└─────────────────────────────────┘
                ↓
        Click "🎤 Enable Voice"
                ↓
Voice controls appear!
```

**Step 2: Use Voice Input**
```
┌─────────────────────────────────┐
│  [Type or speak...]   🎤  [→]  │  ← Click mic
└─────────────────────────────────┘
        ↓ (mic turns red)
    Speak: "Open dashboard"
        ↓
┌─────────────────────────────────┐
│  [Open dashboard]     🎤  [→]  │  ← Text appears!
└─────────────────────────────────┘
```

**Step 3: Use Voice Output**
```
┌─────────────────────────────────┐
│  AI: Here's your dashboard  🔊 │  ← Click speaker
└─────────────────────────────────┘
        ↓
    🔊 (pulsing - playing audio)
```

See full visual guide: [Where Are Controls?](./WHERE_ARE_VOICE_CONTROLS.md)

---

## 🚀 Get Started in 3 Steps

1. **Open ChatBubble**
2. **Click more menu (⋮) → "🎤 Enable Voice"**
3. **Start using microphone 🎤 and speaker 🔊 icons**

That's it! No API key needed. 🎉

---

## 📖 Full Documentation

### User Guides
- [Quick Start Guide](./VOICE_CONTROL_QUICKSTART.md) - How to enable and use
- [Where Are Controls?](./WHERE_ARE_VOICE_CONTROLS.md) - Finding voice features
- [API Configuration](.env.local.example) - Optional premium setup

### Technical Documentation
- [Phase 2 Integration](../../docs/planning/strategy/VOICE_CONTROL_PHASE_2_COMPLETE.md) - Complete implementation
- [Efficient Architecture](../../docs/planning/strategy/EFFICIENT_VOICE_CONTROL_PLAN.md) - Native-first design
- [Phase 1 Foundation](../../docs/planning/strategy/VOICE_CONTROL_IMPLEMENTATION_COMPLETE.md) - Core hooks

### Code Reference
- [useTTS.ts](./src/hooks/useTTS.ts) - Text-to-Speech hook
- [useSTT.ts](./src/hooks/useSTT.ts) - Speech-to-Text hook
- [TTSButton.tsx](./src/components/TTSButton.tsx) - Speaker button component
- [ChatBubble.tsx](./src/components/ChatBubble.tsx) - Main integration

---

## 💡 Key Features

### ✅ Works Out of the Box
- No API key required
- No configuration needed
- Uses free device voices
- Works offline

### ✅ Optional Premium Upgrade
- High-quality OpenAI voices
- Simple API key configuration
- Automatic fallback to native
- Cost-effective (opt-in only)

### ✅ Cost Efficient
- 95%+ usage is FREE
- $629,625/year savings at scale
- Native voices by default
- Premium only when needed

---

## 🔗 Quick Reference

| Task | Link |
|------|------|
| **Enable voice** | [Quick Start](./VOICE_CONTROL_QUICKSTART.md#-how-to-enable-voice-control) |
| **Find controls** | [Where Are Controls?](./WHERE_ARE_VOICE_CONTROLS.md) |
| **Configure API** | [.env.local.example](.env.local.example) |
| **Use voice input** | [Quick Start - Voice Input](./VOICE_CONTROL_QUICKSTART.md#-using-voice-input-speech-to-text) |
| **Use voice output** | [Quick Start - Voice Output](./VOICE_CONTROL_QUICKSTART.md#-using-voice-output-text-to-speech) |
| **Troubleshoot** | [Quick Start - Troubleshooting](./VOICE_CONTROL_QUICKSTART.md#-troubleshooting) |
| **See implementation** | [Phase 2 Complete](../../docs/planning/strategy/VOICE_CONTROL_PHASE_2_COMPLETE.md) |
| **Understand architecture** | [Efficient Architecture](../../docs/planning/strategy/EFFICIENT_VOICE_CONTROL_PLAN.md) |

---

## 📞 Need Help?

1. **Can't find voice controls?** → [Where Are Controls?](./WHERE_ARE_VOICE_CONTROLS.md)
2. **API setup issues?** → [.env.local.example](.env.local.example)
3. **Feature not working?** → [Troubleshooting](./VOICE_CONTROL_QUICKSTART.md#-troubleshooting)
4. **Want technical details?** → [Phase 2 Complete](../../docs/planning/strategy/VOICE_CONTROL_PHASE_2_COMPLETE.md)

---

**Start now**: [Quick Start Guide →](./VOICE_CONTROL_QUICKSTART.md)
