import {InPort, Inputs, NodeBase, OutPort} from "../node";

/**
 * Special mapper that adds field names to an array of values.
 * TODO: Tentative. Contender: mapper callback "hash".
 */
export class HashMapper extends NodeBase {
  public readonly in: {
    $: InPort<Array<any>>
  };
  public readonly out: {
    $: OutPort<{ [key: string]: any }>
  };
  private readonly fields: Array<string>;

  constructor(fields: Array<string>) {
    super();
    this.fields = fields;
    this.openInPort("$", new InPort(this));
    this.openOutPort("$", new OutPort(this));
  }

  protected process(inputs: Inputs, tag?: string): void {
    const values = inputs.get(this.in.$);
    const fields = this.fields;
    const fieldCount = fields.length;
    const result = {};
    for (let i = 0; i < fieldCount; i++) {
      const field = fields[i];
      result[field] = values[i];
    }
    this.out.$.send(result, tag);
  }
}
