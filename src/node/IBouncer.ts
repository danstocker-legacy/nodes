import {TOutBundle} from "../port";

export interface IBouncer {
  /**
   * Port bundle for bounced inputs.
   */
  re: TOutBundle<any>;
}
