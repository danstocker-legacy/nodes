import {InPorts} from "./InPorts";
import {Inputs} from "./Inputs";
import {OutPorts} from "./OutPorts";

export interface INode {
  readonly id: string;
  readonly in: InPorts;
  readonly out: OutPorts;

  send(inputs: Inputs, tag?: string): void;
}
