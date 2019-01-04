import {ISink, ISource} from "../node";
import {TInBundle, TOutBundle} from "../port";
import {IInputs, IOutputs} from "./Gate";
import {Joiner} from "./Joiner";
import {UGate} from "./UGate";

export class GateJ<V> implements ISink, ISource {
  public readonly i: TInBundle<IInputs<V>>;
  public readonly o: TOutBundle<IOutputs<V>>;

  constructor() {
    const joiner = new Joiner<IInputs<V>>(["d_val", "st_open"]);
    const gate = new UGate<V>();
    joiner.o.o.connect(gate.i.i);
    this.i = {
      d_val: joiner.i.d_val,
      st_open: joiner.i.st_open
    };
    this.o = {
      d_val: gate.o.d_val
    };
  }
}
