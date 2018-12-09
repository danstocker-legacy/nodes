import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {ValueOf} from "../../utils";

interface ISyncerOutputs<T> {
  sync: T;
}

/**
 * Joins input values bearing the same tag. Produces a dictionary of port
 * name - value pairs.
 * @example
 * let syncer: Syncer<{foo: number, bar: boolean}>;
 * syncer = new Syncer(["foo", "bar"]);
 * syncer.i.foo.send(5, "1");
 * syncer.i.bar.send(true, "1");
 * // `syncer.o.$` will output `{foo: 5, bar: true}` for tag "1"
 */
export class Syncer<T> implements ISink, ISource {
  public readonly i: TInBundle<T>;
  public readonly o: TOutBundle<ISyncerOutputs<T>>;

  private readonly fields: Array<string>;
  private readonly inputCache: Map<string, T>;
  private readonly portCache: Map<string, Set<string | number>>;

  constructor(fields: Array<string>) {
    MSink.init.call(this, fields);
    MSource.init.call(this, ["sync"]);
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
        this.o.sync.send(inputs, tag);
      }
    }
  }
}
