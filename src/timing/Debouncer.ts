import {push} from "../functional";
import {ReducerCallback} from "../functional/ReducerCallback";
import {InPort, Inputs, NodeBase, OutPort} from "../node";
import {shallowCopy} from "../utils/utils";

/**
 * Forwards batches of input values with debouncing.
 * Batches will be tagged with tag of last input in batch.
 */
export class Debouncer<I> extends NodeBase {
  public readonly in: {
    $: InPort<I>
  };
  public readonly out: {
    $: OutPort<any>
  };
  private readonly delay: number;
  private readonly callback: ReducerCallback<I, any>;
  private readonly initial: any;
  private timer: NodeJS.Timer;
  private reduced: any;

  constructor(
    delay: number,
    callback: ReducerCallback<I, any> = push,
    initial: any = []
  ) {
    super();
    this.delay = delay;
    this.callback = callback;
    this.initial = initial;
    this.reduced = shallowCopy(this.initial);
    this.openInPort("$", new InPort(this));
    this.openOutPort("$", new OutPort(this));
  }

  protected process(inputs: Inputs, tag?: string): void {
    const next = inputs.get(this.in.$);
    this.reduced = this.callback(this.reduced, next, this.in.$, this);

    const timer = this.timer;
    if (timer) {
      clearTimeout(timer);
    }

    const onTimeout = () => {
      const reduced = this.reduced;
      this.timer = undefined;
      this.reduced = shallowCopy(this.initial);
      this.out.$.send(reduced, tag);
    };

    this.timer = setTimeout(onTimeout, this.delay);
  }
}
