import {Inputs} from "./Inputs";
import {Ports} from "./Ports";

/**
 * Blueprint for nodes. When creating custom nodes, the implementer has two
 * things to define:
 * 1. Port structure, eg. {in:InPort<T>, out:OutPort<T>}
 * 2. How and when inputs are processed and sent to outputs.
 */
export interface INode {
  readonly in: Ports;
  readonly out: Ports;

  send(inputs: Inputs, tag?: string): void;
}
