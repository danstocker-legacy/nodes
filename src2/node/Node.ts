import {TEventPorts} from "../port";
import {Evented} from "./Evented";
import {IEvented} from "./IEvented";
import {IServiced} from "./IServiced";
import {Serviced} from "./Serviced";

export class Node implements IServiced, IEvented {
  public svc: TEventPorts;

  constructor() {
    Serviced.init.call(this);
    Evented.init.call(this);
  }
}
