import {StdOut} from "./StdOut";

describe("StdOut", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node: StdOut = new StdOut();
      expect(node.in.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: StdOut;

    beforeEach(function () {
      node = new StdOut();
    });

    it("should pass value to stdout", function () {
      spyOn(process.stdout, "write");
      node.send(node.in.$, "5");
      expect(process.stdout.write).toHaveBeenCalledWith("5");
    });
  });
});
