import {Node} from '../node/Node';
import {AggregatorCallback} from '../typedefs';

/**
 * Aggregates inputs to a single output value as defined by the specified reducer callback.
 */
export class Aggregator<I, O> extends Node<I, O> {
  /**
   * Aggregator callback. Similar to callback passed to Array#reduce().
   */
  private readonly callback: AggregatorCallback<I, O>;

  /**
   * Initial value of aggregated value.
   */
  private readonly seed: O;

  /**
   * Lookup of input values from all sources.
   */
  private readonly inputs: Object;

  constructor(callback: AggregatorCallback<I, O>, seed: O) {
    super();
    this.callback = callback;
    this.seed = seed;
    this.inputs = {};
  }

  public in(value: I): void {
    const source = this.in['source'];
    const sources = this.sources;
    const callback = this.callback;
    const inputs = this.inputs;
    let result = Aggregator.copy(this.seed);

    // storing last value
    inputs[source.id] = value;

    // calculating aggregate value
    for (let nodeId in inputs) {
      const value = inputs[nodeId];
      result = callback(result, value, nodeId, sources);
    }

    this.out(result);
  }

  /**
   * Shallow copies specified value.
   */
  private static copy(value: any): any {
    switch (true) {
      case value instanceof Array:
        return value.concat();
      case value instanceof Object:
        const copy = {};
        for (let key in value) {
          copy[key] = value[key];
        }
        return copy;
      default:
        return value;
    }
  }
}
