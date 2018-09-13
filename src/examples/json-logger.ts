import {JsonStringifier, Logger, SuperNode} from "..";

class JsonLogger extends SuperNode {
  constructor() {
    const jsonStringifier = new JsonStringifier<object>(true);
    const logger = new Logger();
    jsonStringifier.out.$.connect(logger.in.$);

    super({
      $: jsonStringifier.in.$
    }, {});
  }
}

const jsonLogger = new JsonLogger();
jsonLogger.in.$.send({foo: "bar"});
