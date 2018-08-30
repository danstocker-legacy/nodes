import {AggregatorCallback} from "../typedefs";
import {INode, Port} from "../node";

/**
 * Aggregates inputs to a single output value as defined by the specified reducer callback.
 * TODO: Rename to Merger
 */
export class Aggregator<I, O> implements INode {
  public readonly ports: {
    in: Port<I>,
    out: Port<O>
  };

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
  private readonly inputs: Map<Port<I>, I>;

  constructor(callback: AggregatorCallback<I, O>, seed: O) {
    this.ports = {
      in: new Port<I>(this),
      out: new Port<O>(this)
    };
    this.callback = callback;
    this.seed = seed;
    this.inputs = new Map<Port<I>, I>();
  }

  public in(port: Port<I>, value: I): void {
    if (port === this.ports.in) {
      const peer = port.in["peer"];
      const callback = this.callback;
      const inputs = this.inputs;

      // storing last value
      inputs.set(peer, value);

      // calculating aggregate value
      let result = Aggregator.copy(this.seed);
      for (let entry of inputs.entries()) {
        result = callback(result, entry[1], entry[0], this);
      }

      this.ports.out.out(result);
    }
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
