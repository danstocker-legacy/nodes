import {StdIn} from "./StdIn";

describe("StdIn", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const stdIn = new StdIn();
      expect(stdIn.ports.out.node).toBe(stdIn);
    });
  });

  describe("#in()", function () {
    let stdIn: StdIn;

    beforeEach(function () {
      stdIn = new StdIn();
    });

    it("should throw error", function () {
      expect(function () {
        stdIn.in(stdIn.ports.out, null);
      }).toThrow();
    });
  });

  describe("#onReadable()", function () {
    let stdIn: StdIn;

    beforeEach(function () {
      stdIn = new StdIn();
    });

    it("should send chunk to output", function () {
      spyOn(process.stdin, "read").and.returnValue("foo");
      spyOn(stdIn.ports.out, 'out');
      process.stdin.emit("readable");
      expect(stdIn.ports.out.out).toHaveBeenCalledWith("foo");
    });
  });
});
