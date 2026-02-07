# PWA Icons and Screenshots

This directory needs the following assets for the Progressive Web App:

## Required Icons
- `icon-192.png` - 192x192px app icon (for home screen)
- `icon-512.png` - 512x512px app icon (for splash screen)
- `favicon.ico` - 32x32px favicon
- `apple-touch-icon.png` - 180x180px (for iOS)

## Optional but Recommended
- `screenshot-wide.png` - 1280x720px (desktop view of your app)
- `screenshot-narrow.png` - 750x1334px (mobile view of your app)

## How to Generate Icons

### Option 1: Using an online tool
1. Visit https://realfavicongenerator.net/
2. Upload your logo
3. Download the generated icons
4. Place them in this `public` directory

### Option 2: Using ImageMagick (command line)
```bash
# From your logo.svg or logo.png
convert logo.png -resize 192x192 icon-192.png
convert logo.png -resize 512x512 icon-512.png
convert logo.png -resize 180x180 apple-touch-icon.png
convert logo.png -resize 32x32 favicon.ico
```

### Option 3: PWA Asset Generator
```bash
npx pwa-asset-generator logo.svg ./public --icon-only
```

## Screenshots
Take screenshots of your running app:
1. Run `npm run dev`
2. Open browser to http://localhost:3000
3. Take screenshots at 1280x720 (desktop) and 750x1334 (mobile)
4. Save as `screenshot-wide.png` and `screenshot-narrow.png`
