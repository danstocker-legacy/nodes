import {INode} from "./INode";
import {InPort} from "./InPort";
import {Inputs} from "./Inputs";
import {IPort} from "./IPort";
import {OutPort} from "./OutPort";
import {Ports} from "./Ports";

export abstract class Node implements INode {
  public readonly ports: Ports;

  protected constructor() {
    this.ports = {};
  }

  public send(inputs: Inputs, tag?: string): void {
    this.process(inputs, tag);
  }

  protected openPort<T>(name: string, port: IPort<T>): void {
    const ports = this.ports;
    const portBefore = ports[name];
    if (portBefore) {
      throw new Error(`Port "${name}" already open`);
    }
    ports[name] = port;
    this.onPortOpen(name, port);
  }

  protected closePort(name: string): void {
    const portBefore = this.ports[name];
    if (portBefore) {
      delete this.ports[name];
      this.onPortClose(name, portBefore);
    }
  }

  protected abstract process(inputs: Inputs, tag?: string): void;

  // tslint:disable:no-empty
  protected onPortOpen<T>(name: string, port: IPort<T>): void {
  }

  // tslint:disable:no-empty
  protected onPortClose<T>(name: string, port: IPort<T>): void {
  }
}
