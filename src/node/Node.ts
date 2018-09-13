import {INode} from "./INode";
import {InPort} from "./InPort";
import {InPorts} from "./InPorts";
import {Inputs} from "./Inputs";
import {IPort} from "./IPort";
import {OutPort} from "./OutPort";
import {OutPorts} from "./OutPorts";
import {Ports} from "./Ports";

export abstract class Node implements INode {
  public readonly in: InPorts;
  public readonly out: OutPorts;

  protected constructor() {
    this.in = {};
    this.out = {};
  }

  public send(inputs: Inputs, tag?: string): void {
    this.process(inputs, tag);
  }

  // tslint:disable:no-empty
  public onConnect<T>(outPort: OutPort<T>, inPort: InPort<T>): void {
  }

  // tslint:disable:no-empty
  public onDisconnect<T>(outPort: OutPort<T>, inPort: InPort<T>): void {
  }

  protected openInPort<T>(name: string, port: InPort<T>): void {
    const ports = this.in;
    const portBefore = ports[name];
    if (portBefore) {
      throw new Error(`Port "${name}" already open`);
    }
    ports[name] = port;
    this.onPortOpen(name, port, ports);
  }

  protected openOutPort<T>(name: string, port: OutPort<T>): void {
    const ports = this.out;
    const portBefore = ports[name];
    if (portBefore) {
      throw new Error(`Port "${name}" already open`);
    }
    ports[name] = port;
    this.onPortOpen(name, port, ports);
  }

  protected closeInPort<T>(name: string): void {
    const ports = this.in;
    const portBefore = ports[name];
    if (portBefore) {
      delete ports[name];
      this.onPortClose(name, portBefore, ports);
    }
  }

  protected closeOutPort<T>(name: string): void {
    const ports = this.out;
    const portBefore = ports[name];
    if (portBefore) {
      delete ports[name];
      this.onPortClose(name, portBefore, ports);
    }
  }

  protected abstract process(inputs: Inputs, tag?: string): void;

  // tslint:disable:no-empty
  protected onPortOpen(name: string, port: IPort<any>, ports: Ports): void {
  }

  // tslint:disable:no-empty
  protected onPortClose(name: string, port: IPort<any>, ports: Ports): void {
  }
}
