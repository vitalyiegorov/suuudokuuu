import { parentPort, workerData } from 'node:worker_threads';

import { ratePuzzle } from '@suuudokuuu/rating';

const { shardEntries } = workerData;

const ratedEntries = shardEntries.map(({ candidateIndex, line }) => {
    const { rating, isCeiling, hardestTechnique } = ratePuzzle(line);

    return { candidateIndex, rating, isCeiling, hardestTechnique };
});

parentPort.postMessage(ratedEntries);
