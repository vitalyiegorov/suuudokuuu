#!/usr/bin/env python3
"""Sample Linux cgroup and host resource counters as JSONL."""
import argparse
import datetime
import json
import math
import signal
import sys
import time
from pathlib import Path

PROC = Path('/proc')
stop_requested = False


def stop(_signum, _frame):
    global stop_requested
    stop_requested = True


def unescape_mount(value):
    return value.replace('\\040', ' ').replace('\\011', '\t').replace('\\012', '\n').replace('\\134', '\\')


def cgroup_directory(proc_root):
    entries = (proc_root / 'self/cgroup').read_text().splitlines()
    unified = next((line.split(':', 2)[2] for line in entries if line.startswith('0::')), None)
    if unified is None or not unified.startswith('/'):
        raise ValueError('unified cgroup-v2 path is unavailable or invalid')
    for line in (proc_root / 'self/mountinfo').read_text().splitlines():
        fields = line.split(' ')
        separator = fields.index('-')
        if fields[separator + 1] != 'cgroup2':
            continue
        root = Path(unescape_mount(fields[3]))
        mountpoint = Path(unescape_mount(fields[4]))
        if proc_root != Path('/proc'):
            mountpoint = proc_root.parent / mountpoint.relative_to('/')
        group = Path(unified)
        try:
            relative = group.relative_to(root)
        except ValueError:
            continue
        candidate = mountpoint / relative
        if candidate.is_dir():
            return candidate
    raise ValueError('cannot resolve this process cgroup-v2 directory from mountinfo')


def read_number(path, key=None, required=False):
    try:
        content = path.read_text().strip()
    except OSError as error:
        if required:
            raise ValueError(f'required counter {path.name} unavailable') from error
        return None, f'unavailable: {error.strerror or error.__class__.__name__}'
    try:
        if key is None:
            value = int(content)
        else:
            value = None
            for line in content.splitlines():
                parts = line.split()
                if len(parts) == 2 and parts[0] == key:
                    value = int(parts[1])
                    break
            if value is None:
                raise ValueError(f'missing {key}')
        if value < 0:
            raise ValueError('negative value')
        return value, None
    except ValueError as error:
        if required:
            raise ValueError(f'required counter {path.name} is invalid') from error
        return None, f'invalid: {error}'


def read_map(path, keys, required=()):
    try:
        lines = path.read_text().splitlines()
    except OSError as error:
        if required:
            raise ValueError(f'required counters in {path.name} unavailable') from error
        return {key: None for key in keys}, {key: f'unavailable: {error.strerror or error.__class__.__name__}' for key in keys}
    values = {}
    reasons = {}
    parsed = {}
    for line in lines:
        parts = line.split()
        if len(parts) >= 2:
            try:
                parsed[parts[0].rstrip(':')] = int(parts[1])
            except ValueError:
                parsed[parts[0]] = None
    for key in keys:
        value = parsed.get(key)
        if isinstance(value, int) and value >= 0:
            values[key] = value
        else:
            values[key] = None
            reasons[key] = f'invalid or missing: {key}'
            if key in required:
                raise ValueError(f'required counter {key} in {path.name} is invalid or missing')
    return values, reasons


def read_limit(path, kind):
    try:
        content = path.read_text().strip().split()
    except OSError as error:
        raise ValueError(f'required limit {path.name} unavailable') from error
    try:
        if kind == 'cpu':
            if len(content) != 2:
                raise ValueError('expected quota and period')
            quota = content[0] if content[0] == 'max' else int(content[0])
            period = int(content[1])
            if quota != 'max' and quota <= 0 or period <= 0:
                raise ValueError('quota and period must be positive')
            return [str(quota), str(period)]
        if len(content) != 1 or content[0] != 'max' and int(content[0]) < 0:
            raise ValueError('expected max or a nonnegative byte count')
        return content[0]
    except ValueError as error:
        raise ValueError(f'required limit {path.name} is invalid') from error


def pressure(path):
    try:
        result = {}
        for line in path.read_text().splitlines():
            parts = line.split()
            if not parts:
                continue
            metrics = {}
            for item in parts[1:]:
                name, value = item.split('=', 1)
                metrics[name] = float(value) if '.' in value else int(value)
            result[parts[0]] = metrics
        if not result:
            raise ValueError('empty pressure file')
        return result, None
    except (OSError, ValueError) as error:
        return None, f'unavailable or invalid: {error}'


def sample(group, proc_root):
    memory_current, _ = read_number(group / 'memory.current', required=True)
    cpu, _ = read_map(group / 'cpu.stat', ('usage_usec', 'nr_periods', 'nr_throttled', 'throttled_usec'), required=('usage_usec', 'nr_throttled', 'throttled_usec'))
    output = {
        'monotonic_seconds': time.monotonic(),
        'wall_time_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'cgroup': {'memory_current': memory_current, 'cpu_stat': cpu},
        'optional_reasons': {},
    }
    for filename, field in (('memory.peak', 'memory_peak'), ('memory.events', 'memory_events'), ('memory.stat', 'memory_stat'), ('memory.swap.current', 'memory_swap_current'), ('memory.swap.events', 'memory_swap_events')):
        path = group / filename
        if filename in ('memory.events', 'memory.stat', 'memory.swap.events'):
            keys = ('high', 'max', 'fail') if filename == 'memory.swap.events' else ('low', 'high', 'max', 'oom', 'oom_kill') if filename == 'memory.events' else ('anon', 'file')
            values, reasons = read_map(path, keys, required=('oom', 'oom_kill') if filename == 'memory.events' else ())
            output['cgroup'][field] = values
            if reasons:
                output['optional_reasons'][field] = reasons
        else:
            value, reason = read_number(path)
            output['cgroup'][field] = value
            if reason:
                output['optional_reasons'][field] = reason
    output['cgroup']['cpu_max'] = read_limit(group / 'cpu.max', 'cpu')
    output['cgroup']['memory_max'] = read_limit(group / 'memory.max', 'memory')
    for filename in ('io.pressure', 'memory.pressure', 'cpu.pressure'):
        field = filename.replace('.', '_')
        output['cgroup'][field], reason = pressure(group / filename)
        if reason:
            output['optional_reasons'][field] = reason
    host = {}
    meminfo_keys = ('MemTotal', 'MemFree', 'MemAvailable', 'Buffers', 'Cached', 'SwapTotal', 'SwapFree')
    values, reasons = read_map(proc_root / 'meminfo', meminfo_keys)
    host['meminfo'] = values
    if reasons:
        output['optional_reasons']['host_meminfo'] = reasons
    values, reasons = read_map(proc_root / 'vmstat', ('pswpin', 'pswpout'))
    host['vmstat'] = values
    if reasons:
        output['optional_reasons']['host_vmstat'] = reasons
    output['host'] = host
    return output


def write_status(path, exit_code, stop_reason, samples, last_wall_time_utc=None):
    status = {
        'exit_code': exit_code,
        'stop_reason': stop_reason,
        'samples': samples,
        'last_wall_time_utc': last_wall_time_utc,
    }
    path.write_text(json.dumps(status, separators=(',', ':')) + '\n', encoding='utf-8')


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', required=True, type=Path)
    parser.add_argument('--stop-file', required=True, type=Path)
    parser.add_argument('--interval', required=True, type=float)
    parser.add_argument('--duration', required=True, type=float)
    args = parser.parse_args()
    status_path = args.output.with_suffix('.status.json')
    try:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        status_path.unlink(missing_ok=True)
        if not math.isfinite(args.interval) or not math.isfinite(args.duration) or args.interval <= 0 or args.duration <= 0 or args.duration > 3600:
            write_status(status_path, 1, 'error', 0)
            parser.error('interval and duration must be positive; duration must not exceed 3600 seconds')
        samples = 0
        last_wall_time_utc = None
        try:
            group = cgroup_directory(PROC)
            signal.signal(signal.SIGTERM, stop)
            signal.signal(signal.SIGINT, stop)
            deadline = time.monotonic() + args.duration
            stop_reason = 'duration'
            with args.output.open('w', encoding='utf-8') as output:
                while True:
                    record = sample(group, PROC)
                    output.write(json.dumps(record, separators=(',', ':')) + '\n')
                    output.flush()
                    samples += 1
                    last_wall_time_utc = record['wall_time_utc']
                    if stop_requested:
                        stop_reason = 'signal'
                        break
                    if args.stop_file.exists():
                        stop_reason = 'stop_file'
                        break
                    if time.monotonic() >= deadline:
                        break
                    time.sleep(min(args.interval, max(0, deadline - time.monotonic())))
            write_status(status_path, 0, stop_reason, samples, last_wall_time_utc)
            return 0
        except (OSError, ValueError) as error:
            print(f'android-benchmark-collect: {error}', file=sys.stderr)
            write_status(status_path, 1, 'error', samples, last_wall_time_utc)
            return 1
    except OSError as error:
        print(f'android-benchmark-collect: {error}', file=sys.stderr)
        return 1


if __name__ == '__main__':
    raise SystemExit(main())
