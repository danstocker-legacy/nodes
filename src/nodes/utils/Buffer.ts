import {ISink, ISource, MSink, MSource} from "../../node";
import {IInPort, TInBundle, TOutBundle} from "../../port";
import {ValueOf} from "../../utils";

interface IBufferInputs<V> {
  $: V;
  paused: boolean;
}

interface IBufferOutputs<V> {
  $: V;
}

/**
 * Buffers inputs when paused. Forwards input otherwise.
 * Atomic equivalent of a composite node.
 * Composite view:
 * TBD
 * @example
 * TBD
 */
export class Buffer<V> implements ISink, ISource {
  public readonly in: TInBundle<IBufferInputs<V>>;
  public readonly out: TOutBundle<IBufferOutputs<V>>;

  private readonly buffer: Array<[V, string]>;
  private paused: boolean;

  constructor() {
    MSink.init.call(this, ["$", "paused"]);
    MSource.init.call(this, ["$"]);
    this.buffer = [];
    this.paused = true;
  }

  public send(
    port: IInPort<ValueOf<IBufferInputs<V>>>,
    value: ValueOf<IBufferInputs<V>>,
    tag?: string
  ): void {
    const inPorts = this.in;
    switch (port) {
      case inPorts.$:
        if (this.paused) {
          this.buffer.push([value as V, tag]);
        } else {
          this.out.$.send(value as V, tag);
        }
        break;

      case inPorts.paused:
        this.paused = value as boolean;
        // if new value is false, release buffer contents
        if (!value) {
          const buffer = this.buffer;
          while (buffer.length) {
            const next = buffer.shift();
            this.out.$.send(next[0], next[1]);
          }
        }
        break;
    }
  }
}
