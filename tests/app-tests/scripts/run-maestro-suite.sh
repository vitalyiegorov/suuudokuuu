#!/usr/bin/env bash

set -euo pipefail

script_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
app_tests_directory="$(dirname -- "$script_directory")"
app_id="${APP_ID:?APP_ID is required}"
simulator_udid="${SIMULATOR_UDID:-}"
output_path="${MAESTRO_OUTPUT_PATH:-$app_tests_directory/artifacts/maestro/report.xml}"
debug_output_directory="${MAESTRO_DEBUG_OUTPUT_DIRECTORY:-$app_tests_directory/artifacts/maestro}"
report_directory="$(dirname -- "$output_path")/.maestro-flow-reports"

selected_flow_paths=()

if [[ "$#" -gt 0 ]]; then
    selected_flow_paths=("$@")
else
    shopt -s nullglob
    selected_flow_paths=("$app_tests_directory"/flows/[0-9][0-9].*.flow.yaml)
    shopt -u nullglob
fi

if [[ "${#selected_flow_paths[@]}" -eq 0 ]]; then
    printf '%s\n' 'No Maestro flows selected.' >&2
    exit 1
fi

rm -rf "$report_directory"
mkdir -p "$report_directory" "$debug_output_directory"

maestro_arguments=(
    --config "$app_tests_directory/config.yaml"
    -e "APP_ID=$app_id"
)

if [[ -n "$simulator_udid" ]]; then
    maestro_arguments+=(--udid "$simulator_udid")
fi

maestro test \
    "$app_tests_directory/flows/setup/prime-deep-links.flow.yaml" \
    "${maestro_arguments[@]}" \
    --debug-output "$debug_output_directory/prime-deep-links" \
    --test-output-dir "$debug_output_directory/prime-deep-links"

reports=()
flow_index=0

merge_reports() {
    node - "$output_path" "${reports[@]}" <<'EOF'
const fs = require('node:fs');
const path = require('node:path');
const [outputPath, ...reportPaths] = process.argv.slice(2);

const getAttribute = (attributes, name, fallback) => {
    const match = attributes.match(new RegExp(`${name}="([^"]*)"`));

    return match?.[1] ?? fallback;
};

let tests = 0;
let failures = 0;
let time = 0;
let device = '';
const testCases = [];

for (const reportPath of reportPaths) {
    const report = fs.readFileSync(reportPath, 'utf8');
    const suiteMatch = report.match(/<testsuite\b([^>]*)>([\s\S]*?)<\/testsuite>/);

    if (!suiteMatch) {
        continue;
    }

    const attributes = suiteMatch[1];

    tests += Number(getAttribute(attributes, 'tests', '0'));
    failures += Number(getAttribute(attributes, 'failures', '0'));
    time += Number(getAttribute(attributes, 'time', '0'));
    device ||= getAttribute(attributes, 'device', '');
    testCases.push(...(suiteMatch[2].match(/<testcase\b[\s\S]*?<\/testcase>|<testcase\b[^>]*\/>/g) ?? []));
}

const deviceAttribute = device ? ` device="${device}"` : '';
const body = testCases.map(testCase => `    ${testCase}`).join('\n');
const mergedReport = `<?xml version='1.0' encoding='UTF-8'?>\n<testsuites>\n  <testsuite name="Test Suite"${deviceAttribute} tests="${tests}" failures="${failures}" time="${time.toFixed(1)}">\n${body}\n  </testsuite>\n</testsuites>\n`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, mergedReport);
EOF
}

for flow_path in "${selected_flow_paths[@]}"; do
    flow_index=$((flow_index + 1))
    flow_name="$(basename -- "$flow_path" .flow.yaml)"
    flow_report_path="$report_directory/$flow_name.xml"
    flow_debug_directory="$debug_output_directory/$flow_name"

    echo "Running Maestro flow $flow_index: $flow_name"

    set +e
    maestro test \
        "$flow_path" \
        "${maestro_arguments[@]}" \
        --format junit \
        --output "$flow_report_path" \
        --debug-output "$flow_debug_directory" \
        --test-output-dir "$flow_debug_directory"
    flow_status=$?
    set -e

    if [[ -f "$flow_report_path" ]]; then
        reports+=("$flow_report_path")
        merge_reports
    fi

    if [[ "$flow_status" -ne 0 ]]; then
        exit "$flow_status"
    fi
done
