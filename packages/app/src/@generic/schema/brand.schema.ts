import { ThemeEnum } from '@suuudokuuu/progress';
import * as Schema from 'effect/Schema';

export const BrandSchema = Schema.Struct({
    appName: Schema.NonEmptyString,
    defaultTheme: Schema.Enum(ThemeEnum),
    links: Schema.Struct({
        donation: Schema.String.check(Schema.isStartingWith('https://'))
    })
});

export type BrandType = typeof BrandSchema.Type;
