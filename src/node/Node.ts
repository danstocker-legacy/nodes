import {INode} from "./INode";
import {InPort} from "./InPort";
import {Inputs} from "./Inputs";
import {IPort} from "./IPort";
import {OutPort} from "./OutPort";

type Ports = {
  [key: string]: IPort<any>
};
type InPorts = {
  [key: string]: InPort<any>
};
type OutPorts = {
  [key: string]: OutPort<any>
};

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

  protected openPort<T>(name: string, port: IPort<T>): void {
    const ports = this.getPorts(port);
    const portBefore = ports[name];
    if (portBefore) {
      throw new Error(`Port "${name}" already open`);
    }
    ports[name] = port;
    this.onPortOpen(name, port, ports);
  }

  // protected closePort<T>(name: string, port:IPort<T>): void {
  //   const portBefore = this.ports[name];
  //   if (portBefore) {
  //     const ports = this.getPorts(portBefore);
  //     delete ports[name];
  //     this.onPortClose(name, portBefore, ports);
  //   }
  // }

  protected abstract process(inputs: Inputs, tag?: string): void;

  // tslint:disable:no-empty
  protected onPortOpen<T>(name: string, port: IPort<T>, ports: Ports): void {
  }

  // tslint:disable:no-empty
  protected onPortClose<T>(name: string, port: IPort<T>, ports: Ports): void {
  }

  private getPorts<T>(port: IPort<T>): Ports {
    let result: { [key: string]: IPort<T> };
    if (port instanceof InPort) {
      result = this.in;
    } else if (port instanceof OutPort) {
      result = this.out;
    }
    return result;
  }
}
