import { describe, expect, it } from '@jest/globals';
import { View } from 'react-native';

import { appMetricStripGetSeparatorKey } from './app-metric-strip-get-separator-key.util';

describe('appMetricStripGetSeparatorKey', () => {
    it('should derive the key from the item key instead of its position', () => {
        const item = <View key=".2" />;

        expect(appMetricStripGetSeparatorKey(item, 0)).toBe('.2-separator');
    });

    it('should keep the same key when a removed sibling shifts the item position', () => {
        const item = <View key=".3" />;
        const keyBeforeRemoval = appMetricStripGetSeparatorKey(item, 3);
        const keyAfterRemoval = appMetricStripGetSeparatorKey(item, 2);

        expect(keyAfterRemoval).toBe(keyBeforeRemoval);
    });

    it('should give sibling items distinct keys', () => {
        const firstItem = <View key=".0" />;
        const secondItem = <View key=".1" />;

        expect(appMetricStripGetSeparatorKey(firstItem, 0)).not.toBe(appMetricStripGetSeparatorKey(secondItem, 1));
    });

    it('should fall back to the position for nodes without a key', () => {
        expect(appMetricStripGetSeparatorKey('plain text', 3)).toBe('3-separator');
    });
});
