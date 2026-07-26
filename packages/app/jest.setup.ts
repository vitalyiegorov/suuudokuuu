import { i18n } from '@lingui/core';

import { messages } from './src/i18n/locales/en/messages';

i18n.load({ en: messages });
i18n.activate('en');
