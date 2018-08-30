import {Port} from './Port';

export interface INode {
  readonly ports: Object;

  in(port: Port<any>, value: any);
}
