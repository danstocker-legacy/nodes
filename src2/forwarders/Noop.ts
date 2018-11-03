import {INode} from "../node";
import {IInPort, IOutPort, StaticPorts} from "../port";

export class Noop implements INode {
  public readonly in: StaticPorts<IInPort<any>, "$">;
  public readonly out: StaticPorts<IOutPort<any>, "$">;
}
