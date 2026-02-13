# FireHorse Open Graph Image Specification

## Overview
Design spec for 1200x630px Open Graph image that appears when firehorse.info is shared on social media (Facebook, Twitter/X, LinkedIn, Slack, etc.)

---

## Dimensions & Format
- **Size:** 1200px × 630px (Facebook/Twitter standard)
- **Format:** PNG (with transparency fallback) or JPG
- **File size:** Target < 300KB for fast loading
- **Safe area:** Keep critical text/elements within 1100×550px center (account for platform cropping)

---

## Background

### Base color
- **Color:** `#0a0a0a` (ash-950)
- **Treatment:** Subtle radial gradient for depth

### Gradient overlay
```css
background: radial-gradient(
  ellipse at center,
  rgba(249, 115, 22, 0.15) 0%,    /* fire-500 at 15% opacity */
  rgba(234, 88, 12, 0.08) 40%,     /* fire-600 at 8% opacity */
  #0a0a0a 80%                      /* ash-950 solid */
);
```

**Effect:** Warm fire glow radiating from center, fading to deep black at edges

---

## Typography

### Main headline: "YEAR OF THE FIRE HORSE"

**Font:** Cinzel Bold (var(--font-display))
**Size:** 72px–84px
**Color:** `#fb923c` (fire-400)
**Effect:** Apply subtle fire glow
```css
text-shadow:
  0 0 20px rgba(249, 115, 22, 0.6),
  0 0 40px rgba(249, 115, 22, 0.3);
```
**Position:** Upper-center (Y: 180-220px from top)
**Alignment:** Center
**Letter spacing:** 2px (tracking-wide)

### Subtext: "2026 | firehorse.info"

**Font:** Inter Medium (var(--font-body))
**Size:** 32px–36px
**Color:** `#d4d4d4` (ash-300)
**Position:** Below headline (Y: ~320px from top)
**Alignment:** Center
**Letter spacing:** 1px
**Separator:** Use middle dot (·) or pipe (|) between "2026" and domain

---

## Visual Elements

### Option 1: Stylized Fire Horse Silhouette
- **Element:** Abstract horse head/profile merged with flame shapes
- **Style:** Minimalist, geometric, modern (not literal/realistic)
- **Color:** Gradient from fire-500 to ember-500
- **Position:** Background element behind text OR side element (left/right 200px margin)
- **Opacity:** 20-30% (subtle, doesn't compete with text)

### Option 2: Flame Motif
- **Element:** Stylized flame icon or abstract fire particles
- **Style:** Geometric, sharp angles (matches modern brand aesthetic)
- **Colors:** fire-400, fire-500, ember-500 gradient
- **Position:**
  - Large flame: Behind text as watermark (opacity 15%)
  - Small flames: Decorative accents in corners (4-6 particles)
- **Effect:** Subtle fire-glow on particles

### Option 3: Chinese Zodiac Symbol
- **Element:** 丙午 (Fire Horse in Chinese characters)
- **Font:** Traditional Chinese serif font
- **Size:** Very large (200-300px), low opacity
- **Color:** fire-800 at 10% opacity
- **Position:** Centered background watermark behind English text

**Recommendation:** Combine Option 2 (flame motif) + Option 3 (Chinese characters) for cultural + modern balance

---

## Color Palette (Exact Hex Codes)

### Fire palette
- `#fb923c` — fire-400 (primary headline color)
- `#f97316` — fire-500 (glow, gradient)
- `#ea580c` — fire-600 (gradient accent)
- `#c2410c` — fire-700 (deep fire)

### Ember palette
- `#fbbf24` — ember-400 (warm gold highlight)
- `#f59e0b` — ember-500 (gradient)

### Ash/Dark palette
- `#0a0a0a` — ash-950 (background)
- `#d4d4d4` — ash-300 (subtext)
- `#a3a3a3` — ash-400 (secondary text if needed)

---

## Layout Structure

```
┌─────────────────────────────────────────────┐
│                                             │
│          [丙午 watermark - faded]           │ 120px margin top
│                                             │
│       YEAR OF THE FIRE HORSE                │ 180px from top
│       (fire-400, Cinzel Bold, 78px)         │
│                                             │
│          2026 · firehorse.info              │ 320px from top
│         (ash-300, Inter Medium, 34px)       │
│                                             │
│    [Flame particles in corners/accent]      │
│                                             │
│                                             │
└─────────────────────────────────────────────┘
     1200px × 630px
```

---

## Design Guidelines

### DO:
- Keep text highly legible (high contrast with background)
- Use brand colors exactly (no off-brand oranges/reds)
- Maintain visual hierarchy (headline dominates, subtext supports)
- Apply subtle fire glow effects for depth
- Test preview on multiple platforms (FB, Twitter, LinkedIn)

### DON'T:
- Use literal/realistic horse images (too literal, dated)
- Overcrowd with multiple visual elements competing for attention
- Use small text (minimum 30px for readability in thumbnails)
- Apply heavy blur or effects that reduce text clarity
- Use off-brand colors or fonts

---

## Platform Testing Checklist

Test OG image preview on:
- [ ] Facebook (link post)
- [ ] Twitter/X (card preview)
- [ ] LinkedIn (article share)
- [ ] WhatsApp/iMessage (link preview)
- [ ] Slack (unfurl)

**Tool:** Use [socialsharepreview.com](https://socialsharepreview.com) or Meta's Sharing Debugger

---

## File Delivery

### Primary OG image
**Path:** `/home/marc/DEV/firehorse/firehorse/public/og-image.png`
**Format:** PNG-24 with transparency support
**Optimization:** Run through ImageOptim or TinyPNG

### SVG Placeholder (temporary)
**Path:** `/home/marc/DEV/firehorse/firehorse/public/og-image.svg`
**Purpose:** Immediate placeholder until designed PNG is created
**Design:** Simple branded graphic with text overlay using brand colors

### Meta tags (for reference)
```html
<meta property="og:image" content="https://firehorse.info/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Year of the Fire Horse 2026 — firehorse.info" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://firehorse.info/og-image.png" />
```

---

## Accessibility

- **Alt text:** "Year of the Fire Horse 2026 — firehorse.info"
- **Text contrast:** Ensure fire-400 on ash-950 meets WCAG AA (4.5:1 minimum)
- **No critical info in visuals only:** All key content is in text form

---

**Created:** 2026-02-13
**Design status:** Spec complete, awaiting design implementation
**Designer:** TBD
