#!/usr/bin/env bash

set -euo pipefail

script_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
test_directory="$(mktemp -d)"
trap 'rm -rf "$test_directory"' EXIT
mkdir -p "$test_directory/bin" "$test_directory/container"

cat > "$test_directory/bin/xcrun" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

printf '%s\n' "$*" >> "$TEST_XCRUN_CALLS"
if [[ "$1 $2" == 'simctl get_app_container' ]]; then
    printf '%s\n' "$TEST_CONTAINER_PATH"
fi
EOF
chmod +x "$test_directory/bin/xcrun"

export PATH="$test_directory/bin:$PATH"
export TEST_CONTAINER_PATH="$test_directory/container"
export TEST_XCRUN_CALLS="$test_directory/xcrun-calls"
export TEST_SCRIPT_DIRECTORY="$script_directory"

cat > "$test_directory/bin/adb" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "$*" >> "$TEST_ADB_CALLS"
shift 2
if [[ "$1 $2" == 'shell id' ]]; then
    echo 'uid=0(root)'
elif [[ "$1" == 'pull' ]]; then
    touch "$3"
fi
EOF
chmod +x "$test_directory/bin/adb"
export TEST_ADB_CALLS="$test_directory/adb-calls"

node --input-type=module <<'EOF'
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const { seedAppState, launchSeededApp } = await import(join(process.env.TEST_SCRIPT_DIRECTORY, 'seed-app-state.ts'));
const target = { appId: 'com.example.suuudokuuu', platform: 'ios', serial: '', udid: 'test-simulator' };

assert.throws(
    () => seedAppState(target, { appearance: 'dark', difficulty: 'Hell', language: 'invalid' }),
    /Unsupported language/
);
assert.throws(
    () => seedAppState(target, { appearance: 'dark', difficulty: 'Hell', language: 'en', sceneState: 'invalid' }),
    /Unknown scene state/
);
assert.equal(existsSync(process.env.TEST_XCRUN_CALLS), false);

seedAppState(target, { appearance: 'light', difficulty: 'Infinity', language: 'de' });
const database = new DatabaseSync(join(process.env.TEST_CONTAINER_PATH, 'Documents', 'SQLite', 'ExpoSQLiteStorage'));
const row = database.prepare('SELECT value FROM storage WHERE key = ?').get('persist:root');
database.close();
assert.ok(row);
const persisted = JSON.parse(row.value);
assert.equal(JSON.parse(persisted._persist).version, 40);
assert.equal(JSON.parse(persisted.settings).language, 'de');
assert.equal(JSON.parse(persisted.settings).isDarkColorSchema, false);
assert.equal(JSON.parse(persisted.settings).lastGameDifficulty, 'Infinity');
assert.equal(JSON.parse(persisted.game).difficulty, 'Newbie');

launchSeededApp(target, 'de', 'de-DE');
const calls = readFileSync(process.env.TEST_XCRUN_CALLS, 'utf8');
assert.match(calls, /simctl terminate test-simulator com\.example\.suuudokuuu/);
assert.match(calls, /simctl get_app_container test-simulator com\.example\.suuudokuuu data/);
assert.match(calls, /simctl launch test-simulator com\.example\.suuudokuuu -AppleLanguages \(de\) -AppleLocale de-DE/);
seedAppState({ ...target, platform: 'android', serial: 'test-emulator' }, { appearance: 'dark', difficulty: 'Hell', language: 'en' });
const androidCalls = readFileSync(process.env.TEST_ADB_CALLS, 'utf8');
assert.match(androidCalls, /wait-for-device/);
assert.match(androidCalls, /mkdir -p .*files\/SQLite/);
assert.match(androidCalls, /chown .*stat -c %u:%g/);
assert.match(androidCalls, /restorecon/);
EOF

echo 'Seed app state self-test passed.'
