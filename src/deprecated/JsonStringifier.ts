import {InPort, Inputs, NodeBase, OutPort} from "../node";

/**
 * Sends object input to output as JSON string.
 * @deprecated Use `new Mapper(map.jsonStringify)` instead
 */
export class JsonStringifier<I extends object> extends NodeBase {
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
    this.openInPort("$");
    this.openOutPort("$");
  }

  protected process(inputs: Inputs, tag?: string): void {
    this.out.$.send(
      JSON.stringify(inputs.get(this.in.$), null, this.pretty ? 2 : 0),
      tag);
  }
}
