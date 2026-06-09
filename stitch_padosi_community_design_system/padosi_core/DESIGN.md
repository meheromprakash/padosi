---
name: Padosi Core
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#404943'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#707973'
  outline-variant: '#bfc9c1'
  surface-tint: '#2c694e'
  primary: '#0f5238'
  on-primary: '#ffffff'
  primary-container: '#2d6a4f'
  on-primary-container: '#a8e7c5'
  inverse-primary: '#95d4b3'
  secondary: '#006c48'
  on-secondary: '#ffffff'
  secondary-container: '#92f7c3'
  on-secondary-container: '#00734d'
  tertiary: '#713900'
  on-tertiary: '#ffffff'
  tertiary-container: '#8f4f14'
  on-tertiary-container: '#ffd1b1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b1f0ce'
  primary-fixed-dim: '#95d4b3'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#0e5138'
  secondary-fixed: '#92f7c3'
  secondary-fixed-dim: '#75daa8'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005235'
  tertiary-fixed: '#ffdcc4'
  tertiary-fixed-dim: '#ffb780'
  on-tertiary-fixed: '#2f1400'
  on-tertiary-fixed-variant: '#6f3800'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  margin-mobile: 20px
  margin-desktop: 48px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
  stack-xl: 40px
---

## Brand & Style

The design system is rooted in the concept of modern neighborliness—balancing the organic warmth of a community garden with the precision of a high-end service. It targets Indian urban and semi-urban residents who value trust, safety, and local connection. 

The aesthetic is **Corporate Modern with a Soft Humanist edge**. It avoids the clutter often found in social apps, opting for a premium, structured layout that feels reliable and calm. The visual narrative leverages generous whitespace and soft-touch surfaces to evoke a sense of security and growth, making digital neighborhood interactions feel as natural as a conversation over a garden fence.

## Colors

The palette is anchored by "Trust Greens," chosen to resonate with growth and community harmony. 

- **Primary Green (#2D6A4F)** is used for high-emphasis actions, headers, and brand-critical elements to establish authority and reliability.
- **Secondary Green (#52B788)** acts as a supportive accent for success states, active indicators, and secondary calls to action.
- **Surface Tiers**: We utilize a pure white background for maximum clarity, while **Surface Light** and **Input Background** provide subtle tonal shifts to group content without the need for heavy borders.
- **Functional Accents**: Warm oranges and yellows are used sparingly for neighborhood alerts and community notices, ensuring they feel urgent but not alarming.

## Typography

This design system utilizes **Inter** for its exceptional legibility and systematic, professional feel. The typographic scale is designed to handle dense information—like community notice boards—while maintaining a premium "app" feel rather than a "website" feel.

Headlines use a bold weight with slightly tightened letter spacing to create a strong visual anchor. Body text is set with generous line heights to ensure long-form neighborhood stories or rules remain readable on mobile screens. Labels utilize medium weights to provide clear affordance for interactive metadata.

## Layout & Spacing

The layout follows a **fluid-to-fixed** model. On mobile, we use a 4-column grid with 20px side margins to provide "breathing room" that feels premium. On desktop, the system centers content within a max-width container of 1200px using a 12-column grid.

Spacing follows a strict 4px base unit. We prioritize "Vertical Rhythm" to separate different community posts. Large 40px (stack-xl) gaps are used to separate major sections (e.g., "Trending Nearby" vs. "Local Services"), while tighter 8px (stack-sm) gaps are used for internal card elements like user avatars and timestamps.

## Elevation & Depth

To maintain a "Human-Centered" feel, the design system avoids harsh shadows. Depth is primarily achieved through **Tonal Layering** and **Soft Ambient Shadows**.

- **Level 0 (Flat)**: Used for the main background and input fields.
- **Level 1 (Raised)**: Used for standard feed cards. It uses a subtle shadow: `0px 4px 12px rgba(31, 41, 55, 0.05)`.
- **Level 2 (Overlay)**: Used for floating action buttons (FABs) and modals. The shadow is more diffused: `0px 8px 24px rgba(31, 41, 55, 0.12)`.

Interactive elements should appear to lift slightly on hover (on desktop) or maintain a steady, soft presence on mobile to suggest "touchability."

## Shapes

The shape language is defined by **large, friendly radii**. This removes the "sharpness" often associated with cold enterprise software, making the app feel approachable and safe.

- **Standard Elements**: Buttons and small cards use 0.5rem (8px).
- **Large Containers**: Feed cards and bottom sheets use **rounded-lg** (16px) or **rounded-xl** (24px) to create a soft, "pillowed" look.
- **Avatars**: Always circular to emphasize the individual and the human element of the neighborhood.

## Components

### Buttons
Primary buttons use the **Primary Green (#2D6A4F)** with white text and 24px (rounded-xl) corners for a "pill" appearance. Secondary buttons use a subtle tint of the primary color with green text.

### Cards
Cards are the backbone of the community feed. They should feature 16px padding, a Level 1 shadow, and 20px corner radius. Content inside should be grouped using the `stack-md` spacing.

### Input Fields
Inputs use the **Input Background (#F3F5F4)** with no border in their default state, gaining a 1.5px Primary Green border on focus. This creates a clean, "filled" look that is easier on the eyes than outlined boxes.

### Chips & Tags
Used for neighborhood categories (e.g., "Safety," "Events," "Recommendations"). These should have 100px radius (pill-shaped) and use the Secondary Green or Surface Light colors depending on their active state.

### Bottom Sheets
For mobile-first community actions (like posting a notice), use bottom sheets with 24px top-corner radii and a visible "grabber" handle to reinforce the tactile nature of the UI.