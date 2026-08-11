import { isNotEmptyString } from '@rnw-community/shared';

export const getFieldClassName = (baseClassName: string, className?: string): string =>
    isNotEmptyString(className) ? `${baseClassName} ${className}` : baseClassName;
