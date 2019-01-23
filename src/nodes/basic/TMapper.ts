import {INode, TInPorts, TTag} from "../../node";
import {OutPorts$, Outputs$} from "../../utils";

export type TMapperCallback<I, O> = (value: I, tag?: TTag) => O;

export interface IInputs<I> {
  d_val: I;
}

export interface IOutputs<I, O> {
  b_d_val: I;
  d_val: O;
  ev_err: string;
}

export type TMapper<I, O> = INode<IInputs<I>, IOutputs<I, O>>;

export function Mapper$<I, O>(cb: TMapperCallback<I, O>): TMapper<I, O> {
  const o = OutPorts$(["b_d_val", "d_val", "ev_err"]);
  const outputs = Outputs$(o);

  const i: TInPorts<IInputs<I>> = {
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
