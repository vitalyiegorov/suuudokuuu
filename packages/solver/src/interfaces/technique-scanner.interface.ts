import type { TechniqueResultInterface } from './technique-result.interface';
import type { CandidateContext } from '../classes/techniques/candidate-context/candidate-context';

export interface TechniqueScannerInterface {
    find(context: CandidateContext): TechniqueResultInterface[];
}
