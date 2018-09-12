import {InPort, Inputs, Node, OutPort} from "../node";

/**
 * Sends object input to output as JSON string.
 */
export class JsonStringifier<I extends object> extends Node {
  public readonly in: {
    $: InPort<I>
  };
  public readonly out: {
    $: OutPort<string>
  };
  private readonly pretty: boolean;

  constructor(pretty: boolean = false) {
    super();
    this.pretty = pretty;
    this.openPort("$", new InPort(this));
    this.openPort("$", new OutPort());
  }

  protected process(inputs: Inputs, tag?: string): void {
    this.out.$.send(
      JSON.stringify(inputs.get(this.in.$), null, this.pretty ? 2 : 0),
      tag);
  }
}
