import {JsonStringifier, Logger, SuperNode} from "..";

const jsonStringifier = new JsonStringifier<object>(true);
const logger = new Logger();
jsonStringifier.out.$.connect(logger.in.$);

const jsonLogger = new SuperNode({
  $: jsonStringifier.in.$
}, {});

jsonLogger.in.$.send({foo: "bar"});
