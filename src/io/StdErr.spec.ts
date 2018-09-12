import {StdErr} from "./StdErr";

describe("StdErr", function () {
  describe("constructor", function () {
    it("should intialize ports", function () {
      const stdErr: StdErr = new StdErr();
      expect(stdErr.in.$.node).toBe(stdErr);
    });
  });

  describe("#send()", function () {
    let stdErr: StdErr;

    beforeEach(function () {
      stdErr = new StdErr();
    });

    it("should pass value to stderr", function () {
      spyOn(process.stderr, "write");
      stdErr.send(new Map([[stdErr.in.$, "5"]]));
      expect(process.stderr.write).toHaveBeenCalledWith("5");
    });
  });
});
