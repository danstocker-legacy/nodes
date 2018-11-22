import {IOutMetaPorts} from "../port";
import {IStateful} from "./IStateful";

export interface IStatefulSource extends IStateful {
  change: IOutMetaPorts<any>;
}
