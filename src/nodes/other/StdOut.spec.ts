import {StdOut} from "./StdOut";

describe("StdOut", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node: StdOut = new StdOut();
      expect(node.i.d_val).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: StdOut;

    beforeEach(function () {
      node = new StdOut();
    });

    it("should pass value to stdout", function () {
      spyOn(process.stdout, "write");
      node.send(node.i.d_val, "5");
      expect(process.stdout.write).toHaveBeenCalledWith("5");
    });
  });
});
