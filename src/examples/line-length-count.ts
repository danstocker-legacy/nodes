import {LineSplitter, Logger, Mapper, StdIn} from "..";

const logger: Logger = new Logger();
const stdIn: StdIn = new StdIn();
const mapper: Mapper<string, number> = new Mapper((line) => line.length);
const lineSplitter: LineSplitter = new LineSplitter();
stdIn.out.$.connect(lineSplitter.in.$);
lineSplitter.out.$.connect(mapper.in.$);
mapper.out.$.connect(logger.in.$);
