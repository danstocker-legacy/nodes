import {StdOut} from "./StdOut";

describe("StdOut", function () {
  describe("constructor", function () {
    it("should intialize ports", function () {
      const stdOut: StdOut = new StdOut();
      expect(stdOut.ports.in.node).toBe(stdOut);
    });
  });

  describe("#send()", function () {
    let stdOut: StdOut;

    beforeEach(function () {
      stdOut = new StdOut();
    });

    it("should pass value to stdout", function () {
      spyOn(process.stdout, "write");
      stdOut.send(stdOut.ports.in, "5");
      expect(process.stdout.write).toHaveBeenCalledWith("5");
    });
  });
});