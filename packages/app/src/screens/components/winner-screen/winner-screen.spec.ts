import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

describe('WinnerScreen', () => {
    const readSourceFiles = (directory: string): string =>
        readdirSync(directory, { withFileTypes: true })
            .flatMap(directoryEntry => {
                const entryPath = join(directory, directoryEntry.name);

                if (directoryEntry.isDirectory()) {
                    return readSourceFiles(entryPath);
                }

                if (!directoryEntry.name.endsWith('.tsx')) {
                    return '';
                }

                return readFileSync(entryPath, 'utf8');
            })
            .join('\n');

    const source = readSourceFiles(__dirname);

    it('uses shared chrome and outcome surfaces for a responsive completed-game screen', () => {
        expect(source).toContain('GameResultPage');
        expect(source).toContain('CompletedGameResultDetails');
        expect(source).toContain('GameResultHero');
        expect(source).toContain('WinnerScreenSelectors.Root');
        expect(source).toContain('testID={WinnerScreenSelectors.Root}');
        expect(source).toContain('mistakesTestID={WinnerScreenSelectors.MistakesValue}');
        expect(source).toContain('timeTestID={WinnerScreenSelectors.TimeValue}');
        expect(source).toContain('ukraineSupportTestID={WinnerScreenSelectors.UkraineSupportCta}');
    });

    it('keeps completion actions and score presentation in the shared winner flow', () => {
        expect(source).toContain('Winner, winner!');
        expect(source).toContain('PlayAgainButton');
        expect(source).toContain('ChallengeShareButton');
        expect(source).toContain('Challenge`');
        expect(source).toContain('Home`');
        expect(source).toContain('WinnerResultHero');
        expect(source).toContain('i18n.number(score)');
        expect(source).not.toContain('gameHasNewPersonalBestScoreSelector');
        expect(source).not.toContain('useAppSelector');
        expect(source).toContain('hasNewPersonalBestScore');
        expect(source).toContain('isPersonalBest={hasNewPersonalBestScore}');
        expect(source).not.toContain('Replay');
    });

    it('starts the same completed-game setup without returning to game setup', () => {
        expect(source).toContain('GameContext');
        expect(source).toContain('create(retrySetup)');
        expect(source).toContain('retrySetup={retrySetup}');
        expect(source).toContain('<PlayAgainButton onPress={handlePlayAgain}');
        expect(source).not.toContain('sudoku.Difficulty');
    });
});
