import {Node} from './Node';
import {Reducer} from './Reducer';

/**
 * Aggregates inputs to a single output value as defined by the specified reducer function.
 */
export class Aggregator<Item, Result> extends Node {
    private readonly reducer: Reducer<Item, Result>;
    private readonly initial: Result;

    constructor(reducer: Reducer<Item, Result>, initial: Result) {
        super();
        this.reducer = reducer;
        this.initial = initial;
    }

    public in(): void {
        let reducer = this.reducer,
            inputs = this.inputs,
            result = this.initial;
        for (let nodeId in inputs) {
            let node = inputs[nodeId];
            result = reducer(result, node.value, nodeId, inputs);
        }
        this.out(result);
    }
}
