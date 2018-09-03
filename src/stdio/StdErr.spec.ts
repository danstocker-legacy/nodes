import {StdErr} from "./StdErr";

describe("StdErr", function () {
  describe("constructor", function () {
    it("should intialize ports", function () {
      const stdErr: StdErr = new StdErr();
      expect(stdErr.ports.in.node).toBe(stdErr);
    });
  });

  describe("#send()", function () {
    let stdErr: StdErr;

    beforeEach(function () {
      stdErr = new StdErr();
    });

    it("should pass value to stderr", function () {
      spyOn(process.stderr, "write");
      stdErr.send("5", stdErr.ports.in);
      expect(process.stderr.write).toHaveBeenCalledWith("5");
    });
  });
});
