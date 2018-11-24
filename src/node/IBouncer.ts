import {TOutPorts} from "../port";

export interface IBouncer {
  /**
   * Bundle of ports for bouncing inputs.
   */
  bounced: TOutPorts<any>;
}
