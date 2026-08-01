import { AvailableValueItemSelectors } from '@suuudokuuu/app/src/selectors';

export const cellTestId = (y: number, x: number): string => `CellSelectors.Cell.${y}-${x}`;

export const valueButtonTestId = (value: number): string => `${AvailableValueItemSelectors.Button}.${value}`;
