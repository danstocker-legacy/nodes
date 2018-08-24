#!/usr/bin/env node
import {Logger} from "./src/Logger";
import {Noop} from "./src/Noop";
import {Aggregator} from "./src/Aggregator";

let a = new Noop(),
    b = new Noop(),
    c = new Noop(),
    l = new Logger();
a.edge(b, c);
b.edge(l);
c.edge(l);
a.in("Hello World");

let d = new Noop(),
    e = new Noop(),
    f = new Aggregator<number, number>((sum, next) => sum + (next || 0), 0);
d.edge(f);
e.edge(f);
f.edge(l);
d.in(2);
e.in(3);
e.in(4);
