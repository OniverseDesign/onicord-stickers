const fs = require("fs");
const path = require("path");

const stickersDir = __dirname;
const packsDir = path.join(stickersDir, "packs");

if (!fs.existsSync(packsDir)) {
  fs.mkdirSync(packsDir, { recursive: true });
}

function processOpkFile(opkPath, targetDir, packId) {
  let opkData = null;
  try {
    const raw = fs.readFileSync(opkPath, "utf8");
    opkData = JSON.parse(raw);
  } catch (e) {
    console.error(`[ERROR] Could not parse .opk file: ${opkPath}`, e.message);
    return null;
  }

  const stickers = Array.isArray(opkData.stickers) ? opkData.stickers : [];
  const packName = opkData.name || packId;
  const author = opkData.author || "Oniverse";
  const version = opkData.version || "1.0.0";

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

  // Create pack.json if it does not exist
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

  const opkFileName = path.basename(opkPath);

  return {
    id: packId,
    name: manifest.name || packName,
    version: manifest.version || version,
    author: manifest.author || author,
    description: manifest.description || "",
    icon: `https://raw.githubusercontent.com/OniverseDesign/onicord-stickers/main/packs/${packId}/icon.png`,
    downloadUrl: `https://raw.githubusercontent.com/OniverseDesign/onicord-stickers/main/packs/${packId}/${opkFileName}`,
    stickersCount: stickers.length
  };
}

function buildStickersRepo() {
  console.log("Processing sticker packages (.opk) and generating index.json catalog...");

  const entries = fs.readdirSync(packsDir, { withFileTypes: true });
  const catalog = [];

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".opk")) {
      const packId = path.basename(entry.name, ".opk").toLowerCase().replace(/[^a-z0-9]+/g, "_");
      const targetDir = path.join(packsDir, packId);

      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const sourceOpkPath = path.join(packsDir, entry.name);
      const destOpkPath = path.join(targetDir, entry.name);

      if (sourceOpkPath !== destOpkPath) {
        fs.renameSync(sourceOpkPath, destOpkPath);
        console.log(` [Move] Organized '${entry.name}' into folder -> packs/${packId}/`);
      }

      const info = processOpkFile(destOpkPath, targetDir, packId);
      if (info) catalog.push(info);
    } else if (entry.isDirectory() && !entry.name.startsWith(".")) {
      const packId = entry.name;
      const targetDir = path.join(packsDir, packId);
      const subFiles = fs.readdirSync(targetDir);
      const opkFile = subFiles.find(f => f.endsWith(".opk"));

      if (opkFile) {
        const opkPath = path.join(targetDir, opkFile);
        const info = processOpkFile(opkPath, targetDir, packId);
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
