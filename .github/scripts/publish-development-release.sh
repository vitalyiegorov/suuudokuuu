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

validate_release_provenance() {
  local release="$1"
  local expected_draft="$2"
  local bundle_version_mode="$3"

  jq -e \
    --arg branch "$GITHUB_REF_NAME" \
    --arg bundle_version "$bundle_version" \
    --arg bundle_version_mode "$bundle_version_mode" \
    --arg name "$release_title" \
    --arg run_number "$GITHUB_RUN_NUMBER" \
    --arg sha "$GITHUB_SHA" \
    --arg tag "$tag_name" \
    --arg version "$version" \
    --arg workflow_url "$workflow_url" \
    --argjson expected_draft "$expected_draft" '
      (.body | capture("^<!-- suuudokuuu-development-metadata (?<json>[^\\n]+) -->\\n\\n(?<details>(.|\\n)*)$")) as $content
      | ($content.json | fromjson) as $metadata
      | (.id | type == "number")
        and .tag_name == $tag
        and .target_commitish == $sha
        and .name == $name
        and .draft == $expected_draft
        and .prerelease == true
        and (($metadata | type) == "object")
        and (($metadata | keys) == ["branch", "builtAt", "bundleVersion", "commitSha", "version", "workflowUrl"])
        and $metadata.branch == $branch
        and $metadata.commitSha == $sha
        and $metadata.version == $version
        and $metadata.workflowUrl == $workflow_url
        and ($metadata.bundleVersion | type == "string")
        and ($metadata.bundleVersion | test("^[1-9][0-9]{0,3}\\.[1-9][0-9]?$"))
        and (($metadata.bundleVersion | split(".")[0]) == $run_number)
        and ($bundle_version_mode == "run" or $metadata.bundleVersion == $bundle_version)
        and ($metadata.builtAt | type == "string")
        and ((try ($metadata.builtAt | fromdateiso8601) catch false) | type == "number")
        and $content.details == (
          "Version: " + $metadata.version
          + "\nBuild version: " + $metadata.bundleVersion
          + "\nCommit: " + $metadata.commitSha
          + "\nBranch: " + $metadata.branch
          + "\nBuilt at (UTC): " + $metadata.builtAt
          + "\nWorkflow: " + $metadata.workflowUrl
        )
    ' <<< "$release" > /dev/null
}

fetched_release=''
fetched_release_etag=''

fetch_release_with_etag() {
  local release_id="$1"
  local included_response
  local normalized_response
  local response_headers

  included_response="$(gh api --include "repos/$GITHUB_REPOSITORY/releases/$release_id")" || return 1
  normalized_response="${included_response//$'\r'/}"
  [[ "$normalized_response" == *$'\n\n'* ]] || return 1
  response_headers="${normalized_response%%$'\n\n'*}"
  fetched_release="${normalized_response#*$'\n\n'}"
  [[ "${response_headers%%$'\n'*}" =~ ^HTTP/[^[:space:]]+[[:space:]]+200([[:space:]]|$) ]] || return 1
  fetched_release_etag="$(awk 'tolower($1) == "etag:" {sub(/^[^:]+:[[:space:]]*/, ""); print}' <<< "$response_headers")"
  [[ -n "$fetched_release_etag" ]] || return 1
  jq -en --arg etag "$fetched_release_etag" '$etag | test("^(W/)?\\\"[^\\\"]+\\\"$")' > /dev/null || return 1
  jq -e 'type == "object"' <<< "$fetched_release" > /dev/null
}

verify_release_assets() {
  local release="$1"
  local asset_entries

  jq -e \
    --arg ipa "$ipa_name" \
    --arg apk "$apk_name" \
    --arg checksums "$checksums_name" '
      (.assets | type == "array")
      and ([.assets[].name] | sort) == ([$ipa, $apk, $checksums] | sort)
      and all(.assets[];
        (.id | type == "number")
        and (.size | type == "number")
        and .size > 0
      )
    ' <<< "$release" > /dev/null || fail 'Release asset validation failed.'

  if [[ -n "$download_directory" ]]; then
    rm -rf "$download_directory"
  fi
  download_directory="$(mktemp -d)"
  asset_entries="$(jq -er '.assets | sort_by(.name)[] | [.id, .name] | @tsv' <<< "$release")"

  while IFS=$'\t' read -r asset_id asset_name; do
    case "$asset_name" in
      "$ipa_name"|"$apk_name"|"$checksums_name") ;;
      *) fail "Unexpected release asset: $asset_name" ;;
    esac

    gh api \
      -H 'Accept: application/octet-stream' \
      "repos/$GITHUB_REPOSITORY/releases/assets/$asset_id" > "$download_directory/$asset_name"
  done <<< "$asset_entries"

  verify_directory_entries "$download_directory" "$checksums_name" "$apk_name" "$ipa_name"
  cmp "$artifact_directory/$checksums_name" "$download_directory/$checksums_name" || fail 'Downloaded checksum manifest does not match the local manifest.'
  (
    cd "$download_directory"
    shasum -a 256 -c "$artifact_directory/$checksums_name"
  )
}

verify_published_release() {
  local release="$1"
  local published_tag_count
  local published_tag_pages
  local published_tag_references

  validate_release_provenance "$release" false exact || fail 'Published release provenance validation failed.'
  published_tag_pages="$(gh api --paginate --slurp "repos/$GITHUB_REPOSITORY/git/matching-refs/tags/development-")"
  published_tag_references="$(jq -cer --arg reference "refs/tags/$tag_name" 'add | map(select(.ref == $reference))' <<< "$published_tag_pages")"
  published_tag_count="$(jq -er 'length' <<< "$published_tag_references")"
  [[ "$published_tag_count" -eq 1 ]] || fail "Published release Git tag validation failed: $tag_name."
  jq -e --arg sha "$GITHUB_SHA" '.[0].object.type == "commit" and .[0].object.sha == $sha' <<< "$published_tag_references" > /dev/null ||
    fail "Published release Git tag does not match this workflow commit: $tag_name."
  verify_release_assets "$release"
}

accept_published_release_or_fail() {
  local release_id="$1"
  local failure_message="$2"

  fetch_release_with_etag "$release_id" || fail "$failure_message"
  jq -e --argjson id "$release_id" '.id == $id and .draft == false' <<< "$fetched_release" > /dev/null || fail "$failure_message"
  verify_published_release "$fetched_release"
  exit 0
}

refresh_current_draft_or_accept_published() {
  local release_id="$1"

  fetch_release_with_etag "$release_id" || fail 'Failed to refresh the reconciled release.'
  jq -e --argjson id "$release_id" '.id == $id' <<< "$fetched_release" > /dev/null || fail 'Reconciled release ID changed unexpectedly.'
  if jq -e '.draft == false' <<< "$fetched_release" > /dev/null; then
    verify_published_release "$fetched_release"
    exit 0
  fi
  validate_release_provenance "$fetched_release" true exact || fail 'Reconciled draft release provenance validation failed.'
}

created_draft_release_id=''
download_directory=''

cleanup() {
  local exit_status="$1"

  if [[ -n "$download_directory" ]]; then
    rm -rf "$download_directory"
  fi
  if [[ "$exit_status" -ne 0 && -n "$created_draft_release_id" ]]; then
    if fetch_release_with_etag "$created_draft_release_id" 2> /dev/null &&
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
        ' <<< "$fetched_release" > /dev/null; then
      gh api \
        --method DELETE \
        -H "If-Match: $fetched_release_etag" \
        "repos/$GITHUB_REPOSITORY/releases/$created_draft_release_id" > /dev/null ||
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

(
  cd "$artifact_directory"
  shasum -a 256 "$ipa_name" "$apk_name" > "$checksums_name"
)

release_pages="$(gh api --paginate --slurp "repos/$GITHUB_REPOSITORY/releases?per_page=100")"
matching_releases="$(jq -cer --arg tag "$tag_name" 'add | map(select(.tag_name == $tag))' <<< "$release_pages")"
existing_release_count="$(jq -er 'length' <<< "$matching_releases")"
[[ "$existing_release_count" -le 1 ]] || fail "Multiple releases exist for tag $tag_name."

release_id=''
existing_release_is_draft=''
if [[ "$existing_release_count" -eq 1 ]]; then
  existing_release="$(jq -cer '.[0]' <<< "$matching_releases")"
  release_id="$(jq -er '.id | select(type == "number")' <<< "$existing_release")"
  existing_release_is_draft="$(jq -r '.draft | if type == "boolean" then tostring else error("Invalid draft state") end' <<< "$existing_release")"
fi

tag_reference_pages="$(gh api --paginate --slurp "repos/$GITHUB_REPOSITORY/git/matching-refs/tags/development-")"
matching_tag_references="$(jq -cer --arg reference "refs/tags/$tag_name" 'add | map(select(.ref == $reference))' <<< "$tag_reference_pages")"
existing_tag_count="$(jq -er 'length' <<< "$matching_tag_references")"
[[ "$existing_tag_count" -le 1 ]] || fail "Multiple Git tags exist for $tag_name."
if [[ "$existing_tag_count" -eq 1 ]]; then
  [[ -n "$release_id" ]] || fail "Git tag already exists without a matching release: $tag_name."
  jq -e --arg sha "$GITHUB_SHA" '.[0].object.type == "commit" and .[0].object.sha == $sha' <<< "$matching_tag_references" > /dev/null ||
    fail "Git tag for $tag_name does not match this workflow commit."
fi

if [[ -n "$release_id" && "$existing_release_is_draft" == false ]]; then
  [[ "$existing_tag_count" -eq 1 ]] || fail "Published release is missing its Git tag: $tag_name."
  fetch_release_with_etag "$release_id" || fail 'Failed to refresh the published release.'
  jq -e --argjson id "$release_id" '.id == $id' <<< "$fetched_release" > /dev/null || fail 'Published release ID changed unexpectedly.'
  verify_published_release "$fetched_release"
  exit 0
fi

if [[ -n "$release_id" ]]; then
  fetch_release_with_etag "$release_id" || fail 'Failed to refresh the existing draft release.'
  jq -e --argjson id "$release_id" '.id == $id' <<< "$fetched_release" > /dev/null || fail 'Existing draft release ID changed unexpectedly.'
  validate_release_provenance "$fetched_release" true run || fail "Existing release for $tag_name does not match this workflow run and commit."
  if ! reconciled_release="$(gh api \
    --method PATCH \
    -H "If-Match: $fetched_release_etag" \
    -f name="$release_title" \
    -f body="$release_notes" \
    -F prerelease=true \
    "repos/$GITHUB_REPOSITORY/releases/$release_id")"; then
    accept_published_release_or_fail "$release_id" 'Draft release changed during reconciliation.'
  fi
  jq -e --argjson id "$release_id" '.id == $id' <<< "$reconciled_release" > /dev/null || fail 'Reconciled release ID changed unexpectedly.'
  validate_release_provenance "$reconciled_release" true exact || fail 'Reconciled draft release validation failed.'
else
  [[ "$existing_tag_count" -eq 0 ]] || fail "Git tag already exists: $tag_name."
  created_release="$(gh api \
    --method POST \
    -f tag_name="$tag_name" \
    -f target_commitish="$GITHUB_SHA" \
    -f name="$release_title" \
    -f body="$release_notes" \
    -F draft=true \
    -F prerelease=true \
    "repos/$GITHUB_REPOSITORY/releases")"
  validate_release_provenance "$created_release" true exact || fail 'Created draft release validation failed.'
  created_draft_release_id="$(jq -er '.id | select(type == "number")' <<< "$created_release")"
  release_id="$created_draft_release_id"
fi

refresh_current_draft_or_accept_published "$release_id"
if ! gh release upload "$tag_name" \
  "$artifact_directory/$ipa_name" \
  "$artifact_directory/$apk_name" \
  "$artifact_directory/$checksums_name" \
  --clobber; then
  accept_published_release_or_fail "$release_id" 'Release asset upload failed before publication.'
fi

refresh_current_draft_or_accept_published "$release_id"
verify_release_assets "$fetched_release"

if ! published_release="$(gh api \
  --method PATCH \
  -H "If-Match: $fetched_release_etag" \
  -F draft=false \
  "repos/$GITHUB_REPOSITORY/releases/$release_id")"; then
  accept_published_release_or_fail "$release_id" 'Draft release changed during publication.'
fi
jq -e --argjson id "$release_id" '.id == $id' <<< "$published_release" > /dev/null || fail 'Published release ID changed unexpectedly.'
verify_published_release "$published_release"
created_draft_release_id=''
