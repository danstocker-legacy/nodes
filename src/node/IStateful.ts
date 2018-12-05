import {TOutBundle} from "../port";

export interface IStateful {
  /**
   * State output port bundle.
   * Connect to these nodes to receive updates to the node's sate.
   */
  so: TOutBundle<any>;
}
