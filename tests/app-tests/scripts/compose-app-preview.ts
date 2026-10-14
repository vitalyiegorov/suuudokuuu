import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';

interface TapEvent {
    readonly endSeconds: number;
    readonly xPoints: number;
    readonly yPoints: number;
}

const HoldBeforeFirstTapSeconds = 0.7;
const LeadInSeconds = 0.2;
const RingLeadSeconds = 0.12;
const RingTrailSeconds = 0.28;
const RingSizePixels = 72;
const OutputWidth = 886;
const OutputHeight = 1920;
const DevicePointWidth = 440;
const SceneChangeThreshold = 0.003;
const TapStartPattern = /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})\.(\d+)([+-]\d{2})(\d{2}) .*Tapping ([\d.]+), ([\d.]+)$/u;
const TapDurationPattern = /^.*Tapping took ([\d.]+)$/u;
const TapTimestampPattern = /^(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})\.(\d+)([+-]\d{2})(\d{2}) /u;

const HumanGapsSeconds = '0.45 1.0 0.4 1.0 0.5 0.35 0.4 0.55 0.45 0.5 0.35 0.35 0.5 1.6 1.1 1.0 0.9 0.8 0.7 0.4 2.0'.split(' ').map(Number);

const toEpochSeconds = (line: string): number => {
    const match = TapTimestampPattern.exec(line);

    if (match === null) {
        throw new Error(`Unparseable driver log timestamp: ${line}`);
    }

    const [, date, time, fraction, zoneHours, zoneMinutes] = match;

    return Date.parse(`${date}T${time}.000${zoneHours}:${zoneMinutes}`) / 1000 + Number(`0.${fraction}`);
};

const readTapEvents = (driverLogPath: string): TapEvent[] => {
    const events: TapEvent[] = [];
    let pendingStart: { startSeconds: number; xPoints: number; yPoints: number } | null = null;

    for (const line of readFileSync(driverLogPath, 'utf8').split('\n')) {
        const startMatch = TapStartPattern.exec(line);
        const durationMatch = TapDurationPattern.exec(line);

        if (startMatch !== null) {
            pendingStart = { startSeconds: toEpochSeconds(line), xPoints: Number(startMatch[6]), yPoints: Number(startMatch[7]) };
        } else if (durationMatch !== null && pendingStart !== null) {
            events.push({
                endSeconds: pendingStart.startSeconds + Number(durationMatch[1]),
                xPoints: pendingStart.xPoints,
                yPoints: pendingStart.yPoints
            });
            pendingStart = null;
        }
    }

    return events;
};

const detectFirstSceneChangeSeconds = (recordingPath: string): number => {
    const result = spawnSync(
        'ffmpeg',
        ['-v', 'info', '-i', recordingPath, '-vf', `select='gt(scene,${SceneChangeThreshold})',showinfo`, '-an', '-f', 'null', '-'],
        { encoding: 'utf8' }
    );
    const match = /pts_time:([\d.]+)/u.exec(`${result.stdout}${result.stderr}`);

    if (match === null) {
        throw new Error('No visible change found in the recording');
    }

    return Number(match[1]);
};

const buildFilterGraph = (taps: readonly TapEvent[], videoOffsetSeconds: number): string => {
    const pieceCount = taps.length + 1;
    const splitLabels = Array.from({ length: pieceCount }, (_, index) => `[source${index}]`).join('');
    const ringLabels = taps.map((_, index) => `[ring${index}]`).join('');
    const pieceFilters: string[] = [];
    const overlayFilters: string[] = [];
    let outputCursorSeconds = HoldBeforeFirstTapSeconds;
    const firstResponseSeconds = taps[0].endSeconds + videoOffsetSeconds;

    pieceFilters.push(
        `[source0]trim=start=${firstResponseSeconds - LeadInSeconds - HoldBeforeFirstTapSeconds}:end=${firstResponseSeconds - LeadInSeconds},setpts=PTS-STARTPTS[piece0]`
    );

    taps.forEach((tap, index) => {
        const responseSeconds = tap.endSeconds + videoOffsetSeconds;
        const pieceStartSeconds = responseSeconds - LeadInSeconds;

        pieceFilters.push(
            `[source${index + 1}]trim=start=${pieceStartSeconds}:end=${pieceStartSeconds + HumanGapsSeconds[index]},setpts=PTS-STARTPTS[piece${index + 1}]`
        );

        const responseOutputSeconds = outputCursorSeconds + LeadInSeconds;
        const scale = OutputWidth / DevicePointWidth;
        const ringX = Math.round(tap.xPoints * scale - RingSizePixels / 2);
        const ringY = Math.round(tap.yPoints * scale - RingSizePixels / 2);
        const previousLabel = index === 0 ? '[cut]' : `[overlaid${index - 1}]`;

        overlayFilters.push(
            `${previousLabel}[ring${index}]overlay=x=${ringX}:y=${ringY}:enable='between(t,${responseOutputSeconds - RingLeadSeconds},${responseOutputSeconds + RingTrailSeconds})':eof_action=pass[overlaid${index}]`
        );
        outputCursorSeconds += HumanGapsSeconds[index];
    });

    const concatInputs = Array.from({ length: pieceCount }, (_, index) => `[piece${index}]`).join('');
    const ringStyle = `geq=r=255:g=255:b=255:a='255*(0.2*lt(hypot(X-${RingSizePixels / 2},Y-${RingSizePixels / 2}),30)+0.6*between(hypot(X-${RingSizePixels / 2},Y-${RingSizePixels / 2}),27,31))'`;

    return [
        `[0:v]fps=30,scale=${OutputWidth}:${OutputHeight}:flags=lanczos,setsar=1,format=yuv420p,split=${pieceCount}${splitLabels}`,
        ...pieceFilters,
        `${concatInputs}concat=n=${pieceCount}:v=1:a=0[cut]`,
        `[1:v]${ringStyle},split=${taps.length}${ringLabels}`,
        ...overlayFilters
    ].join(';');
};

const main = (): void => {
    const { values } = parseArgs({
        options: {
            'driver-log': { type: 'string' },
            output: { type: 'string' },
            recording: { type: 'string' }
        }
    });
    const { 'driver-log': driverLogPath, output: outputPath, recording: recordingPath } = values;

    if (driverLogPath === undefined || outputPath === undefined || recordingPath === undefined) {
        throw new Error('Pass --recording, --driver-log and --output');
    }

    const taps = readTapEvents(driverLogPath);

    if (taps.length !== HumanGapsSeconds.length) {
        throw new Error(`Expected ${HumanGapsSeconds.length} taps in the driver log, found ${taps.length}`);
    }

    const videoOffsetSeconds = detectFirstSceneChangeSeconds(recordingPath) - taps[0].endSeconds;
    const totalSeconds = HoldBeforeFirstTapSeconds + HumanGapsSeconds.reduce((sum, gap) => sum + gap, 0);
    const lastOverlay = `[overlaid${taps.length - 1}]`;
    const result = spawnSync(
        'ffmpeg',
        [
            '-y',
            '-i',
            recordingPath,
            '-f',
            'lavfi',
            '-i',
            `nullsrc=s=${RingSizePixels}x${RingSizePixels}:r=30,format=rgba`,
            '-f',
            'lavfi',
            '-i',
            'anullsrc=r=48000:cl=stereo',
            '-filter_complex',
            buildFilterGraph(taps, videoOffsetSeconds),
            '-map',
            lastOverlay,
            '-map',
            '2:a:0',
            '-t',
            String(totalSeconds),
            '-r',
            '30',
            '-c:v',
            'libx264',
            '-profile:v',
            'high',
            '-level:v',
            '4.0',
            '-pix_fmt',
            'yuv420p',
            '-b:v',
            '11M',
            '-minrate',
            '11M',
            '-maxrate',
            '11M',
            '-bufsize',
            '22M',
            '-x264-params',
            'nal-hrd=cbr:force-cfr=1',
            '-c:a',
            'aac',
            '-b:a',
            '256k',
            '-movflags',
            '+faststart',
            outputPath
        ],
        { encoding: 'utf8' }
    );

    if (result.status !== 0) {
        throw new Error(result.stderr);
    }
};

main();
