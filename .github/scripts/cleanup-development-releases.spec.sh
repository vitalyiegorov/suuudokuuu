#!/usr/bin/env bash

set -Eeuo pipefail

repository_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
temporary_directory="$(mktemp -d)"
mock_binary_directory="$temporary_directory/bin"
mock_log_path="$temporary_directory/gh.log"

cleanup() {
  local exit_status="$?"
  trap - EXIT
  rm -rf "$temporary_directory"
  exit "$exit_status"
}

trap cleanup EXIT

mkdir -p "$mock_binary_directory"

cat > "$mock_binary_directory/gh" <<'EOF'
#!/usr/bin/env bash

set -Eeuo pipefail

printf '%s\n' "$*" >> "$MOCK_GH_LOG"

case "$*" in
  *"releases?per_page=100"*)
    printf '%s\n' '[[{"id":103,"tag_name":"development-10-3-1","draft":false},{"id":101,"tag_name":"development-10-1-1","draft":false},{"id":106,"tag_name":"development-10-6-1","draft":false},{"id":102,"tag_name":"development-10-2-1","draft":false},{"id":105,"tag_name":"development-10-5-1","draft":false},{"id":104,"tag_name":"development-10-4-1","draft":false}]]'
    ;;
  *"matching-refs/tags/development-"*)
    printf '%s\n' '[[{"ref":"refs/tags/development-10-1-1"},{"ref":"refs/tags/development-11-1-1"},{"ref":"refs/tags/development-20-1-1"},{"ref":"refs/tags/development-19-1-1"}]]'
    ;;
esac
EOF

chmod +x "$mock_binary_directory/gh"

PATH="$mock_binary_directory:$PATH" \
  MOCK_GH_LOG="$mock_log_path" \
  GITHUB_REPOSITORY='vitalyiegorov/suuudokuuu' \
  GITHUB_RUN_NUMBER=20 \
  "$repository_root/.github/scripts/cleanup-development-releases.sh"

expected_deletions="$(cat <<'EOF'
api --method DELETE repos/vitalyiegorov/suuudokuuu/releases/101
api --method DELETE repos/vitalyiegorov/suuudokuuu/git/refs/tags/development-10-1-1
api --method DELETE repos/vitalyiegorov/suuudokuuu/git/refs/tags/development-19-1-1
EOF
)"
actual_deletions="$(rg '^api --method DELETE ' "$mock_log_path")"

[[ "$actual_deletions" == "$expected_deletions" ]]
