# Photos for the public site

The site has six places for real photos. Until a photo is added, its place stays empty and the page
looks complete without it. Phone photos are fine.

| # | Where it appears | What to photograph | Shape |
|---|---|---|---|
| 1 | Home page, wide band | Your packing room at work: staff packing orders, with the order board visible on a screen if you can | Landscape, wide |
| 2 | About page, wide band | Your team, or a client's team using the system (only with their permission) | Landscape, wide |
| 3 | Systems: Order Management | A packing station with orders and a screen showing the board | Landscape, 4:3 |
| 4 | Systems: Delivery Tracking | Parcels with courier labels, or a courier collecting boxes | Landscape, 4:3 |
| 5 | Systems: SMS Automation | A phone in someone's hand showing a delivery text | Landscape, 4:3 |
| 6 | Systems: Inventory and Production | The production floor, batch sheets or ingredient shelves | Landscape, 4:3 |

## Tips

- **Landscape (sideways), natural light.** Stand near a window and wipe the lens.
- **Tidy the frame.** Clear loose papers, and keep a plain background.
- **No private details.** Hide or cover customer names, phone numbers and addresses on screens, labels and papers.
- **People and other businesses.** Only photograph staff who agree, and only use a client's premises or screens
  (for example Audrey Care) with their written OK.
- **At least 1600 pixels wide.** Any recent phone does this at normal quality. Don't use messaging apps to
  send the originals, because they shrink the pictures.

## Adding a photo

1. Send the photo in the chat and say which number it is, or save it in `public/photos/`.
2. Resize it to about 1600 pixels wide and under about 300 KB (JPEG or WebP).
3. Add an entry in `lib/sitePhotos.ts` with a short description of what's in the picture (the `alt` text) and, optionally, a caption.
