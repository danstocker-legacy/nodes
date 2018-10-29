import {InPort, Inputs, NodeBase, OutPort} from "../node/index";

/**
 * Logs input to console.
 */
export class Logger extends NodeBase {
  public readonly in: {
    /** @deprecated Use log, warn, or error */
    $: InPort<any>,
    log: InPort<any>,
    warn: InPort<any>,
    error: InPort<any>
  };
  public readonly out: {
    log: OutPort<any>,
    warn: OutPort<any>,
    error: OutPort<any>
  };

  constructor() {
    super();
    this.openInPort("$", new InPort(this));
    this.openInPort("log", new InPort(this));
    this.openInPort("warn", new InPort(this));
    this.openInPort("error", new InPort(this));
    this.openOutPort("log", new OutPort(this));
    this.openOutPort("warn", new OutPort(this));
    this.openOutPort("error", new OutPort(this));
  }

  protected process(inputs: Inputs, tag?: string): void {
    // tslint:disable:no-console
    if (inputs.has(this.in.$)) {
      console.log(inputs.get(this.in.$));
    }
    if (inputs.has(this.in.log)) {
      this.out.log.send(inputs.get(this.in.log), tag);
    }
    if (inputs.has(this.in.warn)) {
      this.out.warn.send(inputs.get(this.in.warn), tag);
    }
    if (inputs.has(this.in.error)) {
      this.out.error.send(inputs.get(this.in.error), tag);
    }
  }
}
