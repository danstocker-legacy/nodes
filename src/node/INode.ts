import {InPort} from "./InPort";
import {Ports} from "./Ports";

/**
 * Blueprint for nodes. When creating custom nodes, the implementer has two
 * things to define:
 * 1. Port structure, eg. {in:InPort<T>, out:OutPort<T>}
 * 2. How and when inputs are translated and sent to outputs.
 */
export interface INode {
  readonly ports: Ports;

  send(value: any, port: InPort<any>);
}
