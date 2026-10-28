import { msg } from '@lingui/core/macro';

import { ListConjunctionEnum } from '../enums/list-conjunction.enum';

import type { I18n, MessageDescriptor } from '@lingui/core';

const conjunctionMessages: Record<ListConjunctionEnum, (leadingItems: string, lastItem: string) => MessageDescriptor> = {
    [ListConjunctionEnum.AND]: (leadingItems, lastItem) => msg`${leadingItems} and ${lastItem}`,
    [ListConjunctionEnum.OR]: (leadingItems, lastItem) => msg`${leadingItems} or ${lastItem}`
};

export const gameFormatList = (items: readonly (number | string)[], conjunction: ListConjunctionEnum, i18n: I18n): string => {
    const itemNames = items.map(String);
    const lastItem = itemNames.at(-1) ?? '';

    return itemNames.length < 2 ? lastItem : i18n._(conjunctionMessages[conjunction](itemNames.slice(0, -1).join(', '), lastItem));
};
