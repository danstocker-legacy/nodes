import {INode} from "../node";
import {IInPort} from "./IInPort";
import {IOutPort} from "./IOutPort";
import {Port} from "./Port";

export abstract class InPort<T> extends Port<T> implements IInPort<T> {
  public readonly in: true;

  protected constructor(name: string | number, node: INode) {
    super(name, node);
    this.in = true;
  }

  public connect(peer: IOutPort<T>, tag?: string): void {
    //
  }

  public disconnect(tag?: string): void {
    //
  }

  public send(value: T, tag?: string): void {
    //
  }
}
