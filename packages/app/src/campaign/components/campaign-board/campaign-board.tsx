import { useFieldSnapshot } from '@suuudokuuu/field-core/react';
import { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';

import { emptyFn } from '@rnw-community/shared';

import { Field } from '../../../game/components/field/field';
import { GameContext } from '../../../game/context/game.context';
import { campaignStyles as styles } from '../../campaign.styles';

import type { FieldEngine } from '@suuudokuuu/field-core';
import type { ReactNode } from 'react';

const maximumCellSize = 54;

interface Props {
    readonly engine: FieldEngine;
    readonly children: ReactNode;
}

export const CampaignBoard = ({ engine, children }: Props) => {
    const snapshot = useFieldSnapshot(engine);
    const [boardWidth, setBoardWidth] = useState(0);
    const handleLayout = (event: LayoutChangeEvent) => void setBoardWidth(event.nativeEvent.layout.width);
    const cellSize = Math.min(maximumCellSize, Math.floor(boardWidth / 9));
    const handleSelect = (cell: Parameters<FieldEngine['selectCell']>[0]) => void engine.selectCell(cell);
    const context = { engine, snapshot, create: emptyFn, createDaily: emptyFn, createFromState: emptyFn, isCreatingGame: false };

    return (
        <GameContext value={context}>
            <View style={styles.card}>
                <View onLayout={handleLayout} style={styles.board}>
                    <Field cellMargin={0} cellSize={cellSize} onSelect={handleSelect} ref={null} />
                </View>
                {children}
            </View>
        </GameContext>
    );
};
