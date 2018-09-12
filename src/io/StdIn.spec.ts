import {StdIn} from "./StdIn";

describe("StdIn", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const stdIn = new StdIn();
      expect(stdIn.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let stdIn: StdIn;

    beforeEach(function () {
      stdIn = new StdIn();
    });

    it("should throw error", function () {
      expect(function () {
        stdIn.send(new Map());
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
      spyOn(stdIn.out.$, "send");
      const BuiltInDate = global.Date;
      spyOn(global, "Date").and.callFake(() => new BuiltInDate());
      process.stdin.emit("readable");
      expect(stdIn.out.$.send).toHaveBeenCalledWith("foo", String(+new Date()));
    });
  });
});
