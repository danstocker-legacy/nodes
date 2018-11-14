import {ISource, Node, Source} from "../../node";
import {OutPort, TOutPorts} from "../../port";

export class Interval extends Node implements ISource {
  public readonly out: TOutPorts<{
    $: true
  }>;

  constructor(ms: number) {
    super();
    Source.init.call(this);
    setInterval(this.onInterval.bind(this), ms);
    this.out.$ = new OutPort("$", this);
  }

  private onInterval(): void {
    this.out.$.send(true, null);
  }
}
