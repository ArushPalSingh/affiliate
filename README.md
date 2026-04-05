# DeliveryZone — Affiliate Product Site

A bold, modern affiliate product showcase website. Curate and display products with affiliate links, category filtering, search, star ratings, and a featured product section.

## Features

- 🔍 **Live Search** — filter products by name, category or description
- 🏷️ **Category Tags** — one-click filtering by product category
- ⭐ **Product Ratings** — star ratings displayed on every card
- 💰 **Discount Badges** — auto-calculated from original vs current price
- 🌟 **Featured Product** — highlight your top pick in a dedicated strip
- ➕ **Add Products** — floating button opens an admin form to add new products
- 💾 **Persistent Storage** — products saved in localStorage across sessions
- 📱 **Responsive** — works on mobile, tablet and desktop

## Usage

### Running Locally
Just open `index.html` in your browser — no build step required.

### Adding Products
Click the **+** button (bottom right) to add a product:
- Product Name, Category, Price, and Affiliate Link are required
- Add an image URL and original price for best results
- Check "Mark as Featured" to showcase it in the Featured section

### Updating Sample Products
Edit the `SAMPLE_PRODUCTS` array in `app.js` to change the default products loaded on first visit.

## Tech Stack

- Pure HTML, CSS, JavaScript — zero dependencies
- Google Fonts: Syne (headings) + DM Sans (body)
- localStorage for client-side persistence

## Deployment

Deploy to GitHub Pages:
1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)`
4. Your site will be live at `https://ArushPalSingh.github.io/affiliate-site`

## Affiliate Disclosure

This site contains affiliate links. The owner may earn a commission when visitors purchase through these links, at no extra cost to the buyer.

---

© 2025 DeliveryZone
