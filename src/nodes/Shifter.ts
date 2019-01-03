import {ISink, ISource, MSink, MSource} from "../node";
import {IInPort, TInBundle, TOutBundle} from "../port";

interface IShifterInputs<V> {
  d_val: V;
}

interface IShifterOutputs<V> {
  d_val: V;
}

/**
 * Forwards previous input.
 * Does not know about original tag order. Feed through Serializer if
 * original tag order is to be retained.
 * TODO: Is a displacement > 1 useful?
 */
export class Shifter<V> implements ISink, ISource {
  public readonly i: TInBundle<IShifterInputs<V>>;
  public readonly o: TOutBundle<IShifterOutputs<V>>;

  private readonly displacement: number;
  private readonly buffer: Array<V>;

  /**
   * @param displacement Displacement
   */
  constructor(displacement: number = 1) {
    MSink.init.call(this, ["d_val"]);
    MSource.init.call(this, ["d_val"]);
    this.displacement = displacement;
    this.buffer = [];
  }

  public send(port: IInPort<V>, input: V, tag?: string): void {
    if (port === this.i.d_val) {
      const displacement = this.displacement;
      const buffer = this.buffer;
      buffer.push(input);
      if (buffer.length > displacement) {
        this.o.d_val.send(buffer.shift(), tag);
      } else {
        this.o.d_val.send(undefined, tag);
      }
    }
  }
}
