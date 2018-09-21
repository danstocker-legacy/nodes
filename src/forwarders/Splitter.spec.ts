import {InPort, OutPort} from "../node";
import {Splitter} from "./Splitter";

describe("Splitter", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node = new Splitter();
      expect(node.in).toEqual({
        $: new InPort(node)
      });
      expect(node.out).toEqual({
        1: new OutPort(node),
        2: new OutPort(node)
      });
    });
  });

  describe("#send()", function () {
    let node: Splitter<number>;

    beforeEach(function () {
      node = new Splitter();
    });

    it("should forward input to all outputs", function () {
      const spy = spyOn(OutPort.prototype, "send");
      node.send(new Map([[node.in.$, 5]]));
      const calls = spy.calls.all();
      expect(calls.length).toBe(2);
      expect(calls[0].object).toBe(node.out[1]);
      expect(calls[0].args).toEqual([5, undefined]);
      expect(calls[1].object).toBe(node.out[2]);
      expect(calls[1].args).toEqual([5, undefined]);
    });
  });
});
