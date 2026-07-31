---
name: Modern Heritage
colors:
  surface: '#fbf9f4'
  surface-dim: '#dbdad5'
  surface-bright: '#fbf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ee'
  surface-container: '#f0eee9'
  surface-container-high: '#eae8e3'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c19'
  on-surface-variant: '#46474a'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#76777b'
  outline-variant: '#c7c6ca'
  surface-tint: '#5f5e5f'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1c'
  on-primary-container: '#858384'
  inverse-primary: '#c8c6c7'
  secondary: '#845238'
  on-secondary: '#ffffff'
  secondary-container: '#ffbd9d'
  on-secondary-container: '#7a4a31'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#201b13'
  on-tertiary-container: '#8b8377'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e3'
  primary-fixed-dim: '#c8c6c7'
  on-primary-fixed: '#1b1b1c'
  on-primary-fixed-variant: '#474647'
  secondary-fixed: '#ffdbcb'
  secondary-fixed-dim: '#f9b897'
  on-secondary-fixed: '#331101'
  on-secondary-fixed-variant: '#683b23'
  tertiary-fixed: '#ece1d3'
  tertiary-fixed-dim: '#cfc5b8'
  on-tertiary-fixed: '#201b13'
  on-tertiary-fixed-variant: '#4c463c'
  background: '#fbf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e4e2dd'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 64px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 40px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Libre Caslon Text
    fontSize: 24px
    fontWeight: '400'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '500'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
  button:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  section-gap: 120px
---

## Brand & Style

This design system embodies the intersection of German engineering precision and high-end interior editorial design. The brand personality is authoritative yet welcoming, shifting the digital furniture experience from a transactional e-commerce interface to a curated consultation journey.

The visual style is **Modern Corporate with Minimalist Editorial influences**. It leverages heavy whitespace and a modular grid to mirror the structural integrity of premium furniture. To evoke a "future-facing" feel, the system integrates **subtle Glassmorphism** for navigational overlays and high-end filtering menus, creating a sense of depth and architectural layering without sacrificing clarity. The emotional response should be one of "calm confidence"—reassuring the user of the brand's long-standing quality while signaling a forward-thinking approach to digital interaction.

## Colors

The palette is rooted in architectural neutrals to allow product photography to remain the focal point. 

- **Primary (Deep Charcoal):** Used for primary typography, structural borders, and high-emphasis call-to-actions (CTAs). It provides the "weight" necessary for a premium brand.
- **Secondary (Bronze/Terracotta):** Reserved for subtle accents, interactive states, and "Retailer Consultation" leads. It adds warmth and a touch of modern luxury.
- **Neutrals (Ivory & Sand):** Ivory serves as the primary page background to reduce eye strain compared to pure white. Sand is utilized for secondary containers, cards, and section dividers to create a soft, tiered hierarchy.
- **Taupe:** Used for metadata, disabled states, and secondary icons to maintain a sophisticated low-contrast relationship with the background.

## Typography

The typographic scale creates a rhythmic contrast between the heritage-inspired **Libre Caslon Text** (Headlines) and the hyper-modern **Manrope** (Body/UI). 

Headlines should be set with generous leading and occasional "optical" kerning to feel like a high-fashion magazine. Large display sizes are intended to overlap or sit adjacent to high-resolution imagery. Body text uses Manrope at a medium weight (500) for standard reading to ensure maximum legibility against the Ivory and Sand backgrounds. Labels and small UI elements should utilize the uppercase tracking of Manrope to denote technical specs and categorization.

## Layout & Spacing

This design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The layout philosophy is "Spacious & Modular," prioritizing white space to prevent the interface from feeling cluttered or "salesy."

- **Desktop:** 64px outer margins provide an editorial frame.
- **Vertical Rhythm:** A strict 8px baseline grid is used. Section gaps are intentionally large (120px+) to allow the user to pause and digest one furniture collection at a time.
- **Modular Blocks:** Content is organized into distinct blocks of varying widths (e.g., a 4-column text block paired with an 8-column image) to create a dynamic, non-repetitive flow.

## Elevation & Depth

To maintain a future-facing and premium feel, this design system avoids heavy shadows in favor of **Tonal Layers** and **Refined Glassmorphism**.

1.  **Level 0 (Base):** Ivory (#F9F7F2) background.
2.  **Level 1 (Cards/Sections):** Sand (#E5DED1) containers with no shadow and a very thin (0.5px) Taupe border.
3.  **Level 2 (Overlays/Modals):** A translucent Ivory backdrop filter (blur: 20px, opacity: 85%). This is used for navigation menus and product quick-views to keep the context of the interior space visible behind the UI.
4.  **Interactions:** Hover states on primary elements should trigger a slight "lift" using a very soft, ambient shadow (10% opacity Charcoal, 30px blur) to simulate a physical object being brought closer to the user.

## Shapes

The shape language balances the geometric rigidity of furniture design with the comfort of home. 

Standard components (Buttons, Inputs, Cards) use a **0.5rem (8px)** corner radius. Larger containers or hero image modules may scale up to **1rem (16px)** to emphasize a softer, more modern architectural look. Circular shapes are strictly reserved for functional icons and "Floating Action Buttons" related to retailer chat or consultation booking to distinguish them from structural content.

## Components

- **Buttons:** 
  - *Primary:* Deep Charcoal background, Ivory text. No border. High-contrast and bold.
  - *Secondary (Consultation):* Bronze background with subtle 8px rounding. This is the "Lead" button.
  - *Ghost:* Taupe 1px border with Charcoal text for low-priority actions.
- **Input Fields:** Bottom-border only (1px Taupe) to mimic high-end stationary, transitioning to a 2px Charcoal border on focus. Labels sit in `label-caps` style above the field.
- **Cards:** Product cards should be "frameless." The image sits on the Sand background, with typography centered underneath. Interaction reveals a Glassmorphic "View Details" overlay.
- **Chips/Filters:** Pills with a Sand background and Charcoal text. On selection, the background flips to Taupe.
- **The "Lead" Drawer:** A specific component for retailer contact. It uses the Glassmorphic overlay style, sliding from the right, ensuring the user never leaves their current inspirational context while booking a consultation.
- **Lists:** Technical specifications should be presented in a clean, 2-column list with 1px Sand horizontal dividers, emphasizing the "Engineering" side of the brand.