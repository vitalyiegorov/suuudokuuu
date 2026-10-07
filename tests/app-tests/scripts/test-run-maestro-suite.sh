#!/usr/bin/env bash

set -euo pipefail

script_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
test_directory="$(mktemp -d)"
trap 'rm -rf "$test_directory"' EXIT
mkdir -p "$test_directory/bin"

cat > "$test_directory/bin/maestro" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

flow_path="$2"
shift 2
report_path=''
while [[ "$#" -gt 0 ]]; do
    if [[ "$1" == '--output' ]]; then
        report_path="$2"
        shift 2
    else
        shift
    fi
done

printf '%s\n' "$(basename -- "$flow_path")" >> "$TEST_MAESTRO_CALLS"
if [[ -z "$report_path" ]]; then
    exit 0
fi

flow_name="$(basename -- "$flow_path" .flow.yaml)"
attempts="$(grep -c -F "${flow_name}.flow.yaml" "$TEST_MAESTRO_CALLS")"
if [[ "$flow_name" == 'recoverable' && "$attempts" -eq 1 ]]; then
    echo 'iOS driver not ready after 300000 ms'
    exit 1
fi
if [[ "$flow_name" == 'assertion' ]]; then
    echo 'Assertion failed: element not visible'
    printf '<testsuite tests="1" failures="1" time="0.5"><testcase name="assertion"><failure/></testcase></testsuite>\n' > "$report_path"
    exit 1
fi

printf '<testsuite tests="1" failures="0" time="0.5"><testcase name="%s"/></testsuite>\n' "$flow_name" > "$report_path"
EOF
chmod +x "$test_directory/bin/maestro"

export PATH="$test_directory/bin:$PATH"
export TEST_MAESTRO_CALLS="$test_directory/calls"
export APP_ID='com.example.suuudokuuu'
export SIMULATOR_UDID=''
export MAESTRO_OUTPUT_PATH="$test_directory/report.xml"
export MAESTRO_DEBUG_OUTPUT_DIRECTORY="$test_directory/debug"

bash "$script_directory/run-maestro-suite.sh" "$test_directory/recoverable.flow.yaml" > "$test_directory/success.log"
[[ "$(grep -c -F 'recoverable.flow.yaml' "$TEST_MAESTRO_CALLS")" -eq 2 ]]
grep -q 'tests="1" failures="0"' "$MAESTRO_OUTPUT_PATH"
grep -q $'1\trecoverable\tsuccess\t2\t' "$test_directory/flow-timings.tsv"

if bash "$script_directory/run-maestro-suite.sh" "$test_directory/assertion.flow.yaml" > "$test_directory/failure.log"; then
    echo 'Assertion failure unexpectedly passed.' >&2
    exit 1
fi
[[ "$(grep -c -F 'assertion.flow.yaml' "$TEST_MAESTRO_CALLS")" -eq 1 ]]
grep -q -F 'reset-app-state.flow.yaml' "$TEST_MAESTRO_CALLS"
grep -q 'tests="1" failures="1"' "$MAESTRO_OUTPUT_PATH"
grep -q $'1\tassertion\tfailure\t1\t' "$test_directory/flow-timings.tsv"

echo 'Maestro suite self-test passed.'
