#!/usr/bin/env bash

set -euo pipefail

app_directory="${1:-packages/app}"
dist_directory="${app_directory}/dist"
functions_directory="${app_directory}/vercel-functions"

required_files=(
    "${dist_directory}/index.html"
    "${functions_directory}/api/beta/release.ts"
    "${functions_directory}/api/beta/ipa.ts"
    "${functions_directory}/api/beta/apk.ts"
    "${functions_directory}/api/beta/manifest.ts"
    "${functions_directory}/shared/resolve-beta-release.util.ts"
    "${functions_directory}/shared/serialize-ota-manifest.util.ts"
    "${functions_directory}/package.json"
    "${functions_directory}/yarn.lock"
    "${functions_directory}/.yarnrc.yml"
    "${app_directory}/vercel.json"
)

for required_file in "${required_files[@]}"; do
    if [[ ! -f "${required_file}" ]]; then
        echo "Required Vercel staging file is missing: ${required_file}" >&2
        exit 1
    fi
done

rm -rf "${dist_directory}/api" "${dist_directory}/shared"
cp -R "${functions_directory}/api" "${dist_directory}/api"
cp -R "${functions_directory}/shared" "${dist_directory}/shared"
cp "${functions_directory}/package.json" "${dist_directory}/package.json"
cp "${functions_directory}/yarn.lock" "${dist_directory}/yarn.lock"
cp "${functions_directory}/.yarnrc.yml" "${dist_directory}/.yarnrc.yml"
cp "${app_directory}/vercel.json" "${dist_directory}/vercel.json"

staged_files=(
    "${dist_directory}/api/beta/release.ts"
    "${dist_directory}/api/beta/ipa.ts"
    "${dist_directory}/api/beta/apk.ts"
    "${dist_directory}/api/beta/manifest.ts"
    "${dist_directory}/shared/resolve-beta-release.util.ts"
    "${dist_directory}/shared/serialize-ota-manifest.util.ts"
    "${dist_directory}/package.json"
    "${dist_directory}/yarn.lock"
    "${dist_directory}/.yarnrc.yml"
    "${dist_directory}/vercel.json"
)

for staged_file in "${staged_files[@]}"; do
    if [[ ! -f "${staged_file}" ]]; then
        echo "Vercel staging did not produce: ${staged_file}" >&2
        exit 1
    fi
done

if grep -q 'workspace:' "${dist_directory}/package.json"; then
    echo "Staged package.json contains a monorepo workspace dependency." >&2
    exit 1
fi

unexpected_workspace_references="$({ grep -n 'workspace:' "${dist_directory}/yarn.lock" || true; } | grep -v '@suuudokuuu/vercel-functions@workspace:\.' || true)"
if [[ -n "${unexpected_workspace_references}" ]]; then
    echo "Staged yarn.lock contains an unexpected workspace reference:" >&2
    echo "${unexpected_workspace_references}" >&2
    exit 1
fi
