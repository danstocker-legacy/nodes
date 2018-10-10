import {JsonStringifier, Logger, Syncer} from "..";

const syncer = new Syncer(2);
const jsonStringifier = new JsonStringifier(true);
const logger = new Logger();

syncer.out.$.connect(jsonStringifier.in.$);
jsonStringifier.out.$.connect(logger.in.$);

syncer.in[0].send("foo", "1");
syncer.in[1].send("bar", "2");
syncer.in[0].send("baz", "2"); // {1: "baz", 2: "bar"}
syncer.in[1].send("quux", "1"); // {1: "quux", 2: "foo"}
