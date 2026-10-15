import dynamic from 'next/dynamic';

import { SolverStepControls } from '../solver-step-controls/solver-step-controls';
import { SolverStepItem } from '../solver-step-item/solver-step-item';

import type { SolverStepInterface } from '../../interfaces/solver-step.interface';
import type { DifficultyEnum } from '@suuudokuuu/generator';

const SolverStepPreview = dynamic(async () => (await import('../solver-step-preview/solver-step-preview')).SolverStepPreview, {
    ssr: false
});

interface Props {
    steps: SolverStepInterface[];
    difficulty: DifficultyEnum;
    selectedStepIndex: number | null;
    onSelectStep: (index: number | null) => void;
}

export const SolverStepList = ({ difficulty, onSelectStep, selectedStepIndex, steps }: Props) => (
    <ol className="solver-steps">
        {steps.map(step => {
            const isSelected = step.index === selectedStepIndex;
            const preview = isSelected ? (
                <>
                    <SolverStepPreview difficulty={difficulty} step={step} />
                    <SolverStepControls index={step.index} onSelectStep={onSelectStep} stepCount={steps.length} />
                </>
            ) : null;

            return (
                <SolverStepItem isSelected={isSelected} key={step.index} onSelect={onSelectStep} step={step}>
                    {preview}
                </SolverStepItem>
            );
        })}
    </ol>
);
