import {Node} from './Node';
import {AggregatorCallback} from './typedefs/AggregatorCallback';

/**
 * Aggregates inputs to a single output value as defined by the specified reducer callback.
 */
export class Aggregator<I, R> extends Node<I, R> {
    private readonly callback: AggregatorCallback<I, R>;
    private readonly initial: R;
    private readonly values: Object;

    constructor(callback: AggregatorCallback<I, R>, initial: R) {
        super();
        this.callback = callback;
        this.initial = initial;
        this.values = {};
    }

    public in(value: I): void {
        let node = this.in['node'],
            inputs = this.inputs,
            callback = this.callback,
            result = this.initial,
            values = this.values;

        // storing last value
        values[node.id] = value;

        // calculating aggregate value
        for (let nodeId in values) {
            let value = values[nodeId];
            result = callback(result, value, nodeId, inputs);
        }

        this.out(result);
    }
}
