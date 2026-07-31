import { z } from 'zod';

import type { HellQueueEntryInterface } from '../interfaces/hell-queue-entry.interface';

export const HellQueueEntrySchemaVersion = 1;

const HellQueueFieldStringPattern = /^[0-9]{81}$/u;
const HellQueueMinimumGivens = 17;
const HellQueueMaximumGivens = 20;

export const HellQueueEntrySchema: z.ZodType<HellQueueEntryInterface> = z
    .strictObject({
        id: z.string().regex(HellQueueFieldStringPattern),
        puzzle: z.string().regex(HellQueueFieldStringPattern),
        solution: z.string().regex(HellQueueFieldStringPattern),
        givensCount: z.number().int().min(HellQueueMinimumGivens).max(HellQueueMaximumGivens),
        createdAt: z.number(),
        generatorVersion: z.number().int().positive(),
        schemaVersion: z.literal(HellQueueEntrySchemaVersion)
    })
    .superRefine((entry, context) => {
        if (entry.id !== entry.puzzle) {
            context.addIssue({ code: 'custom', path: ['id'] });
        }
    });
