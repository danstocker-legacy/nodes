import {Node} from '../Node';
import {AggregatorCallback} from '../typedefs';

/**
 * Aggregates inputs to a single output value as defined by the specified reducer callback.
 */
export class Aggregator<I, O> extends Node<I, O> {
  private readonly callback: AggregatorCallback<I, O>;
  private readonly seed: O;
  private readonly inputs: Object;

  constructor(callback: AggregatorCallback<I, O>, seed: O) {
    super();
    this.callback = callback;
    this.seed = seed;
    this.inputs = {};
  }

  public in(value: I): void {
    let source = this.in['source'],
      sources = this.sources,
      callback = this.callback,
      result = Aggregator.copy(this.seed),
      inputs = this.inputs;

    // storing last value
    inputs[source.id] = value;

    // calculating aggregate value
    for (let nodeId in inputs) {
      let value = inputs[nodeId];
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
        let copy = {};
        for (let key in value) {
          copy[key] = value[key];
        }
        return copy;
      default:
        return value;
    }
  }
}
