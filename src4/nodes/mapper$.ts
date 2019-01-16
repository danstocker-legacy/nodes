import {INode} from "../node";
import {TTag} from "../node/TTag";
import {createOutPorts, createOutputs} from "../utils";

export type TMapperCallback<I, O> = (value: I, tag?: TTag) => O;

export interface IInputs<I> {
  d_val: I;
}

export interface IOutputs<I, O> {
  d_val: O;
  b_d_val: I;
  ev_err: string;
}

export type TMapper<I, O> = INode<IInputs<I>, IOutputs<I, O>>;

export function mapper$<I, O>(cb: TMapperCallback<I, O>): TMapper<I, O> {
  const o = createOutPorts(["d_val", "b_d_val", "ev_err"]);
  const outputs = createOutputs(o);

  const i = {
    d_val: (value, tag) => {
      try {
        outputs.d_val(cb(value, tag), tag);
      } catch (err) {
        outputs.b_d_val(value, tag);
        outputs.ev_err(String(err), tag);
      }
    }
  };

  return {i, o};
}
