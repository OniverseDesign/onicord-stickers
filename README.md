# Official Onicord Sticker Packs Repository

Official and community sticker packs registry for **Onicord**.

## Repository Structure

- `index.json`: Central sticker pack catalog registry.
- `build.js`: Compiler script to organize `.opk` files, extract cover icons, and generate `index.json`.
- `packs/`: Sticker pack distribution directories containing `.opk` files, metadata, and icons.

## How to Publish a New Sticker Pack

### Method 1: Automatic Export from Onicord (Recommended)

1. Create and organize your sticker pack inside the **Onicord** desktop app.
2. Export your pack to a `.opk` file using the **Export** button in Onicord settings.
3. Place your `.opk` file directly into the `packs/` directory:
   ```text
   packs/my_awesome_pack.opk
   ```
4. Run the build script:
   ```bash
   node build.js
   ```
   *(or `npm run build` / `npm run pack`)*

5. The build script will automatically:
   - Create `packs/my_awesome_pack/` folder.
   - Move `my_awesome_pack.opk` inside the folder.
   - Extract the first sticker image as `icon.png` for store previews.
   - Create a default `pack.json` metadata file.
   - Update `index.json` catalog.

---

### Method 2: Manual Metadata Customization

Inside `packs/<pack_id>/`:

1. Edit `pack.json` to customize details:
   ```json
   {
     "id": "my_awesome_pack",
     "name": "My Awesome Pack",
     "version": "1.0.0",
     "author": "CreatorName",
     "description": "Collection of custom stickers for Onicord chats.",
     "icon": "icon.png"
   }
   ```

2. Optional: Replace `icon.png` with a custom cover image.

3. Run `node build.js` to update the catalog.

4. Submit a Pull Request or push your changes to GitHub.
