import {LineSplitter, Logger, Mapper, StdIn} from "..";

const logger: Logger = new Logger();
const stdIn: StdIn = new StdIn();
const mapper: Mapper<string, number> = new Mapper(line => line.length);
const lineSplitter: LineSplitter = new LineSplitter();
stdIn.ports.out.connect(lineSplitter.ports.in);
lineSplitter.ports.out.connect(mapper.ports.in);
mapper.ports.out.connect(logger.ports.in);
