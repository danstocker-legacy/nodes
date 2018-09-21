import {StdErr} from "./StdErr";

describe("StdErr", function () {
  describe("constructor", function () {
    it("should intialize ports", function () {
      const node = new StdErr();
      expect(node.in.$.node).toBe(node);
    });
  });

  describe("#send()", function () {
    let node: StdErr;

    beforeEach(function () {
      node = new StdErr();
    });

    it("should pass value to stderr", function () {
      spyOn(process.stderr, "write");
      node.send(new Map([[node.in.$, "5"]]));
      expect(process.stderr.write).toHaveBeenCalledWith("5");
    });
  });
});
