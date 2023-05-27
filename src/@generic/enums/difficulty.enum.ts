import { FieldCellCountConstant } from '../../game/constants/field.constant';

export enum DifficultyEnum {
    Newbie = 'Newbie',
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard',
    Nightmare = 'Nightmare'
}

export const difficultyValues: Record<DifficultyEnum, number> = {
    [DifficultyEnum.Newbie]: Math.ceil(FieldCellCountConstant * 0.02),
    [DifficultyEnum.Easy]: Math.ceil(FieldCellCountConstant * 0.2),
    [DifficultyEnum.Medium]: Math.ceil(FieldCellCountConstant * 0.4),
    [DifficultyEnum.Hard]: Math.ceil(FieldCellCountConstant * 0.5),
    [DifficultyEnum.Nightmare]: Math.ceil(FieldCellCountConstant * 0.8)
};
