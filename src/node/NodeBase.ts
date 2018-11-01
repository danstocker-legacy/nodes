import {INode} from "./INode";
import {InPort} from "./InPort";
import {InPorts} from "./InPorts";
import {Inputs} from "./Inputs";
import {IPort} from "./IPort";
import {OutPort} from "./OutPort";
import {OutPorts} from "./OutPorts";
import {Ports} from "./Ports";

let nextNodeId = 0;

export abstract class NodeBase implements INode {
  public readonly id: string;
  public readonly in: InPorts;
  public readonly out: OutPorts;

  protected constructor() {
    this.id = String(nextNodeId++);
    this.in = {};
    this.out = {};
  }

  public openInPort<T>(name: string | number, port?: InPort<T>): InPort<T> {
    port = port || new InPort(this, typeof name === "string");
    const ports = this.in;
    const portBefore = ports[name];
    if (portBefore) {
      throw new Error(`Port "${name}" already open`);
    }
    ports[name] = port;
    this.onPortOpen(name, port, ports);
    return port;
  }

  public openOutPort<T>(name: string | number, port?: OutPort<T>): OutPort<T> {
    port = port || new OutPort(this, typeof name === "string");
    const ports = this.out;
    const portBefore = ports[name];
    if (portBefore) {
      throw new Error(`Port "${name}" already open`);
    }
    ports[name] = port;
    this.onPortOpen(name, port, ports);
    return port;
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

  /** @deprecated */
  public send(inputs: Inputs, tag?: string): void {
    this.process(inputs, tag);
  }

  // tslint:disable:no-empty

  /**
   * TODO: Use name instead of ports? Could be used directly then.
   * TODO: Make abstract.
   * TODO: Make generic.
   * TODO: Rename to send once deprecated methods are removed.
   */
  public sendInput(port: InPort<any>, value: any, tag?: string): void {
  }

  public onConnect<T>(outPort: OutPort<T>, inPort: InPort<T>): void {
  }

  public onDisconnect<T>(outPort: OutPort<T>, inPort: InPort<T>): void {
  }

  /** @deprecated */
  protected process(inputs: Inputs, tag?: string): void {
  }

  protected onPortOpen(name: string | number, port: IPort<any>, ports: Ports): void {
  }

  protected onPortClose(name: string | number, port: IPort<any>, ports: Ports): void {
  }

  // tslint:enable:no-empty
}
