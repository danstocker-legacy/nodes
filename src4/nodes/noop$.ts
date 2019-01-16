import {INode} from "../node";
import {createOutPorts, createOutputs} from "../utils";

export interface IInputs<V> {
  d_val: V;
}

export interface IOutputs<V> {
  d_val: V;
}

export type TNoop<V> = INode<IInputs<V>, IOutputs<V>>;

export function noop$<V>(): TNoop<V> {
  const o = createOutPorts(["d_val"]);
  const outputs = createOutputs(o);

  const i = {
    d_val: (value, tag) => outputs.d_val(value, tag)
  };

  return {i, o};
}
