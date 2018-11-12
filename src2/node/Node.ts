import {IInPort, OutPort, TInPorts, TOutPorts} from "../port";
import {IEvent} from "../utils";
import {INode, TPortEvents} from "./INode";

/**
 * @deprecated Use a combination of ISink, ISource, IServiced
 */
export abstract class Node<I, O, E extends string = null> implements INode<I, O, E> {
  public in: TInPorts<I>;
  public out: TOutPorts<O>;
  public svc: TOutPorts<{ evt: IEvent<E | TPortEvents> }>;

  protected constructor() {
    this.in = <TInPorts<I>> {};
    this.out = <TOutPorts<O>> {};
    this.svc = {
      evt: new OutPort("evt", this)
    };
  }

  public abstract send(port: IInPort<I[keyof I]>, value: I[keyof I], tag?: string): void;
}
