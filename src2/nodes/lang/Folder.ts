import {ISink, ISource, Node, Sink, Source} from "../../node";
import {IInPort, InPort, OutPort, TInPorts, TOutPorts} from "../../port";
import {copy} from "../../utils";

interface IFolderInput<V> {
  /** Reset signal */
  res: boolean;

  /** Next input value */
  val: V;
}

type TFolderCallback<I, O> = (
  curr: O,
  next: I,
  tag: string,
  node: Folder<I, O>) => O;

/**
 * Folds (reduces) input according to callback.
 * Resets state to initial on receiving truthy on `res`.
 * @example
 * let sum: Folder<number, number>;
 * sum = new Folder((curr, next) => curr + next, 0);
 */
export class Folder<I, O> extends Node implements ISink, ISource {
  public readonly in: TInPorts<{
    $: IFolderInput<I>;
  }>;
  public readonly out: TOutPorts<{
    $: O;
  }>;

  private readonly cb: TFolderCallback<I, O>;
  private readonly initial?: O;
  private folded: O;

  constructor(cb: TFolderCallback<I, O>, initial?: O) {
    super();
    Sink.init.call(this);
    Source.init.call(this);
    this.cb = cb;
    this.initial = initial;
    this.folded = copy(initial);
    this.in.$ = new InPort("$", this);
    this.out.$ = new OutPort("$", this);
  }

  public send(
    port: IInPort<IFolderInput<I>>,
    value: IFolderInput<I>,
    tag?: string
  ): void {
    if (port === this.in.$) {
      const next = value.val;
      const curr = value.res ?
        copy(this.initial) :
        this.folded;

      const folded = this.folded = this.cb(curr, next, tag, this);

      this.out.$.send(folded, tag);
    }
  }
}
