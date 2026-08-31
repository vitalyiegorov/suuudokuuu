import { LLMS_GUIDE_PATHS, LLMS_SECTIONS, LLMS_START_HERE_PATHS } from '../constants/llms-section.constant';

export const resolveLlmsSection = (path: string): string => {
    if (path.startsWith('/techniques')) {
        return LLMS_SECTIONS.techniques;
    }

    if (path.startsWith('/printable') || path === '/large-print-sudoku') {
        return LLMS_SECTIONS.printable;
    }

    if (path.startsWith('/guides/') || LLMS_GUIDE_PATHS.includes(path)) {
        return LLMS_SECTIONS.guides;
    }

    if (path === '/sudoku' || path.startsWith('/sudoku/')) {
        return LLMS_SECTIONS.difficulty;
    }

    if (LLMS_START_HERE_PATHS.includes(path)) {
        return LLMS_SECTIONS.startHere;
    }

    return LLMS_SECTIONS.more;
};
