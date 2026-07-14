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

require_environment_variable GITHUB_REPOSITORY
require_environment_variable GITHUB_RUN_NUMBER
[[ "$GITHUB_RUN_NUMBER" =~ ^[0-9]+$ ]] || fail 'GITHUB_RUN_NUMBER must be numeric.'

release_pages="$(gh api --paginate --slurp "repos/$GITHUB_REPOSITORY/releases?per_page=100")"
releases_to_delete="$(jq -cer --argjson currentRun "$GITHUB_RUN_NUMBER" '
  def development_releases:
    add
    | map(
        select(.tag_name | test("^development-[0-9]+$"))
        | . + {runNumber: (.tag_name | sub("^development-"; "") | tonumber)}
      );

  development_releases
  | (
      map(select(.draft == false))
      | sort_by(.runNumber)
      | reverse
      | .[5:]
      | map(select(.runNumber < $currentRun))
      | sort_by(.runNumber)
    ) as $oldPublished
  | (
      map(select(.draft == true and .runNumber < $currentRun))
      | sort_by(.runNumber)
    ) as $staleDrafts
  | $oldPublished + $staleDrafts
' <<< "$release_pages")"

tag_reference_pages="$(gh api --paginate --slurp "repos/$GITHUB_REPOSITORY/git/matching-refs/tags/development-")"
tag_references="$(jq -ce 'add' <<< "$tag_reference_pages")"

while IFS=$'\t' read -r release_id tag_name is_draft; do
  [[ -n "$release_id" && -n "$tag_name" && -n "$is_draft" ]] || continue
  gh api --method DELETE "repos/$GITHUB_REPOSITORY/releases/$release_id"

  if [[ "$is_draft" == 'false' ]]; then
    tag_reference_exists="$(jq -r --arg reference "refs/tags/$tag_name" 'any(.[]; .ref == $reference)' <<< "$tag_references")"
    if [[ "$tag_reference_exists" == 'true' ]]; then
      gh api --method DELETE "repos/$GITHUB_REPOSITORY/git/refs/tags/$tag_name"
    fi
  fi
done < <(jq -r '.[] | [.id, .tag_name, .draft] | @tsv' <<< "$releases_to_delete")
