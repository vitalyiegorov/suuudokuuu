import { useEffect } from 'react';
import { View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../../hooks/redux.hook';
import { appRootLoadAction } from '../../store/app-root/app-root.actions';
import { appRootFieldSelector, appRootSelectedCellSelector } from '../../store/app-root/app-root.selectors';
import { isGroupEnd } from '../../utils/cell/is-group-end.util';
import { Row } from '../row/row';

import { FieldStyles as styles } from './field.styles';

export const Field = () => {
    const dispatch = useAppDispatch();
    const field = useAppSelector(appRootFieldSelector);
    const selectedCell = useAppSelector(appRootSelectedCellSelector);

    useEffect(() => void dispatch(appRootLoadAction()), []);

    return (
        <View style={styles.wrapper}>
            {field.map((row, i) => (
                <Row key={i} selectedCell={selectedCell} row={i} cells={row} isGroupLast={isGroupEnd(i)} isLastRow={i === row.length - 1} />
            ))}
        </View>
    );
};
