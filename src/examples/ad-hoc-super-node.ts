import {JsonStringifier, Logger, SuperNode} from "..";

const jsonStringifier: JsonStringifier<Object> = new JsonStringifier(true);
const logger: Logger = new Logger();
jsonStringifier.ports.out.connect(logger.ports.in);

const jsonLogger = new SuperNode({
  in: jsonStringifier.ports.in
});

jsonLogger.ports.in.send({foo: "bar"});
