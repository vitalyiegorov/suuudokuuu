import { availableParallelism } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Worker } from 'node:worker_threads';

const SCRIPT_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const WORKER_FILE = join(SCRIPT_DIRECTORY, 'rate-puzzle-worker.mjs');

const createShards = (lines, shardCount) => {
    const shards = Array.from({ length: shardCount }, () => []);

    lines.forEach((line, candidateIndex) => {
        shards[candidateIndex % shardCount].push({ candidateIndex, line });
    });

    return shards.filter(shard => shard.length > 0);
};

const runShard = shardEntries =>
    new Promise((resolve, reject) => {
        const worker = new Worker(WORKER_FILE, { workerData: { shardEntries } });

        worker.once('message', ratedEntries => {
            resolve(ratedEntries);
        });
        worker.once('error', reject);
        worker.once('exit', () => void worker.terminate());
    });

export const ratePuzzlesInParallel = async (lines, requestedWorkerCount = availableParallelism()) => {
    const shardCount = Math.max(1, Math.min(requestedWorkerCount, lines.length));
    const shards = createShards(lines, shardCount);
    const shardResults = await Promise.all(shards.map(runShard));
    const ratingsByCandidateIndex = new Array(lines.length);

    shardResults.flat().forEach(({ candidateIndex, rating, isCeiling }) => {
        ratingsByCandidateIndex[candidateIndex] = { rating, isCeiling };
    });

    return ratingsByCandidateIndex;
};
