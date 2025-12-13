import { SerializableSudoku } from '../../classes/serializable-sudoku/serializable-sudoku';
import { defaultSudokuConfig } from '../../interfaces/sudoku-config.interface';

import { TechniqueManager } from './technique-manager';

import type { FieldInterface } from '../../interfaces/field.interface';

const createFieldFromString = (fieldString: string): FieldInterface => {
    const [field] = SerializableSudoku.convertFieldFromString(fieldString, defaultSudokuConfig);

    return field;
};

describe('TechniqueManager Performance Tests', () => {
    let manager: TechniqueManager;

    beforeEach(() => {
        manager = new TechniqueManager();
    });

    it('should measure performance on nightmare difficulty field', () => {
        const nightmareField = createFieldFromString(
            '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..'
        );

        const iterations = 100;
        const times: number[] = [];
        let firstHint = null;

        for (let i = 0; i < iterations; i += 1) {
            const startTime = performance.now();
            const hint = manager.findNextStep(nightmareField);
            const endTime = performance.now();
            times.push(endTime - startTime);

            if (i === 0) {
                firstHint = hint;
            }

            expect(hint).toBeDefined();
        }

        const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);

        console.log('\n=== Nightmare Field Performance ===');
        console.log(`Iterations: ${iterations}`);
        console.log(`Average time: ${avgTime.toFixed(3)}ms`);
        console.log(`Min time: ${minTime.toFixed(3)}ms`);
        console.log(`Max time: ${maxTime.toFixed(3)}ms`);
        console.log(
            `First hint found: ${firstHint?.technique} at (${firstHint?.cell.x}, ${firstHint?.cell.y}) = ${firstHint?.value}`
        );

        expect(avgTime).toBeLessThan(20);
    });

    it('should measure performance on expert difficulty field', () => {
        const expertField = createFieldFromString(
            '..9.7...5..21..9..1...28....7...5..1..851.....5....3.......3..68........21.....87'
        );

        const iterations = 100;
        const times: number[] = [];

        for (let i = 0; i < iterations; i += 1) {
            const startTime = performance.now();
            const hint = manager.findNextStep(expertField);
            const endTime = performance.now();
            times.push(endTime - startTime);

            expect(hint).toBeDefined();
        }

        const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);

        console.log('\n=== Expert Field Performance ===');
        console.log(`Iterations: ${iterations}`);
        console.log(`Average time: ${avgTime.toFixed(3)}ms`);
        console.log(`Min time: ${minTime.toFixed(3)}ms`);
        console.log(`Max time: ${maxTime.toFixed(3)}ms`);

        expect(avgTime).toBeLessThan(5);
    });

    it('should measure performance on easy difficulty field', () => {
        const easyField = createFieldFromString(
            '.43.8.25.6...1...79...5.....76...8.5.817.69.34.5...71.....3...24...9...5.96.3.87.'
        );

        const iterations = 100;
        const times: number[] = [];

        for (let i = 0; i < iterations; i += 1) {
            const startTime = performance.now();
            const hint = manager.findNextStep(easyField);
            const endTime = performance.now();
            times.push(endTime - startTime);

            expect(hint).toBeDefined();
        }

        const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);

        console.log('\n=== Easy Field Performance ===');
        console.log(`Iterations: ${iterations}`);
        console.log(`Average time: ${avgTime.toFixed(3)}ms`);
        console.log(`Min time: ${minTime.toFixed(3)}ms`);
        console.log(`Max time: ${maxTime.toFixed(3)}ms`);

        expect(avgTime).toBeLessThan(1);
    });

    it('should measure worst-case performance (scanning all cells)', () => {
        const fieldWithHiddenTechniquesOnly = createFieldFromString(
            '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8..79'
        );

        const iterations = 50;
        const times: number[] = [];

        for (let i = 0; i < iterations; i += 1) {
            const startTime = performance.now();
            const hint = manager.findNextStep(fieldWithHiddenTechniquesOnly);
            const endTime = performance.now();
            times.push(endTime - startTime);
        }

        const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);

        console.log('\n=== Worst-Case Performance (Hidden Techniques) ===');
        console.log(`Iterations: ${iterations}`);
        console.log(`Average time: ${avgTime.toFixed(3)}ms`);
        console.log(`Min time: ${minTime.toFixed(3)}ms`);
        console.log(`Max time: ${maxTime.toFixed(3)}ms`);

        expect(avgTime).toBeLessThan(15);
    });

    it('should measure early-exit efficiency (FullHouse available)', () => {
        const fieldWithFullHouse = createFieldFromString(
            '123456789456789123789123456231564897564897231897231564312645978645978312.78312645'
        );

        const iterations = 1000;
        const times: number[] = [];

        for (let i = 0; i < iterations; i += 1) {
            const startTime = performance.now();
            const hint = manager.findNextStep(fieldWithFullHouse);
            const endTime = performance.now();
            times.push(endTime - startTime);
        }

        const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);

        console.log('\n=== Early-Exit Performance (FullHouse) ===');
        console.log(`Iterations: ${iterations}`);
        console.log(`Average time: ${avgTime.toFixed(3)}ms`);
        console.log(`Min time: ${minTime.toFixed(3)}ms`);
        console.log(`Max time: ${maxTime.toFixed(3)}ms`);

        expect(avgTime).toBeLessThan(0.5);
    });

    it('should provide performance summary and recommendations', () => {
        const testCases = [
            { name: 'Easy', field: '.43.8.25.6...1...79...5.....76...8.5.817.69.34.5...71.....3...24...9...5.96.3.87.' },
            { name: 'Medium', field: '..9.7...5..21..9..1...28....7...5..1..851.....5....3.......3..68........21.....87' },
            {
                name: 'Nightmare',
                field: '8..........36......7..9.2...5...7.......457.....1...3...1....68..85...1..9....4..'
            }
        ];

        console.log('\n=== Performance Summary ===');

        const results = testCases.map(testCase => {
            const field = createFieldFromString(testCase.field);
            const startTime = performance.now();
            const hint = manager.findNextStep(field);
            const endTime = performance.now();
            const time = endTime - startTime;

            console.log(`${testCase.name}: ${time.toFixed(3)}ms - Found: ${hint?.technique}`);

            return { name: testCase.name, time, hint };
        });

        console.log('\n=== Analysis ===');
        console.log('Algorithm complexity: O(T × C × K) where:');
        console.log('- T = number of techniques (17)');
        console.log('- C = number of empty cells (varies)');
        console.log('- K = average candidates per cell (1-9)');
        console.log('\nWith early exit optimization:');
        console.log('- Best case: O(1) - First cell, first technique');
        console.log('- Average case: O(T × C/2) - Finds hint midway');
        console.log('- Worst case: O(T × C × 9) - Must check all cells/techniques');
        console.log('\nActual performance is well within acceptable limits for real-time hints.');

        results.forEach(result => {
            expect(result.time).toBeLessThan(20);
        });
    });
});
