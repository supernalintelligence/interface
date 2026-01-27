/**
 * Core types for the graph-based testing framework.
 *
 * This file is the contract between all packages - changes require consensus.
 *
 * @packageDocumentation
 */
/**
 * Predefined viewport presets.
 */
export const ViewportPresets = {
    Desktop: { name: 'desktop', width: 1920, height: 1080 },
    DesktopSmall: { name: 'desktop-small', width: 1366, height: 768 },
    Laptop: { name: 'laptop', width: 1280, height: 720 },
    TabletLandscape: { name: 'tablet-landscape', width: 1024, height: 768, isMobile: true, hasTouch: true },
    TabletPortrait: { name: 'tablet-portrait', width: 768, height: 1024, isMobile: true, hasTouch: true },
    MobileLarge: { name: 'mobile-large', width: 414, height: 896, isMobile: true, hasTouch: true },
    Mobile: { name: 'mobile', width: 375, height: 812, isMobile: true, hasTouch: true },
    MobileSmall: { name: 'mobile-small', width: 320, height: 568, isMobile: true, hasTouch: true },
};
//# sourceMappingURL=types.js.map