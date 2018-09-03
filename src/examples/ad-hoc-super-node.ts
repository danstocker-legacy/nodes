import {JsonStringifier, Logger, SuperNode} from "..";

const jsonStringifier: JsonStringifier<object> = new JsonStringifier(true);
const logger: Logger = new Logger();
jsonStringifier.ports.out.connect(logger.ports.in);

const jsonLogger: SuperNode = new SuperNode({
  in: jsonStringifier.ports.in
});

jsonLogger.ports.in.send({foo: "bar"});