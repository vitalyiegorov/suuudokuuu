import { describe, expect, it, jest } from '@jest/globals';

import { synchronizeUnistylesTheme } from './synchronize-unistyles-theme.util';

describe('synchronizeUnistylesTheme', () => {
    it('does not update an already selected theme', () => {
        const setTheme = jest.fn();

        synchronizeUnistylesTheme({ setTheme, themeName: 'bwLight' }, 'bwLight');

        expect(setTheme).not.toHaveBeenCalled();
    });

    it('updates a different selected theme once', () => {
        const setTheme = jest.fn();

        synchronizeUnistylesTheme({ setTheme, themeName: 'bwLight' }, 'colorfulDark');

        expect(setTheme).toHaveBeenCalledTimes(1);
        expect(setTheme).toHaveBeenCalledWith('colorfulDark');
    });
});
