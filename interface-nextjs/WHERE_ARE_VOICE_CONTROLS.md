# Where Are the Voice Controls? 👀

## 🎯 Quick Answer

**Voice controls are HIDDEN by default!** You need to enable them first.

---

## Step-by-Step Visual Guide

### 1️⃣ Open ChatBubble

Look for the chat bubble button (usually bottom-right corner):

```
┌─────────────────────────────────────┐
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
│                                     │
│                              [💬]  │  ← Click this
└─────────────────────────────────────┘
```

### 2️⃣ Find the More Menu

Chat opens. Look for the **three dots (⋮)** in the top-right:

```
┌──────────────────────────────────────┐
│  Supernal Interface         🔗  ⋮  │  ← Click the ⋮
├──────────────────────────────────────┤
│                                      │
│  [AI messages appear here]           │
│                                      │
├──────────────────────────────────────┤
│  [Type message...]            [→]   │
└──────────────────────────────────────┘
```

### 3️⃣ Enable Voice Control

Click the three dots (⋮) to open the menu:

```
┌────────────────────────────────────┐
│ ☀️ Light Mode                      │
│ 🎤 Enable Voice          ← CLICK! │
│ 🏠 Reset position                  │
│ ℹ️  How to use                     │
│ 🗑️  Clear chat                     │
└────────────────────────────────────┘
```

### 4️⃣ Voice Controls Appear!

After enabling, you'll see:

**Microphone button in input field:**
```
┌──────────────────────────────────────┐
│  [Type or speak...]       🎤  [→]   │  ← Mic button!
└──────────────────────────────────────┘
```

**Speaker icons on AI messages:**
```
┌──────────────────────────────────────┐
│  AI: Here's your response     🔊     │  ← Speaker button!
└──────────────────────────────────────┘
```

---

## 🎤 Using Voice Input

**After enabling voice**, click the microphone button:

```
BEFORE CLICKING (idle):
[Type or speak...]       🎤  [→]

WHILE RECORDING (red, pulsing):
[Listening...]           🔴  [→]

AFTER SPEAKING (text appears):
[Open the dashboard]     🎤  [→]
```

---

## 🔊 Using Voice Output

**After enabling voice**, click speaker icons on AI messages:

```
IDLE:
AI: Your message here     🔊

PLAYING (pulsing):
AI: Your message here     🔊 (animated)

CLICK TO STOP:
AI: Your message here     ⏹️
```

---

## ⚙️ Full Settings

For more options, you can access the full settings modal (if implemented in your app):

```
More menu (⋮) → Settings
↓
┌─────────────────────────────────────┐
│  Chat Settings                      │
├─────────────────────────────────────┤
│  [Theme]                            │
│  [Glass Mode]                       │
│  [Notifications]                    │
│                                     │
│  Voice Control                      │  ← Scroll here
│  ├─ Voice Control         [ON]     │
│  ├─ Auto-read Responses   [OFF]    │
│  ├─ Premium Voices 💎     [OFF]    │
│  └─ Voice Speed: 1.0x     [slider] │
└─────────────────────────────────────┘
```

---

## 🔍 Troubleshooting "I Don't See It"

### Problem: "I don't see the three dots (⋮)"

**Solution**: Make sure ChatBubble is **expanded**:
- Click the chat bubble button to open it
- If minimized, click the header to expand
- Three dots appear in the **top-right corner** when expanded

### Problem: "I clicked Enable Voice but see no changes"

**Solution**: Look for these indicators:
1. **Input field**: Microphone icon should appear on the right side
2. **AI messages**: Hover over AI messages to see speaker icons
3. **Help message**: You should see a message confirming voice is enabled

### Problem: "The menu doesn't have 'Enable Voice'"

**Solution**: You may be using an older version. Check:
- Make sure you're using the latest ChatBubble component
- Voice control was added in the Phase 2 update
- Look for the voice toggle option in the menu

---

## 📍 Exact Locations (Component Details)

### Where the More Menu Button Lives
**File**: `ChatBubble.tsx`
**Location**: Header section, right side
**Code reference**: Line ~1659-1667

```typescript
<button
  onClick={() => setShowMoreMenu(!showMoreMenu)}
  className={THEME_CLASSES.button.more}
  title="More options"
>
  <svg>...</svg> {/* Three dots icon */}
</button>
```

### Where the Voice Toggle Lives
**File**: `ChatBubble.tsx`
**Location**: Inside more menu dropdown
**Code reference**: Line ~1751-1764 (approximately)

```typescript
<button onClick={() => setVoiceEnabled(!voiceEnabled)}>
  {voiceEnabled ? '🔇 Disable' : '🎤 Enable'} Voice
</button>
```

### Where the Mic Button Lives
**File**: `ChatBubble.tsx` → `InputField` component
**Location**: Input field, right side (between text and send button)
**Code reference**: Line ~330-348 (approximately)

```typescript
{voiceEnabled && onMicClick && !compact && (
  <button onClick={onMicClick}>
    <svg>...</svg> {/* Microphone icon */}
  </button>
)}
```

### Where Speaker Icons Live
**File**: `ChatBubble.tsx` → message mapping
**Location**: Next to each AI message
**Code reference**: Line ~1336-1344 and ~1894-1902 (approximately)

```typescript
{message.type === 'ai' && voiceEnabled && (
  <TTSButton
    text={message.text}
    usePremiumVoices={usePremiumVoices}
    speed={ttsSpeed}
    theme={theme}
    size="small"
  />
)}
```

---

## 💡 Pro Tip: How to Make Voice More Obvious

If you want voice control to be **enabled by default**, edit ChatBubble.tsx:

**Change this:**
```typescript
const [voiceEnabled, setVoiceEnabled] = useState(false); // ❌ Hidden
```

**To this:**
```typescript
const [voiceEnabled, setVoiceEnabled] = useState(true);  // ✅ Visible
```

**Location**: ChatBubble.tsx, line ~405

---

## 🎬 Video/GIF Walkthrough (TODO)

Coming soon: Screen recording showing exactly how to enable and use voice control.

---

## 📞 Still Can't Find It?

1. **Check your ChatBubble component** is the latest version
2. **Make sure you imported voice hooks**:
   ```typescript
   import { useTTS } from '../hooks/useTTS';
   import { useSTT } from '../hooks/useSTT';
   import { TTSButton } from './TTSButton';
   ```
3. **Verify the more menu exists** (look for three dots in header)
4. **Try refreshing the page** after enabling
5. **Check browser console** for any errors

---

## 📚 Related Documentation

- [VOICE_CONTROL_QUICKSTART.md](./VOICE_CONTROL_QUICKSTART.md) - How to use voice features
- [VOICE_CONTROL_PHASE_2_COMPLETE.md](../../docs/planning/strategy/VOICE_CONTROL_PHASE_2_COMPLETE.md) - Complete implementation details
- [useTTS.ts](./src/hooks/useTTS.ts) - TTS hook source code
- [useSTT.ts](./src/hooks/useSTT.ts) - STT hook source code

---

**Summary**: Voice is hidden by default! Click **more menu (⋮) → "🎤 Enable Voice"** to reveal all voice controls. 🎯
