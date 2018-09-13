import {InPort} from "./InPort";
import {InPorts} from "./InPorts";
import {Inputs} from "./Inputs";
import {OutPort} from "./OutPort";
import {OutPorts} from "./OutPorts";

/**
 * Blueprint for nodes. When creating custom nodes, the implementer has two
 * things to define:
 * 1. Port structure, eg. {in:InPort<T>, out:OutPort<T>}
 * 2. How and when inputs are processed and sent to outputs.
 */
export interface INode {
  readonly in: InPorts;
  readonly out: OutPorts;

  send(inputs: Inputs, tag?: string): void;

  /** Should only be called by OutPort#connect() */
  onConnect<T>(outPort: OutPort<T>, inPort: InPort<T>): void;

  /** Should only be called by OutPort#disconnect() */
  onDisconnect<T>(outPort: OutPort<T>, inPort: InPort<T>): void;
}
