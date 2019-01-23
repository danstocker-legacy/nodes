import {INode, TInPorts, TTag} from "../../node";
import {OutPorts$, Outputs$} from "../../utils";

export type TFilterCallback<V> = (value: V, tag?: TTag) => boolean;

export interface IInputs<V> {
  d_val: V;
}

export interface IOutputs<V> {
  b_d_val: V;
  d_val: V;
  ev_err: string;
}

export type TFilter<V> = INode<IInputs<V>, IOutputs<V>>;

export function Filter$<V>(cb: TFilterCallback<V>): TFilter<V> {
  const o = OutPorts$(["b_d_val", "d_val", "ev_err"]);
  const outputs = Outputs$(o);

  const i: TInPorts<IInputs<V>> = {
    d_val: (value, tag) => {
      try {
        if (cb(value, tag)) {
          outputs.d_val(value, tag);
        }
      } catch (err) {
        outputs.b_d_val(value, tag);
        outputs.ev_err(String(err), tag);
      }
    }
  };

  return {i, o};
}
