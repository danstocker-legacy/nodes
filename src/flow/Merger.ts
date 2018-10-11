import {SyncerBase} from "../abstracts";
import {reduce} from "../functional";
import {ReduceCallback} from "../functional/callbacks/ReduceCallback";
import {InPort, Inputs, OutPort} from "../node";
import {shallowCopy} from "../utils/utils";

/**
 * Merges values from all input ports into a single output.
 */
export class Merger<I> extends SyncerBase {
  public readonly in: {
    [key: string]: InPort<I>
  };
  public readonly out: {
    $: OutPort<any>
  };
  private readonly count: number;
  private readonly callback: ReduceCallback<I, any>;
  private readonly initial: any;

  constructor(
    count: number = 2,
    callback: ReduceCallback<I, any> = reduce.push,
    initial: any = []
  ) {
    super();
    this.count = count;
    this.callback = callback;
    this.initial = initial;
    for (let i = 0; i < count; i++) {
      this.openInPort(`${i}`, new InPort(this));
    }
    this.openOutPort("$", new OutPort(this));
  }

  protected process(inputs: Inputs, tag: string): void {
    const count = this.count;
    let result = shallowCopy(this.initial);
    for (let i = 0; i < count; i++) {
      const port = this.in[i];
      const value = inputs.get(port);
      result = this.callback(result, value, port, this);
    }
    this.out.$.send(result, tag);
  }
}
