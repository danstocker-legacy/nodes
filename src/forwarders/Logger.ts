import {InPort, Inputs, NodeBase, OutPort} from "../node";

/**
 * Forwards logs, warnings, and errors to connected sink nodes.
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
    this.openInPort("$");
    this.openInPort("log");
    this.openInPort("warn");
    this.openInPort("error");
    this.openOutPort("log");
    this.openOutPort("warn");
    this.openOutPort("error");
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
