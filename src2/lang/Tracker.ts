import {Node} from "../node";
import {
  IInPort,
  StaticInPort,
  StaticOutPort,
  TStaticInPorts,
  TStaticOutPorts
} from "../port";
import {merge, THash} from "../utils";

/**
 * Outputs full sets of inputs, where each value corresponds to the latest
 * one received.
 * @example
 * const tracker: Tracker<{ foo: number, bar: number }>
 * tracker = new Tracker(["foo", "bar"]);
 */
export class Tracker<T extends THash = THash> extends Node {
  public readonly in: TStaticInPorts<T>;
  public readonly out: TStaticOutPorts<{
    $: T
  }>;

  private prepping: boolean;
  private countdown: Set<string | number>;
  private cache: Array<[T, string]>;
  private values: T;

  constructor(fields: Array<string>) {
    super();
    this.prepping = true;
    this.countdown = new Set(fields);
    this.values = <T> {};
    this.cache = [];
    for (const field of fields) {
      this.addPort(new StaticInPort(field, this));
    }
    this.addPort(new StaticOutPort("$", this));
  }

  public send<U>(port: IInPort<U>, value: U, tag?: string): void {
    const name = port.name;
    const cache = this.cache;
    let values = this.values;

    if (this.prepping) {
      // initializing cache
      if (!cache.length) {
        cache.push([values, tag]);
      }

      // trying to place value in last set of values
      const current = values[name];
      if (current !== undefined) {
        // when slot for port is occupied, adding new set
        this.values = values = <T> merge({}, values);
        cache.push([values, tag]);
      }
      // assigning new value to port
      values[name] = value;

      // checking if we've got inputs from all ports
      const countdown = this.countdown;
      countdown.delete(name);
      if (countdown.size === 0) {
        // releasing cached inputs and cleaning up
        this.release();
        this.prepping = false;
        this.countdown = undefined;
        this.cache = undefined;
      }
    } else {
      values[name] = value;
      this.out.$.send(values, tag);
    }
  }

  private release(): void {
    const cache = this.cache;
    const count = cache.length;

    // populating empty slots in cache
    for (let i = count - 2; i >= 0; i--) {
      const current = cache[i][0];
      const previous = cache[i + 1][0];
      merge(current, previous);
    }

    // const port = this.out.$;
    for (const item of cache) {
      this.out.$.send(item[0], item[1]);
    }
  }
}
