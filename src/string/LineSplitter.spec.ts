import {LineSplitter} from "./LineSplitter";

describe("LineSplitter", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node = new LineSplitter();
      expect(node.in.$.node).toBe(node);
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: LineSplitter;

    beforeEach(function () {
      node = new LineSplitter();
    });

    it("should pass individual lines to output", function () {
      const spy = spyOn(node.out.$, "send");
      node.in.$.send("foo\nbar\nbaz", "1");
      const calls = spy.calls.all();
      expect(calls.length).toBe(2);
      expect(calls[0].args).toEqual(["foo", "1|0"]);
      expect(calls[1].args).toEqual(["bar", "1|1"]);
    });

    describe("on subsequent calls", function () {
      beforeEach(function () {
        node.in.$.send("foo\nbar\nba");
      });

      it("should pick up fragment lines", function () {
        const spy = spyOn(node.out.$, "send");
        node.in.$.send("z\nquux\n", "1");
        const calls = spy.calls.all();
        expect(calls.length).toBe(2);
        expect(calls[0].args).toEqual(["baz", "1|0"]);
        expect(calls[1].args).toEqual(["quux", "1|1"]);
      });
    });
  });
});
