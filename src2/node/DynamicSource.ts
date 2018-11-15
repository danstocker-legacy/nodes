import {IOutPort} from "../port";
import {IDynamicSource} from "./IDynamicSource";

export namespace DynamicSource {
  export function addPort(this: IDynamicSource, port: IOutPort<any>, tag?: string): void {
    const name = port.name;
    const ports = this.out;
    if (ports[name]) {
      this.svc.err.send({
        payload: {
          node: this,
          port
        },
        type: "PORT_ADD_FAILURE"
      }, tag);
    }
    ports[name] = port;
    this.svc.evt.send({
      payload: {
        node: this,
        port
      },
      type: "PORT_ADD"
    }, tag);
  }

  export function deletePort(this: IDynamicSource, port: IOutPort<any>, tag?: string): void {
    const name = port.name;
    const ports = this.out;
    if (port === ports[name]) {
      if (port.peers.size > 0) {
        port.disconnect();
      }
      delete ports[name];
      this.svc.evt.send({
        payload: {
          node: this,
          port
        },
        type: "PORT_DELETE"
      }, tag);
    }
  }
}
