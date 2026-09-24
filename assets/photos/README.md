# Original photographs

Drop the client's original photos here. The file name picks the slot it fills. Any of .jpg, .jpeg, .png, .webp or .tif works.

| File name (any extension) | Slot |
| --- | --- |
| `dr-himani-kundoo-portrait` | Home hero (portrait ~4:5, face in the upper third) |
| `dr-himani-kundoo-consultation` | Home "Meet Dr. Kundoo" |
| `dr-himani-kundoo-about` | About page |
| `high-risk-pregnancy` | Service page image (the home feature uses the ultrasound visual) |
| `clinic-miracles`, `clinic-medsarc` | Clinic cards (16:9) |
| `category-pregnancy`, `category-fertility`, `category-gynecology`, `category-wellness` | Category pages |
| `service-<slug>` | Service pages, e.g. `service-fetal-medicine` |

`npm run build` or `npm run dev` generates responsive AVIF and WebP files automatically. Use the largest originals you have; the pipeline never upscales.
