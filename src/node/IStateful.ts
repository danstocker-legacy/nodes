import {IOutPort} from "../port";
import {ITree} from "../utils";

export interface IStateful {
  change: ITree<IOutPort<any>>;
}
