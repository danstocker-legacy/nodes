import {ReducerCallback} from "../typedefs";
import {INode, Port} from "../node";

/**
 * Mergers inputs to a single output value as defined by the specified reducer
 * callback.
 */
export class Merger<I, O> implements INode {
  public readonly ports: {
    in: Port<I>,
    out: Port<O>
  };
  private readonly callback: ReducerCallback<I, O>;
  private readonly seed: O;
  private readonly inputs: Map<Port<I>, I>;

  constructor(callback: ReducerCallback<I, O>, seed: O) {
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
      const origin = port.in["origin"];
      const callback = this.callback;
      const inputs = this.inputs;

      inputs.set(origin, value);

      let result = Merger.copy(this.seed);
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
