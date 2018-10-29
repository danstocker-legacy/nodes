import {
  Console, InPort, Inputs, Logger, map, Mapper, NodeBase
} from "..";

class JsonLogger extends NodeBase {
  public readonly in: {
    $: InPort<object>
  };
  private readonly stringifier: Mapper<any, string>;

  constructor() {
    super();
    const jsonStringifier = new Mapper(map.jsonStringify);
    const logger = new Logger();
    const con = new Console();
    this.stringifier = jsonStringifier;
    jsonStringifier.out.$.connect(logger.in.$);
    logger.out.log.connect(con.in.log);
    this.openInPort("$", new InPort(this));
  }

  protected process(inputs: Inputs, tag?: string): void {
    const value = inputs.get(this.in.$);
    this.stringifier.in.$.send(value, tag);
  }
}

const jsonLogger = new JsonLogger();
jsonLogger.in.$.send({foo: "bar"});
