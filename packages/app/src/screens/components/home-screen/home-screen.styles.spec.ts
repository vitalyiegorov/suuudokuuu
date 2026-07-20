import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

describe('HomeScreenStyles', () => {
    it('keeps home scroll native without oversized bottom spacing', () => {
        const source = readFileSync(join(__dirname, 'home-screen.styles.ts'), 'utf8');
        const screenSource = readFileSync(join(__dirname, 'home.screen.tsx'), 'utf8');
        const scrollContentStartIndex = source.indexOf('scrollContent: {');
        const scrollContentEndIndex = source.indexOf('scrollView: {');
        const contentStackStartIndex = source.indexOf('contentStack: {');
        const contentStackEndIndex = source.indexOf('continueContent: {');
        const scrollContentSource = source.slice(scrollContentStartIndex, scrollContentEndIndex);
        const contentStackSource = source.slice(contentStackStartIndex, contentStackEndIndex);

        expect(source).not.toContain("minHeight: '100%'");
        expect(source).not.toContain('flexGrow: 1');
        expect(scrollContentSource).not.toContain("justifyContent: 'space-between'");
        expect(contentStackSource).not.toContain("justifyContent: 'space-between'");
        expect(screenSource).not.toContain('useWindowDimensions');
        expect(source).not.toContain('paddingBottom: 120');
        expect(screenSource).toContain('HomeScreenBottomScrollPadding');
        expect(screenSource).toContain('HomeScreenCurrentGameBottomScrollPadding');
        expect(screenSource).toContain('topEdgeFadeProps=');
        expect(screenSource).not.toContain('footerEdgeFadeProps=');
        expect(screenSource).toContain('HomeScreenTopOverlayHeight');
        expect(screenSource).toContain('HomeScreenTopOverlayIntensity');
        expect(screenSource).not.toContain('HomeScreenBottomTabClearance');
        expect(screenSource).not.toContain('alwaysBounceVertical={false}');
        expect(screenSource).not.toContain('bounces={false}');
    });

    it('keeps home header glass compact and visible during scroll bounce', () => {
        const source = readFileSync(join(__dirname, 'constant/home-screen.constant.ts'), 'utf8');

        expect(source).toContain('HomeScreenTopOverlayHeight = 110');
        expect(source).toContain('HomeScreenTopOverlayIntensity = 70');
    });

    it('keeps home tab clearance compact because native tabs already reserve the main bottom area', () => {
        const source = readFileSync(join(__dirname, 'constant/home-screen.constant.ts'), 'utf8');

        expect(source).toContain('HomeScreenBottomScrollPadding = 32');
        expect(source).toContain('HomeScreenCurrentGameBottomScrollPadding = 52');
    });
});
