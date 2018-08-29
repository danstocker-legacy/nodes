import {Node} from '../node/Node';

export class Noop<I> extends Node<I, I> {
  public in(value: any): void {
    this.out(value);
  }
}
