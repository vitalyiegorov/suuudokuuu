import type { FieldInterface } from '../interfaces/field.interface';

export const cloneField = (field: FieldInterface): FieldInterface => field.map(row => row.map(cell => ({ ...cell })));
