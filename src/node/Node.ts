import {INode} from "./INode";
import {InPort} from "./InPort";
import {Inputs} from "./Inputs";
import {OutPort} from "./OutPort";
import {Ports} from "./Ports";

export abstract class Node implements INode {
  public readonly ports: Ports;

  public send(inputs: Inputs, tag?: string): void {
    this.process(inputs, tag);
  }

  protected abstract process(inputs: Inputs, tag?: string): void;

  protected getInPorts(): Array<InPort<any>> {
    const ports = this.ports;
    const result = [];
    for (const name in ports) {
      if (ports[name] instanceof InPort) {
        result.push(ports[name]);
      }
    }
    return result;
  }

  protected getOutPorts(): Array<OutPort<any>> {
    const ports = this.ports;
    const result = [];
    for (const name in ports) {
      if (ports[name] instanceof OutPort) {
        result.push(ports[name]);
      }
    }
    return result;
  }
}
