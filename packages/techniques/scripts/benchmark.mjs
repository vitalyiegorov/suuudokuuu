import { performance } from 'node:perf_hooks';

import { Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';

import { TechniqueManager, interactiveTechniqueOrder } from '../dist/esm/index.js';

import { benchmarkBoards } from './benchmark-boards.mjs';

const WARMUP_ITERATION_COUNT = 1;
const MEASURED_ITERATION_COUNT = 3;

const NAME_COLUMN_WIDTH = 34;
const NUMBER_COLUMN_WIDTH = 16;
const COUNT_COLUMN_WIDTH = 8;

const createSudoku = board => Sudoku.fromString(board, defaultSudokuConfig);

const median = values => {
    const sortedValues = [...values].sort((firstValue, secondValue) => firstValue - secondValue);
    const middleIndex = Math.floor(sortedValues.length / 2);
    const isEvenLength = sortedValues.length % 2 === 0;

    return isEvenLength ? (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2 : sortedValues[middleIndex];
};

const pickMedianIteration = iterations => {
    const sortedIterations = [...iterations].sort(
        (firstIteration, secondIteration) => firstIteration.totalDurationMilliseconds - secondIteration.totalDurationMilliseconds
    );
    const middleIndex = Math.floor(sortedIterations.length / 2);

    return sortedIterations[middleIndex];
};

const runIterations = (iterationCount, unitRunner) => {
    const iterations = [];

    for (let iterationIndex = 0; iterationIndex < iterationCount; iterationIndex += 1) {
        const unitDurationsMilliseconds = [];
        const startTime = performance.now();

        unitRunner(unitDurationsMilliseconds);

        const totalDurationMilliseconds = performance.now() - startTime;

        iterations.push({ totalDurationMilliseconds, unitDurationsMilliseconds });
    }

    return iterations;
};

const summarizeWorkload = (name, iterations) => {
    const totalDurations = iterations.map(iteration => iteration.totalDurationMilliseconds);
    const medianTotalMilliseconds = median(totalDurations);
    const medianIteration = pickMedianIteration(iterations);
    const unitDurationsMilliseconds = medianIteration.unitDurationsMilliseconds;
    const unitDurationSum = unitDurationsMilliseconds.reduce((sum, duration) => sum + duration, 0);
    const meanUnitMilliseconds = unitDurationSum / unitDurationsMilliseconds.length;
    const maxUnitMilliseconds = Math.max(...unitDurationsMilliseconds);

    return { name, medianTotalMilliseconds, meanUnitMilliseconds, maxUnitMilliseconds, unitCount: unitDurationsMilliseconds.length };
};

const runWorkload = (name, unitRunner) => {
    runIterations(WARMUP_ITERATION_COUNT, unitRunner);
    const measuredIterations = runIterations(MEASURED_ITERATION_COUNT, unitRunner);

    return summarizeWorkload(name, measuredIterations);
};

const runSolveLogicallyFull = unitDurationsMilliseconds => {
    benchmarkBoards.forEach(board => {
        const sudoku = createSudoku(board);
        const startTime = performance.now();

        new TechniqueManager(sudoku).solveLogically();

        unitDurationsMilliseconds.push(performance.now() - startTime);
    });
};

const runFindNextStepSweep = unitDurationsMilliseconds => {
    benchmarkBoards.forEach(board => {
        const sudoku = createSudoku(board);
        const startTime = performance.now();

        new TechniqueManager(sudoku).findNextStep();

        unitDurationsMilliseconds.push(performance.now() - startTime);
    });
};

const buildSolvableBoardMoves = () =>
    benchmarkBoards
        .map(board => {
            const solveResult = new TechniqueManager(createSudoku(board)).solveLogically();
            const placementSteps = solveResult.steps
                .filter(step => step.kind === 'placement')
                .map(step => ({ x: step.cell.x, y: step.cell.y, value: step.value }));

            return { board, outcome: solveResult.outcome, placementSteps };
        })
        .filter(solvedBoard => solvedBoard.outcome === 'solved');

const createIdentifyMoveReplayRunner = (solvableBoards, techniqueOrder) => unitDurationsMilliseconds => {
    solvableBoards.forEach(({ board, placementSteps }) => {
        const sudoku = createSudoku(board);

        placementSteps.forEach(placementStep => {
            const existingCell = sudoku.Field[placementStep.y][placementStep.x];
            const playedCell = { ...existingCell, value: placementStep.value };
            const startTime = performance.now();

            new TechniqueManager(sudoku).identifyMove(playedCell, techniqueOrder);

            unitDurationsMilliseconds.push(performance.now() - startTime);
            sudoku.Field[placementStep.y][placementStep.x] = playedCell;
        });
    });
};

const hashString = value => {
    let hash = 0x811c9dc5;

    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 0x01000193) >>> 0;
    }

    return hash.toString(16).padStart(8, '0');
};

const describeSolveStep = step => {
    const eliminations = step.eliminations
        .map(elimination => `${elimination.cell.y}.${elimination.cell.x}.${elimination.value}`)
        .sort()
        .join(',');

    return `${step.technique}|${step.kind}|${step.cell.y}.${step.cell.x}|${step.value}|${eliminations}`;
};

const buildSolveChecksum = board => {
    const solveResult = new TechniqueManager(createSudoku(board)).solveLogically();
    const description = `${solveResult.outcome}|${String(solveResult.wasSearchCapped)}|${solveResult.steps
        .map(describeSolveStep)
        .join(';')}`;

    return `${hashString(description)}:${solveResult.steps.length}`;
};

const buildIdentifyChecksum = (board, placementSteps) => {
    const sudoku = createSudoku(board);
    const techniques = [];

    placementSteps.forEach(placementStep => {
        const existingCell = sudoku.Field[placementStep.y][placementStep.x];
        const playedCell = { ...existingCell, value: placementStep.value };
        const classification = new TechniqueManager(sudoku).identifyMove(playedCell);

        techniques.push(`${classification.technique}.${classification.value}`);
        sudoku.Field[placementStep.y][placementStep.x] = playedCell;
    });

    return `${hashString(techniques.join(','))}:${techniques.length}`;
};

const printBehaviorChecksums = solvableBoards => {
    console.log('');
    console.log('Behavior checksums (solveLogically / identifyMove-full-replay)');

    benchmarkBoards.forEach((board, boardIndex) => {
        const solvableBoard = solvableBoards.find(candidateBoard => candidateBoard.board === board);
        const solveChecksum = buildSolveChecksum(board);
        const identifyChecksum = solvableBoard === undefined ? 'unsolved' : buildIdentifyChecksum(board, solvableBoard.placementSteps);

        console.log(`board-${String(boardIndex).padStart(2, '0')} solve=${solveChecksum} identify=${identifyChecksum}`);
    });
};

const formatMilliseconds = milliseconds => milliseconds.toFixed(2);

const printTableRow = (name, medianTotalMilliseconds, meanUnitMilliseconds, maxUnitMilliseconds, unitCount) => {
    const nameCell = name.padEnd(NAME_COLUMN_WIDTH);
    const medianTotalCell = formatMilliseconds(medianTotalMilliseconds).padStart(NUMBER_COLUMN_WIDTH);
    const meanUnitCell = formatMilliseconds(meanUnitMilliseconds).padStart(NUMBER_COLUMN_WIDTH);
    const maxUnitCell = formatMilliseconds(maxUnitMilliseconds).padStart(NUMBER_COLUMN_WIDTH);
    const unitCountCell = String(unitCount).padStart(COUNT_COLUMN_WIDTH);

    console.log(`${nameCell}${medianTotalCell}${meanUnitCell}${maxUnitCell}${unitCountCell}`);
};

const printSolvabilityReport = solvedBoardCount => {
    console.log(`Boards: ${benchmarkBoards.length} total, ${solvedBoardCount} solved by solveLogically()`);
    console.log('');
};

const main = () => {
    const wallStartTime = performance.now();
    const solvableBoards = buildSolvableBoardMoves();

    printSolvabilityReport(solvableBoards.length);

    const workloadResults = [
        runWorkload('solveLogically-full', runSolveLogicallyFull),
        runWorkload('identifyMove-full-replay', createIdentifyMoveReplayRunner(solvableBoards, undefined)),
        runWorkload('identifyMove-interactive-replay', createIdentifyMoveReplayRunner(solvableBoards, interactiveTechniqueOrder)),
        runWorkload('findNextStep-sweep', runFindNextStepSweep)
    ];

    console.log(
        `${'Workload'.padEnd(NAME_COLUMN_WIDTH)}${'Median Total (ms)'.padStart(NUMBER_COLUMN_WIDTH)}${'Mean/Unit (ms)'.padStart(
            NUMBER_COLUMN_WIDTH
        )}${'Max/Unit (ms)'.padStart(NUMBER_COLUMN_WIDTH)}${'Units'.padStart(COUNT_COLUMN_WIDTH)}`
    );
    workloadResults.forEach(result =>
        printTableRow(result.name, result.medianTotalMilliseconds, result.meanUnitMilliseconds, result.maxUnitMilliseconds, result.unitCount)
    );

    printBehaviorChecksums(solvableBoards);

    const wallTotalMilliseconds = performance.now() - wallStartTime;

    console.log('');
    console.log(`Total wall time: ${formatMilliseconds(wallTotalMilliseconds)} ms`);
};

main();
