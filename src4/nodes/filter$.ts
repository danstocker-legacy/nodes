import {INode} from "../node";
import {TTag} from "../node/TTag";
import {createOutPorts, createOutputs} from "../utils";

export type TFilterCallback<V> = (value: V, tag?: TTag) => boolean;

export interface IInputs<V> {
  d_val: V;
}

export interface IOutputs<V> {
  d_val: V;
  b_d_val: V;
  ev_err: string;
}

export type TFilter<V> = INode<IInputs<V>, IOutputs<V>>;

export function filter$<V>(cb: TFilterCallback<V>): TFilter<V> {
  const o = createOutPorts(["d_val", "b_d_val", "ev_err"]);
  const outputs = createOutputs(o);

  const i = {
    d_val: (value, tag) => {
      try {
        if (cb(value, tag)) {
          outputs.d_val(value, tag);
        }
      } catch (err) {
        outputs.b_d_val(value, tag);
        outputs.ev_err(String(err), tag);
      }
    }
  };

  return {i, o};
}
