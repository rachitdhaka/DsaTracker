# Design System Specification: The Architectural Flow

## 1. Overview & Creative North Star
**The Creative North Star: "The Intellectual Sanctuary"**

This design system transcends the typical "utility" feel of a progress tracker to create a high-end, editorial experience for software engineers. Instead of a rigid grid of data, the system treats Data Structures and Algorithms (DSA) as a curated journey. 

We depart from standard Material Design 3 by embracing **Soft Minimalism**. We replace traditional structural rigidity with intentional asymmetry, expansive breathing room, and a layering logic that feels like physical sheets of frosted glass and premium paper. The goal is to reduce cognitive load and provide a sense of calm "flow" through the complex landscape of technical preparation.

---

## 2. Colors: Tonal Depth vs. Structural Lines
This system follows a strict **"No-Line" Rule**. Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through background color shifts or subtle tonal transitions.

### Core Palette
- **Primary (`#004ac6`)**: The "Action Anchor." Used for high-impact CTAs and progress indicators.
- **Primary Container (`#2563eb`)**: A vibrant indigo used for hero states and active navigation highlights.
- **Surface & Backgrounds**: Utilizing the `slate` spectrum to create a sense of deep, focused space.

### The "Glass & Gradient" Rule
To move beyond a flat "template" look, main CTAs and progress visualizations should utilize a subtle linear gradient from `primary` to `primary_container`. For floating panels (modals or floating navigation), use **Glassmorphism**:
- **Background:** `surface_container_low` at 80% opacity.
- **Effect:** `backdrop-blur: 12px`.

### Surface Hierarchy & Nesting
Depth is achieved through the nesting of surface tokens rather than shadows alone:
1.  **Base Layer:** `surface` (The canvas).
2.  **Section Layer:** `surface_container_low` (Subtle grouping).
3.  **Content Card:** `surface_container_lowest` (Pure white/lightest slate to pop against the background).
4.  **Interactive Layer:** `surface_container_high` (Elevated states).

---

## 3. Typography: The Editorial Scale
We use **Inter** for its mathematical precision and high legibility at small sizes. The hierarchy is intentionally dramatic to create an editorial feel.

- **Display (Large/Medium):** Reserved for "Hero" stats (e.g., total problems solved). Use `-0.02em` letter spacing to feel premium and "tight."
- **Headline (Small/Medium):** Used for category titles. These should feel authoritative and provide clear entry points into sections.
- **Body (Large/Medium):** Primary reading font. We prioritize line height (1.6) to ensure long problem descriptions remain readable during deep focus.
- **Label (Medium/Small):** Used for metadata (Time Complexity, Space Complexity). Often paired with `surface_variant` color to diminish visual noise.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are too "heavy" for this system. We convey hierarchy through **Tonal Layering** and **Ambient Light**.

### The Layering Principle
Stacking tiers is the primary method of separation. Place a `surface_container_lowest` card on a `surface_container_low` section. This creates a soft, natural lift that mimics fine stationery.

### Ambient Shadows
When a card must "float" (e.g., a hovered problem item):
- **Shadow:** 0px 12px 32px rgba(on_surface, 0.04). 
- **Color:** The shadow must be a tinted version of the `on_surface` color, never a generic dark grey.

### The "Ghost Border" Fallback
If accessibility requires a container boundary, use the **Ghost Border**: `outline_variant` at **15% opacity**. 100% opaque borders are strictly forbidden.

---

## 5. Components: Fluid Primitives

### Buttons: The Pill & The Surface
- **Primary:** `rounded-full` (pill shape). Uses a subtle gradient.
- **Secondary:** No background, uses `primary` text and a `surface_container` hover state.
- **Tertiary:** Subtle `surface_variant` background, appearing only on hover to maintain a clean interface.

### Cards & Lists: The Negative Space Rule
Forbid the use of divider lines. Separate list items using `1.5rem` to `2rem` of vertical white space or by alternating background tones (`surface` to `surface_container_low`).

### Progress Chips (Status Colors)
- **Easy:** `on_surface` text with a `green-50` background (Light Mode) or `green-900/30` (Dark Mode).
- **Medium:** `amber-500` accents.
- **Hard:** `rose-500` accents.
*Note: Status chips should use `rounded-lg` (0.5rem) to differentiate them from the `rounded-full` action buttons.*

### The "Problem Tracker" Specialized Components
- **The Difficulty Matrix:** A three-dimensional toggle using `surface_container_highest` for the active state, rather than a standard radio button.
- **Confidence Slider:** A custom track using `primary_fixed` with a high-contrast `primary` thumb to track how well a user understands a solution.

---

## 6. Do’s and Don’ts

### Do
- **Do** use asymmetrical padding (e.g., more padding at the top of a card than the bottom) to create a modern, rhythmic flow.
- **Do** use `primary_container` for progress bars to ensure the "Vibrant Indigo" identity is the focal point of the user's success.
- **Do** utilize `backdrop-blur` on top navigation bars to allow content to peek through during scrolling.

### Don't
- **Don't** use 1px borders to separate content.
- **Don't** use pure black (#000) for shadows or text; always use the `slate` tinted `on_surface` tokens.
- **Don't** use `rounded-none`. Everything must feel tactile and approachable with a minimum radius of `0.5rem` (sm) up to `3rem` (xl).
- **Don't** crowd the interface. If a screen feels "busy," increase the `surface` background spacing rather than adding lines or boxes.