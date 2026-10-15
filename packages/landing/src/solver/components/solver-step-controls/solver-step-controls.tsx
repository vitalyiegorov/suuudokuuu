const FIRST_STEP_INDEX = 0;

interface Props {
    index: number;
    stepCount: number;
    onSelectStep: (index: number) => void;
}

export const SolverStepControls = ({ index, onSelectStep, stepCount }: Props) => {
    const isFirstStep = index === FIRST_STEP_INDEX;
    const isLastStep = index === stepCount - 1;
    const statusLabel = isLastStep
        ? `Step ${index + 1} of ${stepCount} — the last one. Apply it and the grid is complete.`
        : `Step ${index + 1} of ${stepCount}`;

    const handlePrevious = () => {
        onSelectStep(index - 1);
    };

    const handleNext = () => {
        onSelectStep(index + 1);
    };

    return (
        <div className="solver-step-controls">
            <button className="solver-entry__action" disabled={isFirstStep} onClick={handlePrevious} type="button">
                Previous step
            </button>
            <button className="solver-entry__action" disabled={isLastStep} onClick={handleNext} type="button">
                Next step
            </button>
            <p className="solver-step-controls__status" role="status">
                {statusLabel}
            </p>
        </div>
    );
};
