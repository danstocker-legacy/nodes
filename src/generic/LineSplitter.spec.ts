import {LineSplitter} from "./LineSplitter";

describe("LineSplitter", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const lineSplitter = new LineSplitter();
      expect(lineSplitter.ports.in.node).toBe(lineSplitter);
      expect(lineSplitter.ports.out.node).toBe(lineSplitter);
    });
  });

  describe("#in()", function () {
    let lineSplitter: LineSplitter;

    beforeEach(function () {
      lineSplitter = new LineSplitter();
    });

    it("should pass individual lines to output", function () {
      const spy = spyOn(lineSplitter.ports.out, "out");
      lineSplitter.ports.in.in("foo\nbar\nbaz");
      const calls = spy.calls.all();
      expect(calls.length).toBe(2);
      expect(calls[0].args).toEqual(["foo"]);
      expect(calls[1].args).toEqual(["bar"]);
    });

    describe("on subsequent calls", function () {
      beforeEach(function () {
        lineSplitter.ports.in.in("foo\nbar\nba");
      });

      it("should pick up fragment lines", function () {
        const spy = spyOn(lineSplitter.ports.out, "out");
        lineSplitter.ports.in.in("z\nquux\n");
        const calls = spy.calls.all();
        expect(calls.length).toBe(2);
        expect(calls[0].args).toEqual(["baz"]);
        expect(calls[1].args).toEqual(["quux"]);
      });
    });
  });
});
