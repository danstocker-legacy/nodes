import {InPort, Inputs, NodeBase, OutPort} from "../node";

/**
 * Outputs the previous input value.
 */
export class Shifter<T> extends NodeBase {
  public readonly in: {
    $: InPort<T>
  };
  public readonly out: {
    $: OutPort<T>
  };
  private lastValue: T;

  constructor(initial: T) {
    super();
    this.lastValue = initial;
    this.openInPort("$");
    this.openOutPort("$");
  }

  protected process(inputs: Inputs, tag?: string): void {
    this.out.$.send(this.lastValue, tag);
    this.lastValue = inputs.get(this.in.$);
  }
}
