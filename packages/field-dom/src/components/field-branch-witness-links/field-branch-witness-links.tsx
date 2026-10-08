'use client';

import { isDefined } from '@rnw-community/shared';

import { getWitnessPoint } from '../../utils/get-witness-point.util';

import type { FieldWitnessBranchType, FieldWitnessImplicationType } from '../../types/field-witness-branch.type';

interface Props {
    branch: FieldWitnessBranchType;
    visibleImplications: readonly FieldWitnessImplicationType[];
}

export const FieldBranchWitnessLinks = ({ branch, visibleImplications }: Props) =>
    visibleImplications.map((implication, index) => {
        let reason: FieldWitnessImplicationType | FieldWitnessBranchType['assumption'] | null = null;

        if ('source' in implication) {
            reason = implication.source;
        } else if ('reasonIndex' in implication && isDefined(implication.reasonIndex) && implication.reasonIndex < index) {
            reason = branch.implications[implication.reasonIndex];
        }

        if (!isDefined(reason)) {
            return null;
        }

        const source = getWitnessPoint(reason.cell, reason.value);
        const current = getWitnessPoint(implication.cell, implication.value);

        return <line data-link="implication" key={`reason-${index}`} x1={source.x} x2={current.x} y1={source.y} y2={current.y} />;
    });
