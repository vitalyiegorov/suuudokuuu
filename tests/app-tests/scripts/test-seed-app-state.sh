#!/usr/bin/env bash

set -euo pipefail

script_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
test_directory="$(mktemp -d)"
trap 'rm -rf "$test_directory"' EXIT
mkdir -p "$test_directory/bin" "$test_directory/container/Documents/SQLite"

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

node --input-type=module <<'EOF'
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const { seedAppState, launchSeededApp, IosStorageRelativePath } = await import(join(process.env.TEST_SCRIPT_DIRECTORY, 'seed-app-state.ts'));
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
const database = new DatabaseSync(join(process.env.TEST_CONTAINER_PATH, IosStorageRelativePath));
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
EOF

echo 'Seed app state self-test passed.'
