---
name: add-buyable-item
description: Add a new one-time shop boost (buyable item) consistent with the app’s cat-petting theme and design-concept-reference.png. Produces the boosts.json entry, icon filename/path, accessible imageDescription, and concise icon generation instructions.
---

# Add Buyable Item

## Instructions

1. Preconditions

- This skill is for ONE-TIME purchase boosts only.
- The boost MUST conform to the existing content + validation:
  - Boost schema/types live in: src/game/types.ts and src/game/schema.ts
  - Boost content lives in: src/content/boosts/boosts.json
- If the requested behavior cannot be expressed by an existing boost type, do NOT invent fields silently:
  - Either map it to an existing supported type, or propose a new type and list the required code changes (schema + engine + UI).

2. Theme + style alignment

- Item concept must fit “cozy cat petting” (grooming, comfort, toys, treats, relaxation).
- Visual style must match the UI reference at repo root: design-concept-reference.png
  - Warm palette (beige/orange/browns), soft darker-brown outlines (not black), simple shapes, subtle 2–4 tone shading
  - Icon must work at small size, centered, no background, no text.

3. Define the new item fields (per existing schema)

- Produce: id, title, description, price, icon, type + type-specific params (per src/game/types.ts), and imageDescription.
- description: short, user-facing, includes the numeric effect (e.g. “Clicks give x2 pets.”).
- imageDescription: 1–2 sentences describing ONLY what’s visible in the icon, suitable for accessibility and for generating the icon. Do not format it like a prompt.

4. Choose icon asset name

- Filename must be deterministic and match id:
  - public/icons/<id>.png
  - JSON icon path: /icons/<id>.png
- Return the exact filename to create.

5. Provide “Icon generation instructions”
   Return a short instruction block (bullets) that includes:

- Output: transparent PNG, square (512x512 or 768x768)
- Style constraints: match design-concept-reference.png, warm palette, soft brown outline, subtle shading
- Composition constraints: single centered object, no background, no text, no watermark
- A brief “Avoid” list (photorealistic, 3D, busy background, text)

6. Update boosts.json

- Append the new item object to src/content/boosts/boosts.json.
- Keep JSON valid.
- Ensure id is unique.
- Ensure the fields exactly match the schema in src/game/schema.ts.

7. Output format (must follow)
   Return exactly these sections, in this order:
   A) New item (human spec): title, effect summary, price, why it fits theme
   B) JSON entry: single JSON object to paste into boosts.json
   C) Asset: icon filename + icon path
   D) imageDescription: 1–2 sentences
   E) Icon generation instructions: bullets
   F) Checklist

## Examples

Example A (click multiplier)
A) New item (human spec)

- Title: Soft Brush
- Effect: Clicks give x3 pets.
- Price: 180
- Fit: Brushing is cozy cat-care and matches the core “petting” loop.

B) JSON entry
{
"id": "soft_brush",
"title": "Soft Brush",
"description": "Clicks give x3 pets.",
"type": "clickMultiplier",
"value": 3,
"price": 180,
"icon": "/icons/soft_brush.png",
"imageDescription": "A small cat grooming brush with rounded edges and a warm beige handle, outlined in soft brown. Subtle shading with a tiny pawprint detail, centered on a transparent background."
}

C) Asset

- Filename: public/icons/soft_brush.png
- Path: /icons/soft_brush.png

D) imageDescription
A small cat grooming brush with rounded edges and a warm beige handle, outlined in soft brown. Subtle shading with a tiny pawprint detail, centered on a transparent background.

E) Icon generation instructions

- Transparent PNG (512x512 or 768x768), square.
- Match design-concept-reference.png style: warm beige/brown tones, soft darker-brown outline, clean shapes, subtle 2–4 tone shading.
- Single centered brush icon, no background, no text, no watermark.
- Avoid: photorealism, 3D, busy textures, background scenes, typography.

F) Checklist

- [ ] Add public/icons/soft_brush.png
- [ ] Append the JSON object to src/content/boosts/boosts.json (valid JSON)
- [ ] Confirm the object matches src/game/schema.ts
- [ ] Confirm the boost type is handled by src/game/engine.ts and UI

Example B (auto click)
A) New item (human spec)

- Title: Cozy Scratcher
- Effect: +1 pet every 1 second.
- Price: 220
- Fit: A scratcher is a natural cat item and supports passive petting.

B) JSON entry
{
"id": "cozy_scratcher",
"title": "Cozy Scratcher",
"description": "+1 pet every 1 second.",
"type": "autoClick",
"value": 1,
"intervalMs": 1000,
"price": 220,
"icon": "/icons/cozy_scratcher.png",
"imageDescription": "A simple cardboard cat scratcher pad with rounded corners in warm tan tones and soft brown outlines. Light shading and a small stitched-edge detail, centered on a transparent background."
}

C) Asset

- Filename: public/icons/cozy_scratcher.png
- Path: /icons/cozy_scratcher.png

D) imageDescription
A simple cardboard cat scratcher pad with rounded corners in warm tan tones and soft brown outlines. Light shading and a small stitched-edge detail, centered on a transparent background.

E) Icon generation instructions

- Transparent PNG (512x512 or 768x768), square.
- Match design-concept-reference.png style: warm tan/beige palette, soft brown outline, minimal detail, subtle shading.
- Single centered scratcher pad, no background, no text, no watermark.
- Avoid: photorealism, 3D, busy background, text, logos.

F) Checklist

- [ ] Add public/icons/cozy_scratcher.png
- [ ] Append the JSON object to src/content/boosts/boosts.json (valid JSON)
- [ ] Confirm the object matches src/game/schema.ts
- [ ] Confirm auto click behavior works in src/game/useGame.ts
