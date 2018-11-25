import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";

interface IShifterInputs<V> {
  $: V;
}

interface IShifterOutputs<V> {
  $: V;
}

/**
 * Forwards previous input.
 * Does not know about original tag order. Feed through Serializer if
 * original tag order is to be retained.
 */
export class Shifter<V> implements ISink, ISource {
  public readonly in: TInBundle<IShifterInputs<V>>;
  public readonly out: TOutBundle<IShifterOutputs<V>>;

  private readonly displacement: number;
  private readonly buffer: Array<V>;

  /**
   * @param displacement Displacement
   */
  constructor(displacement: number = 1) {
    MSink.init.call(this, ["$"]);
    MSource.init.call(this, ["$"]);
    this.displacement = displacement;
    this.buffer = [];
  }

  public send(port: IInPort<V>, input: V, tag?: string): void {
    const displacement = this.displacement;
    const buffer = this.buffer;
    buffer.push(input);
    if (buffer.length > displacement) {
      this.out.$.send(buffer.shift(), tag);
    } else {
      this.out.$.send(undefined, tag);
    }
  }
}
