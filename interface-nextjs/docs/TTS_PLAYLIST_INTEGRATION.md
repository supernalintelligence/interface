# TTS Playlist Integration with Supernal Interface

## Overview

The TTS Playlist feature integrates Supernal TTS Widgets with the Supernal Interface system, enabling voice/text control of readable sections via the SubtitleOverlay.

## Features

### 1. Automatic Widget Detection

The system automatically detects Supernal TTS Widgets on the page:

```typescript
import { detectTTSWidgets, extractTTSWidgets } from '@supernal/interface-nextjs/utils/ttsDetection';

// Check if page has TTS widgets
const hasWidgets = detectTTSWidgets(); // true/false

// Get all widget instances with labels
const widgets = extractTTSWidgets();
// [{ id: 'tts-widget-0', element: HTMLElement, label: 'Introduction' }, ...]
```

### 2. Smart Labeling

Widgets are automatically labeled from surrounding context:

**Label extraction strategy:**
1. Check `aria-label` attribute
2. Check `data-label` attribute
3. Look for nearby headings (H1-H6)
4. Check parent section headings
5. Use first text content (limited to 50 chars)
6. Fallback: "Readable Section N"

### 3. Named Elements Support

Widgets automatically get `data-testid` attributes for interface control:

- Wrapper: `data-testid="tts-widget-0"`
- Play button: `data-testid="tts-widget-0-play"`

## Interface Integration

### Registering TTS Widget Components

```typescript
// src/architecture/ComponentNames.ts
export const ComponentNames = {
  TTS: {
    // Individual widgets (auto-detected)
    widget0: 'tts-widget-0',
    widget0Play: 'tts-widget-0-play',
    widget1: 'tts-widget-1',
    widget1Play: 'tts-widget-1-play',

    // Playlist controls
    playlistButton: 'tts-playlist-button',
    playlistButtonExpanded: 'tts-playlist-button-expanded',
    playlistMenu: 'tts-playlist-menu'
  }
} as const;
```

### Creating Voice/Text Commands

```typescript
// src/tools/TTSTools.ts
import { ToolRegistry, Tool } from '@supernal/interface';
import { ComponentNames } from '../architecture/ComponentNames';
import { extractTTSWidgets } from '@supernal/interface-nextjs/utils/ttsDetection';

export class TTSTools extends ToolRegistry {
  @Tool({
    id: 'play-first-section',
    description: 'Play the first readable section on the page',
    origin: {
      elements: [ComponentNames.TTS.widget0Play]
    }
  })
  playFirstSection() {
    const widgets = extractTTSWidgets();
    if (widgets.length > 0) {
      const playButton = widgets[0].element.querySelector('.supernal-tts-play') as HTMLElement;
      playButton?.click();
    }
  }

  @Tool({
    id: 'show-readable-sections',
    description: 'Show playlist of all readable sections',
    origin: {
      elements: [ComponentNames.TTS.playlistButton]
    }
  })
  showReadableSections() {
    const button = document.querySelector('[data-testid="tts-playlist-button"]') as HTMLElement;
    button?.click();
  }

  @Tool({
    id: 'play-section-by-name',
    description: 'Play a specific section by its heading',
    parameters: {
      sectionName: {
        type: 'string',
        description: 'Name of the section to play'
      }
    },
    origin: {
      elements: [ComponentNames.TTS.widget0]
    }
  })
  playSectionByName(params: { sectionName: string }) {
    const widgets = extractTTSWidgets();
    const widget = widgets.find(w =>
      w.label?.toLowerCase().includes(params.sectionName.toLowerCase())
    );

    if (widget) {
      // Scroll to widget
      widget.element.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Play after scroll
      setTimeout(() => {
        const playButton = widget.element.querySelector('.supernal-tts-play') as HTMLElement;
        playButton?.click();
      }, 800);
    }
  }
}
```

### Registering Tools

```typescript
// src/pages/_app.tsx or src/app/layout.tsx
import { SupernalProvider } from '@supernal/interface-nextjs';
import '@/tools/TTSTools'; // Auto-registers via @ToolProvider decorator

export default function App({ children }) {
  return (
    <SupernalProvider mode="fuzzy" glassMode={true}>
      {children}
    </SupernalProvider>
  );
}
```

## User Commands

Once registered, users can control TTS widgets via voice or text:

- **"Play first section"** → Plays the first readable section
- **"Show readable sections"** → Opens the playlist menu
- **"Play introduction"** → Plays the section labeled "Introduction"
- **"Play overview"** → Plays the section labeled "Overview"
- **"Read the getting started section"** → Plays matching section

## UI Components

### TTS Playlist Button (~+)

- **Collapsed mode:** Large button on left side
- **Expanded mode:** Smaller button next to input
- **Single widget:** Auto-scrolls and plays (skips menu)
- **Multiple widgets:** Opens playlist menu

### TTS Playlist Menu

Glassmorphism-styled menu showing:
- Widget labels extracted from headings
- Tap to scroll and play
- Auto-closes after selection
- Empty state prevention (never renders with 0 widgets)

## Dynamic Widget Detection

Widgets are detected dynamically with MutationObserver:

```typescript
// Automatic re-detection when DOM changes
useEffect(() => {
  const observer = new MutationObserver(() => {
    const detected = detectTTSWidgets();
    setHasTTSWidgets(detected);
    if (detected) {
      const widgets = extractTTSWidgets();
      setTTSWidgets(widgets);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  return () => observer.disconnect();
}, []);
```

## Example: Blog Post Template

```tsx
// src/pages/blog/[slug].tsx
<article>
  <div
    className="prose supernal-tts-widget"
    data-text={post.content}
    data-voice="alloy"
    data-provider="openai"
    data-speed={1.0}
    aria-label={post.title} // Used as widget label
  >
    <h1>{post.title}</h1>
    <div dangerouslySetInnerHTML={{ __html: post.htmlContent }} />
  </div>
</article>
```

The Supernal TTS Widget library will:
1. Inject `.supernal-tts-play` button
2. Handle audio playback
3. Show progress and controls

The TTS Playlist system will:
1. Detect the widget via `.supernal-tts-widget[data-text]`
2. Extract label from `aria-label` or `<h1>`
3. Add `data-testid="tts-widget-0"`
4. Show ~+ button if widget detected
5. Enable voice/text control via registered @Tools

## Architecture

```
SubtitleOverlay (UI)
    ↓
ttsDetection.ts (Detection & Extraction)
    ↓
Supernal TTS Widget (.supernal-tts-widget)
    ↓
Named Elements (data-testid)
    ↓
ComponentNames.ts (Contracts)
    ↓
TTSTools.ts (@Tool decorators)
    ↓
Voice/Text Commands
```

## Benefits

1. **Zero Manual Configuration:** Widgets auto-detected and labeled
2. **Voice Control Ready:** Named elements enable AI-powered control
3. **Accessible:** Proper ARIA labels and semantic HTML
4. **Themeable:** Glassmorphism matches SubtitleOverlay theme
5. **Mobile-First:** Touch-optimized with safe area insets
6. **Type-Safe:** Full TypeScript contracts for components and tools

## Future Enhancements

- **Playlist Persistence:** Remember last played section
- **Auto-play Next:** Queue system for sequential playback
- **Playback Controls:** Pause, resume, speed adjustment from playlist
- **Custom Labels:** Override auto-detection with manual labels
- **Widget Groups:** Categorize widgets by topic/section
