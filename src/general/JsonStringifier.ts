import {Node} from '../Node';

export class JsonStringifier<I extends Object> extends Node<I, string> {
  /**
   * Whether output is formatted.
   */
  private readonly pretty: boolean;

  constructor(pretty: boolean = false) {
    super();
    this.pretty = pretty;
  }

  public in(value: I): void {
    this.out(JSON.stringify(value, null, this.pretty ? 2 : 0));
  }
}
