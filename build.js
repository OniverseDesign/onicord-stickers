const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const stickersDir = __dirname;
const packsDir = path.join(stickersDir, "packs");

if (!fs.existsSync(packsDir)) {
  fs.mkdirSync(packsDir, { recursive: true });
}

function processPackFile(filePath, targetDir, packId) {
  let packData = null;
  try {
    const rawBuffer = fs.readFileSync(filePath);
    let jsonString = "";
    try {
      jsonString = zlib.gunzipSync(rawBuffer).toString("utf8");
    } catch {
      jsonString = rawBuffer.toString("utf8");
    }
    packData = JSON.parse(jsonString);
  } catch (e) {
    console.error(`[ERROR] Could not parse pack file: ${filePath}`, e.message);
    return null;
  }

  const stickers = Array.isArray(packData.stickers) ? packData.stickers : [];
  const packName = packData.name || packId;
  const author = packData.author || "Oniverse";
  const version = packData.version || "1.0.0";

  // Re-package as gzip .onipkg if needed
  const standardizedPack = {
    formatVersion: 1,
    type: "stickers",
    version,
    name: packName,
    author,
    iconName: packData.iconName || null,
    stickers: packData.stickers || [],
    createdAt: packData.createdAt || new Date().toISOString()
  };

  const targetOnipkgPath = path.join(targetDir, `${packId}.onipkg`);
  const compressedBuffer = zlib.gzipSync(Buffer.from(JSON.stringify(standardizedPack), "utf8"));
  fs.writeFileSync(targetOnipkgPath, compressedBuffer);

  // Clean legacy .opk if exists and different from target
  const legacyOpkPath = path.join(targetDir, `${packId}.opk`);
  if (fs.existsSync(legacyOpkPath) && legacyOpkPath !== targetOnipkgPath) {
    fs.unlinkSync(legacyOpkPath);
  }
  if (filePath.endsWith(".opk") && fs.existsSync(filePath)) {
    try { fs.unlinkSync(filePath); } catch (e) {}
  }

  // Extract icon if icon.png does not exist in targetDir
  const iconPath = path.join(targetDir, "icon.png");
  if (!fs.existsSync(iconPath) && stickers.length > 0) {
    for (const stk of stickers) {
      if (stk.base64 && typeof stk.base64 === "string") {
        const parts = stk.base64.split(",");
        if (parts[1]) {
          const buffer = Buffer.from(parts[1], "base64");
          fs.writeFileSync(iconPath, buffer);
          console.log(` [Auto] Extracted cover icon for pack '${packName}' -> icon.png`);
          break;
        }
      }
    }
  }

  // Create or update pack.json
  const packJsonPath = path.join(targetDir, "pack.json");
  let manifest = {};

  if (!fs.existsSync(packJsonPath)) {
    manifest = {
      id: packId,
      name: packName,
      version,
      author,
      description: `Collection of ${stickers.length} stickers for Onicord.`,
      icon: "icon.png"
    };
    fs.writeFileSync(packJsonPath, JSON.stringify(manifest, null, 2), "utf8");
    console.log(` [Auto] Created metadata file -> pack.json`);
  } else {
    try {
      manifest = JSON.parse(fs.readFileSync(packJsonPath, "utf8"));
    } catch {
      manifest = { name: packName, version, author, description: "" };
    }
  }

  return {
    id: packId,
    name: manifest.name || packName,
    version: manifest.version || version,
    author: manifest.author || author,
    iconName: manifest.iconName || packData.iconName || null,
    description: manifest.description || "",
    icon: `https://raw.githubusercontent.com/OniverseDesign/onicord-stickers/main/packs/${packId}/icon.png`,
    downloadUrl: `https://raw.githubusercontent.com/OniverseDesign/onicord-stickers/main/packs/${packId}/${packId}.onipkg`,
    stickersCount: stickers.length
  };
}

function buildStickersRepo() {
  console.log("Processing sticker packages (.onipkg) and generating index.json catalog...");

  const entries = fs.readdirSync(packsDir, { withFileTypes: true });
  const catalog = [];

  for (const entry of entries) {
    if (entry.isFile() && (entry.name.endsWith(".onipkg") || entry.name.endsWith(".opk"))) {
      const ext = path.extname(entry.name);
      const packId = path.basename(entry.name, ext).toLowerCase().replace(/[^a-z0-9]+/g, "_");
      const targetDir = path.join(packsDir, packId);

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const sourcePath = path.join(packsDir, entry.name);
      const destPath = path.join(targetDir, entry.name);

      if (sourcePath !== destPath) {
        fs.renameSync(sourcePath, destPath);
        console.log(` [Move] Organized '${entry.name}' into folder -> packs/${packId}/`);
      }

      const info = processPackFile(destPath, targetDir, packId);
      if (info) catalog.push(info);
    } else if (entry.isDirectory() && !entry.name.startsWith(".")) {
      const packId = entry.name;
      const targetDir = path.join(packsDir, packId);
      const subFiles = fs.readdirSync(targetDir);
      const packFile = subFiles.find(f => f.endsWith(".onipkg") || f.endsWith(".opk"));

      if (packFile) {
        const packPath = path.join(targetDir, packFile);
        const info = processPackFile(packPath, targetDir, packId);
        if (info) catalog.push(info);
      }
    }
  }

  const indexData = {
    version: "1.0.0",
    updatedAt: new Date().toISOString(),
    packs: catalog
  };

  fs.writeFileSync(path.join(stickersDir, "index.json"), JSON.stringify(indexData, null, 2), "utf8");
  console.log("Catalog index.json updated successfully.");
  console.log("Sticker repo build completed successfully.");
}

buildStickersRepo();
