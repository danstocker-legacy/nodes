import {StdOut} from "./StdOut";

describe("StdOut", function () {
  describe("constructor", function () {
    it("should intialize ports", function () {
      const node: StdOut = new StdOut();
      expect(node.in.$.node).toBe(node);
    });
  });

  describe("#send()", function () {
    let node: StdOut;

    beforeEach(function () {
      node = new StdOut();
    });

    it("should pass value to stdout", function () {
      spyOn(process.stdout, "write");
      node.send(new Map([[node.in.$, "5"]]));
      expect(process.stdout.write).toHaveBeenCalledWith("5");
    });
  });
});
