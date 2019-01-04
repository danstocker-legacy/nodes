import {IBouncer, ISink, ISource} from "../node";
import {TInBundle, TOutBundle} from "../port";
import {Joiner} from "./Joiner";
import {IInputs, TOutputs} from "./Switch";
import {IInputs as IUSwitchInputs, USwitch} from "./USwitch";

export class SwitchJ<P extends string, V> implements ISink, ISource, IBouncer {
  public readonly i: TInBundle<IInputs<P, V>>;
  public readonly o: TOutBundle<TOutputs<P, V>>;
  public readonly b: TOutBundle<IUSwitchInputs<P, V>>;

  constructor(positions: Array<P>) {
    const joiner = new Joiner<IInputs<P, V>>(["d_val", "st_pos"]);
    const switch1 = new USwitch<P, V>(positions);
    joiner.o.o.connect(switch1.i.i);
    this.i = {
      d_val: joiner.i.d_val,
      st_pos: joiner.i.st_pos
    };
    const switchO = switch1.o;
    const o = {} as TOutBundle<TOutputs<P, V>>;
    for (const p of positions) {
      o[p] = switchO[p];
    }
    this.b = {
      i: switch1.b.i
    };
  }
}
