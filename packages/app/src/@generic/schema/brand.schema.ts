import { z } from 'zod';

import { ThemeEnum } from '../../theme/enum/theme.enum';

export const BrandSchema = z.object({
    appName: z.string().min(1),
    defaultTheme: z.enum(ThemeEnum),
    links: z.object({
        donation: z.url()
    })
});

export type BrandType = z.infer<typeof BrandSchema>;
