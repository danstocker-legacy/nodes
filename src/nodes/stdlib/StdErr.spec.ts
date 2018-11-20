import {StdErr} from "./StdErr";

describe("StdErr", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node = new StdErr();
      expect(node.in.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: StdErr;

    beforeEach(function () {
      node = new StdErr();
    });

    it("should pass value to stderr", function () {
      spyOn(process.stderr, "write");
      node.send(node.in.$, "5");
      expect(process.stderr.write).toHaveBeenCalledWith("5");
    });
  });
});
