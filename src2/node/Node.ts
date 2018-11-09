import {IInPort, IOutPort, IPort, TInPorts, TOutPorts} from "../port";
import {IAtomicNode} from "./IAtomicNode";

export abstract class Node implements IAtomicNode {
  public readonly in: TInPorts<any>;
  public readonly out: TOutPorts<any>;

  protected constructor() {
    this.in = {};
    this.out = {};
  }

  /**
   * TODO: Trigger for dynamic ports.
   * TODO: Make it call into #dynamicPorts if there is one.
   * @param port Port to be added.
   * @param tag Identifies impulse.
   */
  public addPort<T>(port: IPort<T>, tag?: string): void {
    switch (true) {
      case (<IInPort<T>> port).in:
        this.in[port.name] = <IInPort<T>> port;
        break;
      case (<IOutPort<T>> port).out:
        this.out[port.name] = <IOutPort<T>> port;
        break;
    }
  }

  /**
   * TODO: Trigger event.
   * TODO: Make it call into #dynamicPorts if there is one.
   * @param port
   * @param tag
   */
  public deletePort<T>(port: IPort<T>, tag?: string): void {
    switch (true) {
      case (<IInPort<T>> port).in:
        delete this.in[port.name];
        break;
      case (<IOutPort<T>> port).out:
        delete this.out[port.name];
        break;
    }
  }

  public abstract send<T>(port: IInPort<T>, value: T, tag?: string): void;

  public onConnect<T>(localPort: IPort<T>, remotePort: IPort<T>, tag?: string): void {
    //
  }

  public onDisconnect<T>(localPort: IPort<T>, remotePort: IPort<T>, tag?: string): void {
    //
  }
}
