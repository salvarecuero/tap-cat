#!/usr/bin/env node
import * as dotenv from "dotenv";
import * as fs from "fs/promises";
import * as path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Constants
const HIGGSFIELD_API_BASE = "https://platform.higgsfield.ai";
const MODEL_ID = "nano-banana-pro"; // May need adjustment based on actual Higgsfield model path
const POLL_INTERVAL_MS = 3000; // 3 seconds
const MAX_POLL_ATTEMPTS = 60; // 3 minutes total (60 * 3s)

// Base style constraints for all boost icons
const BASE_STYLE_PROMPT = `
Muted, cozy 2D cartoon icons that match design-concept-reference.png: clean simple shapes, soft darker-brown outlines (not black), subtle 2–4 tone shading, and a mostly neutral base (cream/tan/beige) with at most one small muted accent color (sage, dusty blue, muted teal, soft pink, lavender-gray) that won't clash with future cat themes. Single centered object on a transparent background, readable at small size, no text, no background scene, no 3D/photorealism, no neon or highly saturated colors.
`.trim();

interface GenerateIconOptions {
  itemId: string;
  imageDescription: string;
  itemDetails?: string;
}

interface HiggsfieldSubmitResponse {
  request_id: string;
  status?: string;
}

interface HiggsfieldStatusResponse {
  status: "queued" | "in_progress" | "completed" | "failed" | "nsfw";
  images?: Array<{
    url: string;
  }>;
  error?: string;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function submitImageGeneration(prompt: string): Promise<string> {
  const keyId = process.env.HIGGSFIELD_NANO_BANANA_PRO_KEY_ID;
  const keySecret = process.env.HIGGSFIELD_NANO_BANANA_PRO_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Missing Higgsfield API credentials. Please set HIGGSFIELD_NANO_BANANA_PRO_KEY_ID and HIGGSFIELD_NANO_BANANA_PRO_KEY_SECRET in .env"
    );
  }

  const url = `${HIGGSFIELD_API_BASE}/${MODEL_ID}`;
  const authHeader = `Key ${keyId}:${keySecret}`;

  console.log(`Submitting image generation request to: ${url}`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      aspect_ratio: "1:1",
      resolution: "1k", // 1K resolution for icons
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to submit image generation: ${response.status} ${response.statusText}\n${errorText}`
    );
  }

  const data: HiggsfieldSubmitResponse = await response.json();

  if (!data.request_id) {
    throw new Error("No request_id in response");
  }

  console.log(`Request submitted. Request ID: ${data.request_id}`);
  return data.request_id;
}

async function pollRequestStatus(requestId: string): Promise<string> {
  const keyId = process.env.HIGGSFIELD_NANO_BANANA_PRO_KEY_ID;
  const keySecret = process.env.HIGGSFIELD_NANO_BANANA_PRO_KEY_SECRET;

  const url = `${HIGGSFIELD_API_BASE}/requests/${requestId}/status`;
  const authHeader = `Key ${keyId}:${keySecret}`;

  for (let attempt = 1; attempt <= MAX_POLL_ATTEMPTS; attempt++) {
    console.log(`Polling status (attempt ${attempt}/${MAX_POLL_ATTEMPTS})...`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to poll status: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const data: HiggsfieldStatusResponse = await response.json();
    console.log(`Status: ${data.status}`);

    if (data.status === "completed") {
      if (!data.images || data.images.length === 0) {
        throw new Error("No images in completed response");
      }
      return data.images[0].url;
    }

    if (data.status === "failed") {
      throw new Error(
        `Image generation failed: ${data.error || "Unknown error"}`
      );
    }

    if (data.status === "nsfw") {
      throw new Error("Image was flagged as NSFW");
    }

    // Still queued or in progress, wait and retry
    await sleep(POLL_INTERVAL_MS);
  }

  throw new Error("Max polling attempts reached. Image generation timed out.");
}

async function downloadImage(url: string, savePath: string): Promise<void> {
  console.log(`Downloading image from: ${url}`);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to download image: ${response.status} ${response.statusText}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Ensure directory exists
  const dir = path.dirname(savePath);
  await fs.mkdir(dir, { recursive: true });

  await fs.writeFile(savePath, buffer);
  console.log(`Image saved to: ${savePath}`);
}

async function generateIcon(options: GenerateIconOptions): Promise<void> {
  const { itemId, imageDescription, itemDetails } = options;

  // Construct full prompt
  let fullPrompt = imageDescription;

  if (itemDetails) {
    fullPrompt = `${imageDescription}\n\nItem details: ${itemDetails}`;
  }

  fullPrompt = `${fullPrompt}\n\nStyle requirements: ${BASE_STYLE_PROMPT}`;

  console.log("\n=== Generating Boost Icon ===");
  console.log(`Item ID: ${itemId}`);
  console.log(`Description: ${imageDescription}`);
  if (itemDetails) {
    console.log(`Details: ${itemDetails}`);
  }
  console.log("\n--- Full Prompt ---");
  console.log(fullPrompt);
  console.log("-------------------\n");

  try {
    // Submit request
    const requestId = await submitImageGeneration(fullPrompt);

    // Poll for completion
    const imageUrl = await pollRequestStatus(requestId);

    // Download and save
    const savePath = path.join(
      process.cwd(),
      "public",
      "icons",
      `${itemId}.png`
    );
    await downloadImage(imageUrl, savePath);

    console.log("\n✓ Icon generation completed successfully!");
  } catch (error) {
    console.error("\n✗ Icon generation failed:");
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

// CLI entry point
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error(
      "Usage: npm run generate-icon <itemId> <imageDescription> [itemDetails]"
    );
    console.error("");
    console.error("Example:");
    console.error(
      '  npm run generate-icon soft_brush "A soft grooming brush with gentle bristles, warm beige and brown tones" "Premium grooming tool for comfortable cat petting"'
    );
    process.exit(1);
  }

  const [itemId, imageDescription, itemDetails] = args;

  await generateIcon({ itemId, imageDescription, itemDetails });
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

// Export for use by other scripts
export { generateIcon };
export type { GenerateIconOptions };
