import { msg } from '@lingui/core/macro';

import type { Languages } from './languages.constant';
import type { MessageDescriptor } from '@lingui/core';

export const LanguageLabels: Record<(typeof Languages)[number], MessageDescriptor> = {
    ar: msg`العربية`,
    bn: msg`বাংলা`,
    de: msg`Deutsch`,
    en: msg`English`,
    es: msg`Español`,
    fr: msg`Français`,
    hi: msg`हिन्दी`,
    id: msg`Bahasa Indonesia`,
    pt: msg`Português`,
    sv: msg`Svenska`,
    uk: msg`Українська`,
    ur: msg`اردو`,
    zh: msg`中文`
};
