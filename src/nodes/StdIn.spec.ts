import {StdIn} from "./StdIn";

describe("StdIn", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node = new StdIn();
      expect(node.o.d_val).toBeDefined();
    });
  });

  describe("#onReadable()", function () {
    let node: StdIn;

    beforeEach(function () {
      node = new StdIn();
    });

    it("should send chunk to output", function () {
      spyOn(process.stdin, "read").and.returnValue("foo");
      spyOn(node.o.d_val, "send");
      process.stdin.emit("readable");
      expect(node.o.d_val.send).toHaveBeenCalledWith("foo");
    });
  });
});
