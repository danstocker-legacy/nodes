import {INode, Node} from "../node";
import {
  IInPort,
  StaticInPort,
  StaticOutPort,
  TStaticInPorts,
  TStaticOutPorts
} from "../port";

type MapperCallback<I, O> = (value: I, tag: string, node: INode) => O;

/**
 * Maps input value to an output value, as specified by a static mapper
 * callback, or one passed in through the pseudo-port "cb".
 * @example
 * // static callback
 * const mapper = new Mapper<number, string>(String);
 */
export class Mapper<I, O> extends Node {
  public readonly in: TStaticInPorts<{
    $: I
  }>;
  public readonly out: TStaticOutPorts<{
    $: O
  }>;

  private readonly cb: MapperCallback<I, O>;

  constructor(cb: MapperCallback<I, O>) {
    super();
    this.cb = cb;
    this.addPort(new StaticInPort("$", this));
    this.addPort(new StaticOutPort("$", this));
  }

  public send<U>(port: IInPort<U & I>, value: U & I, tag?: string): void {
    if (port === this.in.$) {
      const mapped = this.cb(value, tag, this);
      this.out.$.send(mapped, tag);
    }
  }
}
