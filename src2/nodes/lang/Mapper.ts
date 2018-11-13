import {ISink, ISource} from "../../node";
import {IInPort, InPort, OutPort, TInPorts, TOutPorts} from "../../port";

interface IMapperInputs<V> {
  $: V;
}

interface IMapperOutputs<V> {
  $: V;
}

type TMapperCallback<I, O> = (value: I, tag: string, node: ISink<IMapperInputs<I>>) => O;

/**
 * Maps input value to an output value, as specified by a static mapper
 * callback, or one passed in through the pseudo-port "cb".
 * @example
 * // static callback
 * const mapper = new Mapper<number, string>(String);
 */
export class Mapper<I, O> implements ISink<IMapperInputs<I>>, ISource<IMapperOutputs<O>> {
  public readonly in: TInPorts<IMapperInputs<I>>;
  public readonly out: TOutPorts<IMapperOutputs<O>>;

  private readonly cb: TMapperCallback<I, O>;

  constructor(cb: TMapperCallback<I, O>) {
    this.cb = cb;
    this.in = {
      $: new InPort("$", this)
    };
    this.out = {
      $: new OutPort("$", this)
    };
  }

  public send(port: IInPort<I>, input: I, tag?: string): void {
    if (port === this.in.$) {
      const mapped = this.cb(input, tag, this);
      this.out.$.send(mapped, tag);
    }
  }
}
