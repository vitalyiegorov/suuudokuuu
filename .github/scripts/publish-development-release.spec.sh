#!/usr/bin/env bash

set -Eeuo pipefail

repository_root="${1:-}"
if [[ -z "$repository_root" ]]; then
  repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
fi
script="$repository_root/.github/scripts/publish-development-release.sh"
temporary_root="$(mktemp -d)"
if [[ "${KEEP_MOCK_ROOT:-false}" == false ]]; then
  trap 'rm -rf "$temporary_root"' EXIT
else
  printf 'mock root: %s\n' "$temporary_root" >&2
fi

make_case() {
  local scenario="$1"
  local case_root="$temporary_root/$scenario"
  mkdir -p "$case_root/bin" "$case_root/artifacts"
  printf 'ipa-content' > "$case_root/artifacts/suuudokuuu-development.ipa"
  printf 'apk-content' > "$case_root/artifacts/suuudokuuu-development.apk"
  local ipa_sha256
  ipa_sha256="$(shasum -a 256 "$case_root/artifacts/suuudokuuu-development.ipa" | awk '{print $1}')"
  local bundle_version='123.1'
  if [[ "$scenario" == prior_attempt_draft ]]; then
    bundle_version='123.2'
  fi
  jq -cn --arg bundleVersion "$bundle_version" --arg ipaSha256 "$ipa_sha256" '{bundleVersion:$bundleVersion,ipaSha256:$ipaSha256,runNumber:"123"}' > "$case_root/artifacts/suuudokuuu-development.identity.json"
  : > "$case_root/actions"
  : > "$case_root/release-calls"
  printf '0' > "$case_root/release-count"
  cp "$repository_root/.github/scripts/test-fixtures/mock-publish-development-release-gh.sh" "$case_root/bin/gh"
  chmod +x "$case_root/bin/gh"
}

run_case() {
  local scenario="$1"
  local expected_status="$2"
  make_case "$scenario"
  local case_root="$temporary_root/$scenario"
  local status=0
  (
    cd "$repository_root"
    PATH="$case_root/bin:$PATH" \
      MOCK_ROOT="$case_root" \
      MOCK_SCENARIO="$scenario" \
      MOCK_ARTIFACTS="$case_root/artifacts" \
      GITHUB_REPOSITORY='vitalyiegorov/suuudokuuu' \
      GITHUB_RUN_ID='456' \
      GITHUB_RUN_NUMBER='123' \
      GITHUB_RUN_ATTEMPT='2' \
      GITHUB_SHA='aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' \
      GITHUB_REF_NAME='main' \
      GITHUB_SERVER_URL='https://github.com' \
      bash "$script" "$case_root/artifacts"
  ) > "$case_root/stdout" 2> "$case_root/stderr" || status=$?
  if [[ "$expected_status" == success && "$status" -ne 0 ]]; then
    printf '%s unexpectedly failed:\n' "$scenario" >&2
    cat "$case_root/stderr" >&2
    return 1
  fi
  if [[ "$expected_status" == failure && "$status" -eq 0 ]]; then
    printf '%s unexpectedly succeeded.\n' "$scenario" >&2
    return 1
  fi
}

assert_action_count() {
  local scenario="$1"
  local pattern="$2"
  local expected="$3"
  local count
  count="$(grep -cE "$pattern" "$temporary_root/$scenario/actions" || true)"
  [[ "$count" -eq "$expected" ]] || {
    printf '%s expected %s actions matching %s, got %s:\n' "$scenario" "$expected" "$pattern" "$count" >&2
    cat "$temporary_root/$scenario/actions" >&2
    return 1
  }
}

run_case prior_attempt_draft success
assert_action_count prior_attempt_draft '^DELETE ' 0
assert_action_count prior_attempt_draft '^POST 900$' 1
assert_action_count prior_attempt_draft '^UPLOAD development-123-2-2$' 1
assert_action_count prior_attempt_draft '^PATCH 900$' 1

run_case matching failure
assert_action_count matching '^(DELETE|POST|PATCH|UPLOAD) ' 0

run_case lost_previous_publish success
assert_action_count lost_previous_publish '^POST 900$' 1
assert_action_count lost_previous_publish '^UPLOAD development-123-1-2$' 1
assert_action_count lost_previous_publish '^PATCH 900$' 1

run_case none success
assert_action_count none '^POST 900$' 1
assert_action_count none '^PATCH 900$' 1
assert_action_count none '^DELETE ' 0

run_case mismatch failure
assert_action_count mismatch '^(DELETE|POST|PATCH|UPLOAD) ' 0

run_case upload_fail failure
assert_action_count upload_fail '^POST 900$' 1
assert_action_count upload_fail '^DELETE ' 0

run_case created_mismatch failure
assert_action_count created_mismatch '^POST 901$' 1
assert_action_count created_mismatch '^DELETE release 901$' 0

run_case patch_applied_fail failure
assert_action_count patch_applied_fail '^POST 900$' 1
assert_action_count patch_applied_fail '^PATCH 900$' 1
assert_action_count patch_applied_fail '^DELETE release 900$' 0

run_case patch_noop failure
assert_action_count patch_noop '^POST 900$' 1
assert_action_count patch_noop '^PATCH 900$' 1
assert_action_count patch_noop '^DELETE ' 0

if grep -RE 'DELETE|If-Match' "$temporary_root"/*/actions; then
  printf 'destructive or conditional mutation detected\n' >&2
  exit 1
fi

printf 'mocked publish-development-release matrix passed\n'
