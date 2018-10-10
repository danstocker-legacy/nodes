import {Logger, Sequencer} from "..";

const sequencer = new Sequencer();
const logger = new Logger();

sequencer.out[0].connect(logger.in.$);

sequencer.in.ref.send(null, "1");
sequencer.in.ref.send(null, "2");
sequencer.in[0].send("foo", "2");
sequencer.in.ref.send(null, "3");
sequencer.in.ref.send(null, "4");
sequencer.in[0].send("bar", "3");
sequencer.in[0].send("baz", "1"); // "baz", "foo", "bar"
sequencer.in[0].send("quux", "4"); // "quux"
