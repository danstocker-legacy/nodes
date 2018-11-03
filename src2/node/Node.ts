import {
  IDynamicPort,
  IInPort,
  InPorts,
  IOutPort,
  IPort,
  OutPort,
  OutPorts
} from "../port";
import {INode} from "./INode";

export abstract class Node implements INode {
  public readonly in: InPorts;
  public readonly out: OutPorts;

  protected constructor() {
    this.in = {};
    this.out = {};
  }

  /**
   * TODO: Trigger for dynamic ports.
   * @param port Port to be added.
   * @param tag Identifies impulse.
   */
  public addPort<T>(port: IPort<T>, tag?: string): void {
    switch (true) {
      case (<IInPort<T>> port).in:
        this.in[port.name] = <IInPort<T>> port;
        break;
      case port instanceof OutPort:
        this.out[port.name] = <IOutPort<T>> port;
        break;
    }
  }

  /**
   * TODO: Trigger event.
   * @param port
   * @param tag
   */
  public deletePort<T>(port: IDynamicPort<T>, tag?: string): void {
    switch (true) {
      case (<IInPort<T> & IDynamicPort<T>> port).in:
        delete this.in[port.name];
        break;
      case (<IOutPort<T> & IDynamicPort<T>> port).out:
        delete this.out[port.name];
        break;
    }
  }

  public abstract send<T>(port: IInPort<T>, value: T, tag?: string): void;
}
