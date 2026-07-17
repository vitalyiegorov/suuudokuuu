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

created_draft_release_id=''
download_directory=''

cleanup() {
  local exit_status="$1"

  if [[ -n "$download_directory" ]]; then
    rm -rf "$download_directory"
  fi
  if [[ "$exit_status" -ne 0 && -n "$created_draft_release_id" ]]; then
    local cleanup_release
    if cleanup_release="$(gh api "repos/$GITHUB_REPOSITORY/releases/$created_draft_release_id" 2> /dev/null)" &&
      jq -e \
        --arg body "$release_notes" \
        --arg name "$release_title" \
        --arg sha "$GITHUB_SHA" \
        --arg tag "$tag_name" \
        --argjson id "$created_draft_release_id" '
          .id == $id
          and .tag_name == $tag
          and .target_commitish == $sha
          and .name == $name
          and .body == $body
          and .draft == true
          and .prerelease == true
        ' <<< "$cleanup_release" > /dev/null; then
      gh api --method DELETE "repos/$GITHUB_REPOSITORY/releases/$created_draft_release_id" > /dev/null ||
        printf 'Warning: failed to clean up draft release %s.\n' "$created_draft_release_id" >&2
    else
      printf 'Warning: draft release %s was not safe to clean up.\n' "$created_draft_release_id" >&2
    fi
  fi
}

trap 'exit_status=$?; trap - EXIT; cleanup "$exit_status"; exit "$exit_status"' EXIT

[[ "$#" -eq 1 ]] || fail 'Usage: publish-development-release.sh <artifact-directory>'

for variable_name in GITHUB_REPOSITORY GITHUB_RUN_ID GITHUB_RUN_NUMBER GITHUB_SHA GITHUB_REF_NAME GITHUB_SERVER_URL; do
  require_environment_variable "$variable_name"
done

[[ "$GITHUB_RUN_NUMBER" =~ ^[1-9][0-9]{0,3}$ ]] || fail 'GITHUB_RUN_NUMBER must be between 1 and 9999.'
[[ "$GITHUB_SHA" =~ ^[a-f0-9]{40}$ ]] || fail 'GITHUB_SHA does not match the development release metadata contract.'
[[ "${#GITHUB_REF_NAME}" -le 255 && "$GITHUB_REF_NAME" =~ ^[A-Za-z0-9][A-Za-z0-9._/-]*$ ]] || fail 'GITHUB_REF_NAME does not match the development release metadata contract.'

artifact_directory="$1"
[[ -d "$artifact_directory" ]] || fail "Artifact directory does not exist: $artifact_directory"
artifact_directory="$(cd "$artifact_directory" && pwd)"

ipa_name='suuudokuuu-development.ipa'
apk_name='suuudokuuu-development.apk'
identity_name='suuudokuuu-development.identity.json'
checksums_name='SHA256SUMS'
verify_directory_entries "$artifact_directory" "$apk_name" "$identity_name" "$ipa_name"
[[ -s "$artifact_directory/$ipa_name" ]] || fail "$ipa_name is empty."
[[ -s "$artifact_directory/$apk_name" ]] || fail "$apk_name is empty."
[[ -s "$artifact_directory/$identity_name" ]] || fail "$identity_name is empty."

identity="$(jq -cse '
  if length == 1
    and (.[0] | type == "object")
    and ((.[0] | keys) == ["bundleVersion", "ipaSha256", "runNumber"])
    and (.[0].bundleVersion | type == "string")
    and (.[0].ipaSha256 | type == "string")
    and (.[0].runNumber | type == "string")
  then .[0]
  else error("Invalid iOS build identity")
  end
' "$artifact_directory/$identity_name")" || fail 'iOS build identity does not match the required shape.'
bundle_version="$(jq -er '.bundleVersion' <<< "$identity")"
identity_ipa_sha256="$(jq -er '.ipaSha256' <<< "$identity")"
identity_run_number="$(jq -er '.runNumber' <<< "$identity")"
[[ "$bundle_version" =~ ^[1-9][0-9]{0,3}\.[1-9][0-9]?$ ]] || fail 'Verified bundle version must contain a 1-9999 run number and a 1-99 run attempt.'
[[ "$identity_run_number" =~ ^[1-9][0-9]{0,3}$ ]] || fail 'Verified iOS run number must be between 1 and 9999.'
[[ "${bundle_version%%.*}" == "$identity_run_number" && "$identity_run_number" == "$GITHUB_RUN_NUMBER" ]] || fail 'Verified iOS build identity does not match the release run number.'
[[ "$identity_ipa_sha256" =~ ^[a-f0-9]{64}$ ]] || fail 'Verified IPA SHA-256 is invalid.'
actual_ipa_sha256="$(shasum -a 256 "$artifact_directory/$ipa_name" | awk '{print $1}')"
[[ "$actual_ipa_sha256" == "$identity_ipa_sha256" ]] || fail 'IPA SHA-256 does not match the verified iOS build identity.'

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
  --arg bundleVersion "$bundle_version" \
  --arg builtAt "$built_at" \
  --arg commitSha "$GITHUB_SHA" \
  --arg version "$version" \
  --arg workflowUrl "$workflow_url" \
  '{branch: $branch, bundleVersion: $bundleVersion, builtAt: $builtAt, commitSha: $commitSha, version: $version, workflowUrl: $workflowUrl}')"
release_title="suuudokuuu development v$version ($short_sha)"
release_notes="$(printf '%s\n\nVersion: %s\nBuild version: %s\nCommit: %s\nBranch: %s\nBuilt at (UTC): %s\nWorkflow: %s' \
  "<!-- suuudokuuu-development-metadata $metadata -->" \
  "$version" \
  "$bundle_version" \
  "$GITHUB_SHA" \
  "$GITHUB_REF_NAME" \
  "$built_at" \
  "$workflow_url")"

release_pages="$(gh api --paginate --slurp "repos/$GITHUB_REPOSITORY/releases?per_page=100")"
matching_releases="$(jq -cer --arg tag "$tag_name" 'add | map(select(.tag_name == $tag))' <<< "$release_pages")"
existing_release_count="$(jq -er 'length' <<< "$matching_releases")"
[[ "$existing_release_count" -le 1 ]] || fail "Multiple releases exist for tag $tag_name."

reconciled_draft_release_id=''
if [[ "$existing_release_count" -eq 1 ]]; then
  existing_release="$(jq -cer '.[0]' <<< "$matching_releases")"
  jq -e \
    --arg bundle_version "$bundle_version" \
    --arg sha "$GITHUB_SHA" \
    --arg workflow_url "$workflow_url" '
      .draft == true
      and .prerelease == true
      and .target_commitish == $sha
      and (.id | type == "number")
      and (.body | type == "string")
      and (
        (.body | capture("^<!-- suuudokuuu-development-metadata (?<json>[^\\n]+) -->").json | fromjson) as $metadata
        | $metadata.bundleVersion == $bundle_version
          and $metadata.commitSha == $sha
          and $metadata.workflowUrl == $workflow_url
      )
    ' <<< "$existing_release" > /dev/null || fail "Existing release for $tag_name does not match this workflow run and commit."
  reconciled_draft_release_id="$(jq -er '.id' <<< "$existing_release")"
fi

tag_reference_pages="$(gh api --paginate --slurp "repos/$GITHUB_REPOSITORY/git/matching-refs/tags/development-")"
matching_tag_references="$(jq -cer --arg reference "refs/tags/$tag_name" 'add | map(select(.ref == $reference))' <<< "$tag_reference_pages")"
existing_tag_count="$(jq -er 'length' <<< "$matching_tag_references")"
[[ "$existing_tag_count" -le 1 ]] || fail "Multiple Git tags exist for $tag_name."
if [[ "$existing_tag_count" -eq 1 ]]; then
  [[ -n "$reconciled_draft_release_id" ]] || fail "Git tag already exists without a matching draft release: $tag_name."
  jq -e --arg sha "$GITHUB_SHA" '.[0].object.type == "commit" and .[0].object.sha == $sha' <<< "$matching_tag_references" > /dev/null ||
    fail "Git tag for $tag_name does not match this workflow commit."
fi

if [[ -n "$reconciled_draft_release_id" ]]; then
  if [[ "$existing_tag_count" -eq 1 ]]; then
    gh api --method DELETE "repos/$GITHUB_REPOSITORY/git/refs/tags/$tag_name" > /dev/null
  fi
  gh api --method DELETE "repos/$GITHUB_REPOSITORY/releases/$reconciled_draft_release_id" > /dev/null
fi

(
  cd "$artifact_directory"
  shasum -a 256 "$ipa_name" "$apk_name" > "$checksums_name"
)

created_release="$(gh api \
  --method POST \
  -f tag_name="$tag_name" \
  -f target_commitish="$GITHUB_SHA" \
  -f name="$release_title" \
  -f body="$release_notes" \
  -F draft=true \
  -F prerelease=true \
  "repos/$GITHUB_REPOSITORY/releases")"
jq -e \
  --arg body "$release_notes" \
  --arg name "$release_title" \
  --arg sha "$GITHUB_SHA" \
  --arg tag "$tag_name" '
    (.id | type == "number")
    and .tag_name == $tag
    and .target_commitish == $sha
    and .name == $name
    and .body == $body
    and .draft == true
    and .prerelease == true
  ' <<< "$created_release" > /dev/null || fail 'Created draft release validation failed.'
created_draft_release_id="$(jq -er '.id | select(type == "number")' <<< "$created_release")"
gh release upload "$tag_name" \
  "$artifact_directory/$ipa_name" \
  "$artifact_directory/$apk_name" \
  "$artifact_directory/$checksums_name"

release_pages="$(gh api --paginate --slurp "repos/$GITHUB_REPOSITORY/releases?per_page=100")"
draft_release="$(jq -cer --arg tag "$tag_name" '
  add
  | map(select(.tag_name == $tag))
  | if length == 1 then .[0] else error("Expected exactly one draft release") end
' <<< "$release_pages")"

jq -e \
  --argjson id "$created_draft_release_id" \
  --arg tag "$tag_name" \
  --arg sha "$GITHUB_SHA" \
  --arg ipa "$ipa_name" \
  --arg apk "$apk_name" \
  --arg checksums "$checksums_name" '
    .id == $id
    and .tag_name == $tag
    and .target_commitish == $sha
    and .draft == true
    and .prerelease == true
    and (.assets | type == "array")
    and ([.assets[].name] | sort) == ([$ipa, $apk, $checksums] | sort)
    and all(.assets[]; (.size | type == "number") and .size > 0)
  ' <<< "$draft_release" > /dev/null || fail 'Draft release validation failed.'

release_id="$(jq -er '.id | select(type == "number")' <<< "$draft_release")"
download_directory="$(mktemp -d)"

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

published_release="$(gh api \
  --method PATCH \
  -F draft=false \
  "repos/$GITHUB_REPOSITORY/releases/$release_id")"
jq -e \
  --arg body "$release_notes" \
  --argjson id "$created_draft_release_id" \
  --arg name "$release_title" \
  --arg sha "$GITHUB_SHA" \
  --arg tag "$tag_name" '
    .id == $id
    and .tag_name == $tag
    and .target_commitish == $sha
    and .name == $name
    and .body == $body
    and .draft == false
    and .prerelease == true
  ' <<< "$published_release" > /dev/null || fail 'Published release validation failed.'
created_draft_release_id=''
