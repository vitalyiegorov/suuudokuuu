import { GameActions } from '../game-actions/game-actions';

interface Props {
    readonly actionIconColor: string;
    readonly canRedo: boolean;
    readonly canUndo: boolean;
    readonly hasSharing: boolean;
    readonly isChallengeRun: boolean;
    readonly isHardcore: boolean;
    readonly onExit: () => void;
    readonly onOpenSettings: () => void;
    readonly onPause: () => void;
    readonly onRedo: () => void;
    readonly onShare: () => void;
    readonly onUndo: () => void;
    readonly variant: 'panel' | 'top';
}

export const GameScreenActions = ({
    actionIconColor,
    canRedo,
    canUndo,
    hasSharing,
    isChallengeRun,
    isHardcore,
    onExit,
    onOpenSettings,
    onPause,
    onRedo,
    onShare,
    onUndo,
    variant
}: Props) => {
    const shareAction = { ...(hasSharing && !isChallengeRun && { onShare }) };
    const pauseAction = { ...(variant === 'panel' && !isChallengeRun && { onPause }) };
    const undoRedoAction = { ...(!isChallengeRun && !isHardcore && { onUndo, onRedo, canUndo, canRedo }) };

    return (
        <GameActions
            actionIconColor={actionIconColor}
            onExit={onExit}
            onOpenSettings={onOpenSettings}
            {...pauseAction}
            {...undoRedoAction}
            {...shareAction}
        />
    );
};
