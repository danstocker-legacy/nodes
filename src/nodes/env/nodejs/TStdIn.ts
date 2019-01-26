import {INode} from "../../../node";
import {OutPorts$, Outputs$} from "../../../utils";

interface IOutputs {
  d_val: string | Buffer;
}

export type TStdIn = INode<{}, IOutputs>;

let instance: TStdIn;

export function StdIn$(): TStdIn {
  if (instance) {
    return instance;
  }

  const o = OutPorts$(["d_val"]);
  const outputs = Outputs$(o);

  process.stdin.on("readable", () => {
    const chunk = process.stdin.read();
    if (chunk !== null) {
      outputs.d_val(chunk);
    }
  });

  instance = {i: {}, o};

  return instance;
}
