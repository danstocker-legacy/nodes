import {TInBundle} from "../port";

export interface IControllable {
  /**
   * State input port bundle.
   * Send values through these ports to control the state of the node.
   */
  si: TInBundle<any>;
}
