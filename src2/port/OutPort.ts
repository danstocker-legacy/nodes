import {INode} from "../node";
import {IInPort} from "./IInPort";
import {IOutPort} from "./IOutPort";
import {Port} from "./Port";

export abstract class OutPort<T> extends Port<T> implements IOutPort<T> {
  public readonly out: true;

  protected constructor(name: string | number, node: INode) {
    super(name, node);
    this.out = true;
  }

  public connect(peer: IInPort<T>, tag?: string): void {
    //
  }

  public disconnect(peer?: IInPort<T>, tag?: string): void {
    //
  }

  public send(value: T, tag?: string): void {
    //
  }
}
