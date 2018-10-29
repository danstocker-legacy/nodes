import {InPort, Inputs, NodeBase} from "../node";

/**
 * Sends input to `console.log` / `.warn` / `.error`.
 * TODO: Rename to JsConsole?
 */
export class Console extends NodeBase {
  public readonly in: {
    log: InPort<any>,
    warn: InPort<any>,
    error: InPort<any>,
  };

  constructor() {
    super();
    this.openInPort("log", new InPort(this));
    this.openInPort("warn", new InPort(this));
    this.openInPort("error", new InPort(this));
  }

  protected process(inputs: Inputs, tag?: string): void {
    // tslint:disable:no-console
    if (inputs.has(this.in.log)) {
      console.log(inputs.get(this.in.log));
    }
    if (inputs.has(this.in.warn)) {
      console.warn(inputs.get(this.in.warn));
    }
    if (inputs.has(this.in.error)) {
      console.error(inputs.get(this.in.error));
    }
    // tslint:enable:no-console
  }
}
