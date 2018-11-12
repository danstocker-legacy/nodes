import {ISink} from "./ISink";
import {ISource} from "./ISource";

export type TNode<I, O> = ISink<I> | ISource<O> | (ISink<I> & ISource<O>);
