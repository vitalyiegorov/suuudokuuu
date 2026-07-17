#!/usr/bin/env bash

set -Eeuo pipefail

action_file="$MOCK_ROOT/actions"
sha='aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
artifact_bundle_version="$(jq -r '.bundleVersion' "$MOCK_ARTIFACTS/suuudokuuu-development.identity.json")"
artifact_attempt="${artifact_bundle_version#*.}"
tag="development-123-$artifact_attempt-2"
workflow_url='https://github.com/vitalyiegorov/suuudokuuu/actions/runs/456'
version="$(jq -r '.version' packages/app/package.json)"
release_title="suuudokuuu development v$version (aaaaaaa)"
assets='[{"id":1,"name":"suuudokuuu-development.ipa","size":11},{"id":2,"name":"suuudokuuu-development.apk","size":11},{"id":3,"name":"SHA256SUMS","size":1}]'

release_body() {
  local bundle_version="$1"
  local metadata
  metadata="$(jq -cn \
    --arg branch main \
    --arg bundleVersion "$bundle_version" \
    --arg builtAt '2026-07-17T12:00:00Z' \
    --arg commitSha "$sha" \
    --arg version "$version" \
    --arg workflowUrl "$workflow_url" \
    '{branch:$branch,bundleVersion:$bundleVersion,builtAt:$builtAt,commitSha:$commitSha,version:$version,workflowUrl:$workflowUrl}')"
  printf '%s\n\nVersion: %s\nBuild version: %s\nCommit: %s\nBranch: main\nBuilt at (UTC): 2026-07-17T12:00:00Z\nWorkflow: %s' \
    "<!-- suuudokuuu-development-metadata $metadata -->" "$version" "$bundle_version" "$sha" "$workflow_url"
}

release_json() {
  local id="$1"
  local draft="$2"
  local target_sha="$3"
  local release_assets="$4"
  local name="${5:-$release_title}"
  local body="${6:-$(release_body "$artifact_bundle_version")}"
  local release_tag="${7:-$tag}"
  jq -cn \
    --argjson id "$id" \
    --argjson draft "$draft" \
    --arg sha "$target_sha" \
    --arg tag "$release_tag" \
    --arg name "$name" \
    --arg body "$body" \
    --argjson assets "$release_assets" \
    '{id:$id,tag_name:$tag,target_commitish:$sha,name:$name,draft:$draft,prerelease:true,body:$body,assets:$assets}'
}

current_release_file() {
  if [[ -f "$MOCK_ROOT/created.json" ]]; then
    printf '%s' "$MOCK_ROOT/created.json"
  else
    printf '%s' "$MOCK_ROOT/existing.json"
  fi
}

write_assets() {
  local release_file
  release_file="$(current_release_file)"
  jq -c --argjson assets "$assets" '.assets = $assets' "$release_file" > "$release_file.next"
  mv "$release_file.next" "$release_file"
}

if [[ "${1:-}" == release && "${2:-}" == upload ]]; then
  printf 'UPLOAD %s\n' "$3" >> "$action_file"
  if [[ "$MOCK_SCENARIO" == cleanup_concurrent_publish ]]; then
    release_file="$(current_release_file)"
    jq -c '.draft = false' "$release_file" > "$release_file.next"
    mv "$release_file.next" "$release_file"
    exit 1
  fi
  [[ "$MOCK_SCENARIO" != upload_fail ]] || exit 1
  write_assets
  exit
fi

[[ "${1:-}" == api ]]
shift

method='GET'
endpoint=''
tag_name=''
target_commitish=''
release_name=''
release_body_value=''
include_response=false
if_match=''
draft_value=''
while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --method)
      method="$2"
      shift 2
      ;;
    --paginate|--slurp)
      shift
      ;;
    --include)
      include_response=true
      shift
      ;;
    -H)
      case "$2" in
        'If-Match: '*) if_match="${2#If-Match: }" ;;
      esac
      shift 2
      ;;
    -f|-F)
      case "$2" in
        tag_name=*) tag_name="${2#tag_name=}" ;;
        target_commitish=*) target_commitish="${2#target_commitish=}" ;;
        name=*) release_name="${2#name=}" ;;
        body=*) release_body_value="${2#body=}" ;;
        draft=*) draft_value="${2#draft=}" ;;
      esac
      shift 2
      ;;
    *)
      endpoint="$1"
      shift
      ;;
  esac
done

emit_body() {
  local body="$1"
  if [[ "$include_response" == true ]]; then
    printf 'HTTP/2.0 200 OK\r\nETag: "release-etag"\r\n\r\n%s\n' "$body"
  else
    printf '%s\n' "$body"
  fi
}

initialize_existing() {
  [[ -f "$MOCK_ROOT/existing.json" ]] && return
  case "$MOCK_SCENARIO" in
    matching)
      release_json 700 true "$sha" "$assets" > "$MOCK_ROOT/existing.json"
      ;;
    prior_attempt_draft)
      release_json 700 true "$sha" "$assets" "$release_title" "$(release_body '123.1')" 'development-123-1-1' > "$MOCK_ROOT/existing.json"
      ;;
    lost_previous_publish)
      release_json 700 false "$sha" "$assets" "$release_title" "$(release_body '123.1')" 'development-123-1-1' > "$MOCK_ROOT/existing.json"
      ;;
    mismatch)
      release_json 700 true 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' '[]' > "$MOCK_ROOT/existing.json"
      ;;
  esac
}

case "$method $endpoint" in
  'GET repos/vitalyiegorov/suuudokuuu/releases?per_page=100')
    initialize_existing
    if [[ -f "$MOCK_ROOT/existing.json" ]]; then
      existing="$(cat "$MOCK_ROOT/existing.json")"
      jq -cn --argjson release "$existing" '[[$release]]'
    else
      printf '[[]]\n'
    fi
    ;;
  'GET repos/vitalyiegorov/suuudokuuu/git/matching-refs/tags/development-')
    initialize_existing
    references='[]'
    if [[ -f "$MOCK_ROOT/existing.json" ]]; then
      existing_tag="$(jq -er '.tag_name' "$MOCK_ROOT/existing.json")"
      references="$(jq -cn --argjson references "$references" --arg sha "$sha" --arg tag "refs/tags/$existing_tag" '$references + [{ref:$tag,object:{type:"commit",sha:$sha}}]')"
    fi
    if [[ -f "$MOCK_ROOT/created.json" ]] && jq -e '.draft == false' "$MOCK_ROOT/created.json" > /dev/null; then
      created_tag="$(jq -er '.tag_name' "$MOCK_ROOT/created.json")"
      references="$(jq -cn --argjson references "$references" --arg sha "$sha" --arg tag "refs/tags/$created_tag" '$references + [{ref:$tag,object:{type:"commit",sha:$sha}}]')"
    fi
    if [[ "$references" != '[]' ]]; then
      jq -cn --argjson references "$references" '[$references]'
    else
      printf '[[]]\n'
    fi
    ;;
  'POST repos/vitalyiegorov/suuudokuuu/releases')
    [[ "$tag_name" == "$tag" && "$target_commitish" == "$sha" ]]
    if [[ "$MOCK_SCENARIO" == created_mismatch ]]; then
      printf 'POST 901\n' >> "$action_file"
      release_json 901 true 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' '[]' "$release_name" "$release_body_value"
    else
      printf 'POST 900\n' >> "$action_file"
      release_json 900 true "$sha" '[]' "$release_name" "$release_body_value" > "$MOCK_ROOT/created.json"
      cat "$MOCK_ROOT/created.json"
    fi
    ;;
  'GET repos/vitalyiegorov/suuudokuuu/releases/700'|'GET repos/vitalyiegorov/suuudokuuu/releases/900')
    initialize_existing
    release_file="$(current_release_file)"
    emit_body "$(cat "$release_file")"
    ;;
  'DELETE repos/vitalyiegorov/suuudokuuu/releases/'*)
    conditional=''
    [[ -z "$if_match" ]] || conditional=' conditional'
    printf 'DELETE release %s%s\n' "${endpoint##*/}" "$conditional" >> "$action_file"
    exit 98
    ;;
  'PATCH repos/vitalyiegorov/suuudokuuu/releases/'*)
    release_id="${endpoint##*/}"
    printf 'PATCH %s\n' "$release_id" >> "$action_file"
    release_file="$(current_release_file)"
    if [[ "$MOCK_SCENARIO" == draft_concurrent_publish && "$release_id" == 700 ]]; then
      jq -c '.draft = false' "$release_file" > "$release_file.next"
      mv "$release_file.next" "$release_file"
      exit 1
    fi
    if [[ "$MOCK_SCENARIO" == patch_fail && "$draft_value" == false ]]; then
      exit 1
    fi
    if [[ "$MOCK_SCENARIO" == patch_applied_fail && "$draft_value" == false ]]; then
      jq -c '.draft = false' "$release_file" > "$release_file.next"
      mv "$release_file.next" "$release_file"
      exit 1
    fi
    jq_filter='.'
    if [[ -n "$release_name" ]]; then
      jq_filter="$jq_filter | .name = \$name"
    fi
    if [[ -n "$release_body_value" ]]; then
      jq_filter="$jq_filter | .body = \$body"
    fi
    if [[ "$draft_value" == false && "$MOCK_SCENARIO" != patch_noop ]]; then
      jq_filter="$jq_filter | .draft = false"
    fi
    jq -c --arg name "$release_name" --arg body "$release_body_value" "$jq_filter" "$release_file" > "$release_file.next"
    mv "$release_file.next" "$release_file"
    cat "$release_file"
    ;;
  'GET repos/vitalyiegorov/suuudokuuu/releases/assets/1')
    cat "$MOCK_ARTIFACTS/suuudokuuu-development.ipa"
    ;;
  'GET repos/vitalyiegorov/suuudokuuu/releases/assets/2')
    if [[ "$MOCK_SCENARIO" == published_asset_mismatch ]]; then
      printf 'wrong-apk'
    else
      cat "$MOCK_ARTIFACTS/suuudokuuu-development.apk"
    fi
    ;;
  'GET repos/vitalyiegorov/suuudokuuu/releases/assets/3')
    cat "$MOCK_ARTIFACTS/SHA256SUMS"
    ;;
  *)
    printf 'Unexpected gh call: %s %s\n' "$method" "$endpoint" >&2
    exit 97
    ;;
esac
