import {stdOut$, TStdOut} from "./stdOut$";

describe("stdOut$", () => {
  it("should be singleton", function () {
    expect(stdOut$()).toBe(stdOut$());
  });

  describe("on input (d_val)", () => {
    let node: TStdOut;

    beforeEach(() => {
      node = stdOut$();
    });

    it("should write to stdout", () => {
      spyOn(process.stdout, "write");
      node.i.d_val("foo");
      expect(process.stdout.write).toHaveBeenCalledWith("foo");
    });
  });
});
