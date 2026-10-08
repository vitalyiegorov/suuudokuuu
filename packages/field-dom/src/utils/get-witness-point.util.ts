export const getWitnessPoint = (cell: { readonly x: number; readonly y: number }, value: number) => ({
    x: cell.x * 3 + ((value - 1) % 3) + 0.5,
    y: cell.y * 3 + Math.floor((value - 1) / 3) + 0.5
});
