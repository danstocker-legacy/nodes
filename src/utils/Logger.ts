import {InPort, Inputs, Node} from "../node";

/**
 * Logs input to console.
 */
export class Logger extends Node {
  public readonly in: {
    $: InPort<any>
  };

  constructor() {
    super();
    this.openInPort("$", new InPort(this));
  }

  protected process(inputs: Inputs, tag?: string): void {
    // tslint:disable:no-console
    console.log(inputs.get(this.in.$));
  }
}