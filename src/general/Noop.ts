import {Node} from '../Node';

export class Noop extends Node<any, any> {
  public in(value: any): void {
    this.out(value);
  }
}
