import {reduce} from "../functional";
import {ReduceCallback} from "../functional/callbacks/ReduceCallback";
import {InPort, Inputs, NodeBase, OutPort} from "../node";
import {shallowCopy} from "../utils/utils";

/**
 * Forwards batches of input values with throttling.
 * Batches will be tagged with tag of last input in batch.
 */
export class Throttler<I> extends NodeBase {
  public readonly in: {
    $: InPort<I>
  };
  public readonly out: {
    $: OutPort<Array<I>>
  };
  private readonly delay: number;
  private readonly callback: ReduceCallback<I, any>;
  private readonly initial: any;
  private timer: NodeJS.Timer;
  private reduced: any;
  private count: number;

  constructor(
    delay: number,
    callback: ReduceCallback<I, any> = reduce.push,
    initial: any = []
  ) {
    super();
    this.delay = delay;
    this.reduced = [];
    this.callback = callback;
    this.initial = initial;
    this.reduced = shallowCopy(initial);
    this.count = 0;
    this.openInPort("$");
    this.openOutPort("$");
  }

  protected process(inputs: Inputs, tag?: string): void {
    const next = inputs.get(this.in.$);
    this.reduced = this.callback(this.reduced, next, this.in.$, this);
    this.count++;

    const timer = this.timer;
    if (!timer) {
      const onTimeout = () => {
        const reduced = this.reduced;
        if (this.count) {
          this.timer = setTimeout(onTimeout, this.delay);
          this.reduced = shallowCopy(this.initial);
          this.out.$.send(reduced, tag);
          this.count = 0;
        } else {
          this.timer = undefined;
        }
      };

      this.timer = setTimeout(onTimeout, this.delay);
    }
  }
}
