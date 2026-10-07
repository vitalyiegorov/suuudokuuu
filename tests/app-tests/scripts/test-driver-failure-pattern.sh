#!/usr/bin/env bash

set -euo pipefail

script_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
. "$script_directory/driver-failure-pattern.sh"

for log_line in \
    'AX snapshot failed: kAXErrorInvalidUIElement' \
    'iOS driver not ready after 300000 ms' \
    'java.net.ConnectException: Connection refused' \
    'java.net.SocketTimeoutException: Read timed out'; do
    if ! grep -qE "$MAESTRO_RECOVERABLE_FAILURE_PATTERN" <<< "$log_line"; then
        printf 'Expected recoverable driver failure: %s\n' "$log_line" >&2
        exit 1
    fi
done

for log_line in \
    'Assertion failed: element not visible' \
    'No element found matching selector' \
    'Connection reset by peer' \
    'SocketException: Read timed out'; do
    if grep -qE "$MAESTRO_RECOVERABLE_FAILURE_PATTERN" <<< "$log_line"; then
        printf 'Unexpected recoverable driver failure: %s\n' "$log_line" >&2
        exit 1
    fi
done

echo 'Driver failure pattern self-test passed.'
