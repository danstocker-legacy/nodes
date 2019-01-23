import {INode, TInPorts} from "../../node";
import {IMuxed, OutPorts$, Outputs$} from "../../utils";

export interface IInputs<T> {
  d_mux: IMuxed<T>;
}

export type TOutputs<T> = T;

export type TDemuxer<T> = INode<IInputs<T>, TOutputs<T>>;

export function Demuxer$<T>(fields: Array<keyof T>): TDemuxer<T> {
  const o = OutPorts$(fields);
  const outputs = Outputs$(o);

  const i: TInPorts<IInputs<T>> = {
    d_mux: ({field, value}, tag) => {
      outputs[field](value, tag);
    }
  };

  return {i, o};
}
