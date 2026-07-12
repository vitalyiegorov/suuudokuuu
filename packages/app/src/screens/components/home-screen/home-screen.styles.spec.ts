import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from '@jest/globals';

describe('HomeScreenStyles', () => {
    it('keeps home scroll native without oversized bottom spacing', () => {
        const source = readFileSync(join(__dirname, 'home-screen.styles.ts'), 'utf8');
        const screenSource = readFileSync(join(__dirname, 'home.screen.tsx'), 'utf8');
        const scrollContentStartIndex = source.indexOf("scrollContent: (sizeClass: 'compact' | 'wide') => ({");
        const scrollContentEndIndex = source.indexOf("setupSection: (sizeClass: 'compact' | 'wide') => ({");
        const contentStackStartIndex = source.indexOf("contentStack: (sizeClass: 'compact' | 'wide') => ({");
        const contentStackEndIndex = source.indexOf("masthead: (sizeClass: 'compact' | 'wide') => ({");
        const scrollContentSource = source.slice(scrollContentStartIndex, scrollContentEndIndex);
        const contentStackSource = source.slice(contentStackStartIndex, contentStackEndIndex);

        expect(source).not.toContain("minHeight: '100%'");
        expect(source).not.toContain('flexGrow: 1');
        expect(scrollContentSource).not.toContain("justifyContent: 'space-between'");
        expect(contentStackSource).not.toContain("justifyContent: 'space-between'");
        expect(screenSource).toContain('useAppLayout');
        expect(source).not.toContain('paddingBottom: 120');
        expect(screenSource).toContain('HomeScreenBottomScrollPadding');
        expect(screenSource).toContain('HomeScreenCurrentGameBottomScrollPadding');
        expect(screenSource).toContain('topOverlay=');
        expect(screenSource).not.toContain('bottomOverlay=');
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
