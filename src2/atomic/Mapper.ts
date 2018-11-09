import {IAtomicNode, Node} from "../node";
import {IInPort, InPort, OutPort, TInPorts, TOutPorts} from "../port";

type MapperCallback<I, O> = (value: I, tag: string, node: IAtomicNode) => O;

/**
 * Maps input value to an output value, as specified by a static mapper
 * callback, or one passed in through the pseudo-port "cb".
 * @example
 * // static callback
 * const mapper = new Mapper<number, string>(String);
 */
export class Mapper<I, O> extends Node {
  public readonly in: TInPorts<{
    $: I
  }>;
  public readonly out: TOutPorts<{
    $: O
  }>;

  private readonly cb: MapperCallback<I, O>;

  constructor(cb: MapperCallback<I, O>) {
    super();
    this.cb = cb;
    this.in.$ = new InPort("$", this);
    this.out.$ = new OutPort("$", this);
  }

  public send<U>(port: IInPort<U & I>, input: U & I, tag?: string): void {
    if (port === this.in.$) {
      const mapped = this.cb(input, tag, this);
      this.out.$.send(mapped, tag);
    }
  }
}
