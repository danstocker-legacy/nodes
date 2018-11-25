import {TOutBundle} from "../port";

export interface IBouncer {
  /**
   * Bundle of ports for bouncing inputs.
   */
  bounced: TOutBundle<any>;
}
