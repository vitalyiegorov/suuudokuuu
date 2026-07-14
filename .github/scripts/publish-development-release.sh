#!/usr/bin/env bash

set -Eeuo pipefail

fail() {
  printf 'Error: %s\n' "$1" >&2
  exit 1
}

require_environment_variable() {
  local variable_name="$1"
  [[ -n "${!variable_name:-}" ]] || fail "$variable_name is required."
}

verify_directory_entries() {
  local directory="$1"
  shift
  local expected_entries=("$@")
  local actual_entries=()
  local entry_path

  while IFS= read -r -d '' entry_path; do
    actual_entries+=("${entry_path##*/}")
  done < <(find "$directory" -mindepth 1 -maxdepth 1 -print0 | sort -z)

  [[ "${#actual_entries[@]}" -eq "${#expected_entries[@]}" ]] || fail "Unexpected files in $directory."

  local entry_index
  for entry_index in "${!expected_entries[@]}"; do
    [[ "${actual_entries[$entry_index]}" == "${expected_entries[$entry_index]}" ]] || fail "Unexpected files in $directory."
  done
}

[[ "$#" -eq 1 ]] || fail 'Usage: publish-development-release.sh <artifact-directory>'

for variable_name in GITHUB_REPOSITORY GITHUB_RUN_ID GITHUB_RUN_NUMBER GITHUB_SHA GITHUB_REF_NAME GITHUB_SERVER_URL; do
  require_environment_variable "$variable_name"
done

[[ "$GITHUB_RUN_NUMBER" =~ ^[0-9]+$ ]] || fail 'GITHUB_RUN_NUMBER must be numeric.'
[[ "$GITHUB_SHA" =~ ^[a-f0-9]{40}$ ]] || fail 'GITHUB_SHA does not match the development release metadata contract.'
[[ "${#GITHUB_REF_NAME}" -le 255 && "$GITHUB_REF_NAME" =~ ^[A-Za-z0-9][A-Za-z0-9._/-]*$ ]] || fail 'GITHUB_REF_NAME does not match the development release metadata contract.'

artifact_directory="$1"
[[ -d "$artifact_directory" ]] || fail "Artifact directory does not exist: $artifact_directory"
artifact_directory="$(cd "$artifact_directory" && pwd)"

ipa_name='suuudokuuu-development.ipa'
apk_name='suuudokuuu-development.apk'
checksums_name='SHA256SUMS'
verify_directory_entries "$artifact_directory" "$apk_name" "$ipa_name"
[[ -s "$artifact_directory/$ipa_name" ]] || fail "$ipa_name is empty."
[[ -s "$artifact_directory/$apk_name" ]] || fail "$apk_name is empty."

tag_name="development-$GITHUB_RUN_NUMBER"
version="$(jq -r '.version | if type == "string" then . else "" end' packages/app/package.json)"
[[ "$version" =~ ^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)$ ]] || fail 'Application version does not match the development release metadata contract.'
short_sha="${GITHUB_SHA:0:7}"
built_at="$(date -u '+%Y-%m-%dT%H:%M:%SZ')"
jq -en --arg builtAt "$built_at" '$builtAt | fromdateiso8601 | type == "number"' > /dev/null || fail 'UTC build time does not match the development release metadata contract.'
workflow_url="$GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID"
[[ "$workflow_url" =~ ^https://github\.com/vitalyiegorov/suuudokuuu/actions/runs/[1-9][0-9]*$ ]] || fail 'Workflow URL does not match the development release metadata contract.'
metadata="$(jq -cn \
  --arg branch "$GITHUB_REF_NAME" \
  --arg builtAt "$built_at" \
  --arg commitSha "$GITHUB_SHA" \
  --arg version "$version" \
  --arg workflowUrl "$workflow_url" \
  '{branch: $branch, builtAt: $builtAt, commitSha: $commitSha, version: $version, workflowUrl: $workflowUrl}')"
release_title="suuudokuuu development v$version ($short_sha)"
release_notes="$(printf '%s\n\nVersion: %s\nCommit: %s\nBranch: %s\nBuilt at (UTC): %s\nWorkflow: %s' \
  "<!-- suuudokuuu-development-metadata $metadata -->" \
  "$version" \
  "$GITHUB_SHA" \
  "$GITHUB_REF_NAME" \
  "$built_at" \
  "$workflow_url")"

release_pages="$(gh api --paginate --slurp "repos/$GITHUB_REPOSITORY/releases?per_page=100")"
existing_release_count="$(jq -er --arg tag "$tag_name" 'add | map(select(.tag_name == $tag)) | length' <<< "$release_pages")"
[[ "$existing_release_count" -eq 0 ]] || fail "Release already exists for tag $tag_name."

tag_reference_pages="$(gh api --paginate --slurp "repos/$GITHUB_REPOSITORY/git/matching-refs/tags/development-")"
existing_tag_count="$(jq -er --arg reference "refs/tags/$tag_name" 'add | map(select(.ref == $reference)) | length' <<< "$tag_reference_pages")"
[[ "$existing_tag_count" -eq 0 ]] || fail "Git tag already exists: $tag_name."

(
  cd "$artifact_directory"
  shasum -a 256 "$ipa_name" "$apk_name" > "$checksums_name"
)

gh release create "$tag_name" \
  "$artifact_directory/$ipa_name" \
  "$artifact_directory/$apk_name" \
  "$artifact_directory/$checksums_name" \
  --draft \
  --prerelease \
  --target "$GITHUB_SHA" \
  --title "$release_title" \
  --notes "$release_notes"

release_pages="$(gh api --paginate --slurp "repos/$GITHUB_REPOSITORY/releases?per_page=100")"
draft_release="$(jq -cer --arg tag "$tag_name" '
  add
  | map(select(.tag_name == $tag))
  | if length == 1 then .[0] else error("Expected exactly one draft release") end
' <<< "$release_pages")"

jq -e \
  --arg tag "$tag_name" \
  --arg sha "$GITHUB_SHA" \
  --arg ipa "$ipa_name" \
  --arg apk "$apk_name" \
  --arg checksums "$checksums_name" '
    .tag_name == $tag
    and .target_commitish == $sha
    and .draft == true
    and .prerelease == true
    and (.assets | type == "array")
    and ([.assets[].name] | sort) == ([$ipa, $apk, $checksums] | sort)
    and all(.assets[]; (.size | type == "number") and .size > 0)
  ' <<< "$draft_release" > /dev/null || fail 'Draft release validation failed.'

release_id="$(jq -er '.id | select(type == "number")' <<< "$draft_release")"
download_directory="$(mktemp -d)"
trap 'rm -rf "$download_directory"' EXIT

while IFS=$'\t' read -r asset_id asset_name; do
  case "$asset_name" in
    "$ipa_name"|"$apk_name"|"$checksums_name") ;;
    *) fail "Unexpected release asset: $asset_name" ;;
  esac

  gh api \
    -H 'Accept: application/octet-stream' \
    "repos/$GITHUB_REPOSITORY/releases/assets/$asset_id" > "$download_directory/$asset_name"
done < <(jq -r '.assets | sort_by(.name)[] | [.id, .name] | @tsv' <<< "$draft_release")

verify_directory_entries "$download_directory" "$checksums_name" "$apk_name" "$ipa_name"
cmp "$artifact_directory/$checksums_name" "$download_directory/$checksums_name" || fail 'Downloaded checksum manifest does not match the local manifest.'
(
  cd "$download_directory"
  shasum -a 256 -c "$artifact_directory/$checksums_name"
)

gh api \
  --method PATCH \
  -F draft=false \
  "repos/$GITHUB_REPOSITORY/releases/$release_id" > /dev/null
