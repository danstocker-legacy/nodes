import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {ValueOf} from "../../utils";

interface IJoinerOutputs<T> {
  /**
   * Multiple named values.
   * Names match the fields passed to constructor.
   */
  mul: T;
}

/**
 * Joins input values bearing the same tag. Produces a dictionary of port
 * name - value pairs.
 * @example
 * let joiner: Joiner<{b_foo: number, b_bar: boolean}>;
 * joiner = new Joiner(["b_foo", "b_bar"]);
 * joiner.i.b_foo.send(5, "1");
 * joiner.i.b_bar.send(true, "1");
 * // `joiner.o.mul` will output `{b_foo: 5, b_bar: true}` for tag "1"
 */
export class Joiner<T> implements ISink, ISource {
  public readonly i: TInBundle<T>;
  public readonly o: TOutBundle<IJoinerOutputs<T>>;

  private readonly fields: Array<string>;
  private readonly inputCache: Map<string, T>;
  private readonly portCache: Map<string, Set<string | number>>;

  /**
   * @param fields Must be prefixed by their corresponding domains. ("d_" /
   * "st_" / "ev_": data, state, event, etc.)
   */
  constructor(fields: Array<string>) {
    MSink.init.call(this, fields);
    MSource.init.call(this, ["mul"]);
    this.fields = fields;
    this.inputCache = new Map();
    this.portCache = new Map();
  }

  public send(port: IInPort<ValueOf<T>>, input: ValueOf<T>, tag: string): void {
    const name = port.name;
    if (port === this.i[name]) {
      const inputCache = this.inputCache;
      let inputs = inputCache.get(tag);
      if (!inputs) {
        inputs = {} as T;
        inputCache.set(tag, inputs);
      }

      const portCache = this.portCache;
      let ports = portCache.get(tag);
      if (!ports) {
        ports = new Set(this.fields);
        portCache.set(tag, ports);
      }

      // adding value to input cache
      inputs[name] = input;
      ports.delete(name);

      if (ports.size === 0) {
        // got all inputs for current tag
        // releasing input set and cleaning up
        inputCache.delete(tag);
        portCache.delete(tag);
        this.o.mul.send(inputs, tag);
      }
    }
  }
}
