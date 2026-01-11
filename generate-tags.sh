#!/usr/bin/env bash
set -euo pipefail

# =========================================================
# Configuration
# =========================================================

CONTENT_DIRS=("_posts" "_projects")
TAGS_DIR="_tags"
LAYOUT="tag"
ACRONYMS_FILE="_data/acronyms.yml"

DRY_RUN=false
CLEAN_UNUSED=false
DEBUG_ACRONYMS=false

# =========================================================
# Argument parsing
# =========================================================

for arg in "$@"; do
  case "$arg" in
    --dry-run)        DRY_RUN=true ;;
    --clean-unused)  CLEAN_UNUSED=true ;;
    --debug-acronyms) DEBUG_ACRONYMS=true ;;
  esac
done

# =========================================================
# Helpers
# =========================================================

log() {
  echo "$1"
}

slugify() {
  echo "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | sed 's/[[:space:]]\+/-/g' \
    | sed 's/[^a-z0-9-]//g' \
    | sed 's/--\+/-/g' \
    | sed 's/^-//;s/-$//'
}

write_file() {
  local file="$1"
  local content="$2"

  if $DRY_RUN; then
    log "DRY-RUN → would create: $file"
  else
    printf "%s\n" "$content" > "$file"
    log "✏️ created: $file"
  fi
}

# =========================================================
# Load acronyms
# =========================================================

declare -A ACRONYMS=()

if [[ -f "$ACRONYMS_FILE" ]]; then
  while IFS=":" read -r key value; do
    key="$(echo "$key" | xargs | tr '[:upper:]' '[:lower:]')"
    value="$(echo "$value" | xargs)"
    [[ -z "$key" || "$key" =~ ^# ]] && continue
    ACRONYMS["$key"]="$value"
  done < "$ACRONYMS_FILE"
else
  log "⚠️ WARNING: $ACRONYMS_FILE not found — acronyms disabled"
fi

# =========================================================
# Title Case with acronym support
# =========================================================

title_case() {
  local input="${1//[-_]/ }"

  for word in $input; do
    local lower="${word,,}"

    if [[ -n "${ACRONYMS[$lower]:-}" ]]; then
      printf "%s " "${ACRONYMS[$lower]}"
    else
      $DEBUG_ACRONYMS && echo "⛔ Unknown acronym: $lower" >&2
      printf "%s " "${word^}"
    fi
  done | sed 's/ $//'
}

# =========================================================
# Ensure tags directory exists
# =========================================================

if $DRY_RUN; then
  log "DRY-RUN → would ensure directory: $TAGS_DIR/"
else
  mkdir -p "$TAGS_DIR"
fi

# =========================================================
# Collect tags (inline + YAML lists)
# =========================================================

tags=()

for dir in "${CONTENT_DIRS[@]}"; do
  [[ -d "$dir" ]] || continue

  while IFS= read -r file; do
    in_tags=false

    while IFS= read -r line; do
      # Inline tags: tags: [a, b]
      if [[ $line =~ ^[[:space:]]*tags:[[:space:]]*\[(.*)\] ]]; then
        IFS=',' read -ra parts <<< "${BASH_REMATCH[1]}"
        for tag in "${parts[@]}"; do
          tag="$(echo "$tag" | xargs)"
          [[ -n "$tag" ]] && tags+=("$tag")
        done
        in_tags=false
        continue
      fi

      # Start YAML list
      if [[ $line =~ ^[[:space:]]*tags:[[:space:]]*$ ]]; then
        in_tags=true
        continue
      fi

      # YAML list items
      if $in_tags && [[ $line =~ ^[[:space:]]*-[[:space:]]*(.+)$ ]]; then
        tags+=("${BASH_REMATCH[1]}")
        continue
      fi

      # Exit tags block
      $in_tags && [[ $line =~ ^[[:alpha:]_]+: ]] && in_tags=false
    done < "$file"

  done < <(find "$dir" -type f \( -name "*.md" -o -name "*.markdown" \))
done

# =========================================================
# Unique + sort tags
# =========================================================

mapfile -t UNIQUE_TAGS < <(printf "%s\n" "${tags[@]}" | sort -u)

# =========================================================
# Track used slugs
# =========================================================

declare -A USED_SLUGS=()

for tag in "${UNIQUE_TAGS[@]}"; do
  USED_SLUGS["$(slugify "$tag")"]=1
done

# =========================================================
# Generate tag pages
# =========================================================

for tag in "${UNIQUE_TAGS[@]}"; do
  slug="$(slugify "$tag")"
  file="$TAGS_DIR/$slug.md"

  [[ -f "$file" ]] && { log "✔ exists: $file"; continue; }

  write_file "$file" "$(cat <<EOF
---
layout: $LAYOUT
tag: "$tag"
slug: "$slug"
title: "$(title_case "$tag")"
---
EOF
)"
done

# =========================================================
# Cleanup unused tag pages
# =========================================================

if $CLEAN_UNUSED; then
  log ""
  log "🧹 Checking for unused tag pages..."

  unused_count=0
  shopt -s nullglob

  for file in "$TAGS_DIR"/*.md "$TAGS_DIR"/*.markdown; do
    # Extract slug from front-matter
    fm_slug="$(awk '
      /^---$/ { fm++ }
      fm==1 && /^slug:/ {
        sub(/^slug:[[:space:]]*/, "", $0)
        gsub(/["'\'']/, "", $0)
        print $0
        exit
      }
      fm==2 { exit }
    ' "$file")"

    slug="${fm_slug:-$(basename "$file" .md)}"

    [[ -n "${USED_SLUGS[$slug]:-}" ]] && continue

    # Temp Debug
    # log ""
    # log "DEBUG → Used tag slugs:"
    # for s in "${!USED_SLUGS[@]}"; do
    #     log "  - $s"
    # done

    # Front-matter-only protection
    if awk '
      /^---$/ { fm++ }
      fm==2 { exit }
      fm==1 && /^[[:space:]]*protected:[[:space:]]*true/ { found=1 }
      END { exit !found }
    ' "$file"; then
      log "🛡️ protected → skipping: $file"
      continue
    fi

    unused_count=$((unused_count + 1))

    if $DRY_RUN; then
      log "DRY-RUN → would remove unused tag: $file"
    else
      rm "$file"
      log "🔥 removed unused tag: $file"
    fi

  done
    
  shopt -u nullglob

  log ""
  $DRY_RUN \
    && log "🧹 DRY-RUN cleanup: $unused_count unused tag page(s) would be removed" \
    || log "🧹 Cleanup complete: $unused_count unused tag page(s) removed"

fi

# =========================================================
# Summary
# =========================================================

log ""
$DRY_RUN \
  && log "🏁 DRY-RUN complete — no files written" \
  || log "🏁 Done — tag pages generated in '$TAGS_DIR/'"
