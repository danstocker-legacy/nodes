import {StdIn} from "./StdIn";

describe("StdIn", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node = new StdIn();
      expect(node.o.$).toBeDefined();
    });
  });

  describe("#onReadable()", function () {
    let node: StdIn;

    beforeEach(function () {
      node = new StdIn();
    });

    it("should send chunk to output", function () {
      spyOn(process.stdin, "read").and.returnValue("foo");
      spyOn(node.o.$, "send");
      process.stdin.emit("readable");
      expect(node.o.$.send).toHaveBeenCalledWith("foo");
    });
  });
});
