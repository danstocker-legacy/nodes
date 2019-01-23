import {INode, TInPorts} from "../../node";
import {OutPorts$, Outputs$} from "../../utils";

export interface IInputs<V> {
  d_val: V;
}

export interface IOutputs<V> {
  d_val: V;
}

export type TShifter<V> = INode<IInputs<V>, IOutputs<V>>;

export function Shifter$<V>(): TShifter<V> {
  const o = OutPorts$(["d_val"]);
  const outputs = Outputs$(o);

  let last: V;

  const i: TInPorts<IInputs<V>> = {
    d_val: (value, tag) => {
      outputs.d_val(last, tag);
      last = value;
    }
  };

  return {i, o};
}
