import {JsonStringifier, Logger} from "../generic";
import {SuperNode} from "../node";

class JsonLogger extends SuperNode {
  constructor() {
    const jsonStringifier: JsonStringifier<object> = new JsonStringifier(true);
    const logger: Logger = new Logger();
    jsonStringifier.ports.out.connect(logger.ports.in);

    super({
      in: jsonStringifier.ports.in
    });
  }
}

const jsonLogger: JsonLogger = new JsonLogger();
jsonLogger.ports.in.send({foo: "bar"});
