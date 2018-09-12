import {LineSplitter} from "./LineSplitter";

describe("LineSplitter", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const lineSplitter = new LineSplitter();
      expect(lineSplitter.in.$.node).toBe(lineSplitter);
      expect(lineSplitter.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let lineSplitter: LineSplitter;

    beforeEach(function () {
      lineSplitter = new LineSplitter();
    });

    it("should pass individual lines to output", function () {
      const spy = spyOn(lineSplitter.out.$, "send");
      lineSplitter.in.$.send("foo\nbar\nbaz");
      const calls = spy.calls.all();
      expect(calls.length).toBe(2);
      expect(calls[0].args).toEqual(["foo", undefined]);
      expect(calls[1].args).toEqual(["bar", undefined]);
    });

    describe("on subsequent calls", function () {
      beforeEach(function () {
        lineSplitter.in.$.send("foo\nbar\nba");
      });

      it("should pick up fragment lines", function () {
        const spy = spyOn(lineSplitter.out.$, "send");
        lineSplitter.in.$.send("z\nquux\n");
        const calls = spy.calls.all();
        expect(calls.length).toBe(2);
        expect(calls[0].args).toEqual(["baz", undefined]);
        expect(calls[1].args).toEqual(["quux", undefined]);
      });
    });
  });
});
