import type { StepScriptStateInterface } from '@suuudokuuu/field-core';

export type FieldWitnessBranchType = Extract<NonNullable<StepScriptStateInterface['explanation']>, { kind: 'SHOW_BRANCH' }>['branch'];
export type FieldWitnessImplicationType = FieldWitnessBranchType['implications'][number];
