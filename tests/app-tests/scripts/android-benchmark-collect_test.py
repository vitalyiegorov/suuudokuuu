import importlib.util
import json
import sys
import tempfile
import unittest
from unittest.mock import patch
from pathlib import Path

SCRIPT = Path(__file__).with_name('android-benchmark-collect.py')
spec = importlib.util.spec_from_file_location('android_benchmark_collect', SCRIPT)
collector = importlib.util.module_from_spec(spec)
spec.loader.exec_module(collector)


class CollectorTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.root = Path(self.temporary.name)

    def tearDown(self):
        self.temporary.cleanup()

    def put(self, relative, content):
        path = self.root / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content)
        return path

    def test_resolves_nested_cgroup_mount(self):
        self.put('proc/self/cgroup', '0::/tenant/work/job\n')
        self.put('proc/self/mountinfo', '31 22 0:29 /tenant /proc/cgroup rw,nosuid - cgroup2 cgroup rw\n')
        expected = self.root / 'proc/cgroup/work/job'
        expected.mkdir(parents=True)
        self.assertEqual(collector.cgroup_directory(self.root / 'proc'), expected)

    def test_namespace_root_mount_resolution(self):
        self.put('proc/self/cgroup', '0::/\n')
        self.put('proc/self/mountinfo', '31 22 0:29 / /sys/fs/cgroup rw - cgroup2 cgroup rw\n')
        expected = self.root / 'sys/fs/cgroup'
        expected.mkdir(parents=True)
        self.assertEqual(collector.cgroup_directory(self.root / 'proc'), expected)

    def test_zero_is_valid_and_missing_optional_is_null(self):
        path = self.put('zero', '0\n')
        self.assertEqual(collector.read_number(path), (0, None))
        missing, reason = collector.read_number(self.root / 'absent')
        self.assertIsNone(missing)
        self.assertIn('unavailable', reason)

    def test_required_oom_counters_fail_when_missing(self):
        path = self.put('memory.events', 'high 0\nmax 0\n')
        with self.assertRaisesRegex(ValueError, 'oom'):
            collector.read_map(path, ('oom', 'oom_kill'), required=('oom', 'oom_kill'))

    def test_malformed_required_counter_fails(self):
        path = self.put('memory.current', 'not-a-number\n')
        with self.assertRaisesRegex(ValueError, 'invalid'):
            collector.read_number(path, required=True)

    def test_malformed_required_limits_fail(self):
        group = self.root / 'group'
        group.mkdir()
        (group / 'cpu.max').write_text('bad 100000\n')
        (group / 'memory.max').write_text('max\n')
        with self.assertRaisesRegex(ValueError, 'cpu.max'):
            collector.read_limit(group / 'cpu.max', 'cpu')
        (group / 'cpu.max').write_text('100000 100000\n')
        (group / 'memory.max').write_text('-1\n')
        with self.assertRaisesRegex(ValueError, 'memory.max'):
            collector.read_limit(group / 'memory.max', 'memory')

    def test_nonfinite_cli_values_are_rejected(self):
        for interval, duration in (('nan', '1'), ('inf', '1'), ('0.1', 'inf')):
            arguments = ['collector', '--output', str(self.root / 'out'), '--stop-file', str(self.root / 'stop'), '--interval', interval, '--duration', duration]
            with patch.object(sys, 'argv', arguments):
                with self.assertRaises(SystemExit) as error:
                    collector.main()
            self.assertEqual(error.exception.code, 2)


    def test_required_counter_failure_writes_fresh_failure_status(self):
        proc = self.root / 'proc'
        group = self.root / 'group'
        group.mkdir()
        (group / 'memory.current').write_text('0')
        proc.mkdir()
        output = self.root / 'samples.jsonl'
        status_path = output.with_suffix('.status.json')
        status_path.write_text('{"exit_code":0}')
        arguments = ['collector', '--output', str(output), '--stop-file', str(self.root / 'stop'), '--interval', '0.01', '--duration', '1']
        with patch.object(collector, 'PROC', proc), patch.object(collector, 'cgroup_directory', return_value=group), patch.object(sys, 'argv', arguments):
            self.assertEqual(collector.main(), 1)
        status = json.loads(status_path.read_text())
        self.assertEqual(status['exit_code'], 1)
        self.assertEqual(status['stop_reason'], 'error')
        self.assertEqual(status['samples'], 0)
        self.assertIsNone(status['last_wall_time_utc'])

    def test_stopfile_integration_writes_final_flushed_sample(self):
        proc = self.root / 'proc'
        group = self.root / 'group'
        group.mkdir()
        (group / 'memory.current').write_text('0')
        (group / 'cpu.stat').write_text('usage_usec 0\nnr_throttled 0\nthrottled_usec 0\n')
        (group / 'memory.events').write_text('oom 0\noom_kill 0\n')
        (group / 'cpu.max').write_text('max 100000\n')
        (group / 'memory.max').write_text('max\n')
        proc.mkdir()
        (proc / 'meminfo').write_text('MemTotal: 1 kB\nMemFree: 0 kB\nMemAvailable: 0 kB\nBuffers: 0 kB\nCached: 0 kB\nSwapTotal: 0 kB\nSwapFree: 0 kB\n')
        (proc / 'vmstat').write_text('pswpin 0\npswpout 0\n')
        output = self.root / 'samples.jsonl'
        stop_file = self.root / 'stop'
        stop_file.touch()
        arguments = ['collector', '--output', str(output), '--stop-file', str(stop_file), '--interval', '0.01', '--duration', '1']
        with patch.object(collector, 'PROC', proc), patch.object(collector, 'cgroup_directory', return_value=group), patch.object(sys, 'argv', arguments):
            self.assertEqual(collector.main(), 0)
        records = [json.loads(line) for line in output.read_text().splitlines()]
        self.assertEqual(len(records), 1)
        self.assertEqual(records[0]['cgroup']['memory_current'], 0)
        self.assertEqual(records[0]['cgroup']['cpu_stat']['usage_usec'], 0)
        self.assertEqual(records[0]['host']['meminfo']['MemTotal'], 1)
        status_path = output.with_suffix('.status.json')
        status = json.loads(status_path.read_text())
        self.assertEqual(status['exit_code'], 0)
        self.assertEqual(status['stop_reason'], 'stop_file')
        self.assertEqual(status['samples'], 1)
        self.assertEqual(status['last_wall_time_utc'], records[0]['wall_time_utc'])


if __name__ == '__main__':
    unittest.main()
