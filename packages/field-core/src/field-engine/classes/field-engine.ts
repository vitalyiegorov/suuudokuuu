import { Sudoku, defaultSudokuConfig, emptyScoredCells } from '@suuudokuuu/generator';

import { isDefined } from '@rnw-community/shared';

import { cloneFieldCells } from '../../@generic/utils/clone-field-cells.util';
import { getCellKey } from '../../@generic/utils/get-cell-key.util';
import {
    cloneCandidateState,
    getAutoCellCandidates,
    getCandidatesWithElimination,
    getCandidatesWithoutValue,
    getToggledCandidates
} from '../utils/candidate-mutation.util';
import { getNeighbourCell } from '../utils/get-neighbour-cell.util';
import { pruneCandidates } from '../utils/prune-candidates.util';

import { FieldHistory } from './field-history';
import { FieldStore } from './field-store';

import type { StepScriptInterface } from '../../step-script/interfaces/step-script.interface';
import type { FieldCandidateStateInterface } from '../interfaces/field-candidate-state.interface';
import type { FieldEngineOptionsInterface } from '../interfaces/field-engine-options.interface';
import type { FieldHistoryStateInterface } from '../interfaces/field-history-state.interface';
import type { FieldMoveResultInterface } from '../interfaces/field-move-result.interface';
import type { FieldSnapshotInterface } from '../interfaces/field-snapshot.interface';
import type { SerializedFieldStateInterface } from '../interfaces/serialized-field-state.interface';
import type { FieldDirectionType } from '../types/field-direction.type';
import type { FieldInputModeType } from '../types/field-input-mode.type';
import type { CellInterface, DifficultyEnum } from '@suuudokuuu/generator';

export class FieldEngine extends FieldStore {
    private readonly difficulty: DifficultyEnum;
    private readonly history = new FieldHistory();

    private sudoku: Sudoku;
    private selectedCell?: CellInterface;
    private candidateState: FieldCandidateStateInterface;
    private inputMode: FieldInputModeType;
    private showAutoCandidates: boolean;
    private mistakes: number;
    private stepScript: StepScriptInterface | null = null;
    private stepIndex = 0;

    constructor(options: FieldEngineOptionsInterface) {
        super();

        this.difficulty = options.difficulty;
        this.sudoku = Sudoku.fromString(options.sudokuString, { ...defaultSudokuConfig });
        this.candidateState = { candidates: options.candidates ?? {}, eliminatedCandidates: options.eliminatedCandidates ?? {} };
        this.inputMode = options.inputMode ?? 'normal';
        this.showAutoCandidates = options.showAutoCandidates ?? false;
        this.mistakes = options.mistakes ?? 0;
    }

    get Sudoku(): Sudoku {
        return this.sudoku;
    }

    serialize(): SerializedFieldStateInterface {
        return {
            sudokuString: this.sudoku.toString(),
            difficulty: this.difficulty,
            ...cloneCandidateState(this.candidateState),
            inputMode: this.inputMode,
            showAutoCandidates: this.showAutoCandidates,
            mistakes: this.mistakes
        };
    }

    selectCell(cell?: CellInterface): void {
        this.selectedCell = cell;
        this.publish();
    }

    moveSelection(direction: FieldDirectionType): void {
        this.selectedCell = getNeighbourCell(this.sudoku, direction, this.selectedCell);
        this.publish();
    }

    toggleInputMode(): void {
        this.inputMode = this.inputMode === 'normal' ? 'candidate' : 'normal';
        this.showAutoCandidates = this.inputMode === 'candidate' ? false : this.showAutoCandidates;
        this.publish();
    }

    toggleShowAutoCandidates(): void {
        this.showAutoCandidates = !this.showAutoCandidates;
        this.inputMode = this.showAutoCandidates ? 'normal' : this.inputMode;
        this.publish();
    }

    getCellCandidates(cell: CellInterface): number[] {
        return this.showAutoCandidates
            ? getAutoCellCandidates(this.sudoku, this.candidateState.eliminatedCandidates, cell)
            : (this.candidateState.candidates[getCellKey(cell)] ?? []);
    }

    inputValue(value: number): FieldMoveResultInterface | null {
        const { selectedCell } = this;

        if (!this.sudoku.isBlankCell(selectedCell)) {
            return null;
        }

        if (this.inputMode === 'candidate') {
            this.toggleCandidate(selectedCell, value);

            return null;
        }

        return this.placeValue(selectedCell, value);
    }

    placeValue(cell: CellInterface, value: number): FieldMoveResultInterface | null {
        if (!this.sudoku.isBlankCell(cell)) {
            return null;
        }

        const targetCell = { ...cell, value };

        return this.sudoku.isCorrectValue(targetCell) ? this.registerPlacement(targetCell) : this.registerMistake(targetCell);
    }

    toggleCandidate(cell: CellInterface, value: number): void {
        const candidates = getToggledCandidates(this.candidateState.candidates, cell, value);

        this.commitCandidateState({ ...this.candidateState, candidates });
    }

    removeCandidate(cell: CellInterface, value: number): void {
        if (this.showAutoCandidates) {
            const eliminatedCandidates = getCandidatesWithElimination(this.candidateState.eliminatedCandidates, cell, value);

            if (isDefined(eliminatedCandidates)) {
                this.commitCandidateState({ ...this.candidateState, eliminatedCandidates });
            }

            return;
        }

        const candidates = getCandidatesWithoutValue(this.candidateState.candidates, cell, value);

        if (isDefined(candidates)) {
            this.commitCandidateState({ ...this.candidateState, candidates });
        }
    }

    undo(): boolean {
        return this.restoreState(this.history.undo());
    }

    redo(): boolean {
        return this.restoreState(this.history.redo());
    }

    startStepScript(script: StepScriptInterface): void {
        this.stepScript = script;
        this.stepIndex = 0;
        this.publish();
    }

    stepScriptNext(): boolean {
        if (!isDefined(this.stepScript) || this.stepIndex >= this.stepScript.steps.length - 1) {
            return false;
        }

        this.stepIndex += 1;
        this.publish();

        return true;
    }

    stepScriptBack(): boolean {
        if (!isDefined(this.stepScript) || this.stepIndex === 0) {
            return false;
        }

        this.stepIndex -= 1;
        this.publish();

        return true;
    }

    stepScriptReset(): boolean {
        if (!isDefined(this.stepScript)) {
            return false;
        }

        this.stepIndex = 0;
        this.publish();

        return true;
    }

    applyStepScript(): void {
        const script = this.stepScript;

        if (!isDefined(script)) {
            return;
        }

        for (const elimination of script.eliminations) {
            this.removeCandidate(elimination.cell, elimination.value);
        }

        const { placement } = script;

        if (isDefined(placement)) {
            this.placeValue(placement.cell, placement.value);
        }

        this.stopStepScript();
    }

    stopStepScript(): void {
        if (isDefined(this.stepScript)) {
            this.stepScript = null;
            this.stepIndex = 0;
            this.publish();
        }
    }

    protected override createSnapshot(): FieldSnapshotInterface {
        return {
            field: cloneFieldCells(this.sudoku.Field),
            difficulty: this.difficulty,
            sudokuString: this.sudoku.toString(),
            ...this.candidateState,
            inputMode: this.inputMode,
            showAutoCandidates: this.showAutoCandidates,
            mistakes: this.mistakes,
            isWon: this.sudoku.PossibleValues.length === 0,
            canUndo: this.history.CanUndo,
            canRedo: this.history.CanRedo,
            stepScript: this.stepScript,
            stepIndex: this.stepIndex,
            ...(isDefined(this.selectedCell) && { selectedCell: this.selectedCell })
        };
    }

    private registerPlacement(cell: CellInterface): FieldMoveResultInterface {
        const previousState = this.captureState();
        const scoredCells = this.sudoku.setCellValue(cell);

        this.candidateState = { ...this.candidateState, candidates: pruneCandidates(this.sudoku, this.candidateState.candidates, cell) };
        this.selectedCell = { ...cell };
        this.history.push({ previous: previousState, next: this.captureState() });

        const result: FieldMoveResultInterface = { cell, isCorrect: true, scoredCells };

        this.publish();
        this.events.emit('moveApplied', result);

        if (scoredCells.isWon) {
            this.events.emit('completed', scoredCells);
        }

        return result;
    }

    private registerMistake(cell: CellInterface): FieldMoveResultInterface {
        this.mistakes += 1;

        const result: FieldMoveResultInterface = { cell, isCorrect: false, scoredCells: { ...emptyScoredCells } };

        this.publish();
        this.events.emit('mistake', { cell, mistakes: this.mistakes });

        return result;
    }

    private commitCandidateState(nextState: FieldCandidateStateInterface): void {
        const previousState = this.captureState();

        this.candidateState = nextState;
        this.history.push({ previous: previousState, next: this.captureState() });
        this.publish();
    }

    private captureState(): FieldHistoryStateInterface {
        return { sudokuString: this.sudoku.toString(), ...cloneCandidateState(this.candidateState) };
    }

    private restoreState(state: FieldHistoryStateInterface | null): boolean {
        if (!isDefined(state)) {
            return false;
        }

        if (state.sudokuString !== this.sudoku.toString()) {
            this.sudoku = Sudoku.fromString(state.sudokuString, { ...defaultSudokuConfig });
        }

        this.candidateState = cloneCandidateState(state);
        this.publish();

        return true;
    }
}
