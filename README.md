<div align="center">

  <h1>Onicord Sticker Packs</h1>

  <p>
    <strong>Official and community sticker pack repository for the Onicord desktop platform.</strong><br/>
    <em>Distribute, publish, and share animated WebP, APNG, and static sticker collections formatted as <code>.onipkg</code> bundles.</em>
  </p>

  <p>
    <a href="https://github.com/OniverseDesign/onicord">
      <img src="https://img.shields.io/badge/App-Onicord-cba6f7?style=for-the-badge&logo=github&logoColor=white" alt="Onicord App" />
    </a>
    <a href="https://github.com/OniverseDesign/onicord-addons">
      <img src="https://img.shields.io/badge/Ecosystem-Addons-89b4fa?style=for-the-badge&logo=github&logoColor=white" alt="Onicord Addons" />
    </a>
    <a href="https://github.com/OniverseDesign/onicord/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/License-GPL%20v3-74c7ec.svg?style=for-the-badge" alt="License: GPL-3.0" />
    </a>
    <img src="https://img.shields.io/badge/Format-.onipkg-a6e3a1?style=for-the-badge" alt="Format: .onipkg" />
  </p>

  <h4>
    <a href="https://github.com/OniverseDesign/onicord">Main Application</a> ·
    <a href="#repository-structure">Repository Structure</a> ·
    <a href="#creating-and-exporting-sticker-packs">Creating Packs</a> ·
    <a href="#distribution-and-publishing-methods">Distribution & Publishing</a> ·
    <a href="index.json">Catalog (index.json)</a>
  </h4>

</div>

---

## Overview

This repository hosts official and community-created sticker collections for **Onicord**. All packs are compressed and distributed using Onicord's standardized package format: **`.onipkg`** (gzip-compressed JSON bundle with embedded asset bitmaps and metadata).

Users can browse and install sticker collections directly from the in-app Store (**Settings > Stickers**) or by importing a `.onipkg` archive.

---

## Repository Structure

- `index.json`: Central catalog registry listing available sticker packs and download URLs.
- `build.js`: Compiler script to organize `.onipkg` files, extract cover previews, and update `index.json`.
- `packs/`: Sticker pack distribution directories containing `.onipkg` packages, metadata, and icons.

---

## Creating and Exporting Sticker Packs

Unlike addons (which require coding and command-line compilation), **sticker packs can be created, edited, and exported directly from inside the Onicord desktop application**:

1. Open **Onicord**.
2. Navigate to **Settings > Stickers**.
3. Create a new sticker group, enter a title, and import your animated WebP, APNG, PNG, or GIF stickers.
4. Click the **Export** button on the sticker pack card to generate a standalone `.onipkg` archive.

Once exported, you have two distribution pathways: **Direct P2P Sharing** (immediate, decentralized, zero approval needed) or **Official In-App Store Catalog Publication** (via GitHub Pull Request).

---

## Distribution and Publishing Methods

### Method 1: Direct P2P Sharing (Zero Approval Needed)

Because Onicord is a decentralized, serverless platform, you do not need permission or approval to share your custom sticker packs:

- **Direct In-Chat Transfer**: Send your `.onipkg` file directly into any Onicord room or channel. Room members will see an interactive sticker pack card and can install the pack into their library with a single click.
- **External Sharing**: Distribute your `.onipkg` file via Discord, Telegram, your personal website, GitHub releases, or file hosting services.
- **Manual Import**: Recipients can install any `.onipkg` bundle at any time by going to **Settings > Stickers > Import .onipkg** or dragging and dropping the file into the Onicord window.

---

### Method 2: Publishing to the Official In-App Store Catalog (Fork & Pull Request)

To make your sticker pack discoverable by all Onicord users worldwide in the in-app sticker store:

Third-party community members do not have direct push access to `OniverseDesign/onicord-stickers`. All submissions must be submitted through GitHub Forks and Pull Requests.

#### Step 1: Fork and Clone the Repository
1. Fork the [OniverseDesign/onicord-stickers](https://github.com/OniverseDesign/onicord-stickers) repository on GitHub.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/<your-username>/onicord-stickers.git
   cd onicord-stickers
   ```

#### Step 2: Add Your Exported `.onipkg`
Place your exported `.onipkg` file directly into the `packs/` directory:
```text
packs/my_awesome_pack.onipkg
```

#### Step 3: Run the Build Script
Execute the catalog compiler:
```bash
node build.js
```
*(or `npm run build` / `npm run pack`)*

The build script will automatically:
- Create the target folder `packs/my_awesome_pack/`.
- Move `my_awesome_pack.onipkg` inside the folder.
- Extract the first sticker image as `icon.png` for store previews.
- Generate a default `pack.json` metadata descriptor.
- Update the central `index.json` catalog.

#### Step 4: Customize Metadata and Tab Icon (Optional)
Inside `packs/<pack_id>/pack.json`, you can customize the pack's presentation:
```json
{
  "id": "my_awesome_pack",
  "name": "My Awesome Pack",
  "version": "1.0.0",
  "author": "CreatorName",
  "iconName": "pets",
  "description": "Collection of custom stickers for Onicord chats.",
  "icon": "icon.png"
}
```

- **`iconName`**: (Optional) Name of a Material Symbols icon (e.g. `"pets"`, `"mood"`, `"face"`, `"favorite"`, `"auto_awesome"`) to display as the tab icon in the chat sticker picker. If omitted or `null`, Onicord displays a miniature thumbnail of the first sticker in the pack.
- **`icon`**: Store preview cover image file (`icon.png`). You can replace `icon.png` with a custom high-resolution cover image.

After modifying `pack.json`, run `node build.js` again to synchronize `index.json`.

#### Step 5: Submit a Pull Request
1. Commit your changes:
   ```bash
   git add .
   git commit -m "Add my_awesome_pack sticker collection"
   git push origin main
   ```
2. Open a Pull Request from your fork against `OniverseDesign/onicord-stickers:main`.

#### Review and Approval Criteria
The Oniverse core team will review your Pull Request before merging:
- **Format Integrity**: Valid `.onipkg` gzip archive containing valid WebP, APNG, PNG, or GIF assets.
- **Content Guidelines**: No explicit, copyrighted without authorization, or harmful media.
- **Metadata**: Clear pack name, author attribution, and valid `pack.json`.

Once approved and merged by a maintainer, your sticker pack is immediately live in the in-app Store for all Onicord users.
