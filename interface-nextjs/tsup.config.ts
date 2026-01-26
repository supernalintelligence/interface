import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  banner: {
    js: '"use client";',
  },
  external: [
    // Capacitor dependencies (mobile-only, optional)
    '@capacitor/text-to-speech',
    '@capacitor-community/speech-recognition',
  ],
});
