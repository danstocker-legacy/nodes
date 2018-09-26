import {Logger, Node} from "..";

const noop = new Node((inputs) => noop.out[1].send(inputs[1]));
const logger = new Logger();

noop.out[1].connect(logger.in.$);
noop.in[1].send("foo"); // "foo"
