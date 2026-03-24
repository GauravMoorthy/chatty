# Design System Specification: Atmospheric Ethereality

## 1. Overview & Creative North Star: "The Digital Ether"
The Creative North Star for this design system is **"The Digital Ether."** This system moves away from the rigid, boxed-in layouts of traditional web design and instead embraces a fluid, atmospheric environment where UI elements don't just sit on a page—they float within a pressurized, luminous space.

To achieve a high-end editorial feel, we prioritize **intentional asymmetry** and **tonal depth**. By utilizing large-scale typography and overlapping "liquid glass" containers, we create a sense of motion and premium craft. This is not a "flat" light mode; it is a multi-dimensional workspace where light refracts through surfaces and color bleeds naturally across the canvas.

---

## 2. Colors & Surface Philosophy

### The Luminous Palette
Our color strategy relies on the interplay between the crisp `primary` (#5a45cb) and a vibrant, blurry background ecosystem. 

*   **Primary (#5a45cb):** Used for high-impact calls to action and critical brand moments.
*   **Secondary & Tertiary (#006b5f, #993c50):** These function as sophisticated accents, reflecting the organic blobs (`#62fae3`, `#ff8da1`) peeking through the background.
*   **The Background:** A soft off-white `surface` (#f8f9ff) serves as the "ether." It is never truly flat; it is always influenced by the underlying vibrant gradients.

### The "No-Line" Rule
**Strict Mandate:** Designers are prohibited from using 1px solid borders for sectioning. Boundaries must be defined solely through background color shifts or tonal transitions.
*   **Example:** A `surface-container-low` section sitting directly on a `surface` background creates a natural boundary without the "trapped" feeling of a border.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of frosted glass.
*   **Base:** `surface` (#f8f9ff)
*   **Elevated Section:** `surface-container-low` (#f2f3f9)
*   **Interactive Cards:** `surface-container-lowest` (#ffffff)
*   **Active Overlays:** `surface-container-high` (#e7e8ee)

### The "Glass & Gradient" Rule
For floating elements (modals, dropdowns, navigation bars), use **Glassmorphism**. 
*   **Recipe:** Apply `surface-container-lowest` with 70-80% opacity and a high backdrop-blur (20px - 40px). 
*   **Signature Texture:** Main CTAs should utilize a linear gradient from `primary` (#5a45cb) to `primary_container` (#7360e5) at a 135-degree angle to provide "visual soul."

---

## 3. Typography: Editorial Authority

The hierarchy is built on the contrast between the expressive **Plus Jakarta Sans** and the functional **Manrope**.

*   **Display & Headlines (Plus Jakarta Sans):** These should be bold and commanding. Use `display-lg` (3.5rem) with tight letter-spacing (-0.02em) to create an editorial, high-fashion impact.
*   **Body & Titles (Manrope):** Manrope provides a clean, technical counter-balance. `body-lg` (1rem) should be used for long-form content to ensure readability against the glassmorphic backgrounds.
*   **Labels (Manrope):** Use `label-md` (0.75rem) in all-caps with increased letter-spacing (0.05em) for category tags or small metadata to maintain a premium, architectural feel.

---

## 4. Elevation & Depth: Tonal Layering

### The Layering Principle
Depth is achieved by "stacking" surface tiers. To make a card feel "lifted," place a `surface-container-lowest` (#ffffff) card on top of a `surface-container` (#eceef3) background. This creates a soft, natural lift without the "muddy" look of traditional shadows.

### Ambient Shadows
When an object must float (e.g., a FAB or a modal):
*   **Opacity:** 4% - 8%.
*   **Blur:** 40px to 80px.
*   **Tint:** Use a tinted version of `on-surface` (#191c20). Never use pure black shadows; they break the "ether" illusion.

### The "Ghost Border" Fallback
If accessibility requirements demand a border, use a **Ghost Border**: `outline-variant` (#c9c4d6) at 15% opacity. This provides a "suggestion" of a boundary without interrupting the liquid flow of the UI.

---

## 5. Components: Fluid Primitives

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary_container`), `xl` roundness (3rem), no border. Text: `label-md` bold, `on_primary` (#ffffff).
*   **Secondary:** Glassmorphic fill (`surface-container-lowest` at 60% opacity) with high backdrop blur. 
*   **Interaction:** On hover, increase the `backdrop-blur` and slightly shift the gradient angle.

### Cards & Lists
*   **Rule:** Forbid divider lines. Use `spacing-6` (2rem) or `spacing-8` (2.75rem) to create separation through white space.
*   **Nesting:** Place `surface-container-lowest` items within a `surface-container-low` parent for an "embedded" glass look.

### Input Fields
*   **Style:** Subtle `surface-container-high` (#e7e8ee) background. No bottom line or border.
*   **Roundness:** `md` (1.5rem) for a friendly yet modern feel.
*   **Focus State:** A soft glow using the `primary` color at 10% opacity, rather than a thick outline.

### Floating Navigation (Signature Component)
Instead of a fixed top bar, use a floating dock. 
*   **Style:** Glassmorphic container, `full` roundness (9999px), centered at the bottom or top of the viewport.
*   **Depth:** Apply a 60px ambient shadow to separate it from the content "ether."

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical layouts where text overlaps the edges of glass containers.
*   **Do** let the background "blobs" peek through the UI via backdrop-blur.
*   **Do** use `xl` (3rem) or `full` (9999px) roundness for high-interaction elements.

### Don’t
*   **Don’t** use 1px solid borders (even for tables or lists).
*   **Don’t** use high-contrast drop shadows.
*   **Don’t** use pure #000000 for text. Always use `on-surface` (#191c20) to keep the "ether" feel soft and premium.
*   **Don’t** use "default" spacing. Always use the defined Spacing Scale (e.g., `8.5rem` for major section padding) to ensure intentionality.