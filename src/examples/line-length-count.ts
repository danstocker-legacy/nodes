import {LineSplitter, Logger, Mapper, StdIn} from "..";

const logger = new Logger();
const stdIn = new StdIn();
const mapper = new Mapper<string, number>((line) => line.length);
const lineSplitter = new LineSplitter();
stdIn.out.$.connect(lineSplitter.in.$);
lineSplitter.out.$.connect(mapper.in.$);
mapper.out.$.connect(logger.in.$);
