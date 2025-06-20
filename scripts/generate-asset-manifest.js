#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * Transforms Vite's manifest.json to asset-manifest.json format required by Omega Hub
 * Expected output format: { "main.js": "main.bundle.a1b2c3d4.js", "main.css": "style.e5f6g7h8.css" }
 */
function generateAssetManifest() {
  const manifestPath = path.join(process.cwd(), "dist", "manifest.json");
  const assetManifestPath = path.join(
    process.cwd(),
    "dist",
    "asset-manifest.json",
  );

  try {
    // Read Vite's generated manifest
    const viteManifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

    // Transform to required format
    const assetManifest = {};

    // Find main entry and its CSS
    if (viteManifest["index.html"]) {
      const entry = viteManifest["index.html"];

      // Main JS file
      if (entry.file) {
        assetManifest["main.js"] = entry.file;
      }

      // Main CSS file
      if (entry.css && entry.css.length > 0) {
        assetManifest["main.css"] = entry.css[0];
      }
    }

    // Write asset-manifest.json
    fs.writeFileSync(assetManifestPath, JSON.stringify(assetManifest, null, 2));

    console.log("✅ Generated asset-manifest.json:", assetManifest);
  } catch (error) {
    console.error("❌ Failed to generate asset-manifest.json:", error.message);
    process.exit(1);
  }
}

generateAssetManifest();
