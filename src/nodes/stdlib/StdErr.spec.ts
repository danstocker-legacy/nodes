import {StdErr} from "./StdErr";

describe("StdErr", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node = new StdErr();
      expect(node.i.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: StdErr;

    beforeEach(function () {
      node = new StdErr();
    });

    it("should pass value to stderr", function () {
      spyOn(process.stderr, "write");
      node.send(node.i.$, "5");
      expect(process.stderr.write).toHaveBeenCalledWith("5");
    });
  });
});
