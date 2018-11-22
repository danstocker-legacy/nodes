import {ITree} from "../utils";
import {IOutPort} from "./IOutPort";
import {TMetaBundles} from "./TMetaBundles";

export interface IOutMetaPorts<T> extends ITree<IOutPort<any>> {
  out: TMetaBundles<T>;
}
