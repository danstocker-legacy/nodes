import {Logger, Node} from "..";

const node = new Node((inputs) => node.out[1].send(inputs[1]));
const logger = new Logger();

node.out[1].connect(logger.in.$);
node.in[1].send("foo");
