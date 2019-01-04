import {ISink, ISource} from "../node";
import {TInBundle, TOutBundle} from "../port";
import {IInputs, IOutputs} from "./Buffer";
import {Joiner} from "./Joiner";
import {UBuffer} from "./UBuffer";

export class BufferJ<V> implements ISink, ISource {
  public readonly i: TInBundle<IInputs<V>>;
  public readonly o: TOutBundle<IOutputs<V>>;

  constructor() {
    const joiner = new Joiner<IInputs<V>>(["d_val", "st_open"]);
    const buffer = new UBuffer<V>();
    joiner.o.o.connect(buffer.i.i);
    this.i = {
      d_val: joiner.i.d_val,
      st_open: joiner.i.st_open
    };
    this.o = {
      d_val: buffer.o.d_val,
      st_size: buffer.o.st_size
    };
  }
}
