#!/usr/bin/env bash
set -euo pipefail

# Converts images in bilder/ to WebP and resized variants.
# Requires: cwebp (libwebp). Install on macOS: `brew install webp`

if ! command -v cwebp >/dev/null 2>&1; then
  echo "Error: cwebp not found. Install libwebp (e.g., brew install webp)." >&2
  exit 1
fi

SRC_DIR="$(cd "$(dirname "$0")/.." && pwd)/bilder"
OUT_DIR="$SRC_DIR/webp"
mkdir -p "$OUT_DIR"

# target widths for responsive srcset
WIDTHS=(400 800 1200 1600)

shopt -s nullglob
for f in "$SRC_DIR"/*.{jpg,jpeg,png,JPG,JPEG,PNG}; do
  base="$(basename "$f")"
  name="${base%.*}"
  for w in "${WIDTHS[@]}"; do
    out="$OUT_DIR/${name}-${w}.webp"
    if [[ ! -f "$out" ]]; then
      echo "Converting $base -> $(basename "$out")"
      cwebp -q 80 -resize "$w" 0 "$f" -o "$out" >/dev/null
    fi
  done
  # also create an original-size webp (quality 82)
  full="$OUT_DIR/${name}.webp"
  if [[ ! -f "$full" ]]; then
    cwebp -q 82 "$f" -o "$full" >/dev/null
  fi
done

echo "Done. WebP files in: $OUT_DIR"
