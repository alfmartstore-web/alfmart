# Product Image Logic - Quick Reference

## Asset Organization

All product images are located in `/Public/` with the following structure:

```
/Public/
├── heropageimage.jpg                          # Hero page background
├── Genuine Leather Bifold Wallet/
│   ├── glbwblack.png
│   ├── glbwbrown.png
│   ├── glbwgray.png
│   └── glbwlightgray.png
├── Pebbled Leather Long Wallet/
│   ├── pllwblack.png
│   ├── pllwbrown.png
│   └── pllwgray.png
└── Vintage Leather Bifold Wallet/
    ├── vlbwblack.jpg
    ├── vlbwbrown.jpg
    └── VLBWGray.jpg                           # Note: Capital V and G
```

## Product IDs and Paths

| Product | ID | Folder | Prefix | Format | Default Image |
|---------|----|---------|---------|---------|----|
| Genuine Leather Bifold Wallet | 1 | `Genuine Leather Bifold Wallet` | `glbw` | `.png` | `glbwblack.png` |
| Pebbled Leather Long Wallet | 2 | `Pebbled Leather Long Wallet` | `pllw` | `.png` | `pllwblack.png` |
| Vintage Leather Bifold Wallet | 3 | `Vintage Leather Bifold Wallet` | `vlbw` | `.jpg` | `vlbwblack.jpg` |

## Available Colors

- **black** → `#1A1A1A`
- **brown** → `#8B4513`
- **gray** → `#808080`
- **lightgray** → `#D3D3D3` (Genuine Leather Bifold only)

## Image Path Generation

### Automatic Path Construction

When user selects a color, the system automatically constructs the path:

```
/Public/[Product Folder]/[prefix][color].[format]
```

### Examples

**User selects Brown on Genuine Leather Bifold:**
```
/Public/Genuine Leather Bifold Wallet/glbwbrown.png
```

**User selects Gray on Vintage Leather Bifold:**
```
/Public/Vintage Leather Bifold Wallet/VLBWGray.jpg
```
*(Special case: uses custom override "VLBWGray")*

**User selects Light Gray on Genuine Leather Bifold:**
```
/Public/Genuine Leather Bifold Wallet/glbwlightgray.png
```

## Implementation

The image path generation is handled by the `getProductImage()` function:

```javascript
const getProductImage = (product, color) => {
    const config = productImageConfig[product.id];
    const colorName = config.colorOverrides?.[color] || `${config.prefix}${color}`;
    return `/Public/${config.folder}/${colorName}.${config.format}`;
};
```

## Where Images Are Used

1. **Product Pages** (`products.html`)
   - Product grid thumbnails
   - Product modal/detail view
   - Shopping cart items

2. **Home Page** (`index.html`)
   - Product showcase section
   - Shopping cart items

3. **About Page** (`about.html`)
   - Hero section background
   - Story section image

4. **Hero/Landing**
   - `/Public/heropageimage.jpg` - Main hero background image

## Adding a New Color

To add a new color to a product:

1. Create the new image file: `[prefix][colorname].[format]`
2. Place in the product's folder in `/Public/`
3. Add the color to the product's `colors` array in the data
4. If needed, add color hex code to `COLOR_MAP` in config.js
5. Add override if filename doesn't follow pattern: `colorOverrides: { colorname: 'CustomFilename' }`

## File Naming Convention

- All filenames use **lowercase** except for special overrides
- Prefixes are lowercase: `glbw`, `pllw`, `vlbw`
- Color names are lowercase: `black`, `brown`, `gray`, `lightgray`
- Special case: Vintage Leather Bifold gray → `VLBWGray.jpg` (capitalized V and G)

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Images not loading | Check file exists in correct folder, verify filename capitalization |
| Wrong image displays | Verify product ID matches config, check color name in colors array |
| Color option missing | Add color to product's colors array and create image file |
| Image won't update on selection | Clear browser cache, check console for errors |

## Performance Features

- **Caching:** Image paths cached in browser to avoid repeated calculations
- **Preloading:** Images preload when color is selected
- **Lazy Loading:** Below-the-fold images use lazy loading
- **Critical Loading:** Hero images marked for high priority loading
- **Image Optimization:** Shimmer loading animation while loading
