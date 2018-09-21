import {StdIn} from "./StdIn";

describe("StdIn", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node = new StdIn();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: StdIn;

    beforeEach(function () {
      node = new StdIn();
    });

    it("should throw error", function () {
      expect(function () {
        node.send(new Map());
      }).toThrow();
    });
  });

  describe("#onReadable()", function () {
    let node: StdIn;

    beforeEach(function () {
      node = new StdIn();
    });

    it("should send chunk to output", function () {
      spyOn(process.stdin, "read").and.returnValue("foo");
      spyOn(node.out.$, "send");
      const BuiltInDate = global.Date;
      spyOn(global, "Date").and.callFake(() => new BuiltInDate());
      process.stdin.emit("readable");
      const timestamp = +new Date();
      expect(node.out.$.send).toHaveBeenCalledWith("foo", `${timestamp}`);
    });
  });
});
