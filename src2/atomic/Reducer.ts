import {IAtomicNode, Node} from "../node";
import {IInPort, InPort, OutPort, TInPorts, TOutPorts} from "../port";
import {copy} from "../utils";

type TReducerCallback<I, O> = (curr: O, next: I, tag: string, node: IAtomicNode) => O;

type TReducerInput<I> = {
  /** Reset signal */
  res: boolean,

  /** Next input value */
  val: I
};

/**
 * Reduces input according to callback.
 * Resets state to initial on receiving truthy on `res`.
 * @example
 * let sum: Reducer<number, number>;
 * sum = new Reducer((curr, next) => curr + next, 0);
 */
export class Reducer<I, O> extends Node {
  public readonly in: TInPorts<{
    $: TReducerInput<I>
  }>;
  public readonly out: TOutPorts<{
    $: O
  }>;

  private readonly cb: TReducerCallback<I, O>;
  private readonly initial?: O;
  private reduced: O;

  constructor(cb: TReducerCallback<I, O>, initial?: O) {
    super();
    this.cb = cb;
    this.initial = initial;
    this.reduced = copy(initial);
    this.in.$ = new InPort("$", this);
    this.out.$ = new OutPort("$", this);
  }

  public send<U>(
    port: IInPort<U & TReducerInput<I>>,
    value: U & TReducerInput<I>,
    tag?: string
  ): void {
    if (port === this.in.$) {
      const next = value.val;
      const curr = value.res ?
        copy(this.initial) :
        this.reduced;

      const reduced = this.reduced = this.cb(curr, next, tag, this);

      this.out.$.send(reduced, tag);
    }
  }
}
