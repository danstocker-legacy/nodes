import {InPort, OutPort} from "../node";
import {Splitter} from "./Splitter";

describe("Splitter", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const splitter: Splitter<number> = new Splitter();
      expect(splitter.ports).toEqual({
        in: new InPort(splitter),
        out1: new OutPort(),
        out2: new OutPort()
      });
    });
  });

  describe("#send()", function () {
    let splitter: Splitter<number>;

    beforeEach(function () {
      splitter = new Splitter();
    });

    it("should forward input to all outputs", function () {
      const spy = spyOn(OutPort.prototype, "send");
      splitter.send(new Map([[splitter.ports.in, 5]]));
      const calls = spy.calls.all();
      expect(calls.length).toBe(2);
      expect(calls[0].object).toBe(splitter.ports.out1);
      expect(calls[0].args).toEqual([5, undefined]);
      expect(calls[1].object).toBe(splitter.ports.out2);
      expect(calls[1].args).toEqual([5, undefined]);
    });
  });
});
