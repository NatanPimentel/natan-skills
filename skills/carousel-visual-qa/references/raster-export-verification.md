# Raster Export Verification

## Why this check exists

Playwright separates the CSS viewport from the physical screenshot raster. A page designed at `1080×1350` with `deviceScaleFactor: 2` can export a `2160×2700` JPEG. It may look correct in preview while violating the platform delivery specification.

## Required check after render

Run this against every changed file, including selective re-renders:

```bash
python3 - <<'PY'
from PIL import Image
from pathlib import Path

paths = [Path('slide-04.jpg'), Path('slide-07.jpg')]
for path in paths:
    with Image.open(path) as image:
        assert image.size == (1080, 1350), (path, image.size)
        assert image.format == 'JPEG', (path, image.format)
print('raster=1080x1350 format=JPEG')
PY
```

Adapt `paths` to the selected slides. Do this **before** full-resolution visual QA and media delivery.

## Corrective rule

- For final {{BRAND}} feed files, prefer `deviceScaleFactor: 1` in the renderer.
- If a high-DPI capture is deliberate, explicitly resize or export a second physical `1080×1350` final asset before delivery.
- Never describe an image as `1080×1350` based on CSS layout alone.
