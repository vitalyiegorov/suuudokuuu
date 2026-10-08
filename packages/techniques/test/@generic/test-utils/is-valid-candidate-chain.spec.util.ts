import { ChainLinkEnum } from '../../../src/@generic/enums/chain-link.enum';

import type { CandidateContext } from '../../../src/@generic/classes/candidate-context/candidate-context';
import type { ChainCandidateInterface } from '../../../src/@generic/interfaces/chain-candidate.interface';
import type { TechniqueResultInterface } from '../../../src/@generic/interfaces/technique-result.interface';

const isSameCell = (first: ChainCandidateInterface, second: ChainCandidateInterface): boolean =>
    first.cell.x === second.cell.x && first.cell.y === second.cell.y;

const isWeakLink = (context: CandidateContext, first: ChainCandidateInterface, second: ChainCandidateInterface): boolean =>
    isSameCell(first, second)
        ? first.value !== second.value
        : first.value === second.value && context.getPeers(first.cell).includes(second.cell);

const isStrongLink = (context: CandidateContext, first: ChainCandidateInterface, second: ChainCandidateInterface): boolean => {
    if (isSameCell(first, second)) {
        return first.value !== second.value && context.getCandidates(first.cell).length === 2;
    }

    return (
        first.value === second.value &&
        context.getUnits().some(unit => {
            const candidateCells = unit.cells.filter(cell => context.getCandidates(cell).includes(first.value));

            return candidateCells.length === 2 && candidateCells.includes(first.cell) && candidateCells.includes(second.cell);
        })
    );
};

export const isValidCandidateChain = (context: CandidateContext, result: TechniqueResultInterface): boolean => {
    const { chain } = result;

    if (!chain || chain.length < 2 || chain[0].link || chain[chain.length - 1].link !== ChainLinkEnum.STRONG) {
        return false;
    }

    for (const [nodeIndex, node] of chain.entries()) {
        if (!context.getCandidates(node.cell).includes(node.value)) {
            return false;
        }

        if (nodeIndex > 0) {
            const previous = chain[nodeIndex - 1];
            const expectedLink = nodeIndex % 2 === 1 ? ChainLinkEnum.STRONG : ChainLinkEnum.WEAK;

            if (
                node.link !== expectedLink ||
                (node.link === ChainLinkEnum.STRONG && !isStrongLink(context, previous, node)) ||
                (node.link === ChainLinkEnum.WEAK && !isWeakLink(context, previous, node))
            ) {
                return false;
            }
        }
    }

    return result.eliminations.every(elimination => {
        const literal = { cell: elimination.cell, value: elimination.value };

        return (
            context.getCandidates(elimination.cell).includes(elimination.value) &&
            isWeakLink(context, chain[0], literal) &&
            isWeakLink(context, chain[chain.length - 1], literal)
        );
    });
};
