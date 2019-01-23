import {INode, TInPorts} from "../../node";
import {OutPorts$, Outputs$} from "../../utils";

export interface IInputs<V> {
  d_val: V;
}

export interface IOutputs<V> {
  d_val: V;
}

export type TNoop<V> = INode<IInputs<V>, IOutputs<V>>;

export function Noop$<V>(): TNoop<V> {
  const o = OutPorts$(["d_val"]);
  const outputs = Outputs$(o);

  const i: TInPorts<IInputs<V>> = {
    d_val: (value, tag) => {
      outputs.d_val(value, tag);
    }
  };

  return {i, o};
}
