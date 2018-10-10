import {SyncerBase} from "../abstracts/index";
import {rcb} from "../functional/index";
import {ReducerCallback} from "../functional/ReducerCallback";
import {InPort, Inputs, OutPort} from "../node/index";
import {shallowCopy} from "../utils/utils";

export class Merger<I> extends SyncerBase {
  public readonly in: {
    [key: string]: InPort<I>
  };
  public readonly out: {
    $: OutPort<any>
  };
  private readonly count: number;
  private readonly callback: ReducerCallback<I, any>;
  private readonly initial: any;

  constructor(
    count: number = 2,
    callback: ReducerCallback<I, any> = rcb.push,
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
