import {Aggregator} from './Aggregator';

/**
 * Merges inputs into a single array output.
 */
export class Merger<I> extends Aggregator<I, Array<I>> {
    constructor() {
        super((merged: Array<I>, next: I) => {
            merged.push(next);
            return merged;
        }, []);
    }
}
