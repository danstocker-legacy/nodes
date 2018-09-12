import {JsonStringifier, Logger, SuperNode} from "..";

const jsonStringifier: JsonStringifier<object> = new JsonStringifier(true);
const logger: Logger = new Logger();
jsonStringifier.out.$.connect(logger.in.$);

const jsonLogger: SuperNode = new SuperNode({
  $: jsonStringifier.in.$
}, {});

jsonLogger.in.$.send({foo: "bar"});
