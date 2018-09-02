import {SuperNode} from "../node";
import {JsonStringifier, Logger} from "../generic";

class JsonLogger extends SuperNode {
  constructor() {
    const jsonStringifier: JsonStringifier<Object> = new JsonStringifier(true);
    const logger: Logger = new Logger();
    jsonStringifier.ports.out.connect(logger.ports.in);

    super({
      in: jsonStringifier.ports.in
    });
  }
}

const jsonLogger:JsonLogger = new JsonLogger();
jsonLogger.ports.in.send({foo: "bar"});
