import {INode, TInPorts} from "../../node";
import {OutPorts$, Outputs$} from "../../utils";
import {TEqualityCallback} from "./TComparer";

export interface IInputs<V> {
  d_val: V;
}

export interface IOutputs<V> {
  b_d_val: V;
  d_eq: boolean;
  ev_err: string;
}

export type TChangeDetector<V> = INode<IInputs<V>, IOutputs<V>>;

export function Change$Detector<V>(
  cb?: TEqualityCallback<V>
): TChangeDetector<V> {
  const o = OutPorts$(["b_d_val", "d_eq", "ev_err"]);
  const outputs = Outputs$(o);

  let last: V;

  const i: TInPorts<IInputs<V>> = cb ? {
    d_val: (value, tag) => {
      try {
        outputs.d_eq(!cb(value, last), tag);
        last = value;
      } catch (err) {
        outputs.b_d_val(value, tag);
        outputs.ev_err(String(err), tag);
      }
    }
  } : {
    d_val: (value, tag) => {
      outputs.d_eq(value !== last, tag);
      last = value;
    }
  };

  return {i, o};
}
