import {INode} from "./INode";
import {InPort} from "./InPort";
import {InPorts} from "./InPorts";
import {Inputs} from "./Inputs";
import {IPort} from "./IPort";
import {OutPort} from "./OutPort";
import {OutPorts} from "./OutPorts";
import {Ports} from "./Ports";

let lastId = 0;

export abstract class NodeBase implements INode {
  public readonly id: string;
  public readonly in: InPorts;
  public readonly out: OutPorts;

  protected constructor() {
    this.id = String(lastId++);
    this.in = {};
    this.out = {};
  }

  public openInPort<T>(name: string, port: InPort<T>): void {
    const ports = this.in;
    const portBefore = ports[name];
    if (portBefore) {
      throw new Error(`Port "${name}" already open`);
    }
    ports[name] = port;
    this.onPortOpen(name, port, ports);
  }

  public openOutPort<T>(name: string, port: OutPort<T>): void {
    const ports = this.out;
    const portBefore = ports[name];
    if (portBefore) {
      throw new Error(`Port "${name}" already open`);
    }
    ports[name] = port;
    this.onPortOpen(name, port, ports);
  }

  public closeInPort<T>(name: string): void {
    const ports = this.in;
    const portBefore = ports[name];
    if (portBefore) {
      if (portBefore.permanent) {
        throw Error(`Port ${name} is permanent.`);
      }
      if (portBefore.peer) {
        portBefore.disconnect();
      }
      delete ports[name];
      this.onPortClose(name, portBefore, ports);
    }
  }

  public closeOutPort<T>(name: string): void {
    const ports = this.out;
    const portBefore = ports[name];
    if (portBefore) {
      if (portBefore.permanent) {
        throw Error(`Port ${name} is permanent.`);
      }
      if (portBefore.peers.size > 0) {
        portBefore.disconnect();
      }
      delete ports[name];
      this.onPortClose(name, portBefore, ports);
    }
  }

  public send(inputs: Inputs, tag?: string): void {
    this.process(inputs, tag);
  }

  // tslint:disable:no-empty
  public onConnect<T>(outPort: OutPort<T>, inPort: InPort<T>): void {
  }

  public onDisconnect<T>(outPort: OutPort<T>, inPort: InPort<T>): void {
  }

  // tslint:enable:no-empty

  protected abstract process(inputs: Inputs, tag?: string): void;

  // tslint:disable:no-empty
  protected onPortOpen(name: string, port: IPort<any>, ports: Ports): void {
  }

  protected onPortClose(name: string, port: IPort<any>, ports: Ports): void {
  }

  // tslint:enable:no-empty
}
