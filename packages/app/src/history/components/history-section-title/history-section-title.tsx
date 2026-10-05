import { BlackText } from '../../../@generic/components/black-text/black-text';

import { HistorySectionTitleStyles as styles } from './history-section-title.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const HistorySectionTitle = ({ children }: Props) => (
    <BlackText accessibilityRole="header" style={styles.title}>
        {children}
    </BlackText>
);
