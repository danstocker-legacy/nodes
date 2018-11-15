import {IInPort} from "../port";
import {IDynamicSink} from "./IDynamicSink";

export namespace DynamicSink {
  export function addPort(this: IDynamicSink, port: IInPort<any>, tag?: string): void {
    const name = port.name;
    const ports = this.in;
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

  export function deletePort(this: IDynamicSink, port: IInPort<any>, tag?: string): void {
    const name = port.name;
    const ports = this.in;
    if (port === ports[name]) {
      if (port.peer) {
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
