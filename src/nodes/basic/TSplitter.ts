import {INode, TInPorts} from "../../node";
import {OutPorts$, Outputs$} from "../../utils";

export interface IInputs<T> {
  all: T;
}

export type TOutputs<T> = T;

export type TSplitter<T> = INode<IInputs<T>, TOutputs<T>>;

export function Splitter$<T>(fields: Array<keyof T>): TSplitter<T> {
  const o = OutPorts$(fields);
  const outputs = Outputs$(o);

  const i: TInPorts<IInputs<T>> = {
    all: (value, tag) => {
      for (const field of fields) {
        outputs[field](value[field], tag);
      }
    }
  };

  return {i, o};
}
