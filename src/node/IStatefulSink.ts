import {IInMetaPorts} from "../port";
import {IStateful} from "./IStateful";

export interface IStatefulSink extends IStateful {
  change: IInMetaPorts<any>;
}
