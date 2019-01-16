import {TOutPorts} from "../node";
import {TTag} from "../node/TTag";

export function createOutPorts<O>(fields: Array<keyof O>): TOutPorts<O> {
  const outPorts = <TOutPorts<O>>{};
  for (const field of fields) {
    outPorts[field] = new Set();
  }
  return outPorts;
}

type TOutput<V> = (value: V, tag?: TTag) => void;
type TOutputs<O> = {
  [K in keyof O]: TOutput<O[K]>
};

export function createOutputs<O>(outPorts: TOutPorts<O>): TOutputs<O> {
  const outputs = <TOutputs<O>>{};
  for (const field in outPorts) {
    const inPorts = outPorts[field];
    outputs[field] = (value, tag) => {
      for (const inPort of inPorts) {
        inPort(value, tag);
      }
    };
  }
  return outputs;
}

export const noop = () => null;
