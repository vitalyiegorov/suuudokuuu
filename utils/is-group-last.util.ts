export const isGroupEnd = (index: number): boolean => {
    return index < 8 && (index + 1) % 3 === 0;
};
