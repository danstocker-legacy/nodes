import {InPort, Inputs, JsonStringifier, Logger, Node} from "..";

class JsonLogger extends Node {
  public readonly in: {
    $: InPort<object>
  };
  private readonly jsonStringifier: JsonStringifier<object>;

  constructor() {
    super();
    const jsonStringifier = new JsonStringifier(true);
    const logger = new Logger();
    this.jsonStringifier = jsonStringifier;
    jsonStringifier.out.$.connect(logger.in.$);
    this.openInPort("$", new InPort(this));
  }

  protected process(inputs: Inputs, tag?: string): void {
    const value = inputs.get(this.in.$);
    this.jsonStringifier.in.$.send(value, tag);
  }
}

const jsonLogger = new JsonLogger();
jsonLogger.in.$.send({foo: "bar"});
