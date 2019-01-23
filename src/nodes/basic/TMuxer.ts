import {INode, TInPorts} from "../../node";
import {IMuxed, OutPorts$, Outputs$} from "../../utils";

export type TInputs<T> = T;

export interface IOutputs<T> {
  d_mux: IMuxed<T>;
}

export type TMuxer<T> = INode<TInputs<T>, IOutputs<T>>;

export function Muxer$<T>(fields: Array<keyof T>): TMuxer<T> {
  const o = OutPorts$(["d_mux"]);
  const outputs = Outputs$(o);

  const i = <TInPorts<TInputs<T>>>{};

  for (const field of fields) {
    i[field] = (value, tag) => {
      outputs.d_mux({field, value}, tag);
    };
  }

  return {i, o};
}
