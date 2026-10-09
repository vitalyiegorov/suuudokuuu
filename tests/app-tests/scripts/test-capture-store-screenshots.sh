#!/usr/bin/env bash

set -euo pipefail

script_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
test_directory="$(mktemp -d "${TMPDIR:-/tmp}/capture-verifier.XXXXXX")"
trap 'rm -rf "$test_directory"' EXIT
mkdir -p "$test_directory/bin"

cat > "$test_directory/bin/adb" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail

printf '%s\n' "$*" >> "$TEST_ADB_CALLS"
if [[ "$1" != '-s' || "$2" != 'test-serial' ]]; then
    exit 91
fi
shift 2

case "$*" in
    'root') ;;
    'shell id')
        if [[ "$TEST_CASE" == 'seed-failed' ]]; then
            printf 'uid=2000(shell)\n'
        else
            printf 'uid=0(root)\n'
        fi
        ;;
    'pull '*) cp "$TEST_DATABASE" "$3" ;;
    'push '*) ;;
    'shell pidof com.example.suuudokuuu')
        count=0
        if [[ -f "$TEST_PID_COUNT" ]]; then
            count="$(cat "$TEST_PID_COUNT")"
        fi
        count=$((count + 1))
        printf '%s' "$count" > "$TEST_PID_COUNT"
        if [[ "$TEST_CASE" == 'missing-pid' ]]; then
            exit 1
        fi
        if [[ "$TEST_CASE" == 'changed-pid' && "$count" -gt 1 ]]; then
            printf '4321\n'
        else
            printf '1234\n'
        fi
        ;;
    'shell am start '*)
        if [[ "$TEST_CASE" == 'failed-launch' && "$*" == *'-n com.example.suuudokuuu/.MainActivity'* ]]; then
            exit 1
        fi
        if [[ "$TEST_CASE" == 'failed-deep-link' && "$*" == *'android.intent.action.VIEW'* ]]; then
            exit 1
        fi
        ;;
    'shell uiautomator dump /dev/tty')
        if [[ "$TEST_CASE" == 'failed-hierarchy' ]]; then
            exit 1
        fi
        if [[ "$TEST_CASE" == 'missing-root' ]]; then
            printf '<hierarchy><node resource-id="OtherScreen.Root"/></hierarchy>\n'
        elif [[ "$TEST_CASE" == 'write-throws' && "$(grep -c 'uiautomator dump /dev/tty' "$TEST_ADB_CALLS")" -gt 1 ]]; then
            printf '<hierarchy><node resource-id="HomeScreenSelectors.Root"/></hierarchy>\n'
        else
            printf '<hierarchy><node resource-id="GameScreenSelectors.Root"/></hierarchy>\n'
        fi
        ;;
    'exec-out screencap -p')
        if [[ "$TEST_CASE" == 'failed-screenshot' ]]; then
            exit 1
        fi
        if [[ "$TEST_CASE" == 'invalid-png' ]]; then
            printf 'not a png'
        else
            cat "$TEST_PNG"
        fi
        ;;
esac
EOF
chmod +x "$test_directory/bin/adb"

cat > "$test_directory/bin/xcrun" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "$*" >> "$TEST_XCRUN_CALLS"
exit 1
EOF
chmod +x "$test_directory/bin/xcrun"

export PATH="$test_directory/bin:$PATH"
export TEST_ADB_CALLS="$test_directory/adb-calls"
export TEST_XCRUN_CALLS="$test_directory/xcrun-calls"
export TEST_DATABASE="$test_directory/ExpoSQLiteStorage"
export TEST_PID_COUNT="$test_directory/pid-count"
export TEST_PNG="$test_directory/screenshot.png"
export TEST_SCRIPT_DIRECTORY="$script_directory"
export TEST_DIRECTORY="$test_directory"

node --input-type=module <<'EOF'
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const database = new DatabaseSync(process.env.TEST_DATABASE);
database.exec('CREATE TABLE storage (key TEXT PRIMARY KEY NOT NULL, value TEXT)');
database.close();
const png = Buffer.alloc(24);
Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82]).copy(png);
png.writeUInt32BE(768, 16);
png.writeUInt32BE(1280, 20);
writeFileSync(process.env.TEST_PNG, png);

const runner = join(process.env.TEST_SCRIPT_DIRECTORY, 'capture-store-screenshots.ts');
const outputDirectory = join(process.env.TEST_DIRECTORY, 'output');
const reportDirectory = join(process.env.TEST_DIRECTORY, 'report');
const baseArguments = [
    '--platform=android', '--serial=test-serial', '--app-id=com.example.suuudokuuu',
    '--locales=en', '--appearances=light', '--scenes=hero-board', '--status-bar=real',
    `--output-dir=${outputDirectory}`, `--report-dir=${reportDirectory}`, '--verify'
];

const run = (testCase, argumentsList = baseArguments) => {
    rmSync(process.env.TEST_ADB_CALLS, { force: true });
    rmSync(process.env.TEST_XCRUN_CALLS, { force: true });
    rmSync(process.env.TEST_PID_COUNT, { force: true });
    rmSync(outputDirectory, { force: true, recursive: true });
    rmSync(join(reportDirectory, 'report.json'), { force: true });

    if (testCase === 'write-throws') {
        mkdirSync(join(outputDirectory, 'android', 'en', 'light', '01-hero-board.png'), { recursive: true });
    }

    const result = spawnSync(process.execPath, [runner, ...argumentsList], {
        encoding: 'utf8',
        env: { ...process.env, TEST_CASE: testCase, CAPTURE_LAUNCH_SETTLE_MS: '1', CAPTURE_SCENE_SETTLE_MS: '1' }
    });
    return {
        ...result,
        calls: existsSync(process.env.TEST_ADB_CALLS) ? readFileSync(process.env.TEST_ADB_CALLS, 'utf8') : '',
        iosCalls: existsSync(process.env.TEST_XCRUN_CALLS) ? readFileSync(process.env.TEST_XCRUN_CALLS, 'utf8') : ''
    };
};

for (const [argumentsList, error] of [
    [[...baseArguments, '--scenes=unknown'], /Unknown scene/],
    [[...baseArguments, '--scenes='], /Select at least one scene/],
    [[...baseArguments, '--locales='], /Select at least one locale/],
    [[...baseArguments, '--appearances='], /Select at least one appearance/],
    [[...baseArguments, '--platform=ios'], /only supported on Android/],
    [[...baseArguments, '--scenes=pause'], /requires a deep link and ready selector/],
    [[...baseArguments, '--serial='], /Android serial is required/],
    [[...baseArguments, '--capture-mode=slow'], /capture-mode=fast/],
    [[...baseArguments, '--locales=invalid'], /Unknown locale/],
    [[...baseArguments, '--appearances=invalid'], /Unknown appearance/]
]) {
    const result = run('success', argumentsList);
    assert.notEqual(result.status, 0, result.stderr);
    assert.match(result.stderr, error);
    assert.equal(result.calls, '');
    assert.equal(result.iosCalls, '');
}

const invalidIosScene = run('success', ['--platform=ios', '--app-id=com.example.suuudokuuu', '--scenes=unknown']);
assert.notEqual(invalidIosScene.status, 0);
assert.match(invalidIosScene.stderr, /Unknown scene/);
assert.equal(invalidIosScene.iosCalls, '');

const success = run('success');
assert.equal(success.status, 0, success.stderr);
assert.match(success.calls, /-s test-serial shell pidof com\.example\.suuudokuuu/);
assert.match(success.calls, /-s test-serial shell uiautomator dump \/dev\/tty/);
assert.equal(JSON.parse(readFileSync(join(reportDirectory, 'report.json'), 'utf8'))[0].status, 'success');

for (const argumentsList of [baseArguments, baseArguments.filter(argument => argument !== '--verify')]) {
    const seedFailure = run('seed-failed', argumentsList);
    assert.notEqual(seedFailure.status, 0);
    assert.equal((seedFailure.calls.match(/exec-out screencap -p/gu) ?? []).length, 0);
    const [outcome] = JSON.parse(readFileSync(join(reportDirectory, 'report.json'), 'utf8'));
    assert.equal(outcome.status, 'failure');
    assert.match(outcome.failureOutput, /adb root is unavailable/);
}

for (const [testCase, error] of [
    ['missing-pid', /PID/],
    ['changed-pid', /PID changed/],
    ['missing-root', /GameScreenSelectors.Root/],
    ['failed-hierarchy', /hierarchy/],
    ['invalid-png', /PNG/],
    ['failed-screenshot', /screenshot/],
    ['failed-launch', /launch app/],
    ['failed-deep-link', /deep link/]
]) {
    const result = run(testCase);
    assert.notEqual(result.status, 0, `${testCase}: ${result.stderr}`);
    assert.match(result.stderr, error);
    const [outcome] = JSON.parse(readFileSync(join(reportDirectory, 'report.json'), 'utf8'));
    assert.equal(outcome.status, 'failure');
    assert.match(outcome.failureOutput, error);
    assert.ok(outcome.durationSeconds >= 0);
}

const multipleScenesArguments = [
    ...baseArguments.filter(argument => !argument.startsWith('--scenes=')),
    '--scenes=hero-board,hell'
];
const ordinaryWriteFailure = run('write-throws', multipleScenesArguments.filter(argument => argument !== '--verify'));
assert.notEqual(ordinaryWriteFailure.status, 0);
assert.match(ordinaryWriteFailure.stderr, /EISDIR|illegal operation on a directory/);
assert.equal(existsSync(join(reportDirectory, 'report.json')), false);
assert.equal((ordinaryWriteFailure.calls.match(/exec-out screencap -p/gu) ?? []).length, 1);

const verifiedWriteFailure = run('write-throws', multipleScenesArguments);
assert.notEqual(verifiedWriteFailure.status, 0);
assert.equal((verifiedWriteFailure.calls.match(/exec-out screencap -p/gu) ?? []).length, 2, verifiedWriteFailure.calls);
const verifiedOutcomes = JSON.parse(readFileSync(join(reportDirectory, 'report.json'), 'utf8'));
assert.equal(verifiedOutcomes.length, 2);
assert.equal(verifiedOutcomes[0].status, 'failure');
assert.match(verifiedOutcomes[0].failureOutput, /EISDIR|illegal operation on a directory/);
assert.equal(verifiedOutcomes[1].status, 'success');
EOF

echo 'Capture verifier self-test passed.'
