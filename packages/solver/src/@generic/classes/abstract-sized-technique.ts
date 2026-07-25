import type { CandidateContext } from './candidate-context/candidate-context';
import type { SizedTechniqueDescriptorInterface } from '../interfaces/sized-technique-descriptor.interface';
import type { TechniqueResultInterface } from '../interfaces/technique-result.interface';
import type { TechniqueSearchTargetInterface } from '../interfaces/technique-search-target.interface';
import type { TechniqueStrategyInterface } from '../interfaces/technique-strategy.interface';

export abstract class AbstractSizedTechnique<
    TDescriptor extends SizedTechniqueDescriptorInterface = SizedTechniqueDescriptorInterface
> implements TechniqueStrategyInterface {
    constructor(protected readonly descriptor: TDescriptor) {}

    get technique() {
        return this.descriptor.technique;
    }

    protected get size(): number {
        return this.descriptor.size;
    }

    abstract find(context: CandidateContext, target?: TechniqueSearchTargetInterface): TechniqueResultInterface[];
}
