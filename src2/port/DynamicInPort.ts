import {INode} from "../node";
import {IDynamicPort} from "./IDynamicPort";
import {InPort} from "./InPort";

export class DynamicInPort<T> extends InPort<T> implements IDynamicPort<T> {
  public readonly dynamic: true;

  constructor(name: string, node: INode) {
    super(name, node);
    this.dynamic = true;
  }

  public close(tag?: string): void {
    //
  }
}
