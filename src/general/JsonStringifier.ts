import {Node} from '../Node';

export class JsonStringifier<I extends Object> extends Node<I, string> {
  public in(value: I): void {
    this.out(JSON.stringify(value));
  }
}
