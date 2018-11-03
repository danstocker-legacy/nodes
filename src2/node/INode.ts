import {InPorts, OutPorts} from "../port";

export interface INode {
  readonly in: InPorts;
  readonly out: OutPorts;
}
