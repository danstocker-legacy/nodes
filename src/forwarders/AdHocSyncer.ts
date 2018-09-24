import {Syncer} from "../abstracts";
import {InPort, Inputs, IPort, OutPort, Ports} from "../node";

/**
 * Synchronizes inputs from multiple ports into a map on a single port.
 */
export class AdHocSyncer extends Syncer {
  public readonly in: {
    [key: string]: InPort<any>
  };
  public readonly out: {
    $: OutPort<{ [key: string]: any }>
  };
  private readonly lookup: Map<InPort<any>, string>;

  constructor(count: number = 2) {
    super();
    this.lookup = new Map();
    for (let i = 1; i <= count; i++) {
      this.openInPort(`${i}`, new InPort(this));
    }
    this.openOutPort("$", new OutPort(this));
  }

  protected onPortOpen<T>(name: string, port: IPort<T>, ports: Ports): void {
    super.onPortOpen(name, port, ports);
    if (ports === this.in) {
      this.lookup.set(port as InPort<T>, name);
    }
  }

  protected onPortClose<T>(name: string, port: IPort<T>, ports: Ports): void {
    super.onPortOpen(name, port, ports);
    if (ports === this.in) {
      this.lookup.delete(port as InPort<T>);
    }
  }

  protected process(inputs: Inputs, tag: string) {
    const lookup = this.lookup;
    const values = {};
    for (const [port, value] of inputs.entries()) {
      const name = lookup.get(port);
      values[name] = value;
    }
    this.out.$.send(values, tag);
  }
}
