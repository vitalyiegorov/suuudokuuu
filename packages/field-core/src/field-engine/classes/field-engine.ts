import { Sudoku, defaultSudokuConfig, emptyScoredCells } from '@suuudokuuu/generator';

import { isDefined } from '@rnw-community/shared';

import { cloneFieldCells } from '../../@generic/utils/clone-field-cells.util';
import { getCellKey } from '../../@generic/utils/get-cell-key.util';
import { StepScriptPlayer } from '../../step-script/classes/step-script-player';
import { FieldHistoryKindEnum } from '../enums/field-history-kind.enum';
import { getNeighbourCell } from '../utils/get-neighbour-cell.util';
import { pruneCandidates } from '../utils/prune-candidates.util';

import { FieldHistory } from './field-history';
import { FieldStore } from './field-store';

import type { StepScriptInterface } from '../../step-script/interfaces/step-script.interface';
import type { FieldEngineOptionsInterface } from '../interfaces/field-engine-options.interface';
import type { FieldHistoryStateInterface } from '../interfaces/field-history-state.interface';
import type { FieldMoveResultInterface } from '../interfaces/field-move-result.interface';
import type { FieldSnapshotInterface } from '../interfaces/field-snapshot.interface';
import type { SerializedFieldStateInterface } from '../interfaces/serialized-field-state.interface';
import type { FieldCandidatesType } from '../types/field-candidates.type';
import type { FieldDirectionType } from '../types/field-direction.type';
import type { FieldInputModeType } from '../types/field-input-mode.type';
import type { CellInterface, DifficultyEnum, SudokuConfigInterface } from '@suuudokuuu/generator';

export class FieldEngine extends FieldStore {
    private readonly config: SudokuConfigInterface;
    private readonly difficulty: DifficultyEnum;
    private readonly history: FieldHistory;

    private sudoku: Sudoku;
    private selectedCell?: CellInterface;
    private candidates: FieldCandidatesType;
    private inputMode: FieldInputModeType;
    private showAutoCandidates: boolean;
    private mistakes: number;
    private stepScriptPlayer: StepScriptPlayer | null = null;

    constructor(options: FieldEngineOptionsInterface) {
        super();

        this.config = options.config ?? defaultSudokuConfig;
        this.difficulty = options.difficulty;
        this.sudoku = Sudoku.fromString(options.sudokuString, { ...this.config });
        this.candidates = options.candidates ?? {};
        this.inputMode = options.inputMode ?? 'normal';
        this.showAutoCandidates = options.showAutoCandidates ?? false;
        this.mistakes = options.mistakes ?? 0;
        this.history = new FieldHistory(options.history, options.historyIndex);
    }

    get Sudoku(): Sudoku {
        return this.sudoku;
    }

    serialize(): SerializedFieldStateInterface {
        return {
            sudokuString: this.sudoku.toString(),
            difficulty: this.difficulty,
            candidates: { ...this.candidates },
            inputMode: this.inputMode,
            showAutoCandidates: this.showAutoCandidates,
            mistakes: this.mistakes,
            history: [...this.history.Entries],
            historyIndex: this.history.Index
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

    setInputMode(inputMode: FieldInputModeType): void {
        this.inputMode = inputMode;

        if (inputMode === 'candidate') {
            this.showAutoCandidates = false;
        }

        this.publish();
    }

    toggleInputMode(): void {
        this.setInputMode(this.inputMode === 'normal' ? 'candidate' : 'normal');
    }

    toggleShowAutoCandidates(): void {
        this.showAutoCandidates = !this.showAutoCandidates;

        if (this.showAutoCandidates) {
            this.inputMode = 'normal';
        }

        this.publish();
    }

    getCellCandidates(cell: CellInterface): number[] {
        return this.showAutoCandidates ? this.sudoku.getCellCandidates(cell) : (this.candidates[getCellKey(cell)] ?? []);
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
        const cellKey = getCellKey(cell);
        const cellCandidates = this.candidates[cellKey] ?? [];
        const nextCandidates = cellCandidates.includes(value)
            ? cellCandidates.filter(candidate => candidate !== value)
            : [...cellCandidates, value];

        this.commitCandidates(cell, value, { ...this.candidates, [cellKey]: nextCandidates });
    }

    removeCandidate(cell: CellInterface, value: number): void {
        const cellKey = getCellKey(cell);
        const cellCandidates = this.candidates[cellKey] ?? [];

        if (cellCandidates.includes(value)) {
            this.commitCandidates(cell, value, { ...this.candidates, [cellKey]: cellCandidates.filter(candidate => candidate !== value) });
        }
    }

    undo(): boolean {
        return this.restoreState(this.history.undo());
    }

    redo(): boolean {
        return this.restoreState(this.history.redo());
    }

    startStepScript(script: StepScriptInterface): void {
        this.stepScriptPlayer = new StepScriptPlayer(script);
        this.publish();
        this.events.emit('stepScriptStarted', script);
    }

    stepScriptNext(): boolean {
        return this.moveStepScript(player => player.next());
    }

    stepScriptBack(): boolean {
        return this.moveStepScript(player => player.back());
    }

    stepScriptReset(): boolean {
        return this.moveStepScript(player => {
            player.reset();

            return true;
        });
    }

    applyStepScript(): void {
        const player = this.stepScriptPlayer;

        if (isDefined(player)) {
            player.applyResult(this);
            this.stopStepScript();
        }
    }

    stopStepScript(): void {
        const player = this.stepScriptPlayer;

        if (isDefined(player)) {
            this.stepScriptPlayer = null;
            this.publish();
            this.events.emit('stepScriptFinished', player.Script);
        }
    }

    protected override createSnapshot(): FieldSnapshotInterface {
        const player = this.stepScriptPlayer;

        return {
            field: cloneFieldCells(this.sudoku.Field),
            difficulty: this.difficulty,
            sudokuString: this.sudoku.toString(),
            candidates: this.candidates,
            inputMode: this.inputMode,
            showAutoCandidates: this.showAutoCandidates,
            mistakes: this.mistakes,
            isWon: this.sudoku.PossibleValues.length === 0,
            canUndo: this.history.CanUndo,
            canRedo: this.history.CanRedo,
            stepScript: isDefined(player) ? player.Script : null,
            stepIndex: isDefined(player) ? player.StepIndex : 0,
            ...(isDefined(this.selectedCell) && { selectedCell: this.selectedCell })
        };
    }

    private registerPlacement(cell: CellInterface): FieldMoveResultInterface {
        const previousState = this.captureState();
        const scoredCells = this.sudoku.setCellValue(cell);

        this.candidates = pruneCandidates(this.sudoku, this.candidates, cell);
        this.selectedCell = { ...cell };
        this.pushHistory(FieldHistoryKindEnum.Value, { ...cell }, previousState);

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

    private commitCandidates(cell: CellInterface, value: number, candidates: FieldCandidatesType): void {
        const previousState = this.captureState();

        this.candidates = candidates;
        this.pushHistory(FieldHistoryKindEnum.Candidate, { ...cell, value }, previousState);
        this.publish();
    }

    private pushHistory(kind: FieldHistoryKindEnum, cell: CellInterface, previous: FieldHistoryStateInterface): void {
        this.history.push({ kind, cell, value: cell.value, previous, next: this.captureState() });
    }

    private captureState(): FieldHistoryStateInterface {
        return { sudokuString: this.sudoku.toString(), candidates: { ...this.candidates } };
    }

    private restoreState(state: FieldHistoryStateInterface | null): boolean {
        if (!isDefined(state)) {
            return false;
        }

        if (state.sudokuString !== this.sudoku.toString()) {
            this.sudoku = Sudoku.fromString(state.sudokuString, { ...this.config });
        }

        this.candidates = { ...state.candidates };
        this.publish();

        return true;
    }

    private moveStepScript(move: (player: StepScriptPlayer) => boolean): boolean {
        const player = this.stepScriptPlayer;

        if (!isDefined(player) || !move(player)) {
            return false;
        }

        this.publish();

        return true;
    }
}
