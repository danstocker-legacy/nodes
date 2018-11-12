import {IInPort} from "../port";
import {IAtomicNode} from "./IAtomicNode";
import {Node} from "./Node";

/**
 * @deprecated Use a combination of ISink, ISource, IServiced
 */
export abstract class AtomicNode<I, O, E extends string = null>
  extends Node<I, O, E>
  implements IAtomicNode<I> {
  public abstract send(port: IInPort<I[keyof I]>, value: I[keyof I], tag?: string): void;
}
