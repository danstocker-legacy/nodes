import {INode, TInPorts} from "../../node";
import {OutPorts$, Outputs$} from "../../utils";
import {TEqualityCallback} from "./TComparer";

export interface IInputs<V> {
  d_val: V;
}

export interface IOutputs<V> {
  b_d_val: V;
  d_val: V;
  ev_err: string;
}

export type TChangeFilter<V> = INode<IInputs<V>, IOutputs<V>>;

export function ChangeFilter$<V>(cb?: TEqualityCallback<V>): TChangeFilter<V> {
  const o = OutPorts$(["b_d_val", "d_val", "ev_err"]);
  const outputs = Outputs$(o);

  let last: V;

  const i: TInPorts<IInputs<V>> = cb ? {
    d_val: (value, tag) => {
      try {
        if (!cb(value, last)) {
          outputs.d_val(value, tag);
        }
      } catch (err) {
        outputs.b_d_val(value, tag);
        outputs.ev_err(String(err), tag);
      }
      last = value;
    }
  } : {
    d_val: (value, tag) => {
      if (value !== last) {
        outputs.d_val(value, tag);
      }
      last = value;
    }
  };

  return {i, o};
}
