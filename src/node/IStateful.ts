import {IOutPort} from "../port";
import {ITree} from "../utils";

// TODO is the tree necessary?
export interface IStateful {
  change: ITree<IOutPort<any>>;
}
