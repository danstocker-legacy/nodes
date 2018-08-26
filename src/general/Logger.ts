import {Node} from '../Node';

export class Logger extends Node<any, any> {
  public in(value: any): void {
    console.log(value);
  }
}
