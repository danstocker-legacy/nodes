import {Node} from '../Node';
import {MapperCallback} from "../typedefs";

export class Mapper<I, O> extends Node<I, O> {
  private readonly callback: MapperCallback<I, O>;

  constructor(callback: MapperCallback<I, O>) {
    super();
    this.callback = callback;
  }

  public in(value: I): void {
    let source = this.in['source'];
    this.out(this.callback(value, source && source.id, this.sources));
  }
}