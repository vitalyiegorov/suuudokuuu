#!/usr/bin/env bash
set -euo pipefail

app_tests_dir=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)

for shard_index in 0 1; do
    test -s "$app_tests_dir/shards/shard-$shard_index.txt"
done

diff -u \
    <(awk '/^    flowsOrder:/ { in_order = 1; next } in_order && /^        - / { sub(/^[[:space:]]*- /, ""); print $0 ".yaml" }' "$app_tests_dir/config.yaml" | sort) \
    <(cat "$app_tests_dir/shards/shard-0.txt" "$app_tests_dir/shards/shard-1.txt" | sort)
