import {INode, TInPorts} from "../../node";
import {copy, OutPorts$, Outputs$} from "../../utils";
import {TOutputs} from "../basic/TDemuxer";

export type TInputs<T> = T;

export interface IOutputs<T> {
  all: T;
}

export type TMerger<T> = INode<TInputs<T>, IOutputs<T>>;

export function Merger$<T>(fields: Array<keyof T>): TMerger<T> {
  const o = OutPorts$(["all"]);
  const outputs = Outputs$(o);

  const inputs = <TOutputs<T>>{};

  const i = <TInPorts<TInputs<T>>>{};
  for (const field of fields) {
    i[field] = (value, tag) => {
      inputs[field] = value;
      outputs.all(copy(inputs), tag);
    };
  }

  return {i, o};
}
