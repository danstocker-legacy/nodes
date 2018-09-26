import {Logger, Node} from "..";

const noop = new Node((inputs) => noop.out[0].send(inputs[0]));
const logger = new Logger();

noop.out[0].connect(logger.in.$);
noop.in[0].send("foo"); // "foo"
