import {INode, Port} from '../node';

type LoggerPorts = {
  in: Port<any>
}

export class Logger implements INode {
  public ports: LoggerPorts;

  constructor() {
    this.ports = {
      in: new Port<any>(this)
    }
  }

  public in(port: Port<any>, value: any): void {
    console.log(value);
  }
}
