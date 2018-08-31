import {INode, Port} from "../node";

type ReducerCallback<I, O> = (result: O, next: I, source: Port<I>, port: Port<I>) => O;

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
      const source = port.in["source"];
      const callback = this.callback;
      const inputs = this.inputs;

      inputs.set(source, value);

      let result = Merger.shallowCopy(this.seed);
      for (let entry of inputs.entries()) {
        result = callback(result, entry[1], entry[0], port);
      }

      this.ports.out.out(result);
    }
  }

  private static shallowCopy(value: any): any {
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
