import {SyncerBase} from "../abstracts";
import {ReducerCallback} from "../functional/ReducerCallback";
import {InPort, Inputs, OutPort} from "../node";
import {shallowCopy} from "../utils/utils";

/**
 * Outputs aggregated input values between changes in reference.
 */
export class Aggregator<I, O> extends SyncerBase {
  public readonly in: {
    ref: InPort<any>,
    $: InPort<I>
  };
  public readonly out: {
    $: OutPort<O>
  };
  private readonly callback: ReducerCallback<I, O>;
  private readonly initial: O;
  private ref: any;
  private reduced: O;

  constructor(callback: ReducerCallback<I, O>, initial?: O) {
    super();
    this.callback = callback;
    this.initial = initial;
    this.reduced = shallowCopy(initial);
    this.openInPort("ref", new InPort(this));
    this.openInPort("$", new InPort(this));
    this.openOutPort("$", new OutPort(this));
  }

  protected process(inputs: Inputs, tag?: string): void {
    const ref = inputs.get(this.in.ref);
    const value: I = inputs.get(this.in.$);
    let reduced = ref !== this.ref ?
      shallowCopy(this.initial) :
      this.reduced;

    this.ref = ref;
    reduced = this.reduced = this.callback(reduced, value, this.in.$, this);

    this.out.$.send(reduced, tag);
  }
}
