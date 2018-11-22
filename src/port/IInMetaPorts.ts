import {ITree} from "../utils";
import {IOutPort} from "./IOutPort";
import {TMetaBundles} from "./TMetaBundles";

export interface IInMetaPorts<T> extends ITree<IOutPort<any>> {
  in: TMetaBundles<T>;
}
