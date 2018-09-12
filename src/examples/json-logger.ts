import {JsonStringifier, Logger, SuperNode} from "..";

class JsonLogger extends SuperNode {
  constructor() {
    const jsonStringifier: JsonStringifier<object> = new JsonStringifier(true);
    const logger: Logger = new Logger();
    jsonStringifier.out.$.connect(logger.in.$);

    super({
      $: jsonStringifier.in.$
    }, {});
  }
}

const jsonLogger: JsonLogger = new JsonLogger();
jsonLogger.in.$.send({foo: "bar"});
