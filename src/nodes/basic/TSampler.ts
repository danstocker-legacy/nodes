import {INode, TInPorts} from "../../node";
import {OutPorts$, Outputs$} from "../../utils";

export interface IInputs<V> {
  d_val: V;
  ev_smp: any;
}

export interface IOutputs<V> {
  d_val: V;
}

export type TSampler<V> = INode<IInputs<V>, IOutputs<V>>;

export function Sampler$<V>() {
  const o = OutPorts$(["d_val"]);
  const outputs = Outputs$(o);

  let input: V;

  const i: TInPorts<IInputs<V>> = {
    d_val: (value) => {
      input = value;
    },

    ev_smp: (value, tag) => {
      outputs.d_val(input, tag);
    }
  };

  return {i, o};
}
