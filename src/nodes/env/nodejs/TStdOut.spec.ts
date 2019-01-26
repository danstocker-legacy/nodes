import {StdOut$, TStdOut} from "./TStdOut";

describe("StdOut$", () => {
  it("should be singleton", () => {
    expect(StdOut$()).toBe(StdOut$());
  });

  describe("on input (d_val)", () => {
    let node: TStdOut;

    beforeEach(() => {
      node = StdOut$();
    });

    it("should write to stdout", () => {
      spyOn(process.stdout, "write");
      node.i.d_val("foo");
      expect(process.stdout.write).toHaveBeenCalledWith("foo");
    });
  });
});
