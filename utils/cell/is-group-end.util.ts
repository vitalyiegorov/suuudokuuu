import { FieldGroupSizeConstant, FieldSizeConstant } from '../../constants/field.constant';

export const isGroupEnd = (index: number): boolean => {
    return index < FieldSizeConstant - 1 && (index + 1) % FieldGroupSizeConstant === 0;
};
